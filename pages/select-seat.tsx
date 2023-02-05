import React from 'react';
import { type NextPage } from 'next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Button } from 'flowbite-react';
import { HiShoppingCart } from 'react-icons/hi';
import PaymentCardForm from '../components/PaymentCardForm';
import OrderSummary from '../components/OrderSummary';
import PaymentCardDropdown from '../components/PaymentCardDropdown';
import AddressForm from '../components/AddressForm';
import PromoCodeForm from '../components/PromoCodeForm';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/navigation';
import { Label, TextInput, Textarea } from 'flowbite-react';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { useEffect } from 'react';
import _debounce from 'lodash/debounce';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import UserData from '../types/UserData';
import { removeArgumentsFromDocument } from '@apollo/client/utilities';


const AvailableSeats = gql`
query getAvailableSeats($showingID: Int!) {
  getAvailableSeats(showingID:$showingID) {
    seatID
    location
    theaterID
  }
}
`;

const SeatsByQuery = gql`
  query getAllSeats {
    getAllSeats {
      seatID
      location
      theaterID
    }
  }
`;
const createBooking = gql`
  mutation createBookingWithTickets($createTicketInputs: [CreateTicketInput!]!, $createBookingInput: [CreateBookingInput!]!) {
    createBookingWithTickets(createTicketInputs: $createTicketInputs, createBookingInput : $createBookingInput) {
      total
      subTotal
      bookingID
    }
  }
`;
const seatAvailable = gql`
  query isSeatAvailable($seatID: Int!, $showingID: Int!) {
    isSeatAvailable(seatID: $seatID, showingID: $showingID) 
  }
`;
let movieId = 'No movie found';
let theaterId = 'No movie found';
let showingId = 'none';
let adults = 0;
let children = 0;
let seniors = 0;
let seatQuantity = 0;
let selectedSeats = '';
let url = '/checkout?';
let available = "true";
let seats = new Array(6);


