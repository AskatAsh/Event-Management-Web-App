const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const bcrypt = require('bcrypt');
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
    const usersCollection = client.db("eventManagementDB").collection("users");

    // GET recent events
    app.get('/events', async (req, res) => {
      try {
        const events = await eventsCollection.find({}).sort({ "dateTime": -1 }).toArray();
        res.status(200).json({
          success: true,
          message: `Fetched ${events.length} recent event(s) auccessfully.`,
          data: events
        });
      } catch (error) {
        console.error('Error fetching recent events:', error);
        res.status(500).json({
          success: false,
          message: "Internal server error while fetching events.",
          error: error.message
        })
      }
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

    // Get events added by user
    app.get('/my-events/:id', async (req, res) => {
      const { id } = req.params;

      const filter = { userId: id };

      const result = await eventsCollection.find(filter).toArray();

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

    // Delete an event
    app.delete('/delete-event', async (req, res) => {
      const { id } = req.query;

      console.log(id);
      const filter = { _id: new ObjectId(id) };

      const result = await eventsCollection.deleteOne(filter);

      res.send(result);
    })

    // Signup new user
    app.post('/register', async (req, res) => {
      const { name, email, password, photoURL } = req.body;

      // check for existing user with email
      const existingUser = await usersCollection.findOne({ email: email });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already registered! Please Login.' });
      }

      // hashing password using bcrypt with saltOrRounds
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        name,
        email,
        password: hashedPassword,
        photoURL,
        role: 'user',
        createdAt: new Date()
      };

      const result = await usersCollection.insertOne(newUser);

      console.log(result);
      res.send(result);
    })

    // Login user
    app.post('/login', async (req, res) => {
      const { email, password } = req.body;

      // check if user exists with given email
      const user = await usersCollection.findOne({ email: email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      // compare passwords
      const isPasswordMatched = await bcrypt.compare(password, user.password);
      if (!isPasswordMatched) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      // send success message and user info
      res.json({
        message: 'Login Successful',
        user: {
          name: user.name,
          email: user.email,
          photoURL: user.photoURL,
          role: user.role
        }
      })

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