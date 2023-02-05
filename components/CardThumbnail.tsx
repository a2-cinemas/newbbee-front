import React from 'react';

const CardThumbnail = () => {
  return (
    <>
      <div className="flex flex-wrap flex-shrink flex-col p-6 rounded-xl space-x-4 bg-slate-50 hover:bg-slate-100">
        <div>
          <div className="text-md">
            <p>VISA ending in 1839</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
              />
            </svg>
          </div>
          <div className=" text-md text-gray-500 dark:text-gray-400">
            <p>Expires: 10/22 </p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p> Name On Card: Blockathan G. Buster </p>
          </div>
          <div className="text-md text-gray-500 dark:text-gray-400"></div>
        </div>
      </div>
    </>
  );
};

export default CardThumbnail;
