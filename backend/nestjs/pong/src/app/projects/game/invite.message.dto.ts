export interface InviteMessageDTO {
	meta: string;
	data: {
		to: number;
		from: number;
		content: string;
	};
}
