const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const { getDateRange } = require('./utils/dateRange');
const uri = "mongodb+srv://mongodb:learning_backend_mongodb@cluster01.d7f8blu.mongodb.net/eventManagementDB?retryWrites=true&w=majority&appName=Cluster01";

const app = express();
app.use(express.json());
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

    // GET recent events
    app.get('/events', async (req, res) => {
      const result = await eventsCollection.find({}).sort({ "dateTime": -1 }).limit(3).toArray();
      console.log(result);
      res.send(result);
    })

    // Search events
    app.get('/events/search', async (req, res) => {
      const searchTerms = req.query.title;
      console.log(searchTerms);
      const result = await eventsCollection.find({ title: { $regex: searchTerms, $options: "i" } }).toArray();
      res.send(result);
    })

    // Filter events
    app.get('/events/filter', async (req, res) => {
      const { filterType } = req.query;
      console.log(filterType);

      const dateFilter = getDateRange(filterType);
      const query = {
        dateTime: { $gte: `${dateFilter.$gte}`, $lte: `${dateFilter.$lte}` }
      }
      console.log(query);
      const result = await eventsCollection.find({
        dateTime: {
          $gte: dateFilter.$gte,
          $lte: dateFilter.$lte
        }
      }).sort({ dateTime: -1 }).toArray();
      res.send(result);
    })

    // Add an event
    app.post('/add-event', async (req, res) => {
      const { title, name, dateTime, location, description } = req.body;

      const event = {
        title,
        name,
        dateTime: new Date(dateTime),
        location,
        description,
        attendeeCount: 0,
        createdAt: new Date()
      };

      const result = await eventsCollection.insertOne(event);
      console.log(result);
      res.send(result);
    })

    // Update an event
    app.put('/update-event/:id', async (req, res) => {
      const { id } = req.params;
      const { title, name, dateTime, location, description, attendeeCount } = req.body;

      const filter = { _id: new ObjectId(id) };

      const updateEvent = {
        title: title,
        name: name,
        dateTime: new Date(dateTime),
        location: location,
        description: description,
        attendeeCount: attendeeCount,
        updatedAt: new Date()
      };

      const result = await eventsCollection.updateOne(filter, {
        $set: updateEvent
      }, { upsert: true });

      console.log(result);
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