import Ball from 'src/core/projects/game/shared/entities/ball';
import Canvas from 'src/core/projects/game/shared/entities/canvas';
import GameState from 'src/core/projects/game/shared/entities/game.state';
import Player from 'src/core/projects/game/shared/entities/player';
import { PlayerCustomization } from 'src/core/projects/game/shared/entities/player.customization';
import { GameStatus } from 'src/core/projects/game/shared/enums/game.status';
import { GameHistoryRepository } from 'src/core/projects/game/shared/interfaces/game.history.repository';
import { GameStateInterface } from 'src/core/projects/game/shared/interfaces/game.state.interface';

export default class GameStateAdapter implements GameStateInterface {
  public openedGames: Map<number, GameState> = new Map<number, GameState>();
  public finishedGames: GameState[] = [];

  private interval: number = 1000 / 40;
  private step: number = 6;
  private maxScore: number = 3;

  private boardHeight: number = 600;
  private boardWidth: number = 800;
  private playerWidth: number = 10;
  private playerHeight: number = 90;
  private ballWidth: number = 10;
  private ballHeight: number = 10;
  private initialPlayerSpeed: number = 0;

  constructor(private gameHistoryRepository: GameHistoryRepository) {}

  public async createGame(
    playerId: number,
    customization: PlayerCustomization,
    playerName: string,
  ): Promise<GameState> {
    const gameId: number = await this.gameHistoryRepository.createGame(
      GameStatus.Waiting,
      0,
      0,
      playerId,
    );

    const player: Player = this.createPlayer(
      playerId,
      1,
      playerName,
      customization,
    );
    const ball: Ball = this.createBall();
    const board: Canvas = this.createBoard();
    const gameState: GameState = {
      id: gameId,
      player1: player,
      ball: ball,
      player1Score: 0,
      player2Score: 0,
      board: board,
      status: GameStatus.Waiting,
    };

    this.openedGames.set(gameState.id, gameState);
    return gameState;
  }

  public async closeDisconnectedGame(
    gameId: number,
    disconnectedId: number,
  ): Promise<GameState | undefined> {
    const gameState: GameState = this.openedGames.get(gameId);
    if (gameState == undefined) {
      return undefined;
    }
    this.openedGames.delete(gameId);

    if (gameState.status == GameStatus.Finished) {
      return gameState;
    }
    gameState.status = GameStatus.Finished;

    //there is only one player on the game and they've disconnected
    if (gameState.player1 == null || gameState.player2 == null) {
      await this.gameHistoryRepository.removeUncompleteGameHistory(
        gameState.id,
      );
      return gameState;
    }

    const winnerId: number = this.calculateWinner(gameState, disconnectedId);
    await this.gameHistoryRepository.updateGameHistoryWithDisconnect(
      gameState.id,
      gameState.player1Score,
      gameState.player2Score,
      gameState.status,
      disconnectedId,
      winnerId,
    );

    return gameState;
  }

  public async createSecondPlayer(
    playerId: number,
    customization: PlayerCustomization,
    gameId: number,
    playerName: string,
  ): Promise<GameState> {
    const player: Player = this.createPlayer(
      playerId,
      2,
      playerName,
      customization,
    );
    const gameState: GameState = this.openedGames.get(gameId);
    gameState.player2 = player;
    gameState.status = GameStatus.Running;

    await this.gameHistoryRepository.updateGameHistoryWithSecondPlayer(
      gameState.id,
      gameState.status,
      player.id,
    );

    this.openedGames.set(gameId, gameState);

    return gameState;
  }

