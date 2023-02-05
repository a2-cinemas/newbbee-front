import React from 'react';
import { type NextPage } from 'next';
import { Button } from 'flowbite-react';
import { HiShoppingCart } from 'react-icons/hi';
import PaymentCardForm from '../components/PaymentCardForm';
import OrderSummary from '../components/OrderSummary';
import PaymentCardDropdown from '../components/PaymentCardDropdown';
import AddressForm from '../components/AddressForm';
import PromoCodeForm from '../components/PromoCodeForm';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { Card } from 'flowbite-react';
import { useState } from 'react';
import UserData from '../types/UserData';
import { TextInput } from 'flowbite-react';
import { useMutation } from '@apollo/client';

let movieId = 'No movie found';
let theaterId = 'No movie found';
let showingId = 'No movie found';
let adults = 0;
let children = 0;
let seniors = 0;
let adultTotal =0;
let seniorTotal =0;
let childTotal = 0;
let selectedSeats = '';
let url = '/checkout?';
let available = "true"; "no movie found";
let seatQuantity = 0;
let seats;
let length = 0;

const bookings = gql`
  query GetAllBookings{
    GetAllBookings {
      bookingID
      userID
      paymentCard{
        cardType
      }

      tickets{
        showing {
          movie{
            title
          }
        }
      }
      dateOfPurchase
      total
      subTotal
    }
  }
`;
const CardByIdQuery = gql`
  query getPaymentCardByUserId($id: Int!) {
    getPaymentCardByUserID(id: $id) {
      paymentCardID
      cardType
      CVV
      expirationDate
      holderName
      number
    }
  }
`;

const UpdatePaymentCard = gql`
  mutation updatePaymentCard($updatePaymentCard: UpdatePaymentCardInput!) {
    updatePaymentCard(updatePaymentCardInput: $updatePaymentCard) {
      number
    }
  }
`;

const ticketType = gql`
  query getTicketTypeById($id: Int!) {
    getTicketTypeById(id: $id) {
      type
      price
    }
  }
`;

