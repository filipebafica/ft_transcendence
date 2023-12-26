import StatusDTO from "../dtos/status.dto";

export default interface StatusGateway {
    create(
        userId: number,
        newStatus: string
    ): Promise<void>;

    get(userId: number): Promise<StatusDTO>
}