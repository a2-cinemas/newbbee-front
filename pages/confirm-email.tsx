import React, { useState, useEffect } from 'react';
import { type NextPage } from 'next';
import Navbar from '../components/Navbar';
import emailjs from 'emailjs-com';
import { useRouter } from 'next/router';
import { TextInput, Checkbox, Label } from 'flowbite-react';
import { useMutation } from '@apollo/client';
import { gql, useQuery } from '@apollo/client';
import UserData from '../types/UserData';

const ForgotPassword: NextPage = () => {
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

  const router = useRouter();
  let loggedIn: boolean = false;
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
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
  const [updateUser, { data, loading, error }] = useMutation(UpdateUser);

  function skip(e) {
    e.preventDefault(); //This is important, i'm not sure why, but the email won't send without it
    router.push('/');
  }

  const verify = (e) =>{
      e.preventDefault(); //This is important, i'm not sure why, but the email won't send without it
    //emailjs.sendForm('service_va70md4', 'template_l1o85dh', e.target, 'CCk7kM0XQ4zjFYb7H')


    if (code == user.verificationToken) {
      console.log('Wrong Credentials', code,  user.verificationToken);

      console.log('user ID update ', user.userID);
      updateUser({ variables: { updateUser: { userID: 23, userStatusID: 1  } } });

      console.log('Made UPDATED ');
   //   router.push('/');
    }
    console.log('Wrong Credentials', code,  user.verificationToken);
  }

  return (
    <div className="bg-slate-300 h-screen">
      <Navbar onLogin />
      <form
        onSubmit={verify}
        className="flex flex-col gap-4 items-center my-20 mx-96 pb-10 pt-10 
                    border-2 border-solid border-slate-200 bg-slate-100"
      >
        <h1 className="text-xl font-bold">Verify Account</h1>
        <div>Please enter your the code sent to your email to verify account or skip to verify later.</div>

        <div>
          <div className="mb-2 block">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Code</label>
            <TextInput
              type="integer"
              id="code"
              name="code"
              value={code}
              onChange={(event) => setUserCode(Number(event.target.value))}
              placeholder="XXXX"
              required
            />
          </div>
        </div>

        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded " type="submit">
          Verify
        </button>
        <button onClick={skip}>Skip</button>
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
