import { type NextPage } from 'next';
import React from 'react';
import AdminSidebar from '../components/AdminSidebar';
import MovieTable from '../components/MovieTable';
import MoviesShowingsTable from '../components/MovieShowingsTable';
import AdminNavbar from '../components/AdminNavbar';

const ManageMovies: NextPage = () => {
  return (
    <>
      <AdminNavbar />
      <div className="m-auto">
        <div className="flex float-left h-screen">
          <AdminSidebar />
        </div>
        <div className="flex-col items-center w-full py-4 px-4 sm:px-6 lg:px-8">
          <div className="self-center py-10 px-20 pt-4 ">
            <MovieTable />
          </div>
          <div className="self-center py-10 px-20 pt-4 ">
            <MoviesShowingsTable />
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageMovies;
