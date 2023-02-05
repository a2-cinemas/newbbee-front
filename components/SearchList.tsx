// src/components/SearchList.js

import React from 'react';
import Card from './Card';

function SearchList({ filteredPersons }) {
  if (filteredPersons != undefined) {
    const filtered = filteredPersons.map((person) => <Card key={person.id} person={person} />);
    return <div className="scroll ">{filtered}</div>;
  }
}

export default SearchList;
