import React, { useEffect, useState } from 'react';
import { type NextPage } from 'next';
import { gql, selectHttpOptionsAndBody, useMutation, useQuery } from '@apollo/client';
import Navbar from '../components/Navbar';
import { TextInput, Checkbox, Label } from 'flowbite-react';
import PaymentCardForm from '../components/PaymentCardForm';
import AddressForm from '../components/AddressForm';
import Link from 'next/link';
import { useRouter } from 'next/router';
import emailjs from 'emailjs-com';
// import { Address } from '../types/Address';
// import { PaymentCard } from '../types/PaymentCard';
// import { validateAddress, validateEmail, validateInput } from '../utils/inputValidation';
// import { FormInput } from '../types/FormInput';

const GET_USER_BY_EMAIL = gql`
  query getUserByEmail($email: String!) {
    getUserByEmail(email: $email) {
      userID
      email
    }
  }
`;

const CREATE_USER = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(createUserInput: $input) {
      userID
      firstName
      lastName
      homeAddressID
    }
  }
`;

const UPDATE_USER = gql`
  mutation updateUser($input: UpdateUserInput!) {
    updateUser(updateUserInput: $input) {
      userID
      firstName
      lastName
      email
      phoneNumber
      password
      admin
      promotion
      verificationToken
    }
  }
`;

const CREATE_ADDRESS = gql`
  mutation createAddress($input: CreateAddressInput!) {
    createAddress(createAddressInput: $input) {
      addressID
      street
      city
      state
      zipCode
      country
    }
  }
`;

const CREATE_PAYMENT_CARD = gql`
  mutation createPaymentCard($input: CreatePaymentCardInput!) {
    createPaymentCard(createPaymentcardInput: $input) {
      paymentCardID
      cardType
      CVV
      expirationDate
      holderName
      number
      userID
      addressID
      address {
        street
        state
        zipCode
        city
        country
      }
    }
  }
