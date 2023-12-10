export abstract class CustomException extends Error {
    constructor(message: string, public readonly additionalInfo?: {key: string, value: string}) {
        super(message);
        // Set the prototype explicitly to ensure proper inheritance
        Object.setPrototypeOf(this, CustomException.prototype);
    }
}
