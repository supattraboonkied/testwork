const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

const { MongoClient } = require("mongodb");
const uri = "mongodb://Supattra:testwork@localhost:27017";

// Add data to mangodb
app.post('/users/create', async(req, res) => {
  const user = req.body;
  const client = new MongoClient(uri);
  await client.connect();
  await client.db('mydb').collection('users').insertOne({
    id: parseInt(user.id),
    fname: user.fname,
    lname: user.lname,
    email: user.email
  });
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "User with ID = "+user.id+" is created",
    "user": user
  });
})

// Select data
app.get('/users', async(req, res) => {
    const id = parseInt(req.params.id);
    const client = new MongoClient(uri);
    await client.connect();
    const users = await client.db('mydb').collection('users').find({}).toArray();
    await client.close();
    res.status(200).send(users);
})

// Select data where id
app.get('/users/:id', async(req, res) => {
    const id = parseInt(req.params.id);
    const client = new MongoClient(uri);
    await client.connect();
    const user = await client.db('mydb').collection('users').findOne({"id": id});
    await client.close();
    res.status(200).send({
      "status": "ok",
      "user": user
    });
  })

  // Update data to mangodb
  app.put('/users/update', async(req, res) => {
    const user = req.body;
    const id = parseInt(user.id);
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('mydb').collection('users').updateOne({'id': id}, {"$set": {
      id: parseInt(user.id),
      fname: user.fname,
      lname: user.lname,      
      email: user.email
    }});
    await client.close();
    res.status(200).send({
      "status": "ok",
      "message": "User with ID = "+id+" is updated",
      "user": user
    });
  })

   // Delete data where id
  app.delete('/users/delete', async(req, res) => {
    const id = parseInt(req.body.id);
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('mydb').collection('users').deleteOne({'id': id});
    await client.close();
    res.status(200).send({
      "status": "ok",
      "message": "User with ID = "+id+" is deleted"
    });
  })