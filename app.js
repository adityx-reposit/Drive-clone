const express = require ('express');
const userRouter = require("./routes/user.routes");
const dotenv = require('dotenv');
dotenv.config();
const cookieParser=require('cookie-parser')
const indexRouter = require('./routes/index.routes.js')
const connectToDb=require('./config/db.js')
connectToDb()

const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.set("view engine", 'ejs')

app.use("/",indexRouter)
app.use("/user",userRouter)

app.listen(3000)