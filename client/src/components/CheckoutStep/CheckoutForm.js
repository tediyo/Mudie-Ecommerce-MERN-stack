import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { payOrder } from '../../actions/orderAction';
import { savePaymentMethod } from '../../actions/cartAction';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'; // for stripe CC component
import Message from '../../components/Message';
///////////////////

import StripeCheckout from 'react-stripe-checkout';
const CheckoutForm = ({ price, orderId }) => {
	const [error, setError] = useState(''); // from the stripe component itself
	const dispatch = useDispatch();
	const [clientSecret, setClientSecret] = useState(''); // from the payment intent sent from server
	const stripe = useStripe();
	const elements = useElements();

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	///////////////////////
 
/*<StripeCheckout
  stripeKey={process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}
  token={this.onToken}
  amount={this.state.amount}
/>


const onToken = (token, amount) => {
	fetch('/charge', {
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json',
	  },
	  body: JSON.stringify({
		token,
		amount,
	  }),
	})
	  .then((response) => {
		response.json().then((data) => {
		  alert(`Payment Successful!`);
		});
	  })
	  .catch((error) => {
		console.error(error);
		alert(`Payment Error: ${error}`);
	  });
  };*/

	////////////////////////
	// STEP 1: create a payment intent and getting the secret
	useEffect(() => {
		const getClientSecret = async () => {
			const { data } = await axios.post(
				'/api/orders/stripe-payment',
				{ price, email: userInfo.email },
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			setClientSecret(data.clientSecret);
		};

		if (userInfo && price) getClientSecret();
	}, [price, userInfo]);

	// STEP 2: make the payment after filling the form properly
	const makePayment = async (e) => {
		e.preventDefault();
		if (!stripe || !elements) {
			// Stripe.js has not yet loaded.
			// Make  sure to disable form submission until Stripe.js has loaded.
			return;
		}
		if (clientSecret) {
			const payload = await stripe.confirmCardPayment(clientSecret, {
				payment_method: {
					card: elements.getElement(CardElement),
					billing_details: {
						name: userInfo.name,
						email: userInfo.email,
					},
				},
			});
			// console.log(payload.error);
			if (!payload.error) {
				dispatch(savePaymentMethod('Stripe'));
				dispatch(
					payOrder(orderId, {
						...payload.paymentIntent,
						paymentMode: 'stripe',
					})
				);
			} else {
				setError(payload.error.message);
			}
		} else {
			window.location.reload();
		}
	};

	// render a checkout form for filling details about credit or debit cards
	return (
		<Form id='payment-form' onSubmit={makePayment}>
			{error && (
				<Message dismissible variant='danger'>
					{error}
				</Message>
			)}
			<Form.Group
				style={{
					margin: '1em 0',
					fontSize: '1em',
				}}>
				<CardElement
					options={{
						style: {
							base: {
								fontSize: '16px',
								color: '#424770',
								'::placeholder': {
									color: '#aab7c4',
								},
							},
							invalid: {
								color: '#9e2146',
							},
						},
					}}
					id='card-element'
				/>
			</Form.Group>
			<div className='d-grid'>
				<Button disabled={!stripe} size='lg' type='submit'>
					Pay Noww
				</Button>
			</div>
		</Form>
	);
};

export default CheckoutForm;
