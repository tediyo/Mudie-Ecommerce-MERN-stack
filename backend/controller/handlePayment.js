/* 
    CHAPA API PAYMENT INTEGRATION TEST
    Required: Chapa secret key || GET THE KEY BY REGISTERING @ https://dashboard.chapa.co/register
*/

// const express = require("express")
// const app = express()
import { Chapa } from 'chapa-nodejs';

const axios = require("axios").default

const PORT = process.env.PORT //|| 4400

const CHAPA_URL = process.env.CHAPA_URL || "https://api.chapa.co/v1/transaction/initialize"
const CHAPA_AUTH = process.env.CHAPA_AUTH // || register to chapa and get the key

// app.set("view engine", "ejs")

// req header with chapa secret key
const config = {
    headers: {
        Authorization: `Bearer CHASECK_TEST-HGIKNodWHMWzvQaOmVB7NLOHsF1Kmawd`
    }
}

// entry for the front end
// app.get('/', (req, res) => {
//     res.render("index")
// })

// initial payment endpoint
 const handlePayment =async (req, res) => {
         // chapa redirect you to this url when payment is successful
        const CALLBACK_URL = "http://localhost:3001/api/verify-payment/"
        const RETURN_URL = "http://localhost:3001/api/payment-success/"

        // a unique reference given to every transaction
        const TEXT_REF = "tx-myecommerce12345-" + Date.now()

        // form data
        const data = {
            amount: req.body.amount, 
            currency: req.body.currency,
            email: req.body.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            tx_ref: TEXT_REF,
            callback_url: CALLBACK_URL + TEXT_REF,
            return_url: RETURN_URL
        }

        // post request to chapa
        await axios.post(CHAPA_URL, data, config)
            .then((response) => {
                return res.json({url:response.data.data.checkout_url})
            })
            .catch((err) => console.log(err))
}
module.exports =handlePayment;
// verification endpoint


