const config = {
    headers: {
        Authorization: `Bearer CHASECK_TEST-HGIKNodWHMWzvQaOmVB7NLOHsF1Kmawd`
    }
}
const axios = require("axios").default

 const verifyPayment = async (req, res) => {
    console.log("verify");
    //verify the transaction 
    await axios.get("https://api.chapa.co/v1/transaction/verify/" + req.params.id, config)
        .then((response) => {
            console.log("Payment was successfully verified")
        }) 
        .catch((err) => console.log("Payment can't be verfied", err))
}
module.exports = verifyPayment