  public async updateGame(
    gameId: number,
    currentGameState: GameState,
  ): Promise<void> {
    if (currentGameState.status != GameStatus.Running) {
      return;
    }

    const gameState: GameState = currentGameState;

    /**
     * @brief: If max score is reached it removes from running games and adds to finished games
     * Finished games will be read asynchronously by handleFinished service.
     * When the game is finished it stops updating.
     */
    if (this.isMaxScore(gameState.player1Score, gameState.player2Score)) {
      gameState.status = GameStatus.Finished;
      this.openedGames.delete(gameId);

      const winnerId: number = this.calculateWinner(gameState);

      await this.gameHistoryRepository.updateGameHistoryWithMaxScore(
        gameId,
        gameState.player1Score,
        gameState.player2Score,
        gameState.status,
        winnerId,
      );

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
        { type: 't', value: player.y - ball.y - ball.height },
        { type: 'b', value: player.y + player.height - ball.y },
        { type: 'l', value: player.x + player.width - ball.x },
        { type: 'r', value: player.x - ball.x - ball.width },
      ];

      const min_dist = dist.reduce((prev, curr) => {
        return Math.abs(prev.value) < Math.abs(curr.value) ? prev : curr;
      });

      if (min_dist.type === 't' || min_dist.type === 'b') {
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
      let signVX: number = ball.vX < 0 ? -1 : 1;
      let signVY: number = ball.vY < 0 ? -1 : 1;

      ball.vX = Math.min(Math.abs(ball.vX), 20) * signVX;
      ball.vY = Math.min(Math.abs(ball.vY), 20) * signVY;

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
      const randomDirection = this.generateRandomAngle();
      gameState.ball = {
        x: (gameState.board.width - gameState.ball.width) / 2,
        y: (gameState.board.height - gameState.ball.height) / 2,
        width: gameState.ball.width,
        height: gameState.ball.height,
        vX: direction * Math.cos(randomDirection),
        vY: -3 * Math.sin(randomDirection),
      };
    };

    // Update score
    if (gameState.ball.x < 0) {
      gameState.player2Score += 1;
      resetGameState(3);
    } else if (
      gameState.ball.x + gameState.ball.width >
      gameState.board.width
    ) {
      gameState.player1Score += 1;
      resetGameState(-3);
    }

    gameState.player1 = updatePlayer(gameState.player1);
    gameState.player2 = updatePlayer(gameState.player2);
    gameState.ball = updateBall(gameState.ball);

    this.openedGames.set(gameId, gameState);
    return;
  }

  private isMaxScore(player1Score: number, player2Score: number): boolean {
    return player1Score >= this.maxScore || player2Score >= this.maxScore;
  }

  public collectUpdatePromises(): Promise<void>[] {
    const updatePromises: Promise<void>[] = [];

    for (const [gameId, gameState] of this.openedGames) {
      updatePromises.push(this.updateGame(gameId, gameState));
    }

    return updatePromises;
  }

  public waitAllUpdatesToComplete(
    updatePromises: Promise<void>[],
  ): Promise<void[]> {
    return Promise.all(updatePromises);
  }

