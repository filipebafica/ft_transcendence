export interface MessageDTO {
	meta: string;
	data: {
		to: number;
		from: number;
		content: string;
	};
}
