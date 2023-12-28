import { plainToInstance } from 'class-transformer';
import { Invitation } from 'src/app/entities/invitation.entity';
import { InviteDTO } from 'src/core/projects/game/inviteRouter/invite/dtos/invite.dto';
import { InviteStatus } from 'src/core/projects/game/shared/enums/invite.status';
import { InvitationRepository } from 'src/core/projects/game/shared/interfaces/invitation.repository';
import { EntityManager, Repository } from 'typeorm';

export class InvitationRegisterAdapter implements InvitationRepository {
  private invitationRepository: Repository<Invitation>;

  constructor(private readonly entityManager: EntityManager) {
    this.invitationRepository = entityManager.getRepository(Invitation);
  }

  public async createInvite(
    senderId: number,
    senderSocketId: string,
    receiverId: number,
    status: string,
  ): Promise<void> {
    try {
      let entity: Invitation = await this.invitationRepository.create({
        sender_id: senderId,
        sender_socket_id: senderSocketId,
        receiver_id: receiverId,
        status: status,
      });

      entity = await this.invitationRepository.save(entity);
    } catch (error) {
      throw error;
    }
  }

  public async hasOpenInvite(
    senderId: number,
    receiverId: number,
  ): Promise<boolean> {
    try {
      const invitation = await this.invitationRepository.findOne({
        where: {
          sender_id: senderId,
          receiver_id: receiverId,
          status: InviteStatus.Opened,
        },
      });

      if (invitation == undefined) {
        return false;
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  public async updateInvite(
    senderId: number,
    receiverId: number,
    receiverSocketId: string,
    status: string,
    gameId?: number,
  ): Promise<void | null> {
    try {
      const invitation = await this.invitationRepository.findOne({
        where: {
          sender_id: senderId,
          receiver_id: receiverId,
          status: InviteStatus.Opened,
        },
      });

      if (invitation == undefined) {
        throw null;
      }

      invitation.receiver_socket_id = receiverSocketId;
      invitation.game_id = gameId;
      invitation.status = status;

      await this.invitationRepository.save(invitation);
    } catch (error) {
      throw error;
    }
  }

  public async getOpenedInvite(
    senderId: number,
    receiverId: number,
  ): Promise<InviteDTO> {
    try {
      const invitation = await this.invitationRepository.findOne({
        where: {
          sender_id: senderId,
          receiver_id: receiverId,
          status: InviteStatus.Opened,
        },
      });

      if (invitation == undefined) {
        throw Error(
          `There is no invite opened for combination of sendeId: ${senderId} and receiverId ${receiverId}`,
        );
      }

      return plainToInstance(InviteDTO, invitation);
    } catch (error) {
      throw error;
    }
  }

  public async removeOpenedInviteById(playerId: number): Promise<void> {
    try {
      await this.invitationRepository
        .createQueryBuilder()
        .delete()
        .where(
          '(sender_id = :playerId OR receiver_id = :playerId) AND status = :status',
          { playerId, status: 'opened' },
        )
        .execute();
    } catch (error) {
      throw error;
    }
  }
}
