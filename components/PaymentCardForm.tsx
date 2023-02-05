import React, { FunctionComponent } from 'react';
import { HiCreditCard, HiCalendar, HiLockClosed } from 'react-icons/hi';
import { Label, TextInput } from 'flowbite-react';

type PaymentCardFormProps = {
  handleUserInput?: (name: string, value: any) => void;
  paymentFormError?: any;
};

const PaymentCardForm: FunctionComponent<PaymentCardFormProps> = ({ handleUserInput, paymentFormError }) => {
  return (
    <>
      <div className="mb-6">
        <div className="mb-2 block">
          <Label htmlFor="credit-card" value="Card Number" />
        </div>
        <TextInput
          id="credit-card"
          placeholder="0000 0000 0000 0000"
          icon={HiCreditCard}
          onChange={(e) => handleUserInput('cardNumber', e.target.value)}
        />
        {<p className="text-red-500 pt-2 text-xs italic">{paymentFormError ? paymentFormError.cardNumber : ''}</p>}
      </div>
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="expiration-date" value="Expiration Date" />
          </div>
          <TextInput
            id="expiration-date"
            placeholder="MM/YY"
            icon={HiCalendar}
            onChange={(e) => handleUserInput('expirationDate', e.target.value)}
          />
          {
            <p className="text-red-500 pt-2 text-xs italic">
              {paymentFormError ? paymentFormError.expirationDate : ''}
            </p>
          }
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="cvc" value="CVC/CVV" />
          </div>
          <TextInput
            id="cvc"
            placeholder="•••"
            icon={HiLockClosed}
            onChange={(e) => handleUserInput('cvc', e.target.value)}
          />
          {<p className="text-red-500 pt-2 text-xs italic">{paymentFormError ? paymentFormError.cvc : ''}</p>}
        </div>
      </div>
    </>
  );
};

export default PaymentCardForm;
