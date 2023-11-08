const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken')
require('dotenv').config()
const cookieParser= require('cookie-parser');
const port = process.env.PORT || 5000
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


/* middleweres */
app.use(express.json())
/* app.use(cors()) */
const corsConfig = {
    origin: ['http://localhost:5173'],
    credentials: true,
    methods : ['GET', 'POST','PATCH', 'PUT', 'DELETE', 'OPTIONS'],
}

app.use(cors(corsConfig))
app.use(cookieParser())




const uri = `mongodb+srv://${process.env.VITE_User}:${process.env.VITE_User_Password}@cluster0.d7bs2ds.mongodb.net/?retryWrites=true&w=majority`;

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
      

    /* access token  */
    // 76b7f5055e1b52554c47e5e27a22e4d8abec0535d46678fb6911d30da2649b078e9c143b3ebc4113720dadc513959e4f5e1040653a85f814bc2aabd1983bb1dc



     /* auth releted api  */
     app.post('/jwt' , async(req ,res)=>{
     const user = req.body;
     console.log('user for web token', user)
     const token = jwt.sign(user, '76b7f5055e1b52554c47e5e27a22e4d8abec0535d46678fb6911d30da2649b078e9c143b3ebc4113720dadc513959e4f5e1040653a85f814bc2aabd1983bb1dc', {expiresIn: '1h'})

     res.cookie('token', token ,{
        httpOnly : true,
        secure: true,
        sameSite : 'none'
     })
     
     .send({success : true})

     })

     /*  log out auth */
     app.post('/logout', async(req ,res)=>{
    const user = req.body
    console.log('logging out ' , user);
    res.clearCookie('token' , {maxAge: 0}).send({success : true})
     })

      

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


    /* read data  for booked packages*/
    app.get('/booked', async (req, res) => {
        // console.log( req.cookies);
        const result = await addBookedCollection.find().toArray()

        res.send(result);
    })
     

     /* get single data using id for added package */
     app.get("/addPackage/:id", async (req, res) => {
        const id = req.params.id
        
        const query = {
            _id : new ObjectId(id)
        }
        const result = await addPackageCollection.findOne(query)
        // console.log(result);
        res.send(result)
        
    })


     /* get single data using id for booked packages */
     app.get("/booked/:id", async (req, res) => {
        const id = req.params.id
        
        const query = {
            _id : new ObjectId(id)
        }
        const result = await addBookedCollection.findOne(query)
        // console.log(result);
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
        // console.log(result);
        res.send(result);
    })




    /* update a single data for booked packages */

    app.patch('/booked/:id', async (req, res) => {
        const id = req.params.id
        const filter = {
            _id: new ObjectId(id)
        }
        const updateBookedPackage = req.body
        
        console.log(updateBookedPackage);
        const updatedPackage = {
            $set: {
                status: updateBookedPackage.status,
                    
            }
        }
        const result = await addBookedCollection.updateOne(filter , updatedPackage )
        // console.log(result);
        res.send(result);
    })

     
     /* delete a single data from the added Package section */
     app.delete('/addPackage/:id', async (req, res) => {
        const id = req.params.id
        console.log(id);
        const query = { _id :new ObjectId(id)}
        const result = await addPackageCollection.deleteOne(query)
        // console.log(result);
        res.send(result);
    }
    )


     /* post single data for add packages   */
     app.post('/addPackage', async (req, res) => {
        const product = req.body
        const result = await addPackageCollection.insertOne(product)
       
        res.send(result);
        // console.log(result);
    })




     /* post single data for booked   */
     app.post('/booked', async (req, res) => {
        const product = req.body
        const result = await addBookedCollection.insertOne(product)
       
        res.send(result);
        // console.log(result);
    })



     /* get single data using id  for addservice*/
     app.get("/allServices/:id", async (req, res) => {
        const id = req.params.id
        
        const query = {
            _id : new ObjectId(id)
        }
        const result = await serviceCollection.findOne(query)
        // console.log(result);
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
