import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
  username: string;
  passwordHash: string;
  refreshToken?: string;
}

export interface IUserMethods {
  validatePassword(password: string): Promise<boolean>;
}

export type UserDocument = Document & IUser & IUserMethods;

const userSchema = new mongoose.Schema<
  IUser,
  Model<IUser, {}, IUserMethods>,
  IUserMethods
>(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    refreshToken: { type: String, default: null },
  },
  { timestamps: true }
);

userSchema.method('validatePassword', function (password: string) {
  return bcrypt.compare(password, this.passwordHash);
});

export const UserModel = mongoose.model<IUser, Model<IUser, {}, IUserMethods>>(
  'User',
  userSchema
);
