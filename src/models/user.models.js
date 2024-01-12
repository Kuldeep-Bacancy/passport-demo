import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose"

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

userSchema.plugin(passportLocalMongoose)

export const User = mongoose.model('User', userSchema)