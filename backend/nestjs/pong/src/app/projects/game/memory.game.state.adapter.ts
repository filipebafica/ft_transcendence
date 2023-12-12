import { randomUUID } from "crypto";
import { Server } from "http";
import Ball from "src/core/projects/game/shared/entities/ball";
import Canvas from "src/core/projects/game/shared/entities/canvas";
import GameState from "src/core/projects/game/shared/entities/game.state";
import Player from "src/core/projects/game/shared/entities/player";
import { GameStateInterface } from "src/core/projects/game/shared/interfaces/game.state.interface";
import { arrayBuffer } from "stream/consumers";

enum Status {
	Waiting,
	Running,
	Finished,
}

export default class MemoryGameStateAdapter implements GameStateInterface {
	public runningGames: Map<string | number, GameState> = new Map<string | number, GameState>();
	public finishedGames: GameState[] = [];

	private interval: number = 1000 / 40;
	private step: number = 3;
	private maxScore: number = 1;

	private boardHeight: number = 600;
	private boardWidth: number = 800;
	private playerWidth: number = 10;
	private playerHeight: number = 90;
	private ballWidth: number = 10;
	private ballHeight: number = 10;
	private initialPlayerSpeed: number = 0;

	public 	createGame(playerId: string | number, playerName: string): GameState {
		let player: Player = this.createPlayer(playerId, 1, playerName);
		let ball: Ball = this.createBall();
		let board: Canvas = this.createBoard();
		let gameState: GameState = {
			id: randomUUID(),
			player1: player,
			ball: ball,
			player1Score: 0,
			player2Score: 0,
			board: board,
			status: Status.Waiting,
		};

		this.runningGames.set(gameState.id, gameState);
		return gameState;
	}

	public closeGame(gameId: string): GameState | undefined {
		let gameState: GameState = this.runningGames.get(gameId);
		if (gameState == undefined) {
			//gameId doens't exist
			return undefined;
		}
		this.runningGames.delete(gameId);

		gameState.status = Status.Finished;
		return gameState;
	}

	public createSecondPlayer(playerId: string | number, gameId: string | number, playerName: string): GameState {
		let player: Player = this.createPlayer(playerId, 2, playerName);
		let gameState: GameState = this.runningGames.get(gameId);
		gameState.player2 = player;
		gameState.status = Status.Running;
		this.runningGames.set(gameId, gameState);
		return gameState;
	}

	public async updateGame(gameId: string | number, currentGameState: GameState): Promise<void> {
		if (currentGameState.status != Status.Running) {
			return ;
		}

		let gameState: GameState = currentGameState;
		
		/**
		 * @brief: If max score is reached it removes from running games and adds to finished games
		 * Finished games will be read asynchronously by handleFinished service.
		 * When the game is finished it stops updating.
		 */
		if (this.isMaxScore(gameState.player1Score, gameState.player2Score)) {
			gameState.status = Status.Finished;
			this.runningGames.delete(gameId);
			this.finishedGames.push(gameState);
		}

		const outOfBounds = (yPosition: number, height: number): boolean => {
			return yPosition < 0 || yPosition + height > gameState.board.height;
		};
	
		const updatePlayer = (player: Player) => {
			if (!outOfBounds(player.y + player.speed, player.height)) {
				player.y += player.speed;
			}
			return player;
		};

		const detectCollision = (ball: Ball, player: Player): boolean => {
			return (
				ball.x <= player.x + player.width &&
				ball.x + ball.width >= player.x &&
				ball.y + ball.height >= player.y &&
				ball.y <= player.y + player.height
			);
		};
	
		const handleCollision = (ball: Ball, player: Player) => {
			const dist = [
				{ type: "t", value: player.y - ball.y - ball.height },
				{ type: "b", value: player.y + player.height - ball.y },
				{ type: "l", value: player.x + player.width - ball.x },
				{ type: "r", value: player.x - ball.x - ball.width },
			];
	
			let min_dist = dist.reduce((prev, curr) => {
				return Math.abs(prev.value) < Math.abs(curr.value) ? prev : curr;
			});
	
			if (min_dist.type === "t" || min_dist.type === "b") {
				ball.y += min_dist.value;
				ball.x += (min_dist.value * ball.vX) / ball.vY;
				ball.vX *= 1.1;
				ball.vY = ball.vY * -1.1 + player.speed;
			} else {
				ball.x += min_dist.value;
				ball.y += (min_dist.value * ball.vY) / ball.vX;
				ball.vX *= -1.1;
				ball.vY *= 1.1;
			}
	
			return ball;
		};
	
		const updateBall = (ball: Ball) => {
			ball.x += ball.vX;
			ball.y += ball.vY;
	
			if (outOfBounds(ball.y, ball.height)) {
				ball.vY *= -1;
			}
	
			if (detectCollision(ball, gameState.player1)) {
				ball = handleCollision(ball, gameState.player1);
			} else if (detectCollision(ball, gameState.player2)) {
				ball = handleCollision(ball, gameState.player2);
			}
	
			return ball;
		};
	
		const resetGameState = (direction: number): void => {
			gameState.ball = {
				x: (gameState.board.width - gameState.ball.width) / 2,
				y: (gameState.board.height - gameState.ball.height) / 2,
				width: gameState.ball.width,
				height: gameState.ball.height,
				vX: direction,
				vY: 2,
			};
		};
	
		// Update score
		if (gameState.ball.x < 0) {
			gameState.player2Score += 1;
			resetGameState(2);
		} else if (gameState.ball.x + gameState.ball.width > gameState.board.width) {
			gameState.player1Score += 1;
			resetGameState(-2);
		}
	
		gameState.player1 = updatePlayer(gameState.player1);
		gameState.player2 = updatePlayer(gameState.player2);
		gameState.ball = updateBall(gameState.ball);

		this.runningGames.set(gameId, gameState);
		return ;
	}

