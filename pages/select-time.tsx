import React, { useState, useEffect } from 'react';
import { type NextPage } from 'next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Button } from 'flowbite-react';
import { HiShoppingCart } from 'react-icons/hi';
import PaymentCardForm from '../components/PaymentCardForm';
import OrderSummary from '../components/OrderSummary';
import PaymentCardDropdown from '../components/PaymentCardDropdown';
import AddressForm from '../components/AddressForm';
import PromoCodeForm from '../components/PromoCodeForm';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';
import 'swiper/css';
import 'swiper/css/navigation';
import { Label, TextInput, Textarea } from 'flowbite-react';
import { Navigation } from 'swiper';
import UserData from '../types/UserData';
import { useLocation } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import YoutubeEmbed from '../components/YoutubeEmbed';

const MovieByIdQuery = gql`
  query getMovieById($id: Int!) {
    getMovieById(id: $id) {
      title
      director
      producer
      category
      synopsis
      releaseDate
      rating
      trailer
      imageRef
    }
  }
`;

let movieId = 'No movie found';

const SelectTime = () => {
  const numId = Number(movieId);

  const {
    loading: movieLoading,
    error: movieError,
    data: movieData,
  } = useQuery(MovieByIdQuery, { variables: { id: numId } });

  console.log('This should be id', numId);

  const router = useRouter();

  let loggedIn: boolean = false;

  const next = () => {
    console.log(user.userStatusID);

    if (user.userStatusID == 0) {
      router.push('/confirm-email');
    } else {
      router.push('/select-seat');
    }
  };

  const [user, setUser] = useState<UserData | null>(null);

  const setStuff = (a) => {
    console.log('set stuff', a);

    movieId = a;
  };

  useEffect(() => {
    const b = window.location.search;
    console.log(b);

    const c = new URLSearchParams(b);

    const a = c.get('movie');

    console.log(a);

    setStuff(a);

    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser && loggedInUser != 'undefined') {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  if (user) {
    console.log('This is user', user.email);
    loggedIn = true;
    <div>{user.email} is loggged in</div>;
  }

  return (
    <>
      <Navbar onCheckout />
      <br></br>
      <br></br>
      <br></br>

      <div className="p-8">
        <div className="grid grid-rows-2 grid-flow-col gap-4">
          <div className="row-span-2 ...">
            <div className="py-3 sm:max-w-xl sm:mx-auto">
              <div className="bg-white shadow-lg border-gray-100 max-h-300	 border sm:rounded-3xl p-8 flex space-x-8">
                <div className="h-100 overflow-visible w-1/2">
                  <picture>
                    <source srcSet={movieData?.getMovieById.imageRef} type="image/webp" />
                    <img className="rounded-3xl shadow-lg" src="images/starwars.jpg" alt="" />
                  </picture>
                </div>

                <div className="flex flex-col w-1/2 space-y-4">
                  <div className="flex justify-between items-start">
                    <h2 className="text-3xl font-bold"> {movieData?.getMovieById.title} </h2>
                  </div>
                  <br></br>
                  <div>
                    <h2 className="text-xl ">
                      Select an available date and time to see a showing of {movieData?.getMovieById.title}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 w-3/4 ">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="base" value="Show Dates" />
              </div>
              <TextInput id="base" type="date" sizing="md" />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="base" value="Show Times" />
              </div>
              <TextInput id="base" type="time" sizing="md" />
            </div>

            <Button onClick={next}>Select a Seat</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectTime;
