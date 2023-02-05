import React, { Fragment, useState, FunctionComponent } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from 'flowbite-react';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import SearchBar from './SearchBar';
import UserData from '../types/UserData';

const navigation = [
  { name: 'Home', href: '/', current: false, admin: false },

  //{ name: 'Log out', href: '/login', current: true, admin: false },
];

const accountManagement = [
  { name: 'Login', href: '/login', current: false, admin: false },
  {
    name: 'Create Account',
    href: '/create-account',
    current: false,
    admin: false,
  },
];

function classNames(...classNames) {
  return classNames.filter(Boolean).join(' ');
}

type Props = {
  isAdmin?: boolean;
  isLoggedIn?: boolean;
  onCreateAccount?: boolean;
  onLogin?: boolean;
  onLogout?: boolean;
  onProfile?: boolean;
  onCheckout?: boolean;
  onHome?: boolean;
};

const Navbar: FunctionComponent<Props> = ({
  isAdmin,
  isLoggedIn,
  onCreateAccount,
  onLogin,
  onLogout,
  onProfile,
  onCheckout,
  onHome,
}) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [userpassword, setUserPassword] = useState('');
  const [useremail, setUserEmail] = useState('');

  const loggedInNavbar = onCreateAccount || onLogin;
  const checkoutNavbar = onCheckout;
  const adminNavbar = isAdmin || false;
  const router = useRouter();

  const [isAdminNavbar, setIsAdminNavbar] = useState(adminNavbar);

  const handleAdminMode = () => {
    setIsAdminNavbar(!isAdminNavbar);
  };
  const handleLogout = () => {
    setUser(null);
    setUserEmail('');
    setUserPassword('');
    localStorage.clear();

    router.push('/login');
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                {/* <div className='flex flex-shrink-0 items-center'>
                  <img
                    className='block h-8 w-auto lg:hidden'
                    src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500'
                    alt='Your Company'
                  />
                  <img
                    className='hidden h-8 w-auto lg:block'
                    src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500'
                    alt='Your Company'
                  />

                </div> */}

                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4 ">
                    {(loggedInNavbar || checkoutNavbar) && (
                      <Button onClick={() => router.back()}>
                        <HiOutlineArrowLeft className="h-6 w-6" />
                      </Button>
                    )}

                    {navigation
                      .filter((item) => {
                        if (isAdmin) return item;
                        if (!isAdmin && !item.admin) return item;
                      })
                      .map((item) => (
                        <Link href={item.href} key={item.name}>
                          <a
                            className={classNames(
                              item.current
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                              'px-3 py-2 rounded-md text-sm font-medium flex justify-center items-center'
                            )}
                            aria-current={item.current ? 'page' : undefined}
                          >
                            {item.name}
                          </a>
                        </Link>
                      ))}
                  </div>
                </div>
              </div>

              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {!loggedInNavbar && (
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      {accountManagement.map((item) => (
                        <Link href={item.href} key={item.name}>
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                              'px-3 py-2 rounded-md text-sm font-medium'
                            )}
                            aria-current={item.current ? 'page' : undefined}
                          >
                            {item.name}
                          </a>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {loggedInNavbar && ( //commented out the ! in !basicNavbar
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="sr-only">Open user menu</span>
                        <svg
                          className="h-8 w-8 rounded-full"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="312.809 0 401 401"
                        >
                          <path fill="#E4E6E7" d="M268.073-44.735h490.423v490.423H268.073z" />
                          <path
                            d="M513.81 267.142c-103.361 0-187.754 58.93-192.475 132.842h384.988c-4.733-73.918-89.157-132.842-192.512-132.842zM610.416 158.026c0 57.17-42.935 103.516-95.896 103.516s-95.895-46.346-95.895-103.516S461.559 54.51 514.52 54.51c52.968 0 95.896 46.352 95.896 103.515z"
                            fill="#AEB4B7"
                          />
                        </svg>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              onClick={() => {
                                router.push('/checkout');
                              }}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700 cursor-pointer'
                              )}
                            >
                              Checkout
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              onClick={() => {
                                router.push('/profile');
                              }}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700 cursor-pointer'
                              )}
                            >
                              Your Profile
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href=""
                              onClick={handleAdminMode}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Toggle Admin Mode
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              onClick={handleLogout}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Sign out
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