const Checkout: NextPage = () => {

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

    const adult = c.get('adults');   
    console.log('adult',adult);

    const child = c.get('children');   
    console.log('child', child);

    const senior = c.get('seniors');   
    console.log('senior', senior);

    const seat= c.getAll('seat');   
    console.log('seat', seat);
    

    setStuff(a, theater, showing,adult, child, senior);

    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser && loggedInUser != 'undefined') {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);
  const [user, setUser] = useState<UserData | null>(null);

  
  let currentUserID = 0;
  let currentAddressID = 0;
  if (user) {
    console.log("This is user", user);
    currentUserID = user.userID;
    currentAddressID = user.homeAddressID;
  }

  const {
    loading: cardLoading,
    error: cardError,
    data: cardData,
  } = useQuery(CardByIdQuery, { variables: { id: currentUserID } });
  const [updatePaymentCard, {}] = useMutation(UpdatePaymentCard);

  const {
    data: adultData
  } = useQuery(ticketType, { variables: { id: 0 } });
  const {
    data: childData
  } = useQuery(ticketType, { variables: { id: 1 } });
  const {
    data: seniorData
  } = useQuery(ticketType, { variables: { id: 2 } });
  const router = useRouter();
  const {
    loading: bookLoading,
    error: bookError,
    data: bookData,
  } = useQuery(bookings);

  const [cardType, setCardType] = useState('');
  const [CVV, setCVV] = useState('');
  const [expirationDate, setexpirationDate] = useState('');
  const [holderName, setholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [editCards, setEditCards] = useState(false);


  const setStuff = (a, theater, showing, adult, child, senior) => {
    console.log('set stuff', a + theater);
    theaterId = theater.toString(); 
    movieId = a;
    showingId = showing;

    adults = adult;
    children = child;
    seniors = senior;
    console.log(childTotal, children ,childData?.getTicketTypeById.price );

    adultTotal = adults * 11.5;
    childTotal = children * 5.5;
    seniorTotal = seniors * 6.5;

  };



  console.log("bookings ", bookData?.GetAllBookings[bookData?.GetAllBookings.length - 1]);

  function handleEditCards(e) {
    e.preventDefault();
    setEditCards(!editCards);

    console.log(cardData?.getPaymentCardByUserID[0].holderName);
    if (editCards == true) {
      if (cardType != '' && cardType != cardData?.getPaymentCardByUserID[0].cardType) {
        updatePaymentCard({
          variables: {
            updatePaymentCard: { paymentCardID: cardData?.getPaymentCardByUserID[0].paymentCardID, cardType: cardType },
          },
        });
      }
      var cvvcode = Number(CVV);
      if (CVV != '' && CVV != cardData?.getPaymentCardByUserID[0].CVV) {
        updatePaymentCard({
          variables: {
            updatePaymentCard: { paymentCardID: cardData?.getPaymentCardByUserID[0].paymentCardID, CVV: cvvcode },
          },
        });
      }
      var expirationcode = Number(expirationDate);
      if (expirationDate != '' && expirationDate != cardData?.getPaymentCardByUserID[0].expirationDate) {
        updatePaymentCard({
          variables: {
            updatePaymentCard: {
              paymentCardID: cardData?.getPaymentCardByUserID[0].paymentCardID,
              expirationDate: expirationcode,
            },
          },
        });
      }
      if (holderName != '' && holderName != cardData?.getPaymentCardByUserID[0].holderName) {
        updatePaymentCard({
          variables: {
            updatePaymentCard: {
              paymentCardID: cardData?.getPaymentCardByUserID[0].paymentCardID,
              holderName: holderName,
            },
          },
        });
      }
      if (cardNumber != '' && cardNumber != cardData?.getPaymentCardByUserID[0].number) {
        updatePaymentCard({
          variables: {
            updatePaymentCard: { paymentCardID: cardData?.getPaymentCardByUserID[0].paymentCardID, number: cardNumber },
          },
        });
      }

      location.reload();
    }
  }
  return (
    <>
      <Navbar onCheckout />
      <div className="flex flex-col items-center min-h-fit py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Checkout</h1>
        </div>
        <div className="grid gap-6 mb-6 md:grid-cols-2 mt-8">
          <div>
          <div className="flex-col gap-2 space-y-6 min-w-500">
          <div className="flex p-6 gap-2 space-x-4 rounded-xl bg-gray-200		 max-h-full ">
            <div className="text-lg font-medium">
              <p>Payment Card Information</p>
            </div>
            <div className="space-y-3 text-md bg-slate-50 rounded-xl p-6 gap-5  min-h-800">
              {editCards === false ? (
                <div>
                  <div className="space-y-1 font-medium dark:text-white">


                    <div>{cardData?.getPaymentCardByUserID[0].holderName}</div>
                    <div>{cardData?.getPaymentCardByUserID[0].number} </div>
                    <div>Expiration: {cardData?.getPaymentCardByUserID[0].expirationDate} </div>
                    <div>CVV: {cardData?.getPaymentCardByUserID[0].CVV} </div>
                    <div>{cardData?.getPaymentCardByUserID[0].cardType} </div>

                    <Button pill={true} onClick={handleEditCards}>
                      Edit Card
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <label>Name</label>
                  <TextInput
                    placeholder={cardData?.getPaymentCardByUserID[0].holderName}
                    onChange={(event) => setholderName(event.target.value)}
                  />
                  <label>Number</label>
                  <TextInput
            TextInput        placeholder={cardData?.getPaymentCardByUserID[0].number}
                    onChange={(event) => setCardNumber(event.target.value)}
                  />

                  <label>Expiration</label>
                  <TextInput
                    placeholder={cardData?.getPaymentCardByUserID[0].expirationDate}
                    onChange={(event) => setexpirationDate(event.target.value)}
                  />
                  <label>CVV</label>

                  <TextInput
                    placeholder={cardData?.getPaymentCardByUserID[0].CVV}
                    onChange={(event) => setCVV(event.target.value)}
                  />
                  <label>Card Type</label>

                  <TextInput
                    placeholder={cardData?.getPaymentCardByUserID[0].cardType}
                    onChange={(event) => setCardType(event.target.value)}
                  />

                  <Button pill={true} onClick={handleEditCards}>
                    Done
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>




          </div>
          <div className="grid gap-6 ml-10">
          <div className="max-w-md">
      <Card>
        <div className="mb-4 flex items-center justify-center">
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Order Summary</h5>
        </div>
        <div className="flow-root">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            <li className="py-3 sm:py-2">
              <div className="flex items-center space-x-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">Adult x {adults} </p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  ${adultTotal}
                </div>
              </div>
            </li>
            <li className="py-3 sm:py-2">
              <div className="flex items-center space-x-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">Senior x {seniors}</p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                ${seniorTotal}
                </div>
              </div>
            </li>
            <li className="py-3 sm:py-2">
              <div className="flex items-center space-x-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">Child x {children}</p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                ${childTotal}
                </div>
              </div>
            </li>
            {/* taxes and fees */}
            <li className="py-3 sm:py-2">
              <div className="flex items-center space-x-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">Subtotal</p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                ${bookData?.GetAllBookings[bookData?.GetAllBookings.length - 1].subTotal}
                </div>
              </div>
            </li>
            {/* Total */}
            <li className="py-3 sm:py-4">
              <div className="flex items-center space-x-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-medium text-gray-900 dark:text-white">Total</p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  ${ bookData?.GetAllBookings[bookData?.GetAllBookings.length - 1].total}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </Card>
    </div>
    <Card>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Promo code</h2>
              <div className="flex flex-col mt-4">
                <TextInput id="promo_code" placeholder="Enter your promo code" />
              </div>
              <Button  >Apply</Button>
            </Card>           


              <div className="grid relative">
              <div className="justify-self-end">
                <Button onClick={() => router.push('checkout/confirmation')}>
                  <HiShoppingCart className="mr-2 h-5 w-5" />
                  Confirm Purchase
                </Button>
              </div>
              <div className="absolute justify-self-start">
                <Button color="failure" onClick={() => router.push('/')}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default Checkout;
