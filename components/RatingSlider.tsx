import React from 'react';

const RatingSlider = ({ label }) => {
  return (
    <div>
      <label htmlFor="steps-range" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
        {label}
      </label>
      <input
        id="steps-range"
        type="range"
        min="0"
        max="10"
        value="5"
        step="0.2"
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      />
    </div>
  );
};

export default RatingSlider;
