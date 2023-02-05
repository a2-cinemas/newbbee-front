import React from 'react';
import { type NextPage } from 'next';
import Navbar from '../components/Navbar';
import emailjs from 'emailjs-com';
import { useRouter } from 'next/router';
import { TextInput, Checkbox, Label } from 'flowbite-react';
import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useMutation } from '@apollo/client';

const ForgotPassword: NextPage = () => {
  var randomNum = Math.floor(1000 + Math.random() * 9000);

  const UserByEmailQuery = gql`
    query getUserByEmail($email: String!) {
      getUserByEmail(email: $email) {
        userID
      }
    }
  `;
  const UpdateUser = gql`
    mutation updateUser($updateUser: UpdateUserInput!) {
      updateUser(updateUserInput: $updateUser) {
        userID
        password
      }
    }
  `;
  const [useremail, setUserEmail] = useState('');

  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(UserByEmailQuery, { variables: { email: useremail } });
  const [update, { data, loading, error }] = useMutation(UpdateUser);

  const router = useRouter();

  function sendEmail(e) {
    e.preventDefault(); //This is important, i'm not sure why, but the email won't send without it

    console.log(randomNum);
    console.log(userData?.getUserByEmail.userID);

    update({ variables: { updateUser: { userID: userData?.getUserByEmail.userID, verificationToken: randomNum } } });

    emailjs.sendForm('service_va70md4', 'template_nlawgjd', e.target, 'CCk7kM0XQ4zjFYb7H').then(
      (result) => {
        router.push('/create-password');
        //This is if you still want the page to reload (since e.preventDefault() cancelled that behavior)
      },
      (error) => {
        console.log(error.text);
      }
    );
  }
  return (
    <div className="bg-slate-300 h-screen">
      <Navbar onLogin />
      <form
        onSubmit={sendEmail}
        className="flex flex-col gap-4 items-center my-20 mx-96 pb-10 pt-10 
                    border-2 border-solid border-slate-200 bg-slate-100"
      >
        <h1 className="text-xl font-bold">Forgot Password</h1>
        <div>Please enter your email and a link to reset your password will be sent</div>

        <div>
          <div className="mb-2 block">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Email
            </label>
            <TextInput
              type="email"
              id="email"
              name="email"
              placeholder="john.doe@email.com"
              required
              onChange={(event) => setUserEmail(event.target.value)}
              value={useremail}
            />{' '}
          </div>

          <TextInput name="title" value="Reset Password Code" style={{ display: 'none' }}></TextInput>
          <TextInput
            name="head"
            value="You have requested to change your password"
            style={{ display: 'none' }}
          ></TextInput>
          <TextInput name="message" value="Heres your verification code:  " style={{ display: 'none' }}></TextInput>
          <TextInput name="verificationToken" value={randomNum} style={{ display: 'none' }}></TextInput>
        </div>

        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded " type="submit">
          Send Forgot Password Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
/*
<!--<div>
<div className="mb-2 block">
  <label>Email</label>
</div>
<input className="rounded" id="firstEmail" type="email" required={true} />
</div>
<div>-->*/
