require("dotenv").config();
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const uri = "mongodb+srv://<db_username>:<db_password>@cluster0.ogyvr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ogyvr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });

    const database = client.db("TODO");
    const userCollection = database.collection("users");
    const taskCollection = database.collection("Tasks");

    app.post("/users", async (req, res) => {
      const user = req.body;
    //   console.log('user here',user);
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exist", insertedId: null });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    app.post("/tasks", async (req, res) => {
      const data = req.body;
      const result = await taskCollection.insertOne(data);
      res.send(result);
    });
    app.get("/tasks", async (req, res) => {
      const {email}= req.headers
      console.log(email);
      const query ={email:email}
    //   console.log(query);
      const result = await taskCollection.find(query).toArray();
      res.send(result);
    });
    app.delete("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });
    app.patch("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      
      const filter = { _id: new ObjectId(id) };
      const task = req.body;
      const {title,message,Category}= task
    //   console.log(task);
      const updatedTask = {
        $set: {
          title: task.title,
          message: task.message,
          Category: task.category,
        },
      };
      const result = await taskCollection.updateOne(filter, updatedTask);
      res.send(result);
    });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
