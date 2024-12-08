import express, { Express } from "express"
import path from "path"
import router from "./src/routes/index"
//import morgan from "morgan"
import mongoose, { Connection } from "mongoose"

const app: Express = express()
const port: number = 3000

const mongoDB: string = "mongodb://127.0.0.1:27017/testdb"
mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db: Connection = mongoose.connection

db.on("error", console.error.bind(console, "MongoDB connection error"))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, "../public")))
app.use("/", router)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
