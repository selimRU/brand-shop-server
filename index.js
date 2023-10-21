const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000


// midddleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// bRFUQ0DfdQ36K0rh
// brandShop

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nc6s3b6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // await client.connect();
        const productCollections = client.db("brandShop").collection("products");
        const cartCollections = client.db("brandShop").collection("cart");

        app.get('/products', async (req, res) => {
            const query = {};
            const result = await productCollections.find(query).toArray()
            res.send(result)
        })
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) };
            const result = await productCollections.findOne(query)
            res.send(result)
        })
        app.get('/cart', async (req, res) => {
            const query = {};
            const result = await cartCollections.find(query).toArray()
            res.send(result)
        })

        app.post('/products', async (req, res) => {
            const product = req.body
            const result = await productCollections.insertOne(product)
            res.send(result)
        })
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const product = req.body
            const updateProduct = {
                $set: {
                    name: product.name,
                    type: product.type,
                    price: product.price,
                    ratting: product.ratting,
                    description: product.description,
                    image: product.image
                }
            }
            const result = await productCollections.updateOne(filter, updateProduct, options);
            res.send(result)
        })
        app.post('/cart', async (req, res) => {
            const product = req.body
            // console.log(product);
            const result = await cartCollections.insertOne(product)
            res.send(result)
        })
        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await cartCollections.deleteOne(query)
            res.send(result)
        })
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await productCollections.deleteOne(query)
            res.send(result)
        })

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})