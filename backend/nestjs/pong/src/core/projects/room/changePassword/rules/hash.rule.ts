import * as bcrypt from 'bcrypt';

export default class HashRule {
    apply(password?: string): string {
        if (!password) {
            return null;
        }

        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    }
}