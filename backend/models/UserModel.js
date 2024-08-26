import { genSalt, hash } from 'bcrypt';
import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:false
    },
    lastName:{
        type:String,
        required:false
    },
    email:{
        type:String,
        required:[true,"Email is required."],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Password is required."]
    },
    image:{
        type:String,
        required:false
    },
    color:{
        type:Number,
        required:false
    },
    profileSetup:{
        type:Boolean,
        default:false
    }
});

userSchema.pre("save",async function (next) {
    const salt = await genSalt();
    this.password = await hash(this.password,salt);
    next();
});

const UserModel = mongoose.model("User",userSchema);

export default UserModel;