const SelectSeat: NextPage = () => {


  const [createbooking, {loading : loading1, error: error1, data: bookingData}] = useMutation(createBooking);

  const [user, setUser] = useState<UserData | null>(null);


  const [getAvailable, { loading, error, data: availableData  }] = useLazyQuery(seatAvailable );
  
  const router = useRouter();

  const { loading: seatLoading, error: seatError, data: seatData } = useQuery(SeatsByQuery);
  const { loading: avSeatLoading, error: avSeatError, data: avSeatData } = useQuery(AvailableSeats, { variables: { showingID:  parseInt(showingId) } });



  const getAvailableButChill = _debounce(getAvailable, 10000);

  const setStuff = (a, theater, showing) => {
    console.log('set stuff', a + theater);
    theaterId = theater.toString(); 
    movieId = a;
    showingId = showing;
  };
  const addSeat = (event, id) => {
    selectedSeats = selectedSeats + "&seat=" + id ;
    console.log("changed", selectedSeats);

    if(seatQuantity == 6){
      <p>cannot select more than 6 seats</p>
    }
    else{
      seats[seatQuantity] = id;
    }
    
    seatQuantity = seatQuantity + 1;


  }
  const trytodothis = (e) => {


    e.preventDefault(); //This is important, i'm not sure why, but the email won't send without it
    url = "/checkout?movies="+movieId+"&theater="+theaterId + "&showing="+ showingId + "&adults=" + adults + "&children=" + children + "&seniors=" + seniors ;
    console.log("URL", bookingData?.createBookingWithTickets.bookingID);

    router.push(url);
    
  }

  const checkout = (e) => {

    e.preventDefault(); //This is important, i'm not sure why, but the email won't send without it
    let ticket = new Array(seatQuantity);
    for(let i = 0; i < seatQuantity; i ++){
        ticket[i] = {
          ticketTypeID : 2,
          userID: user.userID,
          bookingID: 10, 
          seatID: parseInt(seats[i]),
          showingID: parseInt(showingId)
        }
    }
    let booking = {
      userID: user.userID, 
      paymentCardID: null, 
      promotionID:  14, 
      dateOfPurchase: "2022-11-22", 
      total: 0,
      feeIDs: 1

    }
    console.log(user.userID);
    

    createbooking({
      variables: { createTicketInputs: ticket, createBookingInput: booking},
    }
    )

    
    
    console.log("loading ", loading1, error1, bookingData);
    
    trytodothis(e);

    //router.push(url);
    





    
  }
  const setAdults = (event) =>{
    adults = event;
    console.log(adults);
  }
  const setChildren = (event) =>{
    children = event;
    console.log(children);
  }
  const setSeniors = (event) =>{
    seniors = event;
    console.log(seniors);
  }

  useEffect(() => {

    const b = window.location.search;
    console.log(b);
    const c = new URLSearchParams(b);
    const a = c.get('movies');
    console.log('movies', a);
    
    const showing = c.get('showing');   
    console.log('showing', showing);

    const theater = c.get('theater');   
    console.log('theater', theater);

    setStuff(a, theater, showing);

    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser && loggedInUser != 'undefined') {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  
  console.log(seatData?.getAllSeats);


 // getAvailable({ variables: { seatID: 1, showingID:1 } });

  function show(current) {

    let temp = 0;

    return (
      <>
      
          {avSeatData?.getAvailableSeats.map(function (user, index) {
            // returns Nathan, then John, then Jane
           /* var d = new Date(user.startTime);
            let hours = d.getUTCHours();
            let minutes = d.getUTCMinutes();

            console.log('d', d); // Hours
            let start = moment(user.startTime).utc().format('MM/DD/YYYY');
            let fullDate = d;
            let url = '/select-seat?movies=' + movieId + '?showing=' + user.showingID;
            // start = fullDate.toString();
            console.log(start);*/
           //console.log("data",availableData?.isSeatAvailable);
         //  let num = parseInt(showingId);

          // console.log("data first ",user.seatID, num);
          // getAvailableButChill({ variables: { seatID: user.seatID, showingID:  num } });
         //  console.log("data",availableData?.isSeatAvailable);
            



            if(user.theaterID == theaterId && user.location.charAt(0) == current ){
              if( temp == (user.seatID - 1)){
              }
              else{
                if(temp == 0){
  
                }
                else {
                console.log("temp", temp, user.seatID);
                }
              }
              temp = user.seatID;

              let isSeatAvailable = true;
     
              return (

              <td  key={index}>
                
                  {/*<Button onClick={event => addSeat(event.target, user.location)} >
                    {user.location}
            </Button>*/}
                  <Button style={{color: 'white', backgroundColor: 'CornflowerBlue'}}>
                  <p>{user.location }  </p>
                  <span style={{color: 'CornflowerBlue'}}>_</span>

                  <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike"  onClick={event => addSeat(event.target, user.seatID)}/>
                  </Button>
                 


                </td>


            );
            
            }
            /*else if(user.theaterID == theaterId && user.location.charAt(0) == current){
              let num = parseInt(showingId);

                
                return (
  
                <td  key={index}>
                  
                    {/*<Button onClick={event => addSeat(event.target, user.location)} >
                      {user.location}
              </Button>*/
              /*      <Button style={{color: 'white', backgroundColor: 'grey'}}>
                    <p>{user.location }  </p>
                    <span style={{color: 'grey'}}>_</span>
  
                    </Button>
                   
  
  
                  </td>);
  
            }
*/

          })}
      </>
    );
  }


  return (
    <>
      <Navbar onCheckout />

      <div>
        <br></br>
        <h1 className="text-center  lg:mx-40 md:mx-20 mx-5 font-bold text-4xl text-gray-800">
          Screen<br></br>
          _______________________
        </h1>

        <br></br>
      <div className="text-center" >
        <h1 className=" text-2xl text-gray-800">Ticket Type Selection</h1>
        <br></br>


        <label for="quantity">Adults:</label>
        <input style={{ border: 'none' }}  type="number" id="quantity" name="quantity" min="0" max="5" placeholder="0" onChange={(event) => setAdults(event.target.value)}/>
        <label for="quantity">Children:</label>
        <input style={{ border: 'none' }}  type="number" id="quantity" name="quantity" min="0" max="5" placeholder="0" onChange={(event) => setChildren(event.target.value)}/>
        <label for="quantity">Seniors:</label>
        <input style={{ border: 'none' }}  type="number" id="quantity" name="quantity" min="0" max="5" placeholder="0" onChange={(event) => setSeniors(event.target.value)}/>
    
      </div>
  
      </div>

      <div>

        
        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '50vh'}}>
 


            <table>
            <tbody>

            <tr>
            {show("A")}
            </tr>
            <tr>
            {show("B")}
            </tr>
            <tr>
            {show("C")}
            </tr>
            <tr>
            {show("D")}
            </tr>
            <tr>
            {show("E")}
            </tr>
            <tr>
            {show("F")}
            </tr>
            <tr>
            {show("G")}
            </tr>
            <tr>
            {show("H")}
            </tr>
            <tr>
            {show("I")}
            </tr>
            <tr>
            {show("J")}
            </tr>
            <tr>
            {show("K")}
            </tr>
            <tr>
            {show("L")}
            </tr>
            <tr>
            {show("M")}
            </tr>
            <tr>
            {show("N")}
            </tr>
            <tr>
            {show("O")}
            </tr>
            <tr>
            {show("P")}
            </tr>
            <tr>
            {show("Q")}
            </tr>
            <tr>
            {show("R")}
            </tr>
            <tr>
            {show("S")}
            </tr>
            <tr>
            {show("T")}
            </tr>
            <tr>
            {show("U")}
            </tr>
            <tr>
            {show("V")}
            </tr>
            <tr>
            {show("W")}
            </tr>
            <tr>
            {show("X")}
            </tr>
            <tr>
            {show("Y")}
            </tr>
            <tr>
            {show("Z")}
  </tr>
                    
            </tbody>

            </table>

      


            </div>
            <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
 
            <Button onClick={checkout} >
                Done
            </Button>
            </div>
      </div>
    </>
  );
};

export default SelectSeat;
