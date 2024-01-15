import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required!']
  },
  fullName: {
    type: String,
    required: [true, 'FullName is required']
  },
  username: {
    type: String,
    unique: true,
    required: [true, 'Username is required!']
  },
  password: {
    type: String,
    required: [true, 'Password is required!']
  },
  provider: {
    type: String,
    default: 'local'
  },
  providerId: {
    type: String,
    default: ''
  }
});

userSchema.pre("save", async function(next){
  if (!this.isModified("password") || this.provider != 'local') return next();

  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model('User', userSchema)