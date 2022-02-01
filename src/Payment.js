import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import CurrencyFormat from 'react-currency-format';
import { Link, useNavigate } from 'react-router-dom';
import CheckoutProduct from './CheckoutProduct';
import './Payment.css';
import { getBasketTotal } from './reducer';
import { useStateValue } from './StateProvider';
import axios from './axios';
import { db } from './firebase';

function Payment() {

    const navigate = useNavigate();

    const [{ basket, user }, dispatch] = useStateValue();

    const [succeeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState("");
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState(true);

    useEffect(() =>  {
        //generate that special stripe secret which allows us to charge a customer
        const getClientSecret = async() => {
            const response = await axios({
                method:'post',
                //stripe excepts the total in currencies subunits
                url:`/payments/create?total=${getBasketTotal(basket) * 100}`
            });
            setClientSecret(response.data.clientSecret)
        }

        getClientSecret();
    },[basket])

    console.log('THE SECRET IS >>>', clientSecret)
 
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        //do all fancy stripe stuff
        event.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, { payment_method:{
            card: elements.getElement(CardElement)
        } 
    }).then(({ paymentIntent }) => {
        //paymentIntent = payment confirmation

        db.collection('users')
        .doc(user?.uid)
        .collection('orders')
        .doc(paymentIntent.id)
        .set({
            basket:basket,
            amounr:paymentIntent.amount,
            created:paymentIntent.created
        })

        setSucceeded(true);
        setError(null);
        setProcessing(false);

        dispatch({
            type:'EMPTY_BASKET'
        })

        navigate('/orders')
    })
    }

    const handleChange = event => {
        //Listen for change in  CardElement
        //and display any errors as the customer types their card details
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "" );
    }

  return (<div className='payment'>
      <div className='payment__container'>
          <h1>
              Checkout ({<Link to = 'checkout'>{basket?.length} items</Link>})
          </h1>

          {/* payment section - delivery address */}
          <div className='payment__section'>
              <div className='payment__title'>
                  <h3>Delivery Adress</h3>
              </div>
              <div className='payment__address'>
                  <p>{user ?.email}</p>
                  <p>123 react lane</p>
                  <p>Pune, India</p>
              </div>
          </div>
          {/* payment section - Review Items */}
          <div className='payment__section'>
              <div className = 'payment__title'>
                <h3>Review items and delivery</h3>
              </div>
              <div className='payment__items'>
                  {basket.map(item => (
                      <CheckoutProduct
                        id = {item.id}
                        title = {item.title}
                        image = {item.image}
                        price = {item.price}
                        rating = {item.rating}
                        />
                  ))}
              </div>
          </div>
          {/* payment section - Payment method */}
          <div className='payment__section'>
              <div className='payment__title'>
                  <h3>Payment Method</h3>
              </div>
              <div className='payment__details'>
                  {/* stripe magic */}
                  <form onSubmit={handleSubmit}>
                      <CardElement onChange={handleChange} />

                      <div className='payment__priceContainer'>
                          <CurrencyFormat
                          render Text={(value) => (
                              <h3>Order Total: {value}</h3>
                          )}
                          decimalScale = {2}
                          value = {getBasketTotal(basket)}
                          displayType = {'text'}
                          thousandSeparator = {true}
                          prefix = {'$'}
                          />
                          <button 
                          disabled={processing || disabled || succeeded}>
                              <span>{processing ? <p>Processing</p> : 'Buy Now'}</span>
                          </button>
                      </div>

                      {/* Error */}
                      {error && <div>{error}</div>}

                  </form>
              </div>
              
          </div>
      </div>
  </div>);
}

export default Payment;