`;

const blankAddress = {
  street: '',
  city: '',
  state: '',
  zip: null,
  country: '',
};

const blankPaymentCard = {
  cardNumber: '',
  cardHolderName: '',
  expirationDate: '',
  cvc: null,
};

// function to convert phone number to only numbers
const convertPhone = (phone: string) => {
  return phone.replace(/\D/g, '');
};

// function to convert date string to integer
const convertDate = (date: string) => {
  const [month, year] = date.split('/');
  return parseInt(year + month);
};

const CreateAccount: NextPage = () => {
  // create random verification token that's 4 digits long
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  //Use this number

  const [checked, setChecked] = useState(false);

  // Create user states
  const [formInput, setFormInput] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    promoCode: false,
    address: blankAddress,
    payment: blankPaymentCard,
  });

  const [formError, setFormError] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: blankAddress,
    payment: blankPaymentCard,
  });

  // GraphQL mutation to create user
  const [createAddress, { data: addressData, error: addressError, loading: addressLoading }] =
    useMutation(CREATE_ADDRESS);

  // const updateCache = (cache: any, { data }: any) => {
  //   const existingUser = cache.readQuery({
  //     query: GET_USER_BY_EMAIL,
  //     variables: { email: formInput.email },
  //   });

  //   cache.writeQuery({
  //     query: GET_USER_BY_EMAIL,
  //     variables: { email: formInput.email },
  //     data: {
  //       users: [data.createUser, ...existingUser.users],
  //     },
  //   });
  // };

  const [updateUser, { data: updateData, error: updateError, loading: updateLoading }] = useMutation(UPDATE_USER);
  const [createPaymentCard, { data: paymentData, error: paymentError, loading: paymentLoading }] =
    useMutation(CREATE_PAYMENT_CARD);

  // const {
  //   data: userData,
  //   error: userError,
  //   loading: userLoading,
  // } = useQuery(GET_USER_BY_EMAIL, {
  //   variables: { email: formInput.email },
  // });

  const [createUser, { data }] = useMutation(CREATE_USER, {
    onCompleted: (data) => {
      console.log({ data });
    },
  });

  const createUserVariables = {
    input: {
      firstName: formInput.firstName,
      lastName: formInput.lastName,
      email: formInput.email,
      password: formInput.password,
      phoneNumber: convertPhone(formInput.phoneNumber),
      admin: false,
      homeAddressID: addressData?.createAddress.addressID,
      promotion: formInput.promoCode,
      verificationToken: randomNum,
    },
  };

  // const {
  //   data: userData,
  //   error: userError,
  //   loading: userLoading,
  // } = useQuery(GET_USER_BY_EMAIL, {
  //   variables: {
  //     email: formInput.email,
  //   },
  // });

  const handleCheck = () => {
    setChecked(!checked);
    console.log(checked);
  };

  const handleUserInput = (name, value) => {
    setFormInput({ ...formInput, [name]: value });
    console.log(formInput, 'formInput');
  };

  const handleAddressInput = (name, value) => {
    setFormInput({ ...formInput, address: { ...formInput.address, [name]: value } });
    console.log(formInput, 'formInput');
  };

  const handlePaymentInput = (name, value) => {
    setFormInput({ ...formInput, payment: { ...formInput.payment, [name]: value } });
    console.log(formInput, 'formInput');
  };

  // const OnSubmit = async (checked) => {

  // };

  const router = useRouter();

  const validateFormInput = (e) => {
    e.preventDefault();
    let inputError = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      address: {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
      },
      payment: {
        cardNumber: '',
        cardHolderName: '',
        expirationDate: '',
        cvc: '',
      },
    };

    // validateInput(e, formInput, inputError);
    // for (const key in formInput) {
    //   if (key === 'address') {
    //     for (const addressKey in formInput.address) {
    //       setFormError({ ...formError, address: { ...formError.address, [addressKey]: validateAddress() } });
    //     }
    //   } else if (key === 'payment') {
    //     for (const paymentKey in formInput.payment) {
    //       if (formInput.payment[paymentKey] === '') {
    //         inputError.payment[paymentKey] = 'This field is required';
    //       }
    //     }
    //   } else if (formInput[key] === '') {
    //     inputError[key] = 'This field is required';
    //   }

    // }
    if (formInput.firstName === '') {
      setFormError({ ...inputError, firstName: 'First name is required' });
      console.log(formError);
      return;
    }

    if (formInput.lastName === '') {
      setFormError({ ...inputError, lastName: 'Last name is required' });
      return;
    }

    if (formInput.phoneNumber === '') {
      setFormError({ ...inputError, phoneNumber: 'Phone number is required' });
      return;
    }

    if (formInput.email === '') {
      setFormError({ ...inputError, email: 'Email is required' });
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(formInput.email)) {
      setFormError({ ...inputError, email: 'Email is invalid' });
      return;
    }

    if (formInput.password === '') {
      setFormError({ ...inputError, password: 'Password is required' });
      return;
    }

    const validatePassword = (password) => {
      const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_])[A-Za-z\d!@#$%^&*()-_]{8,20}/;
      return re.test(password);
    };

    //check if password is valid
    if (!validatePassword(formInput.password)) {
      setFormError({ ...inputError, password: 'Please enter a valid password' });
      return;
    }

    if (formInput.confirmPassword === '') {
      setFormError({ ...inputError, confirmPassword: 'Confirm password is required' });
      return;
    }

    if (formInput.password !== formInput.confirmPassword) {
      setFormError({ ...inputError, confirmPassword: 'Passwords do not match' });
      return;
    }

    const validateCreditCardNumber = (cardNumber) => {
      // enforce a minimum length of 16 digits with or without spaces
      const re = /^(\d{4}[\s-]?){4}$/;
      return re.test(cardNumber);
    };

    // check if card number format is valid
    if (!validateCreditCardNumber(formInput.payment.cardNumber) && checked) {
      setFormError({
        ...inputError,
        payment: { ...inputError.payment, cardNumber: 'Please enter a valid card number' },
      });
      return;
    }

    if (formInput.payment.cardNumber === '' && checked) {
      setFormError({
        ...inputError,
        payment: { ...inputError.payment, cardNumber: 'Card number is required' },
      });
      return;
    }

    if (formInput.payment.expirationDate === '' && checked) {
      setFormError({
        ...inputError,
        payment: { ...inputError.payment, expirationDate: 'Expiration date is required' },
      });
      return;
    }

    // validate date in MM/YY format
    const validateDate = (date) => {
      const re = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/;
      return re.test(date);
    };

    // check if expiration date is valid
    if (!validateDate(formInput.payment.expirationDate) && checked) {
      setFormError({
        ...inputError,
        payment: { ...inputError.payment, expirationDate: 'Please enter a valid expiration date' },
      });
      return;
    }

    const validateCVC = (cvc) => {
      const re = /^[0-9]{3,4}$/;
      return re.test(cvc);
    };

    if (formInput.payment.cvc === '' && checked) {
      setFormError({ ...inputError, payment: { ...inputError.payment, cvc: 'CVC is required' } });
      return;
    }

    // check if cvc is valid
    if (!validateCVC(formInput.payment.cvc) && checked) {
      setFormError({
        ...inputError,
        payment: { ...inputError.payment, cvc: 'Please enter a valid cvc' },
      });
      return;
    }

    if (formInput.address.street === '' && checked) {
      setFormError({ ...inputError, address: { ...inputError.address, street: 'Street is required' } });
      return;
    }

    if (formInput.address.country === '' && checked) {
      setFormError({ ...inputError, address: { ...inputError.address, country: 'Country is required' } });
      return;
    }

    if (formInput.address.city === '' && checked) {
      setFormError({ ...inputError, address: { ...inputError.address, city: 'City is required' } });
      return;
    }

    if (formInput.address.state === '' && checked) {
      setFormError({ ...inputError, address: { ...inputError.address, state: 'State is required' } });
      return;
    }

    if (formInput.address.zip === '' && checked) {
      setFormError({ ...inputError, address: { ...inputError.address, zip: 'Zip code is required' } });
      return;
    }

    setFormError(inputError);

    console.log(parseInt(formInput.address.zip), 'zip');

    // createAddress mutation to create address linked to user
    if (checked) {
      createAddress({
        variables: {
          input: {
            street: formInput.address.street,
            city: formInput.address.city,
            state: formInput.address.state,
            zipCode: parseInt(formInput.address.zip),
            country: formInput.address.country,
          },
        },
      });
    }

    createUser({
      variables: {
        input: {
          firstName: formInput.firstName,
          lastName: formInput.lastName,
          email: formInput.email,
          password: formInput.password,
          phoneNumber: convertPhone(formInput.phoneNumber),
          admin: false,
          homeAddressID: addressData?.createAddress.addressID,
          promotion: formInput.promoCode,
          verificationToken: randomNum,
        },
      },
    });
    // if (checked) {
    //   createPaymentCard({
    //     variables: {
    //       input: {
    //         cardType: 'VISA',
    //         CVV: parseInt(formInput.payment.cvc),
    //         expirationDate: convertDate(formInput.payment.expirationDate),
    //         holderName: data?.createUser.firstName + ' ' + data?.createUser.lastName,
    //         number: formInput.payment.cardNumber,
    //         addressID: 37 + 1, //addressData?.createAddress.addressID,
    //         userID: 49 + 1, //data?.createUser.userID,
    //       },
    //     },
    //   });
    // }

    // OnSubmit(checked);
    // send email to user
    sendEmail(e);
  }; // validateFormInput

  const sendEmail = (e) => {
    e.preventDefault(); //This is important, i'm not sure why, but the email won't send without it

    emailjs.sendForm('service_va70md4', 'template_nlawgjd', e.target, 'CCk7kM0XQ4zjFYb7H').then(
      (result) => {
        router.push('/registration-confirmation');
        //This is if you still want the page to reload (since e.preventDefault() cancelled that behavior)
      },
      (error) => {
        console.log(error.text);
      }
    );
  };

  return (
    <>
      <Navbar onCreateAccount={true} />
      <div className="flex flex-col items-center min-h-fit py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Create an account</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login">
              <a className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                Log in
              </a>
            </Link>
          </p>
        </div>
        <form className="contact-form" onSubmit={validateFormInput}>
          <div className="grid gap-6 mb-6 md:grid-cols-2 mt-8">
            <div>
              <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                First name
              </label>
              <TextInput
                type="text"
                id="first_name"
                placeholder="John"
                // required
                onChange={(e) => handleUserInput('firstName', e.target.value)}
              />
              {<p className="text-red-500 pt-2 text-xs italic">{formError.firstName}</p>}
            </div>
            <div>
              <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Last name
              </label>
              <TextInput
                type="text"
                id="last_name"
                placeholder="Doe"
                onChange={(e) => handleUserInput('lastName', e.target.value)}
              />
              {<p className="text-red-500 pt-2 text-xs italic">{formError.lastName}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Phone number
              </label>
              <TextInput
                type="tel"
                id="phone"
                placeholder="123-456-6789"
                // pattern="\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})"
                // required
                onChange={(e) => handleUserInput('phoneNumber', e.target.value)}
              />
              {<p className="text-red-500 pt-2 text-xs italic">{formError.phoneNumber}</p>}
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Email address
            </label>
            <TextInput
              type="email"
              id="email"
              name="email"
              placeholder="john.doe@email.com"
              // required
              onChange={(e) => handleUserInput('email', e.target.value)}
            />
            {<p className="text-red-500 pt-2 text-xs italic">{formError.email}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Password
            </label>
            <TextInput
              type="password"
              id="password"
              placeholder="•••••••••"
              helperText={
                'Must be at least 8 characters long and contain one from the following: A-Z, a-z, 0-9, !@#$%^&*-()_'
              }
              // pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_])[A-Za-z\d!@#$%^&*()-_]{8,20}"
              // required
              onChange={(e) => handleUserInput('password', e.target.value)}
            />
            {<p className="text-red-500 pt-2 text-xs italic">{formError.password}</p>}
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirm_password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Confirm password
            </label>
            <TextInput
              type="password"
              id="confirm_password"
              placeholder="•••••••••"
              // pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_])[A-Za-z\d!@#$%^&*()-_]{8,20}"
              // required
              onChange={(e) => handleUserInput('confirmPassword', e.target.value)}
            />
            {<p className="text-red-500 pt-2 text-xs italic">{formError.confirmPassword}</p>}
          </div>
          <div className="flex items-start mb-6">
            <div className="flex items-center h-5 gap-2">
              <Checkbox
                id="promotion"
                onChange={() => setFormInput({ ...formInput, promoCode: !formInput.promoCode })}
              />
              <Label htmlFor="promotion">I want to get promotional offers</Label>
            </div>
          </div>
          <div className="flex items-start mb-6">
            <div className="flex items-center h-5 gap-2">
              <Checkbox id="register" onChange={() => handleCheck()} checked={checked || false} />
              <Label htmlFor="register">I want to register my payment card and address now</Label>
            </div>

            <TextInput name="title" value="Account Registration Information" style={{ display: 'none' }}></TextInput>
            <TextInput
              name="head"
              value="We are glad to see you joined the A2 Cinemas family. To verify your account, please copy the code."
              style={{ display: 'none' }}
            ></TextInput>
            <TextInput name="message" value="Heres your verification code:  " style={{ display: 'none' }}></TextInput>
            <TextInput name="verificationToken" value={randomNum} style={{ display: 'none' }}></TextInput>
          </div>
          {checked ? (
            <PaymentCardForm
              handleUserInput={handlePaymentInput}
              paymentFormError={formError.payment}
              // isChecked={!checked}
            />
          ) : null}
          {checked ? (
            <AddressForm
              handleUserInput={handleAddressInput}
              addressFormError={formError.address}
              // isChecked={!checked}
            />
          ) : null}

          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Create account
            {/* <input type="submit" value="Create Account" /> */}
          </button>
        </form>
      </div>
    </>
  );

  /*
  return (
    <form className="contact-form" onSubmit={sendEmail}>
     
      
      <label>To Name</label>
      <input type="text" name="to_name" />


      <label>Message</label>
      <input type="text" name="message" />


      <label>Email</label>
      <input type="email" name="email" />

      <input type="submit" value="Send" />
    </form>
  );*/
};

export default CreateAccount;
