import { Module } from "@nestjs/common";
import { GameGateway } from "./game.gateway";
import { GameController } from "./game.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import config from "src/app/ormconfig";
import { GameHistory } from "src/app/entities/game.history.entity";

@Module({
	imports: [
		TypeOrmModule.forRoot(config),
		TypeOrmModule.forFeature([GameHistory])
	],		
	providers: [GameGateway],
	controllers: [GameController]
})
export class GameModule {}
