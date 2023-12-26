import { CustomException } from "../../shared/exceptions/custom.exception";

export class ClientIsNotPlayingException extends CustomException {
	constructor(
		additionalInfo?: {key: string, value: string},
		message = "Client id is not playing: "
	) {
		super(message, additionalInfo);
	}
}
