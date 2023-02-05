import React from 'react';
import { Sidebar } from 'flowbite-react';
import { HiPencil, HiPlus, HiTicket, HiUser, HiScissors, HiArrowSmRight, HiTable } from 'react-icons/hi';

const AdminSidebar = () => {
  return (
    <div className=" bg-gray-50 ml-4">
      <Sidebar aria-label="Default sidebar example">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item href="manage-movies/add-movie" icon={HiPlus} labelColor="alternative">
              Add Movie
            </Sidebar.Item>
            <Sidebar.Item href="/manage-movies" icon={HiPencil}>
              Manage Movies
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiTicket}>
              Manage Tickets
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiUser}>
              Manage Users
            </Sidebar.Item>
            <Sidebar.Item href="/manage-promotions" icon={HiScissors}>
              Manage Promotions
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
};

export default AdminSidebar;
