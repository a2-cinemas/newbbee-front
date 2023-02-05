import React, { useState, useEffect } from 'react';
import { type NextPage } from 'next';
import Navbar from '../../components/Navbar';
import { gql, useQuery } from '@apollo/client';
import { Button } from 'flowbite-react';
import emailjs from 'emailjs-com';
import Router, { useRouter } from 'next/router';


const bookings = gql`
  query GetAllBookings{
    GetAllBookings {
      bookingID
      userID
      paymentCard{
        cardType
        address{
          street
          state
        }
      }

      tickets{
        showing {
          movie{
            title
            rating
          }
        }
      }
      dateOfPurchase
      total
      subTotal
    }
  }
`;

let email = "";
let total = "";
let transac = "";


const sendEmail = async () => {
  try {
    await emailjs.send(
      'service_va70md4', // serviceID
      'template_nlawgjd', // templateID
      { // this is the object for the variables that go in the template
        email: email,
        title: `Thank you for your booking!`,
        head: `Your total was $ ${total }`,
        message: `We hope to see you soon!`,
        verificationToken: `Transaction ID: ${transac}`,
      },
      'CCk7kM0XQ4zjFYb7H' // Public API key
    );
    Router.push("/");
  } catch (error) {
    console.log(error);
  }
};


const Confirmation: NextPage = () => {

  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser && loggedInUser != undefined) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  let currentUserID = 0;
  let currentAddressID = 0;

  if (user) {
    console.log("This is user", user.email);
    currentUserID = user.userID;
    currentAddressID = user.homeAddressID;
    email = user.email;
  }

  const {
    loading: bookLoading,
    error: bookError,
    data: bookData,
  } = useQuery(bookings);

  console.log("bookings ", bookData?.GetAllBookings[bookData?.GetAllBookings.length - 1]);
  total = bookData?.GetAllBookings[bookData?.GetAllBookings.length - 1].total;
  transac = bookData?.GetAllBookings[bookData?.GetAllBookings.length - 1].bookingID;

  console.log("total ", total);

  return (
    <div className=" h-screen">
      <Navbar isLoggedIn />
      <h1 className="text-3xl underline font-extrabold p-5 font-sans">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Order Summary&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </h1>
      <div className="bg-slate-100 m-10 font-sans p-5 text-xl font-semibold rounded">
        <div className="border-b-2 border-slate-700 p-3">
          Thank you for your purchase. Your order confirmation has been sent to your email
          <br></br>
          <br></br>
          Your Booking # is: {bookData?.GetAllBookings[bookData?.GetAllBookings.length - 1].bookingID}
        </div>
        <h1 className="p-3">Order Details</h1>
        <div className="flex flex-row items-center border-b-2 border-slate-700 pb-3">
          <div className="pr-10 pl-3 font-bold">
            Movie: {bookData?.GetAllBookings[bookData?.GetAllBookings.length - 1].tickets[0].showing.movie.title}
            <p className="font-normal pb-5">{bookData?.GetAllBookings[bookData?.GetAllBookings.length - 1].tickets[0].showing.movie.rating}</p>
            <p className="font-semibold">
             Date of Purchase: {bookData?.GetAllBookings[bookData?.GetAllBookings.length - 1].dateOfPurchase}
              <br></br>
              <br></br>
              <br></br>
            </p>
          </div>
          <div className="font-semibold">
            A2 Cinemas
            <p className="font-normal pb-5">
              <br></br>
              111 Some Address Name Road
              <br></br>
              RandomCity, Georgia 33333
              <br></br>
              <br></br>
              (123)-456-7890
            </p>
          </div>
          <div className="pl-10 pt-6">
            Order Receipt
            <br></br>
            <br></br>


            <div className="font-normal flex flex-row">
              <div className="pr-14">

                <p className="font-bold">Total: </p>
              </div>
              <div className="pr-14">

                <p className="font-bold">${bookData?.GetAllBookings[bookData?.GetAllBookings.length - 1].total}</p>
              </div>


            </div>
          </div>
          <div className="font-semibold">
            <p className="pt-10">Paid Using...</p>
            <p className="font-normal pb-5">
              <br></br>
              Card Type: {bookData?.GetAllBookings[bookData?.GetAllBookings.length - 1].paymentCard.cardType}

              <br></br>
              {bookData?.GetAllBookings[bookData?.GetAllBookings.length - 1].paymentCard.address.street}
              <br></br>
              {bookData?.GetAllBookings[bookData?.GetAllBookings.length - 1].paymentCard.address.state}

            </p>
          </div>
        </div>
        <div className="p-3 pt-10 font-normal">
          <br></br>
          <br></br>
          Sign up for our A2 Cinemas Premium Moviegoer Mail to receive promotional codes and infromation on all things:
          movies, news, snacks, and more!
          <br></br>
          <br></br>
          <p className="font-semibold italic">Confirmation of this purchase has been sent to the email on account</p>
          <Button onClick={sendEmail}>
            Exit
          </Button>
        </div>

      </div>

    </div>
  );
};

export default Confirmation;
