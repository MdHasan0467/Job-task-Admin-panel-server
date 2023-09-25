const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
const colors = require("colors");
const dotenv = require('dotenv').config()
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { MongoClient, ServerApiVersion } = require('mongodb');


//! Middleware's.......... 
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dewgdxt.mongodb.net/?retryWrites=true&w=majority`;

//! Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});




//! database connection check by this function 
async function dbConnect() {
    try {
    await client.connect();
    console.log('successfully connected to MongoDB!'.blue.bold);
    }
    catch{err => console.log(err)}
}
dbConnect()





// User Collection
const usersCollection = client.db("Admin-panel").collection("users");



app.get("/", (req, res) => {
  res.send("Server Is Running");
});


app.post("/user", async (req, res) => {
  const user = req.body;
  const email = user.email;
  const filter = await usersCollection.findOne({ email: email });
  
  const usersList = await usersCollection.count({});
  
  if (filter === null) {
      if (usersList !== 0) {
          res.send((result = await usersCollection.insertOne(req.body)));
      }
      else {
      const user = req.body;
      user.role = 'Admin';
      const result = await usersCollection.insertOne(user);
      res.send(result);
      }
    }
    else {
        res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }
  });







app.listen(port, () => {
    console.log(`Server Is Running on port ${port}`.red.bold);
  });