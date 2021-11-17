const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;



const port = process.env.PORT || 5000;

//middle wire
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oiptd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('carPoint');
        const productsCollection = database.collection('products');

        //GET API
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({})
            const products = await cursor.toArray();
            res.send(products)
        });

        //GET Single Products
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific products', id);
            const query = { _id: ObjectId(id) };
            const product = await productsCollection.findOne(query);
            res.json(product);
        })

        //POST API
        app.post('/products', async (req, res) => {
            const product = req.body;
            console.log('Hit the api', product)

            const result = await productsCollection.insertOne(product);
            console.log(result);
            res.json(result);
        });

        //DELETE API
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.json(result)

        })



    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello car points!')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})