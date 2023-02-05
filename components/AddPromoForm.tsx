import React, { useState, FormEvent, FormEventHandler } from 'react';
import { Button, TextInput, Label, Card, Checkbox } from 'flowbite-react';
import { gql, useMutation, useQuery } from '@apollo/client';
import emailjs from 'emailjs-com';
import UserData from '../types/UserData';
import { useEffect } from 'react';

const CREATE_PROMO = gql`
  mutation createPromotion($promotionInput: CreatePromotionInput!) {
    createPromotion(createPromotionInput: $promotionInput) {
      title
      promoCode
      percentOff
      startDate
      endDate
      active
    }
  }
`;

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

const GET_PROMOTIONS = gql`
  query promotion {
    promotion {
      promotionID
      title
      promoCode
      percentOff
      startDate
      endDate
      active
    }
  }
`;

const GET_USERS = gql`
  query getAllUsers {
    getAllUsers {
      email
      promotion
    }
  }
`;

const AddPromoForm = () => {
  // set promotion input state

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
    //console.log("This is user", user);
    currentUserID = user.userID;
    currentAddressID = user.homeAddressID;
  }

  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(UserByIdQuery, { variables: { id: currentUserID } });

  console.log('USER DATA', userData?.getUserByID.email);

  const [promotionInput, setPromotionInput] = useState({
    title: '',
    promoCode: '',
    percentOff: 0,
    startDate: '',
    endDate: '',
    active: false,
  });

  // checked state for checkbox
  const [checked, setChecked] = useState(false);

  // set email state
  const [email, setEmail] = useState('');

  // get all users
  const { loading, error, data: usersData } = useQuery(GET_USERS);

  // set mutation
  const [createPromotion, { data }] = useMutation(CREATE_PROMO, { refetchQueries: [{ query: GET_PROMOTIONS }] });

  // handle user input
  const handleUserInput = (name: string, value: any) => {
    setPromotionInput({ ...promotionInput, [name]: value });
  };

  // handle checkbox
  const handleCheckbox = () => {
    setChecked(!checked);
    console.log(checked);
  };

  const sendPromotionEmail = async (userEmail: string, percentOff: number, title: string, promoCode: string) => {
    try {
      await emailjs.send(
        'service_va70md4',
        'template_nlawgjd',
        {
          email: userEmail,
          title: `${percentOff}% OFF Promo Code`,
          head: `You received the ${title} promo code to use at your next checkout!`,
          message: `Here's your promo code:`,
          verificationToken: `${promoCode}`,
        },
        'CCk7kM0XQ4zjFYb7H'
      );
    } catch (error) {
      console.log(error);
    }
  };

  // handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createPromotion({
      variables: {
        promotionInput: {
          title: promotionInput.title,
          promoCode: promotionInput.promoCode,
          percentOff: promotionInput.percentOff,
          startDate: promotionInput.startDate,
          endDate: promotionInput.endDate,
          active: checked,
        },
      },
    });

    if (checked) {
      usersData.getAllUsers.map((user: any) => {
        if (user.promotion === true) {
          sendPromotionEmail(user.email, promotionInput.percentOff, promotionInput.title, promotionInput.promoCode);
        }
      });
    }

    // reset form
    setPromotionInput({
      title: '',
      promoCode: '',
      percentOff: 0,
      startDate: '',
      endDate: '',
      active: false,
    });
  };

  return (
    <>
      <Card>
        <form className="flex flex-col gap-4 min-w-[25%]" onSubmit={handleSubmit}>
          <div className="flex flex-row justify-center mb-4">
            <h1 className="text-2xl font-bold">Add Promo</h1>
          </div>
          <div className="mb-6">
            <div className="mb-2 block">
              <Label htmlFor="promo-name" value="Name" />
            </div>
            <TextInput
              id="promo-name"
              placeholder="Chrismas Sale"
              value={promotionInput.title}
              onChange={(e) => handleUserInput('title', e.target.value)}
              required={true}
            />
          </div>
          <div className="mb-6">
            <div className="mb-2 block">
              <Label htmlFor="promo-code" value="Promo Code" />
            </div>
            <TextInput
              id="promo-code"
              placeholder="PROMO"
              value={promotionInput.promoCode}
              onChange={(e) => handleUserInput('promoCode', e.target.value)}
              required={true}
            />
          </div>
          <div className="mb-6">
            <div className="mb-2 block">
              <Label htmlFor="discount" value="Discount %" />
            </div>
            <TextInput
              id="discount"
              placeholder="10"
              min={0.1}
              onChange={(e) => handleUserInput('percentOff', Number(e.target.value))}
              required={true}
            />
          </div>
          <div className="mb-6">
            <div className="mb-2 block">
              <Label htmlFor="start-date" value="Start Date" />
            </div>
            <TextInput
              id="start-date"
              type="date"
              placeholder="2021-01-01"
              value={promotionInput.startDate}
              onChange={(e) => handleUserInput('startDate', e.target.value)}
              required={true}
            />
          </div>
          <div className="mb-6">
            <div className="mb-2 block">
              <Label htmlFor="end-date" value="End Date" />
            </div>
            <TextInput
              id="end-date"
              type="date"
              placeholder="2021-01-01"
              value={promotionInput.endDate}
              onChange={(e) => handleUserInput('endDate', e.target.value)}
              required={true}
            />
          </div>
          {/* Sent email checkbox */}
          <div className="mb-6">
            <div className="mb-2 block">
              <Label htmlFor="active" value="Do you want to send this code to registered users?" />
            </div>
            <div className="flex flex-row gap-2">
              <Checkbox id="active" onChange={() => handleCheckbox()} checked={checked || false} />
              <Label htmlFor="active" value="Send Out Code" />
            </div>
          </div>

          <div className="mb-6">
            <Button type="submit">Add Promo</Button>
          </div>
        </form>
      </Card>
    </>
  );
};

export default AddPromoForm;
