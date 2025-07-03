import mongoose  from "mongoose";

//schema
const userSchema = new mongoose.Schema({
    username : {type:String, required:true, unique:true},
    createdAt : {type:Date, required:true}
})

//reference model
const User = mongoose.model("User",userSchema)


export default User

