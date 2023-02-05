import React from 'react';

/*
 * Used to represent a summary of a purchase which includes basic information about the purchase and
 * payment method.
 */
const Purchase = () => {
  return (
    <>
      <div className="flex flex-wrap flex-shrink flex-col p-6 rounded-xl space-x-4 bg-slate-50 hover:bg-slate-100">
        <div>
          <div className=" text-md">
            <p>Everything Everywhere All at Once</p>
          </div>
          <div className=" text-md text-gray-500 dark:text-gray-400">
            <p>3/15/22 - 3:45pm | Theater 11</p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p> Adult ticket x2</p>
            <p> Child ticket x1</p>
            <p> TOTAL: $30.28 </p>
            <br />
            <p> Paid for with VISA ending in 3891</p>
          </div>
          <div className="text-md text-gray-500 dark:text-gray-400"></div>
        </div>
      </div>
    </>
  );
};

export default Purchase;
