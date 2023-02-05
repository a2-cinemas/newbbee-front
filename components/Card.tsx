// src/components/Card.js

import React from 'react';
import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

//         <YoutubeEmbed embedId={ person.trailer}  />

import YoutubeEmbed from '../components/YoutubeEmbed';
import { Label, TextInput, Textarea } from 'flowbite-react';

function Card({ person }) {
  const url = '/movie-info/?movie=' + person.movieID;
  return (
    //  <td>
    /*       <div className="max-w-10">

       <div >

        <div >
          <div >
              <div className="bg-white shadow-lg border-gray-100max-w-50 border sm:rounded-3xl p-8 flex space-x-8">
                <div className="h-100 overflow-hidden w-1/2">
                  <picture>
                    <source srcSet= { person.imageRef}  type="image/webp" />
                    <img className="rounded-3xl shadow-lg" src="images/starwars.jpg" alt="" />
                  </picture>

                </div>

                <div className="flex flex-col w-1/2 space-y-4">
                  <div className="flex justify-between items-start">
                    <h2 className="text-3xl font-bold"> { person.title} </h2>
                  </div>                  
                  <div className="flex text-2xl font-bold text-a">{ person.rating } </div>
                  {/*<YoutubeEmbed embedId={ person.trailer}  />*/ /*}
                  <a href = {url}>Book</a>
                </div>
              </div>
            </div>
          </div>
        </div>   
      </div>*/
    //</td>
    <td>
      <div>
        <p className="invisible">jiofekbnfojksabnfijkasmhnfoas78098jkdjm jh</p>

        <div className="p-8">
          <div className="grid grid-rows-2 grid-flow-col gap-4">
            <div className="row-span-2 ...">
              <div className="">
                <div className="bg-white shadow-lg border-gray-100  border sm:rounded-3xl p-8   max-w-40	">
                  <div className="">
                    <picture>
                      <source srcSet={person.imageRef} type="image/webp" />
                      <img className="rounded-3xl w-20" src="images/starwars.jpg" alt="" />
                    </picture>
                  </div>

                  <div className=" min-h-full	 space-y-6 space-x-4">
                    <div className="flex justify-between items-start">
                      <h2 className="text-3xl font-bold"> {person.title} </h2>
                    </div>
                    <h2 className="text-xl "> Rated: {person.rating} </h2>

                    <div>
                      <a href={url}>
                        {' '}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                          />
                        </svg>
                      </a>{' '}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </td>
  );
}

export default Card;
