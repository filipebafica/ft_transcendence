import { CustomException } from "../../shared/exceptions/custom.exception"

export class AlreadyPlayerException extends CustomException {
	constructor(
		additionalInfo?: {key: string | number, value: string | number},
		message = "Player is playing already: "
	) {
		super(message, additionalInfo);
	}
}
