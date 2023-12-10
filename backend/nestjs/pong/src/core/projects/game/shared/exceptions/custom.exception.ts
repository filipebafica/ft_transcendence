export abstract class CustomException extends Error {
    constructor(message: string, public readonly additionalInfo?: {key: string | number, value: string | number}) {
        super(message);
        // Set the prototype explicitly to ensure proper inheritance
        Object.setPrototypeOf(this, CustomException.prototype);
    }
}
