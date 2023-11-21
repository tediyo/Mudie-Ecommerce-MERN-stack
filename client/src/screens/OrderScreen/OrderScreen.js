import React, { useState, useEffect } from "react";
import axios from "axios";
import { PayPalButton } from "react-paypal-button-v2";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import {
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Button,
  Container,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import CheckoutForm from '../../components/CheckoutStep/CheckoutForm';
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../../actions/orderAction";
import { savePaymentMethod } from '../../actions/cartAction';
import {
  ORDER_PAY_RESET,
  ORDER_UPDATE_DELIVER_RESET,
} from "../../constants/orderConstant";
import DropNotif from "../../components/Modal/Modal";

const OrderScreen = ({ match, history }) => {
  //stripe
  const stripePromise = loadStripe(
		process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
	);
  const orderId = match.params.id;
  const [sdkReady, setSdkReady] = useState(false);

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderDetail = useSelector((state) => state.orderDetail);
  const { order, loading, error } = orderDetail;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: sucessPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    }

    //chapaa
    /*const payWithChapa = async () => {
      const url = await axios.post("http://localhost:5000/api/pay", {
        amount: "5000",
        currency: "ETB",
        email: payemail.value,
        first_name: name.value,
        last_name: fname.value,
      });
      window.location.href = url.data.url;
    };
    /*const payWithChapa = async () => {
      const url = await axios.post("http://localhost:3001/api/pay", {
        amount: "5000",
        currency: "ETB",
        email: order.user.email,
       
        name: order.user.name,
      });
      window.location.href = url.data.url;
    };*/

    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get("/api/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      /*const script = document.createElement('script');
			script.async = true;
			script.type = 'text/javascript';
			script.src = `https://www.paypal.com/sdk/js?client-id=${clientID}&currency=USD&disable-funding=credit,card`;
			script.onload = () => setSDKReady(true);
			document.body.appendChild(script); */
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if (!order || sucessPay) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      }
    }
  }, [dispatch, orderId, order, sucessPay, history, userInfo]);

  if (!loading) {
    const addDecimal = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };
    // Caculate price
    order.itemPrices = addDecimal(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
  }

  const successPaymentHandler = (paymentResult) => {
		dispatch(savePaymentMethod('PayPal'));
		dispatch(
			payOrder(orderId, { ...paymentResult, paymentMode: 'paypal' })
		);
	};

  

  /*
  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult));
  };
*/
  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };
  const getDate = (date) => {
    return new Date(date).toString();
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <Container className="mt-5">
        <Row>
          <Col md={8}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h1>Order {order._id}</h1>
                <h2>Shipping</h2>
                <p>
                  <strong>Full Name: </strong> {order.shippingAddress.fullname}
                </p>
                <p>
                  <strong>Email: </strong>{" "}
                  <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                </p>
                <p>
                  <strong>Security code: </strong>
                  {order.shippingAddress.phone}{" "}
                </p>
                <p className="mb-3">
                  <strong>Address: </strong>
                  {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode},{" "}
                  {order.shippingAddress.state}
                </p>
                {order.isDelivered ? (
                  <Message variant="success">
                    Delivered on {order.deliveredAt}
                  </Message>
                ) : (
                  <Message variant="danger">Not Delivered</Message>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>Payment Method</h2>
                <p className="mb-3">
                  <strong>Method: </strong>
                  {order.paymentMethod}
                </p>
                {order.isPaid ? (
                  <Message variant="success">
                    Paid on {getDate(order.paidAt)}
                  </Message>
                ) : (
                  <Message variant="danger">Not Paid</Message>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>Order Items</h2>
                {order.orderItems.length === 0 ? (
                  <Message>Your order is empty</Message>
                ) : (
                  <ListGroup variant="flush">
                    {order.orderItems.map((item, index) => (
                      <ListGroup.Item key={index}>
                        <Row>
                          <Col md={1}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fluid
                              rounded
                            />
                          </Col>
                          <Col>
                            <Link to={`/product/${item.product}`}>
                              {item.name}
                            </Link>
                          </Col>
                          <Col md={4}>
                            {item.qty}x ${item.price} = ${item.qty * item.price}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={4}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Order Summary</h2>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${order.itemPrices}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order.shippingPrice}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${order.taxPrice}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Total</Col>
                    <Col>${order.totalPrice}</Col>
                  </Row>
                </ListGroup.Item>

                {!order.isPaid && (
                  <>
                  {order.paymentMethod ===
                  'PalPal' ? (
                  <ListGroup.Item>
                    {loadingPay && <Loader />}
                    {!sdkReady ? (
                      //<Loader />
                     <PayPalButton
                     amount={order.totalPrice}
                     onSuccess={successPaymentHandler}
                   ></PayPalButton>
                    ) : (
                      <Loader />
                      )
                      /*<PayPalButton
                        amount={order.totalPrice}
                        onSuccess={successPaymentHandler}
                      ></PayPalButton>*/
                    }
                    </ListGroup.Item>
                   ) :( 
                    
												<ListGroup.Item>
													{loadingPay && <Loader />}
													<Elements
														stripe={stripePromise}>
														{/* price in paisa */}
														<CheckoutForm
															price={
																order.totalPrice *
																100
															}



                              /////////////////////
															orderId={orderId}
														/>
													</Elements>
												</ListGroup.Item>
											)
                      }
                  </>
                )}
                {loadingDeliver && <Loader />}
                {successDeliver && (
                  <DropNotif
                    heading="Mark Delivered"
                    text="Mark as delivered successfully"
                    resetData={() => {
                      dispatch({ type: ORDER_UPDATE_DELIVER_RESET });
                      dispatch(getOrderDetails(orderId));
                    }}
                  ></DropNotif>
                )}
                {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverHandler}
                    >
                      Mark as Delivered
                    </Button>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default OrderScreen;
