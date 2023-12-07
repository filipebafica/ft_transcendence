import { 
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	OnGatewayConnection,
	OnGatewayDisconnect,
	MessageBody,
} from '@nestjs/websockets';

import { Server } from 'socket.io';
import { v4 as uuid } from 'uuid';

interface Player {
	id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
}

interface Canvas {
    width: number;
    height: number;
}

interface GameState {
	id: string
    player1: Player;
    player2: Player;
    ball: Ball;
    player1Score: number;
    player2Score: number;
    board: Canvas;
}

interface Ball {
    x: number;
    y: number;
    width: number;
    height: number;
    vX: number;
    vY: number;
}

const FPS: number = 40;
const STEP: number = 5;
const LIMIT_LEFT: number = 15;
const LIMIT_RIGHT: number = 85;
const MILISECONDS: number = 1000;

const boardWidth: number = 800;
const boardHeight: number = 600;
const playerWidth: number = 10;
const playerHeight: number = 90;
const ballWidth: number = 10;
const ballHeight: number = 10;
const initialPlayerSpeed: number = 0;

@WebSocketGateway({ namespace: '/game' })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
	private queue: string[] = [];
	private playing: string[] = [];
	private games: Map<string, GameState> = new Map<string, GameState>();

	//associa o client.id com o uuid do player
	// private connected: Map<string, string> = new Map<string, string>();
	private updateFrequency: number = MILISECONDS / FPS;

  @WebSocketServer()
  server: Server;

	constructor() {
		this.handleGameState();
	}

  @SubscribeMessage('joinGame')
  joinGame(@MessageBody() uuid: string) {

	if (this.playing.includes(uuid)) {
		console.log(`Player ID: ${uuid} is already playing`)
		return ;
	}

	if (this.queue.length > 0) {

		if (this.queue.includes(uuid)) {
			console.log(`Player ID: ${uuid} is already on queue`)
			return ;
		}

		const ids: string[] = [uuid, this.queue.shift()];
		const players: Player[] = this.createPlayers(ids);
		let ball: Ball = this.createBall(
			(boardWidth - ballWidth) / 2,
			(boardHeight - ballHeight) / 2,
			ballWidth,
			ballHeight,
			2,
			2,
		)

		this.createGame(players, ball);
		this.playing.push(...ids);

		return ;
	}
	console.log(`Player ID: ${uuid} has joined to the queue`);
	this.queue.push(uuid);
  }

  handleConnection(client: any, ...args: any[]) {
	console.log(`Client connected from game: ${client.id}`)
  }

  //finalizar o jogo quando um dos players se desconectar
  handleDisconnect(client: any) {
    console.log(`Client disconnected from game: ${client.id}`);
  }

  //Creates the player when the client has connected to the game
  private createPlayer = (
	id: string,
	x: number,
	y: number,
	width: number,
	height: number,
	speed: number,
	): Player => (
		{
			id: id,
			x: x,
			y: y,
			width: width,
			height: height,
			speed: speed,
		}
	);

  private createPlayers(ids: string[]): Player[] {
	let player1: Player = this.createPlayer(
		ids[0],
		10,
		(boardHeight - playerHeight) / 2,
		playerWidth,
		playerHeight,
		initialPlayerSpeed,
	);

	let player2: Player = this.createPlayer(
		ids[1],
		boardWidth - playerWidth - 10,
		(boardHeight - playerHeight) / 2,
		playerWidth,
		playerHeight,
		initialPlayerSpeed,
	);

	const players: Player[] = [
		player1,
		player2,
	];

	return players;
  }

  private createGame(players: Player[], ball: Ball): void {

	const gameState: GameState = {
		id: uuid(),
		player1: players[0],
		player2: players[1],
		ball: ball,
		player1Score: 0,
		player2Score: 1,
		board: { width: boardWidth, height: boardHeight},
	};
	this.games.set(gameState.id, gameState);
	this.notificateGameCreation(gameState);

	console.log(`Game id: ${gameState.id} has been created`);
	return ;
  }
  
