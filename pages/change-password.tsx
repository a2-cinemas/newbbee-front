import React from 'react';
import { type NextPage } from 'next';
import Navbar from '../components/Navbar';
import { TextInput } from 'flowbite-react';

const ChangePassword: NextPage = () => {
  return (
    <>
      <Navbar onCreateAccount={true} />
      <div className="flex-col min-h-fit py-12 px-4 sm:px-6 lg:px-8 p-5 justify-self-center place-items-center">
        <div className="w-1/3 space-y-5 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Change Password</h1>
        </div>
        <form className="w-1/3">
          <div className="mb-6 ">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              New Password
            </label>
            <TextInput
              type="password"
              id="password"
              placeholder="•••••••••"
              pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}"
              required
            />
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
              pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}"
              required
            />
          </div>

          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default ChangePassword;
