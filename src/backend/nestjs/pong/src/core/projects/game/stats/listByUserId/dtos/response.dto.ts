import { StatsDTO } from "./stats.dto";

export class ResponseDTO {
    constructor(
        public readonly stats: StatsDTO
    ) {
    }

    public toJson() {
		return {
			"status": "success",
			"stats": this.stats,
		}
	}
}