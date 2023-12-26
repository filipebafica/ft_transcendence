import { MessageEmitterAdapter } from 'src/app/projects/game/message.emitter.adapter';
import { Request } from './dtos/request.dto';
import { Logger } from '@nestjs/common';
import { GameStateInterface } from '../../shared/interfaces/game.state.interface';
import { InvitationRepository } from '../../shared/interfaces/invitation.repository';
import { InviteStatus } from '../../shared/enums/invite.status';
import { OpenInviteRule } from './rules/open.invite.rule';
import { AcceptedInviteRule } from './rules/accepted.invite.rule';
import { RejectedInviteRule } from './rules/rejected.invite.rule';
import { GameHistoryRepository } from '../../shared/interfaces/game.history.repository';
import { CanPlayersPlayRule } from './rules/can.players.play.rule';
import { QueueInterface } from '../../shared/interfaces/queue.interface';
import { ClientManagerInterface } from '../../shared/interfaces/client.manager.interface';

export class InviteService {
  private openInviteRule: OpenInviteRule;
  private acceptedInviteRule: AcceptedInviteRule;
  private rejectedInviteRule: RejectedInviteRule;
  private canPlayersPlayRule: CanPlayersPlayRule;

  constructor(
    private readonly logger: Logger,
    private messageEmitter: MessageEmitterAdapter,
    private gameManager: GameStateInterface,
    private invitationRegister: InvitationRepository,
    private gameHistoryRepository: GameHistoryRepository,
    private waitingQueue: QueueInterface,
    private clientManager: ClientManagerInterface,
  ) {
    this.openInviteRule = new OpenInviteRule(
      this.invitationRegister,
      this.messageEmitter,
    );

    this.acceptedInviteRule = new AcceptedInviteRule(
      this.invitationRegister,
      this.messageEmitter,
      this.gameManager,
      this.clientManager,
      this.waitingQueue,
    );

    this.rejectedInviteRule = new RejectedInviteRule(
      this.invitationRegister,
      this.messageEmitter,
    );

    this.canPlayersPlayRule = new CanPlayersPlayRule(
      this.gameHistoryRepository,
      this.waitingQueue,
      this.invitationRegister,
    );
  }

  public async execute(request: Request): Promise<void> {
    try {
      this.logger.log(
        JSON.stringify({
          'InviteService has started': {
            request: request,
          },
        }),
      );

      //usar adapter para verificar se o usuário esta logado
      if (request.message.data.content == InviteStatus.Opened) {
        if ((await this.canPlayersPlayRule.apply(request)) == false) {
          throw Error(
            "Can't invite because players are either playing or with an opened invititation",
          );
        }
      }

      if (request.message.data.content == InviteStatus.Opened) {
        await this.openInviteRule.apply(request, InviteStatus.Opened);
      }

      if (request.message.data.content == InviteStatus.Accepted) {
        await this.acceptedInviteRule.apply(request, InviteStatus.Accepted);
      }

      if (request.message.data.content == InviteStatus.Rejected) {
        await this.rejectedInviteRule.apply(request, InviteStatus.Rejected);
      }

      this.logger.log('InviteService has finished');
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          'InviteService has finished with error': {
            error: [error.message],
          },
        }),
      );
      throw error;
    }
  }
}
