import './App.css';
import Header from './Header';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './Home';
import Checkout from './Checkout';
import Login from './Login';
import Payment from './Payment';
import Orders from './Orders';
import { useEffect } from 'react';
import { auth } from './firebase';
import { useStateValue } from './StateProvider';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const promise = loadStripe(
  'pk_test_51KMQnGSIEtbFuxMzDfeAJ2YNQZBgu3PhWAJ5BPF9FkSyWxkaeTuAhMDlpUBenllbsvbMEs6arISgn6vUNT3QCCJU00DM26YeBF'
);

function App() {

  const [{}, dispatch] = useStateValue();

  useEffect(() => {
    // will only run once when the app component loads...

    auth.onAuthStateChanged((authUser) => {
      console.log("THE USER IS >>> ", authUser);

      if (authUser) {
        // the user just logged in / the user was logged in

        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      } else {
        // the user is logged out
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });
  }, []);

  return (

    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={[<Login/>]} />

          <Route path="/checkout" element={[<Header />, <Checkout/>]} />

          <Route path="/payment" element={[<Header/>, 
          <Elements stripe={promise}>
             <Payment/> 
          </Elements>]} />

          <Route path="/orders" element={[<Header/>,<Orders/>]} />

          <Route path="/" element={[<Header />,<Home />]} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
