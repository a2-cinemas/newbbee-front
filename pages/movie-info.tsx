import React from 'react';
import { Button } from 'flowbite-react';

import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';
import 'swiper/css';
import 'swiper/css/navigation';
import { Label, TextInput, Textarea } from 'flowbite-react';

import { useEffect } from 'react';
import { useState } from 'react';
import UserData from '../types/UserData';

import { gql, useQuery } from '@apollo/client';
import YoutubeEmbed from '../components/YoutubeEmbed';
import moment from 'moment';

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
      showings {
        showingID
        movieID
        endTime
        startTime
        available
        theaterID
      }
      reviews {
        review
        rating
      }
    }
  }
`;

const ShowByQuery = gql`
  query getAllShowings {
    getAllShowings {
      showingID
      movieID
      endTime
      startTime
      available
      theaterID
    }
  }
`;


let movieId = 'No movie found';

const MovieInfo = () => {
  const numId = Number(movieId);

  const {
    loading: movieLoading,
    error: movieError,
    data: movieData,
  } = useQuery(MovieByIdQuery, { variables: { id: numId } });

  const { loading: showLoading, error: showError, data: showData } = useQuery(ShowByQuery);

  console.log('success, ', movieData?.getMovieById.showings);

  const showings = () => {};
  const router = useRouter();

  let loggedIn: boolean = false;

  const next = () => {
    //console.log(user.userStatusID);
    const url = '/select-time/?movie=' + movieId;
    if (user == null) {
      router.push('/login');
    } else if (user.userStatusID == 0) {
      router.push('/confirm-email');
    } else {
      router.push(url);
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
    console.log('AAAAA', a);

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
  function show() {
    return (
      <>
        <br></br>
        <h1 className="text-xl">Click on time to book!</h1>
        <br></br>

        <ul>
          {movieData?.getMovieById.showings.map(function (movie, index) {
            // returns Nathan, then John, then Jane
            var d = new Date(movie.startTime);
            let hours = d.getUTCHours();
            let minutes = d.getUTCMinutes();

            console.log('d', d); // Hours
            let start = moment(movie.startTime).utc().format('MM/DD/YYYY');
            let fullDate = d;
            let url = '/select-seat?movies=' + movieId + '&theater=' + movie.theaterID + '&showing=' + movie.showingID;
            // start = fullDate.toString();
            if (user == null) {
              url ='/login';
              console.log("user is not logged in");

            } else if (user.userStatusID == 0) {
              url ='/confirm-email';
              console.log("user has not confirmed emailn");
            } 
            else{
              console.log("obviosly failed");
            }
          //  console.log(start);

            return (
              <li key={index}>
                
                <a href={url}>
                  <Button>
                    {start} {hours}:{minutes}{' '}
                  </Button>{' '}
                </a>
                <br></br>
              </li>
            );
          })}
        </ul>
      </>
    );
  }

  function reviews() {
    return (
      <>
        <h2 className="text-5xl">Reviews</h2>
        <br></br>
        <ul>
          {movieData?.getMovieById.reviews.map(function (user, index) {
            // returns Nathan, then John, then Jane
            return (
              <li key={index}>
                {' '}
                {user.rating}/5 <br></br>
                {user.author} <br></br>
                {user.review} <br></br>
                <br></br>
              </li>
            );
          })}
        </ul>
      </>
    );
  }

  let saveThis = '';

  if (movieData?.getMovieById.trailer != undefined) {
    console.log(movieData?.getMovieById.trailer);
    const url = new URL(movieData?.getMovieById.trailer);
    const searchSection = url.search;
    const parsedLink = new URLSearchParams(searchSection);
    saveThis = parsedLink.get('v');
    console.log('saveThis, ', { saveThis });
  }

  return (
    <>
      <Navbar onCheckout />
      <br></br>
      <br></br>
      <br></br>

      <div className="p-8">
        <div className="grid grid-rows-1 grid-flow-col gap-4">
          <div className="row-span-2 ...">
            <div className="py-3 sm:max-w-xl sm:mx-auto">
              <div className="bg-white shadow-lg border-gray-100 max-h-200	 border sm:rounded-3xl p-8 flex space-x-8">
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
                  <div>
                    <div className="text-lg text-gray-800"> Released: {movieData?.getMovieById.releaseDate} </div>
                  </div>
                  <p className=" text-gray-400 max-h-300 overflow-y-hidden">
                    Synopsis: <br></br>
                    {movieData?.getMovieById.synopsis}{' '}
                  </p>
                  <p className=" text-gray-400 max-h-300 overflow-y-hidden">
                    Category: {movieData?.getMovieById.category}{' '}
                  </p>
                  <div className="flex text-2xl font-bold text-a">{movieData?.getMovieById.rating} </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 w-3/4 ">
            <div className="mb-2 block">
              <Label value="Director" />
              <p>{movieData?.getMovieById.director}</p>
            </div>
            <div className="mb-2 block">
              <Label value="Producer" />
              <p>{movieData?.getMovieById.producer}</p>
            </div>
            <div className="mb-2 block">
              <Label value="Category" />
              <p>{movieData?.getMovieById.category}</p>
            </div>

            <YoutubeEmbed embedId={saveThis} />

            <div>{show()}</div>
          </div>
        </div>

        <div className="p-9">
          <div className="p-9">{reviews()}</div>
        </div>
      </div>
    </>
  );
};

export default MovieInfo;
