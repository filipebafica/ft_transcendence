import { CustomException } from "../../shared/exceptions/custom.exception"

export class AlreadyPlayerException extends CustomException {
	constructor(
		additionalInfo?: {key: string, value: string},
		message = "Player is playing already: "
	) {
		super(message, additionalInfo);
	}
}
