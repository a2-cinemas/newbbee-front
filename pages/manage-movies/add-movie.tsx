import React, { FormEvent, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Navbar from '../../components/Navbar';
import { Label, TextInput, Textarea, Button, Select, Card } from 'flowbite-react';
import { gql, useMutation, useQuery } from '@apollo/client';
import Movie from '../../types/Movie';
import AdminNavbar from '../../components/AdminNavbar';

const GET_THEATERS_QUERY = gql`
  query theaters {
    theaters {
      theaterID
      capacity
      available
    }
  }
`;

const THEATER_AVAILABILITY_MUTATION = gql`
  mutation updateTheater($theaterInput: UpdateTheaterInput!) {
    updateTheater(updateTheaterInput: $theaterInput) {
      theaterID
      capacity
      available
    }
  }
`;

const GET_MOVIE_IDS_QUERY = gql`
  query movies {
    movies {
      movieID
    }
  }
`;

const CREATE_MOVIE_MUTATION = gql`
  mutation createMovie($createMovieInput: CreateMovieInput!) {
    createMovie(createMovieInput: $createMovieInput) {
      movieID
      title
      director
      producer
      Cast
      category
      synopsis
      releaseDate
      rating
      trailer
      imageRef
    }
  }
`;

const CREATE_SHOWING_MUTATION = gql`
  mutation createShowing($createShowingInput: CreateShowingInput!) {
    createShowing(createShowingInput: $createShowingInput) {
      showingID
      movieID
      movie {
        title
      }
      startTime
      endTime
      available
      theaterID
      theater {
        capacity
        available
      }
    }
  }
`;

const AddMovie = () => {
  const { data: theatersData, refetch } = useQuery(GET_THEATERS_QUERY);
  const [updateTheater] = useMutation(THEATER_AVAILABILITY_MUTATION, {
    refetchQueries: [{ query: GET_THEATERS_QUERY }],
  });
  const [createShowing, { data: showingData }] = useMutation(CREATE_SHOWING_MUTATION);
  // Create Movie mutation that reloads the getMovies query after mutation and then creates a showing for the movie
  const [createMovie, { data: movieData }] = useMutation(CREATE_MOVIE_MUTATION, {
    refetchQueries: [{ query: GET_MOVIE_IDS_QUERY }],
  });

  // state for movie
  const [movie, setMovie] = useState<Movie>({
    movieID: 0,
    title: '',
    director: '',
    producer: '',
    Cast: '',
    category: 'Action',
    synopsis: '',
    releaseDate: '',
    rating: 'G',
    trailer: '',
    imageRef: '',
  });

  // console.log('This is the default theater ->', defaultTheaterID);
  // state for show date, start time, and end time where start time has the show date as well and end time is 2 hours after start time
  const [showDate, setShowDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // handle user input for movie
  const handleMovieInput = (name: string, value: any) => {
    setMovie({ ...movie, [name]: value });
    console.log(movie);
  };

  // handle user input for show date and start time
  const handleShowingInput = (name: string, value: any) => {
    if (name === 'showDate') {
      setShowDate(value);
    } else {
      setStartTime(value);
      // set end time to 2 hours after start time start time format in 24 hour time HH:MM
      const [hour, minute] = value.split(':');
      const endHour = parseInt(hour) + 2;
      const endMinute = minute;
      // if end hour is greater than 24, subtract 24 from end hour
      if (endHour > 24) {
        setEndTime(`${endHour - 24}:${endMinute}`);
      } else {
        setEndTime(`${endHour}:${endMinute}`);
      }
    }
    console.log(showDate, startTime, endTime);
  };

  // handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // create movie and then create showing that is dependent on the movie
    createMovie({
      variables: { createMovieInput: movie },
      // }).then((res) => {
      //   createShowing({
      //     variables: {
      //       createShowingInput: {
      //         movieID: res.data.createMovie.movieID,
      //         startTime: `${showDate} ${startTime}`,
      //         endTime: `${showDate} ${endTime}`,
      //         available: true,
      //         theaterID: Number(theater),
      //       },
      //     },
      // update the unvailable theater and reset form after mutation
    })
      // .then((res) => {
      //   updateTheater({ variables: { theaterInput: { theaterID: Number(theater), available: false } } });
      // })
      .then(() => {
        setMovie({
          title: '',
          director: '',
          producer: '',
          category: 'Action',
          Cast: '',
          synopsis: '',
          releaseDate: '',
          rating: 'G',
          trailer: '',
          imageRef: '',
        });
        setShowDate('');
        setStartTime('');
        setEndTime('');
      });
  };

  return (
    <>
      <AdminNavbar />

      <div className="m-auto">
        <div className="flex float-left">
          <AdminSidebar />
        </div>
        <div className="flex flex-col items-center min-w-fit min-h-fit py-4 px-4 sm:px-6 lg:px-8 overflow-auto relative">
          <div className="w-1/2 min-w-[25%]">
            <Card>
              <div className="flex flex-col items-center justify-center w-full">
                <form className="grid gap-4 w-full pt-4 pb-4" onSubmit={handleSubmit}>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Add Movie</h1>
                  <div>
                    {/* Title */}
                    <div className="mb-2 block">
                      <Label htmlFor="base" value="Title" />
                    </div>
                    <TextInput
                      id="base"
                      type="text"
                      sizing="md"
                      value={movie.title}
                      onChange={(e) => handleMovieInput('title', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    {/* Genre */}
                    <div className="mb-2 block">
                      <Label htmlFor="base" value="Genre" />
                    </div>
                    <Select
                      id="category"
                      sizing="md"
                      value={movie.category}
                      onChange={(e) => handleMovieInput('category', e.target.value)}
                      required
                    >
                      <option value="Action">Action</option>
                      <option value="Comedy">Comedy</option>
                      <option value="Fantasy">Fantasy</option>
                      <option value="Sci-Fi">Sci-Fi</option>
                      <option value="Romance">Romance</option>
                      <option value="Documentary">Documentary</option>
                      <option value="Horror">Horror</option>
                      <option value="Holiday">Holiday</option>
                    </Select>
                  </div>
                  <div>
                    {/* MPAA Rating */}
                    <div className="mb-2 block">
                      <Label htmlFor="base" value="MPAA Rating" />
                    </div>
                    <Select
                      id="rating"
                      sizing="md"
                      value={movie.rating}
                      onChange={(e) => handleMovieInput('rating', e.target.value)}
                      required
                    >
                      <option value="G">G</option>
                      <option value="PG">PG</option>
                      <option value="PG-13">PG-13</option>
                      <option value="R">R</option>
                    </Select>
                  </div>
                  <div>
                    {/* Director */}
                    <div className="mb-2 block">
                      <Label htmlFor="base" value="Director" />
                    </div>
                    <TextInput
                      id="director"
                      type="text"
                      value={movie.director}
                      onChange={(e) => handleMovieInput('director', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    {/* Producer */}
                    <div className="mb-2 block">
                      <Label htmlFor="base" value="Producer" />
                    </div>
                    <TextInput
                      id="base"
                      type="text"
                      sizing="md"
                      value={movie.producer}
                      onChange={(e) => handleMovieInput('producer', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    {/* Cast */}
                    <div className="mb-2 block">
                      <Label htmlFor="base" value="Cast" />
                    </div>
                    <Textarea
                      id="cast"
                      placeholder="Enter cast members..."
                      rows={2}
                      value={movie.Cast}
                      onChange={(e) => handleMovieInput('cast', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    {/* Synopsis */}
                    <div className="mb-2 block">
                      <Label htmlFor="base" value="Synopsis" />
                    </div>
                    <Textarea
                      id="synopsis"
                      placeholder="Enter a synopsis..."
                      rows={3}
                      value={movie.synopsis}
                      onChange={(e) => handleMovieInput('synopsis', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    {/* Trailer URL */}
                    <div className="mb-2 block">
                      <Label htmlFor="base" value="Trailer URL" />
                    </div>
                    <TextInput
                      id="base"
                      type="url"
                      sizing="md"
                      value={movie.trailer}
                      onChange={(e) => handleMovieInput('trailer', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    {/* Poster URL */}
                    <div className="mb-2 block">
                      <Label htmlFor="base" value="Poster URL" />
                    </div>
                    <TextInput
                      id="base"
                      type="url"
                      sizing="md"
                      value={movie.imageRef}
                      onChange={(e) => handleMovieInput('imageRef', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    {/* Release Date */}
                    <div className="mb-2 block">
                      <Label htmlFor="base" value="Release Date" />
                    </div>
                    <TextInput
                      id="base"
                      type="date"
                      sizing="md"
                      value={movie.releaseDate}
                      onChange={(e) => handleMovieInput('releaseDate', e.target.value)}
                      required
                    />
                  </div>
                  {/*
          <div>
            <div className="mb-2 block">
              <Label htmlFor="base" value="Available Theaters" />
            </div>
            <Select id="theater" sizing="md" onChange={(e) => handleTheaterInput(e.target.value)}>
              {theatersData?.theaters
                .filter((theater) => theater.available === true)
                .map((theater) => (
                  <option key={theater.theaterID} value={theater.theaterID}>
                    {`Theater ${theater.theaterID}: ${theater.capacity} seats`}
                  </option>
                ))}
            </Select>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="base" value="Show Date" />
            </div>
            <TextInput
              id="base"
              type="date"
              sizing="md"
              value={showDate}
              onChange={(e) => handleShowingInput('showDate', e.target.value)}
              required
            />
          </div>
           <div>
            <div className="mb-2 block">
              <Label htmlFor="base" value="Show Time" />
            </div>
            <TextInput
              id="base"
              type="time"
              sizing="md"
              value={startTime}
              onChange={(e) => handleShowingInput('startTime', e.target.value)}
              required
            />
          </div> */}

                  {/* Submit Button */}
                  <Button type="submit" onClick={() => refetch()}>
                    <span className="text-white">Add Movie</span>
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddMovie;
