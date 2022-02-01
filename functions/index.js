const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")
('sk_test_51KMQnGSIEtbFuxMzmjEszmEyla3jtC05NBEzGwb9NAva76lysA0NuTsehRKDnfC58O29kKIvZXzI0GvTkPw8GSRt00xyzEbLse');

//API

//App Config
const app = express();

//Middlewares
app.use(cors({origin: true}));
app.use(express.json());

//API routes

app.post('/payments/create', async (req,res) => {
    const total = req.query.total;
    console.log('Payment Request Recieved for this amount >>>', total)

    const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "usd",
    });
    //OK-Created
    res.status(201).send({
        clientSecret: paymentIntent.client_secret,
    })
})

//Listen command
exports.api = functions.https.onRequest(app)

//Example endpoint
//http://localhost:5001/challenge-55061/us-central1/api
