const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());






const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.umppp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const addReviews = database.collection("addReviews")

    app.post('/services', async (req, res) => {
      const newService = req.body;
      console.log(newService);
      const result = await addService.insertOne(newService);
      res.send(result);
    })

    app.get('/services', async (req, res) => {
      const cursor = addService.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await addService.findOne(query);
      res.send(result)
    })

    app.post('/reviews', async (req, res) => {
      const newReview = req.body;
      console.log(newReview);
      const result = await addReviews.insertOne(newReview);
      res.send(result);
    })

    app.get('/reviews', async (req, res) => {
      const cursor = addReviews.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.delete('/reviews/:id' , async (req , res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId (id)}
      const result = await addReviews.deleteOne(query);
      res.send(result)
    })

    app.put('/reviews/:id' , async(req , res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updatedReview = req.body
      const updateDoc  = {
        $set: {rating:updatedReview.rating , summary:updatedReview.review}
      }
      const result = await addReviews.updateOne(filter , updateDoc  , options)
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


app.get('/', (req, res) => {
  res.send('Server is running')
})

app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})

