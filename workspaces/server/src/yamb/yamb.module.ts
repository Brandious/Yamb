import { Module } from '@nestjs/common';
import { YambGateway } from './yamb.gateway';
import { LobbyManager } from '../yamb/lobby/lobby-manager';

@Module({
  providers: [
    // Gateways
    YambGateway,

    // Managers
    LobbyManager,
  ],
})
export class YambModule {}
