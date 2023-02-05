import React, { useState } from 'react';
import { Table } from 'flowbite-react';
import { HiTrash } from 'react-icons/hi';
import { gql, useQuery, useMutation } from '@apollo/client';
import Showing from '../types/Showing';
import Movie from '../types/Movie';
import DeleteModal from './DeleteModal';

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

const GET_MOVIES_QUERY = gql`
  query movies {
    movies {
      movieID
      title
      showings {
        showingID
        movieID
        startTime
        endTime
        theaterID
      }
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

const THEATER_AVAILABILITY_MUTATION = gql`
  mutation updateTheater($theaterInput: UpdateTheaterInput!) {
    updateTheater(updateTheaterInput: $theaterInput) {
      theaterID
      capacity
      available
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

const MovieShowingsTable = () => {
  const tableHeaders = ['Title', 'Scheduled Time', 'Theater'];

  // state for showing delete modal
  const [showDeleteModal, setShowDeleteModal] = useState({});

  // queries for showings, movies, and theaters
  const { loading: showingsLoading, error: showingsError, data: showingsData } = useQuery(GET_SHOWINGS_QUERY);
  const { loading: moviesLoading, error: moviesError, data: moviesData, refetch } = useQuery(GET_MOVIES_QUERY);
  const { loading: theaterLoading, error: theaterError, data: theaterData } = useQuery(GET_THEATERS_QUERY);

  // mutations for updating theater availability and deleting showings
  const [updateTheater] = useMutation(THEATER_AVAILABILITY_MUTATION, {
    refetchQueries: [{ query: GET_THEATERS_QUERY }],
  });
  const [deleteShowing] = useMutation(DELETE_SHOWING_MUTATION, {
    refetchQueries: [{ query: GET_SHOWINGS_QUERY }],
  });

  // if loading, return loading message
  if (showingsLoading || moviesLoading || theaterLoading) {
    return <p>Loading...</p>;
  }

  // create array of showings with movie title included
  const allShowings = moviesData.movies.flatMap((movie: Movie) => {
    return movie.showings.map((show: Showing) => {
      return {
        ...show,
        title: movie.title,
      };
    });
  });

  // check if theater is available for a showing and update if not
  const handleCheckAvailability = async (showing: Showing) => {
    const theater = theaterData.theaters.find((theater) => theater.theaterID === showing.theaterID);
    if (theater.available) {
      return;
    }
    const showings = theater.showings;
    const showingIndex = showings.findIndex((show) => show.showingID === showing.showingID);
    const nextShowing = showings[showingIndex + 1];
    const prevShowing = showings[showingIndex - 1];
    const nextShowingTime = nextShowing ? new Date(nextShowing.startTime).getTime() : Infinity;
    const prevShowingTime = prevShowing ? new Date(prevShowing.startTime).getTime() : -Infinity;
    const showingTime = new Date(showing.startTime).getTime();
    const timeBetweenShowings = Math.min(showingTime - prevShowingTime, nextShowingTime - showingTime);
    if (timeBetweenShowings >= 1800000) {
      await updateTheater({
        variables: {
          theaterInput: {
            theaterID: theater.theaterID,
            available: true,
          },
        },
      }).catch((err) => {
        console.log(err);
      });
    }
  };

  const handleDeleteShowing = async (showingId: number) => {
    // delete showing
    await deleteShowing({
      variables: {
        showingId,
      },
      refetchQueries: [{ query: GET_MOVIES_QUERY }],
    }).catch((err) => {
      console.log(err);
    });
    setShowDeleteModal({ ...showDeleteModal, [showingId]: false });
  };

  const getShowingDateTime = (time: string) => {
    const date = new Date(time);
    const day = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${day} at ${timeString}`;
  };

  return (
    <div className="flex flex-col items-center min-w-fit min-h-fit py-4 px-4 sm:px-6 lg:px-8 overflow-auto relative">
      <h1 className="px-4 py-2 text-left text-3xl font-bold text-gray-900 dark:text-gray-100">
        Current Movie Showings
      </h1>
      <div className="grid gap-6 mb-6 mt-8 w-full md:min-w-1/4">
        {!moviesLoading && moviesData && (
          <Table>
            <Table.Head>
              {tableHeaders.map((header) => (
                // if header is title, left align, else center align
                <Table.HeadCell key={header} className={header === 'Title' ? 'text-left' : 'text-center'}>
                  {header}
                </Table.HeadCell>
              ))}
              <Table.HeadCell>
                <span className="sr-only">Delete</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {allShowings.map((show: Showing) => (
                <>
                  {/* map each showingID from each movie */}
                  <Table.Row key={show.startTime}>
                    <Table.Cell key={show.showingID} className="text-left w-fit">
                      {show.title}
                    </Table.Cell>
                    <Table.Cell key={show.startTime}>{getShowingDateTime(show.startTime)}</Table.Cell>
                    <Table.Cell key={show.endTime}>{show.theaterID}</Table.Cell>
                    <Table.Cell className="pr-15 w-1">
                      <HiTrash
                        title="Delete Showing"
                        className="w-6 h-6 text-gray-400 hover:text-red-700 dark:hover:text-red-500 hover:cursor-pointer"
                        onClick={() => setShowDeleteModal({ ...showDeleteModal, [show.showingID]: true })}
                      />
                    </Table.Cell>
                  </Table.Row>
                  {showDeleteModal[show.showingID] ? (
                    <DeleteModal
                      show={showDeleteModal[show.showingID]}
                      prompt={'Are you sure you want to delete this showing?'}
                      onClick={() => handleDeleteShowing(show.showingID)}
                      onClose={() => setShowDeleteModal({ ...showDeleteModal, [show.showingID]: false })}
                    />
                  ) : null}
                </>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>
    </div>
  );
};

export default MovieShowingsTable;
