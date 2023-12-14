import { CustomException } from "../../shared/exceptions/custom.exception";

export class UnavailableGameIdException extends CustomException {
	constructor(
		additionalInfo?: {key: string, value: string},
		message = "Unavailable game id: "
	) {
		super(message, additionalInfo);
	}
}
