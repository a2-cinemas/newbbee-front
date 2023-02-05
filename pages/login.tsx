import React, { useState, useEffect } from 'react';
import { type NextPage } from 'next';
import Navbar from '../components/Navbar';
import { Label, TextInput, Checkbox, Button } from 'flowbite-react';
import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';
import client from '../lib/apollo-client';
import { validate } from 'graphql';
import { useRouter } from 'next/router';
import { GlobalCrypto } from '../util/globalCrypto';
import axios from 'axios';
import UserData from '../types/UserData';

const UserByEmailQuery = gql`
  query getUserByEmail($email: String!) {
    getUserByEmail(email: $email) {
      email
      password
      userID
      firstName
      lastName
      phoneNumber
      admin
      promotion
      userStatusID
      homeAddressID
      verificationToken
    }
  }
`;

const Login: NextPage = () => {
  const [errorMessage, setErrorMessage] = React.useState('');
  const [userpassword, setUserPassword] = useState('');
  const [useremail, setUserEmail] = useState('');
  const [user, setUser] = useState<UserData | null>(null);

  const router = useRouter();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser && loggedInUser != 'undefined') {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  // logout the user
  const handleLogout = () => {
    setUser(null);
    setUserEmail('');
    setUserPassword('');
    localStorage.clear();
  };

  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(UserByEmailQuery, { variables: { email: useremail } });

  const validate = async (e: any) => {
    e.preventDefault();

    // userpassword is the password entered by the user at login
    if (userData?.getUserByEmail.password == GlobalCrypto.hashString(userpassword)) {
      console.log(`userpassword encrypted: ${GlobalCrypto.hashString(userpassword)}`);
      console.log(`actual database password encrypted: ${userData?.getUserByEmail.password}`);
      const user = { useremail, userpassword };
      setUser(userData?.getUserByEmail);
      localStorage.setItem('user', JSON.stringify(userData?.getUserByEmail));
      console.log('This user is an admin', userData?.getUserByEmail.admin);
      if (userData?.getUserByEmail.admin) {
        router.push('/manage-movies');
      } else {
        router.push('/');
      }
      // <Link to={{  pathname: "/register",  state:  userData?.getUserByEmail.userID }}/>
    } else {
      setErrorMessage('Incorrect Email or Password, please try again');
      //    console.log("made it here", useremail)
    }
  };

  // if (user) {
  //   console.log('This is user', user.email);
  //   <div>
  //     {user.email} is loggged in
  //     <button onClick={handleLogout}>logout</button>
  //   </div>;

  //   router.push('/');
  // }

  return (
    <>
      <Navbar onLogin={true} />

      <div className="flex flex-col items-center min-h-fit py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Log in</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?
            <Link href="/create-account">
              <a className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 pl-1">
                Create one.
              </a>
            </Link>
          </p>
        </div>
        <form className="grid gap-6 mb-6 md:grid-cols-1 mt-8 w-1/3" onSubmit={validate}>
          <div>
            <div className="mb-2 block w-full">
              <Label htmlFor="email1" value="Your email" />
            </div>

            <TextInput
              id="email1"
              type="email"
              name="email"
              placeholder="janedoe@email.com"
              required={true}
              onChange={(event) => setUserEmail(event.target.value)}
              value={useremail}
            />

            <div className="mb-2 block w-full">
              <Label htmlFor="password1" value="Your password" />
            </div>
            <TextInput
              id="password1"
              name="password"
              type="password"
              required={true}
              value={userpassword}
              onChange={(event) => setUserPassword(event.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember">Remember me</Label>
          </div>
          <Link
            href="/forgot-password"
            className="font-medium text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Forgot Password?
          </Link>

          {errorMessage && (
            <div
              className="error"
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'red' }}
            >
              {' '}
              {errorMessage}{' '}
            </div>
          )}

          <button type="submit">Submit form</button>
        </form>
      </div>
    </>
  );
};

export default Login;