  public delay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.interval));
  }

  private createPlayer(
    id: number,
    playerNumber: number,
    playerName: string,
    customization?: PlayerCustomization,
  ): Player {
    return {
      id: id,
      name: playerName,
      x: playerNumber == 1 ? 10 : this.boardWidth - this.playerWidth - 10,
      y: (this.boardHeight - this.playerHeight) / 2,
      width: this.playerWidth,
      height: this.playerHeight,
      speed: this.initialPlayerSpeed,
      customization: customization,
    };
  }

  private generateRandomAngle = () => {
    const positive: number = Math.floor(Math.random() * 2);
    const angle: number = (Math.floor(Math.random() * 4) + 1) * 15;
    const direction: number = positive === 0 ? -angle : angle;
    // const direction: number = 0;
    return (direction * Math.PI) / 180;
  };

  private createBall(): Ball {
    const randomDirection = this.generateRandomAngle();
    return {
      x: (this.boardWidth - this.ballWidth) / 2,
      y: (this.boardHeight - this.ballHeight) / 2,
      width: this.ballWidth,
      height: this.ballHeight,
      vX: 3 * Math.cos(randomDirection),
      vY: 3 * Math.sin(randomDirection),
    };
  }

  private createBoard(): Canvas {
    return {
      width: this.boardWidth,
      height: this.boardHeight,
    };
  }

  public getGames(): Map<number, GameState> {
    return this.openedGames;
  }

  public updatePlayerSpeed(
    gameId: number,
    playerId: number,
    action: string,
  ): void {
    const gameState = this.openedGames.get(gameId);

    if (gameState.status != GameStatus.Running) {
      return;
    }

    if (gameState.player1.id == playerId) {
      gameState.player1.speed = this.calculateSpeed(action);
    } else if (gameState.player2.id == playerId) {
      gameState.player2.speed = this.calculateSpeed(action);
    }

    this.openedGames.set(gameId, gameState);
  }

  private calculateSpeed(action: string): number {
    switch (action) {
      case 'KeyDownArrowUp':
        return -this.step;
      case 'KeyDownArrowDown':
        return this.step;
      case 'KeyUpArrowUp':
        return 0;
      case 'KeyUpArrowDown':
        return 0;
    }
  }

  public getGame(gameId: number): GameState | undefined {
    return this.openedGames.get(gameId);
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

  private calculateWinner(
    gameState: GameState,
    disconnectedId?: number,
  ): number | null {
    if (disconnectedId) {
      const winnerId: number = this.selectWinnerByDisconnect(
        disconnectedId,
        gameState.player1.id,
        gameState.player2.id,
      );
      return winnerId;
    }

    if (gameState.player1Score == gameState.player2Score) {
      return null;
    }

    return this.selectWinnerByPoints(
      gameState.player1.id,
      gameState.player1Score,
      gameState.player2.id,
      gameState.player2Score,
    );
  }

  private selectWinnerByDisconnect(
    disconnectId: number,
    player1Id: number,
    player2Id: number,
  ): number | null {
    if (disconnectId == player1Id) {
      return player2Id;
    }

    if (disconnectId == player2Id) {
      return player1Id;
    }

    return null;
  }

  private selectWinnerByPoints(
    player1Id: number,
    player1Score: number,
    player2Id: number,
    player2Score: number,
  ): number {
    if (player1Score > player2Score) {
      return player1Id;
    } else if (player2Score > player1Score) {
      return player2Id;
    }
  }

  public async createPrivateGame(
    playerOneId: number,
    playerOneName: string,
    playerTwoId: number,
    playerTwoName: string,
  ): Promise<GameState> {
    console.log('createPrivateGame');
    const gameId: number = await this.gameHistoryRepository.createPrivateGame(
      GameStatus.Waiting,
      0,
      0,
      playerOneId,
      playerTwoId,
    );

    const playerOne: Player = this.createPlayer(playerOneId, 1, playerOneName);
    const playerTwo: Player = this.createPlayer(playerTwoId, 2, playerTwoName);
    const ball: Ball = this.createBall();
    const board: Canvas = this.createBoard();
    const gameState: GameState = {
      id: gameId,
      status: GameStatus.Waiting,
      ball: ball,
      board: board,
      player1Score: 0,
      player2Score: 0,
      player1: playerOne,
      player2: playerTwo,
    };

    this.openedGames.set(gameId, gameState);
    console.log('GAMESTATE:', this.openedGames);
    return gameState;
  }

  public async updateGameWithCustomization(
    playerId: number,
    gameId: number,
    customization: PlayerCustomization,
  ): Promise<GameState> {
    const gameState: GameState = this.openedGames.get(gameId);
    console.log('gameState:', gameState);
    if (gameState.player1.id == playerId) {
      gameState.player1.customization = customization;
    } else if (gameState.player2.id == playerId) {
      gameState.player2.customization = customization;
    } else {
      throw Error("PlayerId for customization doesn't exist on the game");
    }
    this.openedGames.set(gameId, gameState);

    return gameState;
  }

  public async updateGameToRunning(gameId: number): Promise<GameState> {
    await this.gameHistoryRepository.updateWaitingGameStatus(
      gameId,
      GameStatus.Running,
    );

    const gameState: GameState = this.openedGames.get(gameId);
    gameState.status = GameStatus.Running;
    this.openedGames.set(gameId, gameState);

    return gameState;
  }
}
