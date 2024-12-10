const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 5001;
// const PORT = process.env.port || 5001;
const mongoose = require("mongoose")
const { mongoURL } = require("./keys");
// const path= require("path")

app.use(cors())

require("./models/model")
require("./models/post")

app.use(express.json())
app.use(require("./routes/auth"))
app.use(require("./routes/createPost"))
app.use(require("./routes/user"))


mongoose.connect(mongoURL);

mongoose.connection.on("connected", ()=>{
    console.log(" connected successfully to mongo")
});
mongoose.connection.on("error", ()=>{
    console.log(" not connected to mongo")
});

// serving the frontend
// app.use(express.static(path.join(__dirname, "./insta_app/build")))

// app.get("*", (req,res)=>{
//     res.sendFile(
//         path.join(__dirname, "./insta-app/build/index.html"),
//         function(err){
//             res.status(500).send(err)
//         }
//     )
// })


app.listen(PORT, ()=>(
    console.log("server is running on"+ " " + PORT)
))