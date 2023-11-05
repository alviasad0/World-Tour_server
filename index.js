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
      const  addPackageCollection = client.db("addPackageDB").collection("addPackage")
      const  addBookedCollection = client.db("addBookedDB").collection("addBooked")
      



    /* read data for all services */
    app.get('/allServices', async (req, res) => {
        const result = await serviceCollection.find().toArray()

        res.send(result);
    })
    

    /* read data  for added packages*/
    app.get('/addPackage', async (req, res) => {
        const result = await addPackageCollection.find().toArray()

        res.send(result);
    })
     

     /* get single data using id for added package */
     app.get("/addPackage/:id", async (req, res) => {
        const id = req.params.id
        
        const query = {
            _id : new ObjectId(id)
        }
        const result = await addPackageCollection.findOne(query)
        console.log(result);
        res.send(result)
        
    })



    /* update a single data for add packages */

    app.put('/addPackage/:id', async (req, res) => {
        const id = req.params.id
        const filter = {
            _id: new ObjectId(id)
        }
        const newPackage = req.body
        const options = {
            upsert: true,
        }
        const updatedPackage = {
            $set: {
                image_url: newPackage.image_url,
                    name: newPackage.name,
                    service_name: newPackage.service_name,
                    service_area: newPackage.service_area,
                    price : newPackage.price,
                    email: newPackage.email,
                    short_description: newPackage.short_description,
                    Package_name: newPackage.Package_name

            }
        }
        const result = await addPackageCollection.updateOne(filter , updatedPackage , options)
        console.log(result);
        res.send(result);
    })

     
     /* delete a single data from the added Package section */
     app.delete('/addPackage/:id', async (req, res) => {
        const id = req.params.id
        console.log(id);
        const query = { _id :new ObjectId(id)}
        const result = await addPackageCollection.deleteOne(query)
        console.log(result);
        res.send(result);
    }
    )


     /* post single data for add packages   */
     app.post('/addPackage', async (req, res) => {
        const product = req.body
        const result = await addPackageCollection.insertOne(product)
       
        res.send(result);
        console.log(result);
    })




     /* post single data for booked   */
     app.post('/booked', async (req, res) => {
        const product = req.body
        const result = await addBookedCollection.insertOne(product)
       
        res.send(result);
        console.log(result);
    })



     /* get single data using id */
     app.get("/allServices/:id", async (req, res) => {
        const id = req.params.id
        
        const query = {
            _id : new ObjectId(id)
        }
        const result = await serviceCollection.findOne(query)
        console.log(result);
        res.send(result)
        
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
