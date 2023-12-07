import { CustomException } from "../../shared/exceptions/custom.exception"

export class AlreadyWaitingException extends CustomException {
	constructor(
		additionalInfo?: {key: string, value: string},
		message = "Player is waiting already: "
	) {
		super(message, additionalInfo);
	}
}