	private isMaxScore(player1Score: number, player2Score: number): boolean {
		return player1Score >= this.maxScore || player2Score >= this.maxScore;
	}

	public collectUpdatePromises(): Promise<void>[] {
		const updatePromises: Promise<void>[] = [];
	
		for (let [gameId, gameState] of this.runningGames) {
			updatePromises.push(this.updateGame(gameId, gameState));
		}
	
		return updatePromises;
	}

	public waitAllUpdatesToComplete(updatePromises: Promise<void>[]): Promise<void[]> {
		return Promise.all(updatePromises);
	}

	public delay(): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, this.interval));
	}

	private createPlayer(id: string | number, playerNumber: number, playerName: string): Player {
		return {
			id: id,
			name: playerName,
			x: playerNumber == 1 ? 10 : this.boardWidth - this.playerWidth - 10,
			y: (this.boardHeight - this.playerHeight) / 2,
			width: this.playerWidth,
			height: this.playerHeight,
			speed: this.initialPlayerSpeed,
		};
	}

	private createBall(): Ball {
		return {
			x: (this.boardWidth - this.ballWidth) / 2,
			y: (this.boardHeight - this.ballHeight) / 2,
			width: this.ballWidth,
			height: this.ballHeight,
			vX: 2,
			vY: 2,
		};
	}

	private createBoard(): Canvas {
		return {
			width: this.boardWidth,
			height: this.boardHeight,
		};
	}

	public getGames(): Map<string | number, GameState> {
		return this.runningGames;
	}

	public updatePlayerSpeed(gameId: string | number, playerId: string | number, action: string): void {
		const gameState = this.runningGames.get(gameId);
		
		if (gameState.status != Status.Running) {
			return ;
		}

		if (gameState.player1.id == playerId) {
			gameState.player1.speed = this.calculateSpeed(action);
		} else if (gameState.player2.id == playerId) {
			gameState.player2.speed = this.calculateSpeed(action);
		}

		this.runningGames.set(gameId, gameState);
	}

	private calculateSpeed(action: string): number {
		switch(action) {
			case "KeyDownArrowUp":
				return -this.step;
			case "KeyDownArrowDown":
				return this.step;
			case "KeyUpArrowUp":
				return 0;
			case "KeyUpArrowDown":
				return 0;
		}
	}

	public getGame(gameId: string): GameState | undefined {
		return this.runningGames.get(gameId);
	}

	public getFinishedGames(): GameState[] {
		return this.finishedGames;
	}

	public deleteFinishedGame(gameState: GameState): void {
		const index = this.finishedGames.indexOf(gameState);
		if (index !== -1) {
			this.finishedGames.splice(index, 1);
		}
	}
}
