import React, { useState } from 'react';
import { Table, Button, TextInput, Modal, Label, Textarea, Select } from 'flowbite-react';
import { HiTrash, HiPencil, HiCalendar } from 'react-icons/hi';
import { gql, useQuery, useMutation } from '@apollo/client';
import DeleteModal from './DeleteModal';
import ScheduleMovieModal from './ScheduleMovieModal';
import Movie from '../types/Movie';

const GET_MOVIES_QUERY = gql`
  query movies {
    movies {
      movieID
      title
      director
      producer
      category
      Cast
      synopsis
      rating
      releaseDate
      trailer
      imageRef
      nowShowing
      showings {
        showingID
        movieID
        startTime
        endTime
      }
    }
  }
`;

const GET_SHOWINGS_QUERY = gql`
  query getAllShowings {
    getAllShowings {
      showingID
      movieID
      startTime
      endTime
    }
  }
`;

const GET_THEATERS_QUERY = gql`
  query theaters {
    theaters {
      theaterID
      capacity
      available
    }
  }
`;

const UPDATE_MOVIE_MUTATION = gql`
  mutation updateMovie($movieInput: UpdateMovieInput!) {
    updateMovie(updateMovieInput: $movieInput) {
      movieID
      title
      releaseDate
      showings {
        startTime
        endTime
      }
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

const DELETE_MOVIE_MUTATION = gql`
  mutation deleteMovieById($movieId: Int!) {
    deepDeleteMovieById(id: $movieId) {
      title
      director
      showings {
        showingID
      }
    }
  }
`;

const DELETE_SHOWING_MUTATION = gql`
  mutation deepDeleteShowingById($showingId: Int!) {
    deleteShowingById(id: $showingId) {
      showingID
      movieID
      movie {
        title
        director
      }
      theaterID
      theater {
        available
        showings {
          showingID
          startTime
        }
      }
    }
  }