//   private createBall = (x: number = 50, y: number = 50): Ball => ({position: {x, y}, direction: true});

  private createBall = (
	x: number,
	y: number,
	width: number,
	height: number,
	vX: number,
	vY: number,
	): Ball => (
		{
			x: x,
			y: y,
			width: width,
			height: height,
			vX: vX,
			vY: vY,
		}
	);

  private async handleGameState() {
	while (true) {
		await this.gameLoop();
	}
  }

  //Updates multiple games individually at a fps frequency.
  private async gameLoop(): Promise<void> {
    const updatePromises = this.collectUpdatePromises();
	await this.waitAllUpdatesToComplete(updatePromises);
	await this.delay(this.updateFrequency);
  }

  private collectUpdatePromises(): Promise<void>[] {
	const updatePromises: Promise<void>[] = [];

	for (let [gameID, gameState] of this.games) {
		updatePromises.push(this.updateGame(gameID, gameState));
	}

	return updatePromises;
  }

  private waitAllUpdatesToComplete(updatePromises: Promise<void>[]): Promise<void[]> {
	return Promise.all(updatePromises);
  }

  private delay(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 
   * @todo: Essa função tera a lógica de update do game.
   * Cada novo frame de cada jogo deverá ser calculado de acordo
   * com o ultimo gameSTATUS de cada jogo.
   */
//   private async updateGame(gameID: string, gameState: GameState) {
// 	let newGameState = gameState;

// 	if (gameState.ball.direction == true && gameState.ball.position.x < LIMIT_RIGHT) {
// 		newGameState.ball.position.x += STEP;

// 		this.games.set(gameID, newGameState);
// 		this.server.emit(gameID, newGameState);

// 		return ;
// 	}

// 	if (gameState.ball.direction == false && gameState.ball.position.x > LIMIT_LEFT) {
// 		newGameState.ball.position.x -= STEP;

// 		this.games.set(gameID, newGameState);
// 		this.server.emit(gameID, newGameState);

// 		return ;
// 	}

// 	if (gameState.ball.direction == true && gameState.ball.position.x == LIMIT_RIGHT) {
// 		newGameState.ball.position.x -= STEP;
// 		newGameState.ball.direction = false;

// 		this.games.set(gameID, newGameState);
// 		this.server.emit(gameID, newGameState);

// 		return ;
// 	}

// 	if (gameState.ball.direction == false && gameState.ball.position.x == LIMIT_LEFT) {
// 		newGameState.ball.position.x += STEP;
// 		newGameState.ball.direction = true;

// 		this.games.set(gameID, newGameState);
// 		this.server.emit(gameID, newGameState);

// 		return ;
// 	}
//   };

  private async updateGame(gameID: string, currentGameState: GameState) {
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
	this.server.emit(gameID, gameState);

	return ;
  }

  @SubscribeMessage('playerAction')
  playerAction(@MessageBody() data: {gameID: string, playerID: string, action: string}) {
	console.log(`Player Action: ${data.action}`);

	const gameState = this.games.get(data.gameID);
	const newGameState: GameState = this.updatePlayerSpeed(gameState, data.playerID, data.action)

	this.games.set(data.gameID, newGameState);
  }

  private notificateGameCreation(gameState: GameState): void {
	this.server.emit(gameState.player1.id, gameState.id);

	this.server.emit(gameState.player2.id, gameState.id);
	
	this.server.emit(gameState.id, gameState);
	}

	private updatePlayerSpeed(gameState: GameState, playerID: string, action: string): GameState {

		let newGameState: GameState = gameState;
		if (gameState.player1.id == playerID) {
			newGameState.player2.speed += this.calculateSpeed(gameState.player1.speed, action);
		} else if (gameState.player2.id == playerID) {
			newGameState.player2.speed += this.calculateSpeed(gameState.player2.speed, action);
		}

		return newGameState;
	}

	private calculateSpeed(currentSpeed: number, action: string): number {
		switch(action) {
			case "ArrowUp":
				return -STEP;
			case "ArrowDown":
				return STEP;
		}
	}
}
