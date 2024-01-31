const express = require("express");
const cors = require("cors")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




const uri = "mongodb+srv://rifathossain1752:daApnpLzQDkbMg2I@cluster0.ebtkoly.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("UsersDB");
    const usersCollection = database.collection("user");

    app.get('/users', async(req,res)=>{
      const cursor = usersCollection.find()
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/users',async(req,res)=>{
      const user = req.body;
      console.log("New user", user);
      const result = await usersCollection.insertOne(user);
      res.send(result);
    })
    app.delete('/users/:id',async(req,res)=>{
      const id = req.params.id;
      console.log("delete id :", id);
      const query = { _id:new ObjectId(id)};
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    })
    app.get('/users/:id', async(req,res)=>{
      const id = req.params.id;
      const query ={_id: new ObjectId(id)};
      const user = await usersCollection.findOne(query);
      res.send(user);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/",(req,res)=>{
    res.send("simple crud is running")
})

app.listen(port,()=>{
    console.log(`simple CRUD is running on port${port}`)
})