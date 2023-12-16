export default class PlayerConfig {
	constructor(
		public uuid: number,
		public clientId: string,
	) {
	}

	public equals(other: PlayerConfig): boolean {
		return this.uuid === other.uuid;
	  }
}
