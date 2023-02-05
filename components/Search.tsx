// src/components/Search.js

import React, { useState } from 'react';
import Scroll from './Scroll';
import SearchList from './SearchList';

const Search = ({ details }) => {
  const [searchField, setSearchField] = useState('');
  if (details != undefined) {
    const filteredPersons = details.filter((person) => {
      return person.title.toLowerCase().includes(searchField.toLowerCase()); //||
      //maybe add others here
    });

    const handleChange = (e) => {
      setSearchField(e.target.value);
    };

    const searchList = () => {
      return <SearchList filteredPersons={filteredPersons} />;
    };

    return (
      <section className="garamond">
        <div>
          <input
            className="width: 100%  display: flex  justify-content: center align-items: center"
            type="search"
            placeholder="Search Movies"
            onChange={handleChange}
          />
        </div>
        {searchList()}
      </section>
    );
  }
};

export default Search;
