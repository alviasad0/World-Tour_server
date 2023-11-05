const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


/* middleweres */
app.use(express.json())
/* app.use(cors()) */
const corsConfig = {
    origin: '*',
    credenttials: true,
    methods : ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}

app.use(cors(corsConfig))


/* user name and the password */
// username : alviasad10
//password : jF5pH1BpVqhMiPvK

const uri = "mongodb+srv://alviasad10:jF5pH1BpVqhMiPvK@cluster0.d7bs2ds.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
      
      /* create database and collection  */
      const  serviceCollection = client.db("allServiceDB").collection("allService")
      




    /* read data */
    app.get('/allServices', async (req, res) => {
        const result = await serviceCollection.find().toArray()

        res.send(result);
    })


      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      
    //   await client.close();
    }
  }

  run().catch(console.dir);


app.get('/', (req, res) => {
res.send('world tour server is running')

})


app.listen(port, () => {
 console.log(`app listening on ${port}`);   
})
