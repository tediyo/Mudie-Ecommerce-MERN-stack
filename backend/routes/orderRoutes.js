const express = require("express");
const router = express.Router();
const { protect, adminProtect } = require("../middlewares/authMiddleware");
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDeliver,
  stripePayment,
  //handlePayment,
  //verifyPayment,
} = require("../controller/orderController");

/* //Chapaa Payment
const{handlePayment}= require("../controller/handlePayment");
const{verifyPayment}= require("../controller/verifyPayment");




router.post("/api/pay",handlePayment); 
router.get("/api/verify-payment/:id",verifyPayment);
router.get('/', (req, res) => {
    res.render("index")
})

// router.get("/api/payment-success",paymentSuccess)

router.get("/api/payment-success", async (req, res) => {
console.log("success");

    // res.render("success")
})*/
router
  .route("/")
  .post(protect, /*stripePayment ,*/ addOrderItems)
  .get(protect, adminProtect, getOrders);
router.route("/myorder").get(protect, getMyOrders);
router.route("/stripe-payment").post(protect, stripePayment);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/deliver").put(protect, adminProtect, updateOrderToDeliver);

module.exports = router;
