import { PlayerCustomization } from "./player.customization";

export default class Player {
	constructor(
		public id: number,
		public name: string,
		public x: number,
		public y: number,
		public width: number,
		public height: number,
		public speed: number,
		public customization?: PlayerCustomization,
	) {
	}
}
