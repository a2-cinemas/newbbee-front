import React, { useState } from 'react';
import { type NextPage } from 'next';
import Navbar from '../components/Navbar';
import emailjs from 'emailjs-com';
import { useRouter } from 'next/router';
import { TextInput, Checkbox, Label } from 'flowbite-react';
import { useMutation } from '@apollo/client';
import { gql, useQuery } from '@apollo/client';

const ForgotPassword: NextPage = () => {
  const router = useRouter();

  const UpdateUser = gql`
    mutation updateUser($updateUser: UpdateUserInput!) {
      updateUser(updateUserInput: $updateUser) {
        userID
        password
      }
    }
  `;
  const UserByEmailQuery = gql`
    query getUserByEmail($email: String!) {
      getUserByEmail(email: $email) {
        userID
        verificationToken
      }
    }
  `;

  const [inputpass, setUserPassword] = useState('');
  const [code, setUserCode] = useState('');
  const [useremail, setUserEmail] = useState('');

  console.log('used mutations');
  const [update, { data, loading, error }] = useMutation(UpdateUser);
  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(UserByEmailQuery, { variables: { email: useremail } });

  function change(e) {
    e.preventDefault(); //This is important, i'm not sure why, but the email won't send without it
    ('');
    //emailjs.sendForm('service_va70md4', 'template_l1o85dh', e.target, 'CCk7kM0XQ4zjFYb7H')

    if (code == userData?.getUserByEmail.verificationToken) {
      update({ variables: { updateUser: { userID: userData?.getUserByEmail.userID, password: inputpass } } });
      console.log('Made UPDATED ');
    }
    console.log('Wrong Credentials');
  }

  return (
    <div className="bg-slate-300 h-screen">
      <Navbar onLogin />
      <form
        onSubmit={change}
        className="flex flex-col gap-4 items-center my-20 mx-96 pb-10 pt-10 
                    border-2 border-solid border-slate-200 bg-slate-100"
      >
        <h1 className="text-xl font-bold">Forgot Password</h1>
        <div>Please enter your the code sent to your email and create a new password</div>

        <div>
          <div className="mb-2 block">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Code</label>
            <TextInput
              type="integer"
              id="code"
              name="code"
              value={code}
              onChange={(event) => setUserCode(event.target.value)}
              placeholder="XXXX"
              required
            />
          </div>
        </div>

        <div className="mb-2 block">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Email</label>

          <TextInput
            id="email1"
            type="email"
            name="email"
            placeholder="janedoe@email.com"
            required={true}
            onChange={(event) => setUserEmail(event.target.value)}
            value={useremail}
          />
        </div>

        <div>
          <div className="mb-2 block">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">New Password</label>
            <TextInput
              id="inputpass"
              name="inputpass"
              value={inputpass}
              onChange={(event) => setUserPassword(event.target.value)}
              placeholder=""
              required
            />
          </div>
        </div>

        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded " type="submit">
          Login
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
