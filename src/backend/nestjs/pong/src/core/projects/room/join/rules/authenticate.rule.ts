import * as bcrypt from 'bcrypt';

export default class AuthenticateRule {
    apply(encryptedPassword: string, plainPassword?: string): void {
        if (!plainPassword || !encryptedPassword) {
            return ;
        }

        if (! bcrypt.compareSync(plainPassword, encryptedPassword)) {
            throw new Error("User doesn't have the right credentials to join the room");
        }
    }
}