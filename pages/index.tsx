import React from 'react';
import { type NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper';
import { useEffect } from 'react';
import { useState } from 'react';
import UserData from '../types/UserData';
import { gql, useQuery } from '@apollo/client';
import Search from '../components/Search';
import initialDetails from '../util/initialDetails';
import Scroll from '../components/Scroll';
import SearchList from '../components/SearchList';

const y = new Date('2022-12-23');

const moviesQuery = gql`
  query movies {
    movies {
      movieID
      title
      director
      producer
      category
      synopsis
      releaseDate
      rating
      trailer
      imageRef
      nowShowing
    }
  }
`;

const upcomingMoviesQuery = gql`
  query getUpcomingMovies {
    getUpcomingMovies {
      movieID
      title
      director
      producer
      category
      synopsis
      releaseDate
      rating
      trailer
      imageRef
      nowShowing
    }
  }
`;

const Home = () => {
  const { loading: movieLoading, error: movieError, data: movieData } = useQuery(moviesQuery);

  const { loading: upcomingLoading, error: upcomingError, data: upcomingData } = useQuery(upcomingMoviesQuery);

  let i = 0;

  console.log(movieData?.movies[1].imageRef);

  let loggedIn: boolean = false;

  const [user, setUser] = useState<UserData | null>(null);
  const [userpassword, setUserPassword] = useState('');
  const [useremail, setUserEmail] = useState('');

  const [searchField, setSearchField] = useState(''); //

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser && loggedInUser != 'undefined') {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  if (movieData?.movies != undefined) {
    const filteredNow = movieData?.movies.filter((person) => {
      return (
        (person.title.toLowerCase().includes(searchField.toLowerCase()) && person.nowShowing) ||
        (person.category.toLowerCase().includes(searchField.toLowerCase()) && person.nowShowing)
      );
    });

    const filteredComing = upcomingData?.getUpcomingMovies.filter((person) => {
      return (
        person.title.toLowerCase().includes(searchField.toLowerCase()) ||
        person.category.toLowerCase().includes(searchField.toLowerCase())
      );
    });

    const handleChange = (e) => {
      setSearchField(e.target.value);
    };
    const searchListNow = () => {
      if (filteredNow == undefined) {
        return <p>Nothing</p>;
      } else if (filteredNow.length == 0) {
        return (
          <div className="bg-white border-gray-100  border sm:rounded-3xl p-8   max-w-40	">
            <h1 className="text-4xl text-red-600">No movies found</h1>
          </div>
        );
      } else {
        return <SearchList filteredPersons={filteredNow} />;
      }
    };
    const searchListSoon = () => {
      if (filteredComing == undefined) {
        return <p>Nothing</p>;
      } else if (filteredComing.length == 0) {
        return (
          <div className="bg-white shadow-lg border-gray-100  border sm:rounded-3xl p-8   max-w-40	">
            <h1 className="text-4xl text-red-600">No movies found</h1>
          </div>
        );
      } else {
        return <SearchList filteredPersons={filteredComing} />;
      }
    };

    const handleLogout = () => {
      setUser(null);
      setUserEmail('');
      setUserPassword('');
      localStorage.clear();
    };

    if (user) {
      console.log('This is user', user.email);
      loggedIn = true;
      <div>{user.email} is loggged in</div>;
    }

    return (
      <>
        <Navbar onLogin={loggedIn} />

        <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
          <SwiperSlide>
            <picture>
              <source srcSet="/images/harry.jpg" type="image/webp" />
              <img className=" " src="/images/harry.jpg" alt="image slide 1" />
            </picture>
          </SwiperSlide>
          <SwiperSlide>
            <picture>
              <source srcSet="/images/bowie.jpg" type="image/webp" />
              <img className="object-fill w-full h-full" src="/images/bowie.jpg" alt="image slide 2" />
            </picture>
          </SwiperSlide>
          <SwiperSlide>
            <picture>
              <source srcSet="/images/woman.png" type="image/webp" />
              <img className="object-fill w-full h-full" src="/images/woman.png" alt="image slide 3" />
            </picture>
          </SwiperSlide>
        </Swiper>

        <div>
          <section className="garamond">
            <div className="place-items-center">
              <input className="box" type="search" placeholder="Search Movies" onChange={handleChange} />
            </div>
            <br></br>
            <h1 className="text-5xl">Now Playing</h1>
            {searchListNow()}
            <br></br>
            <br></br>
            <h1 className="text-5xl">Coming Soon</h1>
            {searchListSoon()}
          </section>
        </div>

        {/*
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
      
      <img className="p-8 rounded-t-lg" src={ movieData?.movies[1].imageRef } alt="product image" />
      <div className="px-5 pb-5">
     


          <a href="#">
              <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">Apple Watch Series 7 GPS, Aluminium Case, Starlight Sport</h5>
          </a>
          <div className="flex items-center mt-2.5 mb-5">
              <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>First star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Second star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Third star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fourth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fifth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">5.0</span>
          </div>
            <div className="flex items-center justify-between">
              <a href="#" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">View More Information</a>
            </div>
          </div>


      </div>
  */}
      </>
    );
  }
};

export default Home;
