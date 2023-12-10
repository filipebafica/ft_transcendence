import { randomUUID } from "crypto";
import { Server } from "http";
import Ball from "src/core/projects/game/shared/entities/ball";
import Canvas from "src/core/projects/game/shared/entities/canvas";
import GameState from "src/core/projects/game/shared/entities/game.state";
import Player from "src/core/projects/game/shared/entities/player";
import { GameStateInterface } from "src/core/projects/game/shared/interfaces/game.state.interface";

export default class MemoryGameStateAdapter implements GameStateInterface {
	public games: Map<string, GameState> = new Map<string, GameState>();

	private interval: number = 1000 / 40;
	private step: number = 3;
	private boardHeight: number = 600;
	private boardWidth: number = 800;
	private playerWidth: number = 10;
	private playerHeight: number = 90;
	private ballWidth: number = 10;
	private ballHeight: number = 10;
	private initialPlayerSpeed: number = 0;

	public 	createGame(playerID: string): GameState {
		let player: Player = this.createPlayer(playerID);
		let ball: Ball = this.createBall();
		let board: Canvas = this.createBoard();
		let gameState: GameState = {
			id: randomUUID(),
			player1: player,
			ball: ball,
			player1Score: 0,
			player2Score: 1,
			board: board,
			status: 0,
		};

		this.games.set(gameState.id, gameState);
		return gameState;
	}

	public removeGame(gameID: string): void {
	}

	public createSecondPlayer(playerID: string, gameID: string): GameState {
		let player: Player = this.createPlayer(playerID);
		let gameState: GameState = this.games.get(gameID);
		gameState.player2 = player;
		gameState.status = 1;
		this.games.set(gameID, gameState);
		return gameState;
	}

	public async updateGame(gameID: string, currentGameState: GameState): Promise<void> {
		if (currentGameState.status != 1) {
			return ;
		}

		let gameState: GameState = currentGameState;

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
	
		this.games.set(gameID, gameState);
		return ;
	}

	public collectUpdatePromises(): Promise<void>[] {
		const updatePromises: Promise<void>[] = [];
	
		for (let [gameID, gameState] of this.games) {
			updatePromises.push(this.updateGame(gameID, gameState));
		}
	
		return updatePromises;
	}

	public waitAllUpdatesToComplete(updatePromises: Promise<void>[]): Promise<void[]> {
		return Promise.all(updatePromises);
	}

	public delay(): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, this.interval));
	}

	private createPlayer(id: string): Player {
		return {
			id: id,
			x: 10,
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

	public getGames(): Map<string, GameState> {
		return this.games;
	}

	public updatePlayerSpeed(gameID: string, playerID: string, action: string): void {
		const gameState = this.games.get(gameID);
		
		if (gameState.status != 1) {
			return ;
		}

		if (gameState.player1.id == playerID) {
			gameState.player1.speed = this.calculateSpeed(action);
		} else if (gameState.player2.id == playerID) {
			gameState.player2.speed = this.calculateSpeed(action);
		}

		this.games.set(gameID, gameState);
	}

	private calculateSpeed(action: string): number {
		switch(action) {
			case "ArrowUp":
				return -this.step;
			case "ArrowDown":
				return this.step;
		}
	}
}
