require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { getDateRange } = require('./utils/dateRange');
const uri = "mongodb+srv://mongodb:learning_backend_mongodb@cluster01.d7f8blu.mongodb.net/eventManagementDB?retryWrites=true&w=majority&appName=Cluster01";

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 5000;
// const port = 5000;


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
          message: `Fetched ${events.length} recent event(s) successfully.`,
          data: events
        });
      } catch (error) {
        // console.error('Error fetching recent events:', error);
        res.status(500).json({
          success: false,
          message: "Internal server error while fetching events.",
          error: error.message
        })
      }
    })

    // Search events
    app.get('/events/search', async (req, res) => {
      try {
        const searchTerms = req.query.title;
        if (!searchTerms) {
          return res.status(400).json({ message: 'Missing search terms. Please write event title in search input.' })
        }

        const events = await eventsCollection.find({ title: { $regex: searchTerms, $options: "i" } }).toArray();

        if (!events.length) {
          return res.status(200).json({
            success: true,
            message: `No event(s) found.`,
            data: []
          });
        }

        res.status(200).json({
          success: true,
          message: `Found ${events.length} event(s).`,
          data: events
        });
      } catch (error) {
        // console.error('Error fetching recent events:', error);
        res.status(500).json({
          success: false,
          message: "Internal server error while searching events.",
          error: error.message
        })
      }
    })

    // Filter events
    app.get('/events/filter', async (req, res) => {
      try {
        const { filterType, selectedDate } = req.query;
        console.log(filterType, selectedDate);

        if (!filterType) {
          return res.status(400).send({ message: 'Missing filterType' });
        }

        if (selectedDate && isNaN(Date.parse(selectedDate))) {
          return res.status(400).json({
            success: false,
            message: 'Invalid selectedDate format. Use ISO format (YYYY-MM-DD).'
          });
        }

        const dateFilter = getDateRange(!selectedDate ? 'today' : filterType, selectedDate);

        if (!dateFilter) {
          return res.status(400).send({ message: 'Invalid filter type or missing date' });
        }

        const events = await eventsCollection.find({
          dateTime: {
            $gte: dateFilter.$gte,
            $lte: dateFilter.$lte
          }
        }).sort({ dateTime: -1 }).toArray();

        res.status(200).json({
          success: true,
          message: `Fetched ${events.length} filtered event(s) successfully.`,
          data: events
        });
      } catch (error) {
        // console.error('Error fetching filtered events:', error);
        res.status(500).json({
          success: false,
          message: "Internal server error while fetching filtered events.",
          error: error.message
        })
      }
    })

    // Add an event
    app.post('/add-event', async (req, res) => {
      try {
        const { title, name, dateTime, location, description, userId } = req.body;

        if (!title || !name || !dateTime || !location || !description || !userId) {
          return res.status(400).json({
            success: false,
            message: "Missing input(s). Make sure input fields are not empty."
          })
        }

        const event = {
          title,
          name,
          dateTime: new Date(dateTime),
          location,
          description,
          attendeeCount: 0,
          userId,
          joinedUsers: [],
          createdAt: new Date()
        };

        const result = await eventsCollection.insertOne(event);

        res.status(201).json({
          success: true,
          message: "Successfully added a new event.",
          ...result
        });
      } catch (error) {
        // console.error('Error adding new event:', error);
        res.status(500).json({
          success: false,
          message: "Internal server error while adding new event.",
          error: error.message
        })
      }
    })

    // Join event
    app.put('/join-event/:eventId', async (req, res) => {
      try {
        const { eventId } = req.params;
        const { userId } = req.body;

        if (!eventId) {
          return res.status(400).json({
            success: false,
            message: 'Event ID is required in URL params.'
          });
        }

        const event = await eventsCollection.findOne({ _id: new ObjectId(eventId) });

        if (!event) {
          return res.status(400).json({
            success: false,
            message: 'Event not found.'
          });
        }

        if (event.joinedUsers && event.joinedUsers.includes(userId)) {
          return res.status(400).json({
            success: false,
            message: 'User has already joined this event'
          });
        }

        const result = await eventsCollection.updateOne(
          { _id: new ObjectId(eventId) },
          {
            $addToSet: { joinedUsers: userId },
            $inc: { attendeeCount: 1 }
          }
        )

        res.status(200).json({
          success: true,
          message: 'Successfully joined the event',
          ...result
        });
      } catch (error) {
        // console.error('Error joining event:', error);
        res.status(500).json({
          success: false,
          message: "Internal server error while joining event.",
          error: error.message
        })
      }

    })

    // Get events added by user
    app.get('/my-events/:id', async (req, res) => {
      try {
        const { id } = req.params;

        if (!id) {
          return res.status(400).json({
            success: false,
            message: 'User ID is required in URL params.'
          });
        }

        const filter = { userId: id };

        const events = await eventsCollection.find(filter).sort({ dateTime: -1 }).toArray();

        if (!events.length) {
          return res.status(200).json({
            success: false,
            message: `No events found. Please login and added new event.`,
            data: events
          });
        }

        res.status(200).json({
          success: true,
          message: `Found ${events.length} user added event(s) successfully.`,
          data: events
        });
      } catch (error) {
        // console.error('Error fetching user added events:', error);
        res.status(500).json({
          success: false,
          message: "Internal server error while fetching user added events.",
          error: error.message
        })
      }
    })

    // Update an event
    app.put('/update-event/:id', async (req, res) => {
      try {
        const { id } = req.params;
        if (!id) {
          return res.status(400).json({
            success: false,
            message: 'Events ID is required in URL params.'
          });
        }

        const { title, name, dateTime, location, description, attendeeCount } = req.body;

        const updateFields = {};

        if (title) updateFields.title = title;
        if (name) updateFields.name = name;
        if (dateTime) updateFields.dateTime = new Date(dateTime);
        if (location) updateFields.location = location;
        if (description) updateFields.description = description;
        if (typeof attendeeCount === 'number') updateFields.attendeeCount = attendeeCount;

        updateFields.updatedAt = new Date();

        const filter = { _id: new ObjectId(id) };

        const result = await eventsCollection.updateOne(filter, {
          $set: updateFields
        });

        if (result.matchedCount === 0) {
          return res.status(404).json({
            success: false,
            message: 'No event found with the provided ID.'
          });
        }

        res.status(201).json({
          success: true,
          message: "Event updated successfully.",
          ...result
        });
      } catch (error) {
        // console.error('Error updating event:', error);
        res.status(500).json({
          success: false,
          message: "Internal server error while updating event.",
          error: error.message
        })
      }
    })

    // Delete an event
    app.delete('/delete-event/:id', async (req, res) => {
      try {
        const { id } = req.params;

        if (!id) {
          return res.status(400).json({
            success: false,
            message: 'Events ID is required in URL params.'
          });
        }

        const filter = { _id: new ObjectId(id) };

        const result = await eventsCollection.deleteOne(filter);

        if (result.deletedCount === 0) {
          return res.status(404).json({
            success: false,
            message: 'Event not found or already deleted.'
          });
        }

        res.status(200).json({
          success: true,
          message: "Successfully deleted event.",
          ...result
        });
      } catch (error) {
        // console.error('Error deleting event:', error);
        res.status(500).json({
          success: false,
          message: "Internal server error while deleting event.",
          error: error.message
        })
      }
    })

    // Signup new user
    app.post('/register', async (req, res) => {
      try {
        const { name, email, password, photoURL } = req.body;

        if (!name || !email || !password || !photoURL) {
          return res.status(400).json({
            success: false,
            message: 'All fields (name, email, password, photoURL) are required.'
          });
        }

        // check for existing user with email
        const existingUser = await usersCollection.findOne({ email: email });
        if (existingUser) {
          return res.status(409).json({
            success: false,
            message: 'Email already registered! Please login instead.'
          });
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

        res.status(201).json({
          success: true,
          message: "User registered successfully.",
          ...result
        });
      } catch (error) {
        // console.error('Error registering user:', error);
        res.status(500).json({
          success: false,
          message: "Internal server error while registering user.",
          error: error.message
        })
      }
    })

    // Login user
    app.post('/login', async (req, res) => {
      try {
        const { email, password } = req.body;

        if (!email || !password) {
          return res.status(400).json({
            success: false,
            message: 'Email and password are required.'
          });
        }

        // check if user exists with given email
        const user = await usersCollection.findOne({ email: email });
        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'Invalid email or password.'
          });
        }

        // compare passwords
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
          return res.status(401).json({
            success: false,
            message: 'Invalid email or password.'
          });
        }

        // send success message and user info
        res.status(200).json({
          success: true,
          message: 'Login Successful',
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            photoURL: user.photoURL,
            role: user.role
          }
        })
      } catch (error) {
        // console.error('Error logging user:', error);
        res.status(500).json({
          success: false,
          message: "Internal server error while loggin user.",
          error: error.message
        })
      }
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