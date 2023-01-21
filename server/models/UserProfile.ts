import { Schema, model, Document, InsertManyResult } from "mongoose";

const UserProfileSchema = new Schema({
  name: String,
  googleid: String,
  dummyInt: Number,
});

export interface UserProfile extends Document {
  name: string;
  googleid: string;
  _id: string;
  dummyInt: number;
}

const UserProfileModel = model<UserProfile>("UserProfile", UserProfileSchema);

export default UserProfileModel;