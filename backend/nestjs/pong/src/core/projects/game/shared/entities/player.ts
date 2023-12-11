export default class Player {
	constructor(
		public id: number | string,
		public name: string,
		public x: number,
		public y: number,
		public width: number,
		public height: number,
		public speed: number,
	) {
	}
}
