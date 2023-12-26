export default class PlayerConfig {
	constructor(
		public uuid: number,
		public clientId: string,
		public customization: {
			paddleColor: number,
			fans: number,
			fieldColor: number,
		}
	) {
	}

	public equals(other: PlayerConfig): boolean {
		return this.uuid === other.uuid;
	  }
}
