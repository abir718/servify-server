const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


// L2WI5BhRTK4tk85Y
// servify




const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://servify:L2WI5BhRTK4tk85Y@cluster0.umppp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

    const database = client.db("servifyDB")
    const addService = database.collection("addService")

    app.post('/addservice' , async(req , res)=>{
        const newService = req.body;
        console.log(newService);
        const result = await addService.insertOne(newService);
        res.send(result);
    })

    app.get('/addservice' , async(req , res)=>{
        const cursor = addService.find();
        const result = await cursor.toArray();
        res.send(result);
    })


    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/' , (req , res)=>{
    res.send('Server is running')
})

app.listen(port , () =>{
    console.log(`server is running on port ${port}`)
})

