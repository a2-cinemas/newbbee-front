import React from 'react';
import { type NextPage } from 'next';
import Navbar from '../components/Navbar';
import AdminSidebar from '../components/AdminSidebar';
import AddPromoForm from '../components/AddPromoForm';
import CurrentPromosForm from '../components/CurentPromosForm';
import AdminNavbar from '../components/AdminNavbar';

const ManagePromotions: NextPage = () => {
  return (
    <>
      <AdminNavbar />
      <div className="m-auto">
        <div className="flex float-left">
          <AdminSidebar />
        </div>

        <div className="flex flex-col items-center min-w-fit min-h-fit py-4 px-4 sm:px-6 lg:px-8 overflow-auto relative">
          <div className="self-center py-10 pt-4 ">
            <CurrentPromosForm />
          </div>
          <div className="grid gap-6 mb-6 mt-8 w-3/5 max-w-lg md:min-w-1/2">
            <AddPromoForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default ManagePromotions;
