import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { type NextPage } from 'next';
import emailjs from 'emailjs-com';
import { useRouter } from 'next/router';
import { TextInput, Checkbox, Label } from 'flowbite-react';
import { useMutation } from '@apollo/client';
import { gql, useQuery } from '@apollo/client';
import UserData from '../types/UserData';

const RegistrationConfirmation: NextPage = () => {
  const UpdateUser = gql`
    mutation updateUser($updateUser: UpdateUserInput!) {
      updateUser(updateUserInput: $updateUser) {
        userID
        password
      }
    }
  `;

  const router = useRouter();
  let loggedIn: boolean = false;
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser && loggedInUser != 'undefined') {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  if (user) {
    console.log('This is user', user.email);
    loggedIn = true;
    <div>{user.email} is loggged in</div>;
  }

  const [inputpass, setUserPassword] = useState('');
  const [code, setUserCode] = useState(0);
  const [useremail, setUserEmail] = useState('');

  console.log('used mutations');
  const [update, { data, loading, error }] = useMutation(UpdateUser);

  function skip(e) {
    e.preventDefault(); //This is important, i'm not sure why, but the email won't send without it
    router.push('/');
  }

  function verify(e) {
    e.preventDefault(); //This is important, i'm not sure why, but the email won't send without it
    //emailjs.sendForm('service_va70md4', 'template_l1o85dh', e.target, 'CCk7kM0XQ4zjFYb7H')

    if (user != null) {
      console.log(user.verificationToken, user);

      if (code == user.verificationToken) {
        update({ variables: { updateUser: { userID: user.userID, userStatusID: 1 } } });
        console.log('Made UPDATED ');
        router.push('/');
      }
      console.log('Wrong Credentials');
    } else {
      console.log('User is null');
    }

    router.push('/');
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-fit py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Account Successfully Created</h1>
          <p className="text-md text-gray-800  dark:text-gray-100">
            Congratulations! You have successfully registered an account with A2 Cinemas.
          </p>
          <p className="text-md text-blue-500  dark:text-blue-200">
            An email has been sent to the email address you provided with instructions on how to verify your account.
          </p>

          <br />

          <p className="text-sm text-gray-500  dark:text-gray-100">
            Please note that you won&apos;t be able to use some features of the app until you have verified your
            account.Please enter your the code sent to your email to verify account or skip to verify late
          </p>

          <form onSubmit={verify}>
            <label>Code</label>
            <TextInput
              type="integer"
              id="code"
              name="code"
              value={code}
              onChange={(event) => setUserCode(Number(event.target.value))}
              placeholder="XXXX"
              required
            />

            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded " type="submit">
              Verify
            </button>
            <button onClick={skip}>Skip</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegistrationConfirmation;
