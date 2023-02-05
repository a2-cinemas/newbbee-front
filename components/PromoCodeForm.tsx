import React, { FunctionComponent } from 'react';
import { Card, TextInput, Button } from 'flowbite-react';
import { type } from 'os';

const PromoCodeForm = () => {
  return (
    <Card>
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Promo code</h2>
      <div className="flex flex-col mt-4">
        <TextInput id="promo_code" placeholder="Enter your promo code" />
      </div>
      <Button>Apply</Button>
    </Card>
  );
};

export default PromoCodeForm;
