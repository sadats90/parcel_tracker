import express from "express"
import models from "./models/index.js"
import mongoose from "mongoose"


const port  = 3000
const app = express()

app.use(express.json())

const log = (msg) => {console.log(msg)}  // custom function to test imports


const uri = "mongodb://localhost:27017/parcelTracker"
const options = {}
const connectWithDb = ()=>{
    mongoose.connect(uri,options)

}


app.listen(port, () => {
    console.log("test at 3000")
})


app.get('/',(req,res)=>{
    res.send("Hello" + req.query.q)
})

app.post("/",(req,res)=>{
    const data = req.body
    
    const user = new models.User({username:req.body.username, createdAt:Date.now()})
    user.save()
        .then((SavedUser)=>{
            res.status(200).send("User Saved "+ SavedUser._id)})
        .catch((error)=>{
            res.status(400).send(error.message)
    })
})

connectWithDb()
log(models)