`;

const MovieTable = () => {
  // state for changing table text to input fields
  const [isEditing, setIsEditing] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);

  // state for delete modal
  const [showDeleteModal, setShowDeleteModal] = useState({});
  const [showScheduleModal, setShowScheduleModal] = useState({});

  const { loading, error, data } = useQuery(GET_MOVIES_QUERY);

  const [updateMovie] = useMutation(UPDATE_MOVIE_MUTATION, {
    refetchQueries: [{ query: GET_MOVIES_QUERY }],
  });

  const [deleteMovie] = useMutation(DELETE_MOVIE_MUTATION, {
    refetchQueries: [{ query: GET_MOVIES_QUERY }],
  });

  // state for editing movie
  const [editingMovie, setEditingMovie] = useState<Movie>({
    movieID: 0,
    title: '',
    director: '',
    producer: '',
    Cast: '',
    category: '',
    synopsis: '',
    rating: '',
    releaseDate: '',
    trailer: '',
    imageRef: '',
  });

  // state for editing showings
  const [editingShowings, setEditingShowings] = useState({
    showingID: '',
    movieID: '',
    showDate: '',
    startTime: '',
    endTime: '',
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( </p>;

  const convertDate = (date: string) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // get all showings for a movie
  const getShowingTimes = (movieID: number) => {
    const showings = data.movies.find((movie: any) => movie.movieID === movieID).showings;
    // parse time from iso 8601 and convert utc to local time and get rid of seconds
    const showTimes = showings.map((showing: any) => {
      const time = new Date(showing.startTime).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });
      return time;
    });
    return showTimes;
  };

  const getShowingDate = (movieID: number) => {
    const showings = data.movies.find((movie: any) => movie.movieID === movieID).showings;
    // parse date from iso 8601
    const showDate = showings.map((showing: any) => {
      const date = new Date(showing.startTime).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      return date;
    });
    return showDate;
  };

  const handleMovieInput = (name: string, value: any) => {
    setEditingMovie({ ...editingMovie, [name]: value });
  };

  const handleMovieDelete = (movieID: number) => {
    // delete movie mutation
    deleteMovie({
      variables: { movieId: movieID },
      refetchQueries: [{ query: GET_MOVIES_QUERY }],
    }).catch((err) => console.log(err));
    setShowDeleteModal({ ...showDeleteModal, [movieID]: false });
  };

  const handleShowingCreate = (movieID: number, theaterID: number) => {
    // create showing mutation
    // createShowing({
    //   variables: {
    //     showingInput: {
    //       movieID,
    //       theaterID,
    //       showDate: editingShowings.showDate,
    //       startTime: editingShowings.startTime,
    //       endTime: editingShowings.endTime,
    //     },
    //   },
    //   refetchQueries: [{ query: GET_MOVIES_QUERY }],
    // }).catch((err) => console.log(err));
    setShowScheduleModal({ ...showScheduleModal, [movieID]: false });
  };

  const handleShowingInput = (name: string, value: any) => {
    // if (name === 'showDate') {
    //   setEditingShowings({ ...editingShowings, showDate: value });
    // } else {
    //   setEditingShowings({ ...editingShowings, startTime: value });
    //   // set end time to 2 hours after start time start time format in 24 hour time HH:MM
    //   const [hour, minute] = value.split(':');
    //   const endHour = parseInt(hour) + 2;
    //   const endMinute = minute;
    //   // if end hour is greater than 24, subtract 24 from end hour
    //   if (endHour > 24) {
    //     const newEndHour = endHour - 24;
    //     setEditingShowings({ ...editingShowings, endTime: `${newEndHour}:${endMinute}` });
    //   } else {
    //     setEditingShowings({ ...editingShowings, endTime: `${endHour}:${endMinute}` });
    //   }
    // }
    // console.log(editingShowings);
  };

  // const handleTheaterInput = (value: any) => {
  //   setTheater(value);
  // };

  const onEditModalOpen = (movie: Movie) => {
    setIsEditing(true);
    setEditingMovie(movie);
    console.log(movie);
  };

  const onClose = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    updateMovie({
      variables: {
        movieInput: {
          movieID: editingMovie.movieID,
          title: editingMovie.title,
          director: editingMovie.director,
          producer: editingMovie.producer,
          Cast: editingMovie.Cast,
          category: editingMovie.category,
          synopsis: editingMovie.synopsis,
          rating: editingMovie.rating,
          releaseDate: editingMovie.releaseDate,
          trailer: editingMovie.trailer,
          imageRef: editingMovie.imageRef,
        },
      },
      // }).then(() => {
      //   updateShowing({
      //     variables: {
      //       showingInput: {
      //         showingID: editingMovie.showings.showingID,
      //         movieID: editingMovie.movieID,
      //         showDate: editingShowings.showDate,
      //         startTime: `${editingShowings.showDate} ${editingShowings.startTime}`,
      //         endTime: `${editingShowings.showDate} ${editingShowings.endTime}`,
      //       },
      //     },
    });
    onClose();
  };

  const onScheduleModalOpen = (movie: Movie) => {
    setIsScheduling(true);
  };

  return (
    <>
      <h1 className="px-4 py-2 text-center text-4xl font-bold text-gray-900 dark:text-gray-100">Movies</h1>
      <Table>
        <Table.Head>
          <Table.HeadCell className="w-2 text-left">
            <span className="">Title</span>
          </Table.HeadCell>
          <Table.HeadCell className="w-2 text-center">
            <span className="=">Status</span>
          </Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Delete</span>
          </Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Add Showing</span>
          </Table.HeadCell>
        </Table.Head>

        <Table.Body className="divide-y">
          {data?.movies.map((movie: Movie) => (
            <>
              <Table.Row key={movie.movieID} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell
                  className="text-left whitespace-nowrap font-medium text-gray-900 dark:text-white"
                  key={movie.title}
                >
                  {movie.title}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap w-full">
                  {movie.nowShowing ? 'In Theaters' : 'Coming Soon'}
                </Table.Cell>
                <Table.Cell className="w-1" key={movie.releaseDate}>
                  <HiPencil
                    title="Edit Movie"
                    className="w-6 h-6 text-gray-400 hover:text-gray-500 hover:cursor-pointer"
                    aria-hidden="true"
                    onClick={() => onEditModalOpen(movie)}
                  />
                </Table.Cell>
                <Table.Cell className="w-1">
                  <HiTrash
                    title="Delete Movie"
                    className="w-6 h-6 text-gray-400 hover:text-red-700 dark:hover:text-red-500 hover:cursor-pointer"
                    onClick={() => setShowDeleteModal({ ...showDeleteModal, [movie.movieID]: true })}
                  />
                </Table.Cell>
                <Table.Cell className="w-1 pr-20">
                  <HiCalendar
                    title="Schedule Movie"
                    className="w-6 h-6 text-gray-400 hover:text-blue-700 dark:hover:text-blue-500 hover:cursor-pointer"
                    onClick={() => setShowScheduleModal({ ...showScheduleModal, [movie.movieID]: true })}
                  />
                </Table.Cell>
              </Table.Row>
              {/* Delete movie modal */}
              {showDeleteModal ? (
                <DeleteModal
                  show={showDeleteModal[movie.movieID]}
                  prompt={`Are you sure you want to delete this movie?`}
                  onClick={() => {
                    handleMovieDelete(movie.movieID);
                    console.log('movieID', movie.movieID);
                  }}
                  onClose={() => setShowDeleteModal({ ...showDeleteModal, [movie.movieID]: false })}
                />
              ) : null}
              {/* Schedule movie modal */}
              {showScheduleModal ? (
                <ScheduleMovieModal
                  show={showScheduleModal[movie.movieID]}
                  movie={movie}
                  onClose={() => setShowScheduleModal({ ...showScheduleModal, [movie.movieID]: false })}
                />
              ) : null}
            </>
          ))}
        </Table.Body>
      </Table>

      {/* <!-- Edit user modal --> */}
      {isEditing ? (
        <Modal show={isEditing} onClose={onClose} size="xl" popup>
          <Modal.Header />
          <Modal.Body>
            <form className="grid gap-4 w-full pt-4 pb-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Edit Movie</h1>
              <div>
                {/* Title */}
                <div className="mb-2 block">
                  <Label htmlFor="base" value="Title" />
                </div>
                <TextInput
                  id="base"
                  type="text"
                  sizing="md"
                  value={editingMovie.title}
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
                  value={editingMovie.category}
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
                  value={editingMovie.rating}
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
                  value={editingMovie.director}
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
                  value={editingMovie.producer}
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
                  value={editingMovie.Cast}
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
                  value={editingMovie.synopsis}
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
                  value={editingMovie.trailer}
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
                  value={editingMovie.imageRef}
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
                  value={editingMovie.releaseDate}
                  onChange={(e) => handleMovieInput('releaseDate', e.target.value)}
                  required
                />
              </div>
              {/* <div>
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
                  value={editingShowings.showDate}
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
                  value={editingShowings.startTime}
                  onChange={(e) => handleShowingInput('startTime', e.target.value)}
                  required
                />
              </div> */}
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={onClose}>Close</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </Modal.Footer>
        </Modal>
      ) : null}
    </>
  );
};

export default MovieTable;
