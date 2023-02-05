import React, { useState, useEffect } from 'react';
import { type NextPage } from 'next';
import { gql, useQuery } from '@apollo/client';
import Navbar from '../components/Navbar';
import { Avatar, Label, TextInput } from 'flowbite-react';
import { Button } from 'flowbite-react';
import Purchase from '../components/Purchase';
import CardThumbnail from '../components/CardThumbnail';
import AddressForm from '../components/AddressForm';
import { TrashIcon } from '@heroicons/react/24/outline';
import PaymentCardForm from '../components/PaymentCardForm';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import UserData from '../types/UserData';

const UserByIdQuery = gql`
  query getUserByID($id: Int!) {
    getUserByID(id: $id) {
      userID
      firstName
      lastName
      email
      phoneNumber
      password
      admin
      promotion
      userStatusID
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
const UpdateUser = gql`
  mutation updateUser($updateUser: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUser) {
      userID
      password
      firstName
      lastName
    }
  }
`;
const UpdateAddress = gql`
  mutation updateAddress($updateAddress: UpdateAddressInput!) {
    updateAddress(updateAddressInput: $updateAddress) {
      city
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

const AddressByUserIdQuery = gql`
  query getAddressByID($id: Int!) {
    getAddressByID(id: $id) {
      addressID
      street
      city
      state
      zipCode
      country
    }
  }
`;

const bookings = gql`
  query GetAllBookings{
    GetAllBookings {
      bookingID
      userID
      paymentCard{
        cardType
      }
      promotion {
        title
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


const addDashesToPhoneNumber = (number) => {
  let number_val = number.replace(/\D[^\.]/g, '');
  number = number_val.slice(0, 3) + '-' + number_val.slice(3, 6) + '-' + number_val.slice(6);
  return number;
};

const Profile: NextPage = () => {
  let loggedIn: boolean = false;

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
    console.log("This is user", user);
    currentUserID = user.userID;
    currentAddressID = user.homeAddressID;
  }

  const router = useRouter();

  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(UserByIdQuery, { variables: { id: currentUserID } });

  const {
    loading: bookLoading,
    error: bookError,
    data: bookData,
  } = useQuery(bookings);

  const {
    loading: addressLoading,
    error: addressError,
    data: addressData,
  } = useQuery(AddressByUserIdQuery, { variables: { id: currentAddressID } });
  const {
    loading: cardLoading,
    error: cardError,
    data: cardData,
  } = useQuery(CardByIdQuery, { variables: { id: currentUserID } });

  const [updateUser, {}] = useMutation(UpdateUser);
  const [updateAddress, {}] = useMutation(UpdateAddress);
  const [updatePaymentCard, {}] = useMutation(UpdatePaymentCard);

  const [checkedOne, setCheckedOne] = React.useState(false);
  const [editPersonal, setEditPersonal] = useState(false);
  const [editAvatar, setEditAvatar] = useState(false);
  const [editCards, setEditCards] = useState(false);
  const [street, setUserStreet] = useState('');
  const [zip, setUserZip] = useState(0);
  const [state, setUserState] = useState('');
  const [city, setUserCity] = useState('');
  const [fName, setUserFName] = useState('');
  const [lName, setUserLName] = useState('');
  const [phone, setUserPhone] = useState('');
  const [cardType, setCardType] = useState('');
  const [CVV, setCVV] = useState('');
  const [expirationDate, setexpirationDate] = useState('');
  const [holderName, setholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  if (userLoading) return <p>Loading...</p>;
  if (userError) return <p>Opps, something went wrong with fetching the User Data {userError.message}</p>;

  if (addressLoading) return <p>Loading...</p>;
 // if (addressError) return <p>Opps, something went wrong with fetching the Address Data {addressError.message}</p>;
  function changePass(e) {
    e.preventDefault();

    router.push('/create-password-profile');
  }

  
  function transactions() {
    
    let temp = 0;
    console.log("currentUserID ", currentUserID, bookData?.GetAllBookings);
    return (
      <>
    {bookData?.GetAllBookings.map(function (user, index) {
    console.log("books ", currentUserID);

      if(user.userID == currentUserID){
        return(
          <div key={index}>
          <Button>
              Date of purchase: {user.dateOfPurchase}<br></br>
              Movie: {user.tickets[0].showing.movie.title}<br></br>
              Card Used: {user.paymentCard.cardType}<br></br>
              Subtotal: ${user.subTotal}<br></br>
              Total: ${user.total}<br></br>
          </Button>
          </div>
        );
      }

      })}
      </>
      );
  }

  function handleEditPersonal(e) {
    e.preventDefault();
    setEditPersonal(!editPersonal);

    if (editPersonal == true) {
      console.log('edit personal is done');
      if (state != '' && state != addressData?.getAddressByID.state) {
        updateAddress({
          variables: { updateAddress: { addressID: addressData?.getAddressByID.addressID, state: state } },
        });
      }
      if (street != '' && street != addressData?.getAddressByID.street) {
        updateAddress({
          variables: { updateAddress: { addressID: addressData?.getAddressByID.addressID, street: street } },
        });
      }

      if (zip != 0 && zip != addressData?.getAddressByID.zipCode) {
        var zipcode = Number(zip);
        updateAddress({
          variables: { updateAddress: { addressID: addressData?.getAddressByID.addressID, zipCode: zipcode } },
        });
      }
      if (state != '' && state != addressData?.getAddressByID.state) {
        updateAddress({
          variables: { updateAddress: { addressID: addressData?.getAddressByID.addressID, state: state } },
        });
      }
      if (city != '' && city != addressData?.getAddressByID.city) {
        updateAddress({
          variables: { updateAddress: { addressID: addressData?.getAddressByID.addressID, city: city } },
        });
      }
      if (phone != '' && phone != userData?.getUserByID.phoneNumber) {
        updateUser({ variables: { updateUser: { userID: userData?.getUserByID.userID, phoneNumber: phone } } });
      }

      location.reload();
    }
  }

  function handleChangeOne(e) {
    if (userData?.getUserByID.promotion == 0) {
      console.log('Calid reaming');

      updateUser({ variables: { updateUser: { userID: userData?.getUserByID.userID, promotion: true } } });
    } else {
      updateUser({ variables: { updateUser: { userID: userData?.getUserByID.userID, promotion: false } } });
    }

    if (userData?.getUserByID.promotion == true) {
      console.log('this is the way');
    }
    // location.reload();
  }

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
  function handleEditAvatar(e) {
    e.preventDefault();
    console.log("here");
    setEditAvatar(!editAvatar);

    if (editAvatar == true) {
      if (fName != '' && fName != userData?.getUserByID.firstName) {
        updateUser({ variables: { updateUser: { userID: userData?.getUserByID.userID, firstName: fName } } });
      }
      if (lName != '' && lName != userData?.getUserByID.lastName) {
        updateUser({ variables: { updateUser: { userID: userData?.getUserByID.userID, lastName: lName } } });
      }
      //location.reload();
    }
    console.log('avatar edit handled');
  }

  let verified = 'Not Verified';
  if (userData?.getUserByID.userStatusID == 1) {
    verified = 'Verified';
  }

  return (
    <>
      <Navbar onCreateAccount={false} onLogin={true} isAdmin={false} />
      <div className="flex gap-10 p-6 w-screen font-sans justify-center">
        <div className="flex-col gap-2 space-y-6 min-w-500">
          <div className="flex p-6 gap-2 space-x-4 rounded-xl bg-slate-200 max-h-full">
            {editAvatar === false ? (
              <div>
                <Avatar img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded={true} size="xl">
                  <div className="space-y-1 font-medium dark:text-white">
                    <div>
                      {userData?.getUserByID.firstName} {userData?.getUserByID.lastName}
                    </div>
                    <Button pill={true} onClick={handleEditAvatar}>
                      Edit Name
                    </Button>
                  </div>
                </Avatar>
              </div>
            ) : (
              <div>
                <TextInput
                  placeholder={userData?.getUserByID.firstName}
                  type="text"
                  id="fname"
                  name="fname"
                  required
                  onChange={(event) => setUserFName(event.target.value)}
                />

                <TextInput
                  style={{ border: 'none' }}
                  type="text"
                  id="lname"
                  name="lname"
                  required
                  onChange={(event) => setUserLName(event.target.value)}
                  placeholder={userData?.getUserByID.lastName}
                />
                <Button pill={true} onClick={handleEditAvatar}>
                  Done
                </Button>
              </div>
            )}
          </div>
          <div className="inline-block p-6 gap-5 space-y-4 bg-slate-200 rounded-xl flex-col">
            <div className="text-lg font-medium">
              <p>Personal Information</p>
            </div>
            <div className="space-y-3 text-md bg-slate-50 rounded-xl p-6 gap-5">
              {editPersonal === false ? (
                <div>
                  <p>
                    Email:
                    <span className="text-blue-500"> {userData?.getUserByID.email} </span>
                  </p>

                  <p>
                    Account status:
                    <span className="text-blue-500"> {verified} </span>
                  </p>

                  <p>
                    Phone Number:
                    <span className="text-blue-500"> {userData?.getUserByID.phoneNumber} </span>
                  </p>

                  <p>
                    Billing Address:
                    <span className="text-blue-500">
                      {' '}
                      {addressData?.getAddressByID.city} {addressData?.getAddressByID.state}{' '}
                      {addressData?.getAddressByID.street} {addressData?.getAddressByID.zipCode}{' '}
                    </span>
                  </p>

                  <div className="topping">
                    Enroll in promotions
                    <input
                      type="checkbox"
                      id="topping"
                      name="topping"
                      checked={userData?.getUserByID.promotion}
                      //onChange={handleChangeOne}
                      onClick={handleChangeOne}
                    />
                  </div>
                  <Button onClick={changePass}>Change Password</Button>
                </div>
              ) : (
                <div>
                  <p>
                    Email:
                    <span className="text-blue-500"> {userData?.getUserByID.email} </span>
                  </p>

                  <p>
                    Account status:
                    <span className="text-blue-500"> {verified} </span>
                  </p>

                  <label>Phone Number:</label>
                  <TextInput
                    style={{ border: 'none' }}
                    type="text"
                    id="phone"
                    name="phonenumber"
                    required
                    onChange={(event) => setUserPhone(event.target.value)}
                    placeholder={userData?.getUserByID.phoneNumber}
                  />

                  <label>Billing Address:</label>
                  <TextInput
                    style={{ border: 'none' }}
                    type="text"
                    id="address"
                    name="address"
                    required
                    onChange={(event) => setUserCity(event.target.value)}
                    placeholder={addressData?.getAddressByID.city}
                  />
                  <TextInput
                    style={{ border: 'none' }}
                    type="text"
                    id="address"
                    name="address"
                    required
                    onChange={(event) => setUserState(event.target.value)}
                    placeholder={addressData?.getAddressByID.state}
                  />
                  <TextInput
                    style={{ border: 'none' }}
                    type="text"
                    id="address"
                    name="address"
                    required
                    onChange={(event) => setUserStreet(event.target.value)}
                    placeholder={addressData?.getAddressByID.street}
                  />
                  <TextInput
                    style={{ border: 'none' }}
                    type="text"
                    id="address"
                    name="address"
                    required
                    onChange={(event) => setUserZip(Number(event.target.value))}
                    placeholder={addressData?.getAddressByID.zipCode}
                  />
                </div>
              )}
              <Button onClick={handleEditPersonal}>Edit/Done</Button>
            </div>
          </div>
        </div>

        <div className="flex-col gap-2 space-y-6 min-w-500">
          <div className="flex p-6 gap-2 space-x-4 rounded-xl bg-slate-300 max-h-full ">
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

        <div className="inline-block p-6 gap-5 space-y-4 bg-slate-200 rounded-xl flex-col">
          <div className="text-lg font-medium">
            <p>Recent Purchases</p>
          </div>
          {transactions()}
        </div>
      </div>
    </>
  );
};

export default Profile;
