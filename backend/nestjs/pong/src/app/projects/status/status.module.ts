import { Module } from '@nestjs/common';
import { StatusGateway } from './status.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'src/app/ormconfig';

@Module({
    imports: [
        TypeOrmModule.forRoot(config),
    ],
    providers: [StatusGateway]
})
export class StatusModule {}
