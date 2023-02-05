import React, { Fragment, useState, FunctionComponent } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from 'flowbite-react';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import UserData from '../types/UserData';

const accountManagement = [{ name: 'Logout', href: '/', current: false, admin: false }];

function classNames(...classNames) {
  return classNames.filter(Boolean).join(' ');
}

const AdminNavbar: FunctionComponent = () => {
  const [admin, setUser] = useState<UserData | null>(null);
  const [userpassword, setUserPassword] = useState('');
  const [useremail, setUserEmail] = useState('');

  const router = useRouter();

  const handleLogout = () => {
    setUser(null);
    setUserEmail('');
    setUserPassword('');
    localStorage.clear();

    router.push('/');
  };

  return (
    <>
      <Disclosure as="nav" className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-end">
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    <Link href={'/'}>
                      <a
                        onClick={handleLogout}
                        className={
                          'text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium'
                        }
                      >
                        Sign out
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Disclosure>
    </>
  );
};

export default AdminNavbar;
