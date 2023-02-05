import React, { FunctionComponent } from 'react';
import { Card } from 'flowbite-react';

type Props = {
  isSummary?: boolean;
};

const OrderSummary: FunctionComponent<Props> = ({ isSummary }) => {
  return (
    <div className="max-w-md">
      <Card>
        <div className="mb-4 flex items-center justify-center">
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Order Summary</h5>
        </div>
        <div className="flow-root">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            <li className="py-3 sm:py-2">
              <div className="flex items-center space-x-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">2 x Adult</p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  $24.00
                </div>
              </div>
            </li>
            <li className="py-3 sm:py-2">
              <div className="flex items-center space-x-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">1 x Senior</p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  $7.00
                </div>
              </div>
            </li>
            <li className="py-3 sm:py-2">
              <div className="flex items-center space-x-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">2 x Child</p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  $16.00
                </div>
              </div>
            </li>
            {/* taxes and fees */}
            <li className="py-3 sm:py-2">
              <div className="flex items-center space-x-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">Taxes and Fees</p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  $3.00
                </div>
              </div>
            </li>
            {/* Total */}
            <li className="py-3 sm:py-4">
              <div className="flex items-center space-x-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-medium text-gray-900 dark:text-white">Total</p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  $50.00
                </div>
              </div>
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default OrderSummary;
