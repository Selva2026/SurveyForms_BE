import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    "name" : {type : String, Required :true},
    "email":{type:String, Required:true, unique: true},
    "password":{type : String, Required:true}
});

const User=mongoose.model("User", UserSchema);

export default User