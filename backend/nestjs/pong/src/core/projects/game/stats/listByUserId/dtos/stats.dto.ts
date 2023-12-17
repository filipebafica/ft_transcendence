export class StatsDTO {
    constructor(
        public readonly wins: number,
        public readonly loses: number,
        public readonly winRate: number,
    ) {
    }
}