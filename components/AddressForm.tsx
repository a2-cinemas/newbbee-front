import React, { FunctionComponent, useState, useEffect } from 'react';
import { HiHome } from 'react-icons/hi';
import { Label, TextInput, Select } from 'flowbite-react';

type AddressFormProps = {
  handleUserInput?: (name: string, value: any) => void | null;
  addressFormError?: any | null;
};

const AddressForm: FunctionComponent<AddressFormProps> = ({ handleUserInput, addressFormError }) => {
  return (
    <>
      <div className="mb-6">
        <div className="mb-2 block">
          <Label htmlFor="street" value="Street" />
        </div>
        <TextInput
          id="street"
          placeholder="123 Main St"
          icon={HiHome}
          onChange={(e) => handleUserInput('street', e.target.value)}
        />
        {<p className="text-red-500 pt-2 text-xs italic">{addressFormError ? addressFormError.street : ''}</p>}
      </div>
      <div className="mb-6">
        <div className="mb-2 block">
          <Label htmlFor="countries" value="Select your country" />
        </div>
        <Select id="countries" onChange={(e) => handleUserInput('country', e.target.value)}>
          <option value="none" selected disabled hidden>
            Select...
          </option>
          <option value="USA">United States</option>
          <option value="UK">United Kingdom</option>
          <option value="JP">Japan</option>
          <option value="CN">China</option>
          <option value="IN">India</option>
          <option value="CA">Canada</option>
          <option value="FR">France</option>
          <option value="DE">Germany</option>
        </Select>
        {<p className="text-red-500 pt-2 text-xs italic">{addressFormError ? addressFormError.country : ''}</p>}
      </div>
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="city" value="City" />
          </div>
          <TextInput id="city" placeholder="New York" onChange={(e) => handleUserInput('city', e.target.value)} />
          {<p className="text-red-500 pt-2 text-xs italic">{addressFormError ? addressFormError.city : ''}</p>}
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="state-providence" value="State / Providence" />
          </div>
          <TextInput
            id="state-providence"
            placeholder="NY"
            onChange={(e) => handleUserInput('state', e.target.value)}
          />
          {<p className="text-red-500 pt-2 text-xs italic">{addressFormError ? addressFormError.state : ''}</p>}
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="postal-code" value="ZIP / Postal Code" />
          </div>
          <TextInput
            id="postal-code"
            placeholder="10001"
            required
            onChange={(e) => handleUserInput('zip', e.target.value)}
          />
          {<p className="text-red-500 pt-2 text-xs italic">{addressFormError ? addressFormError.zip : ''}</p>}
        </div>
      </div>
    </>
  );
};

export default AddressForm;
