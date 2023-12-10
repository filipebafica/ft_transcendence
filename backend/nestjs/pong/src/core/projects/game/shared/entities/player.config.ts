export default class PlayerConfig {
	constructor(
		public uuid: string | number,
		public clientid: string
	) {
	}

	public equals(other: PlayerConfig): boolean {
		return this.uuid === other.uuid;
	  }
}
