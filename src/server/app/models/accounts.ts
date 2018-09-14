import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';

// Define promise library for mongoose
(mongoose as any).Promise = global.Promise;

// Define constants
const SALT_WORK_FACTOR: number = 12;

/**
 * Define and export a type interface representing an account model, which is also an extension of a mongoose document.
 */
export interface AccountsModel extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    isActivated: boolean;
    activationToken: string;
    resetPasswordToken: string;
    resetPasswordExpires: number;
    comparePassword: (password: string, fn?: (error: Error, isMatch: boolean) => void) => void;
}

/**
 * Define and export a mongoose schema representing an Account
 */
const accountSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
    },
    email: {
        required: true,
        type: String,
    },
    password: {
        required: true,
        type: String,
    },
    isActivated: {
        default: false,
        type: Boolean,
    },
    activationToken: {
        type: String,
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
});

/**
 * Define password hashing middleware.
 */
accountSchema.pre('save', function(next) {
    // Only hash the password if it's new or has been modified
    if (!this.isModified('password')) {
        return next();
    }
    // Geenerate a random salt
    bcrypt.genSalt(12, (saltError, salt) => {
        if (saltError) {
            return next(saltError);
        }
        // Hash the password using the generated random salt
        bcrypt.hash(this.password, salt, null, (hashError, hash) => {
            if (hashError) {
                return next(hashError);
            }
            // Override the Account's password field with the new hash
            this.password = hash;
            next();
        });
    });
});

/**
 * Define a method for the Account schema that compares passwords using bcrypt.
 */
accountSchema.methods.comparePassword = function(password, callback) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) {
            return callback(err);
        }
        return callback(null, isMatch);
    });
};

export const Accounts = mongoose.model<AccountsModel>('Account', accountSchema);
