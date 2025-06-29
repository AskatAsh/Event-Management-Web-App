const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const uri = "mongodb+srv://mongodb:learning_backend_mongodb@cluster01.d7f8blu.mongodb.net/eventManagementDB?retryWrites=true&w=majority&appName=Cluster01";

const app = express();
const port = process.env.PORT || 5000;


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
    // await client.connect();

    const eventsCollection = client.db("eventManagementDB").collection("events");

    app.get('/events', async (req, res) => {
      const result = await eventsCollection.find({}).sort({"dateTime": -1}).limit(3).toArray();
      console.log(result);
      res.send(result);
    })

    app.get('/events/search', async (req, res) => {
      const searchTerms = req.query.title;
      console.log(searchTerms);
      const result = await eventsCollection.find({title: {$regex: searchTerms, $options: "i"}}).toArray();
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Event Management Server is Running...");
});

app.listen(port, () => {
  console.log("Server is Running on port: ", port);
});