import React from 'react';
import { Dropdown } from 'flowbite-react';
import { HiOutlineCreditCard } from 'react-icons/hi';

const PaymentCardDropdown = () => {
  return (
    <Dropdown label="Use Saved Card" size="sm">
      <Dropdown.Item icon={HiOutlineCreditCard}>Visa *1234</Dropdown.Item>
      <Dropdown.Item icon={HiOutlineCreditCard}>Mastercard *1234</Dropdown.Item>
      <Dropdown.Item icon={HiOutlineCreditCard}>Discover *1234</Dropdown.Item>
      <Dropdown.Item icon={HiOutlineCreditCard}>Amex *1234</Dropdown.Item>
    </Dropdown>
  );
};

export default PaymentCardDropdown;
