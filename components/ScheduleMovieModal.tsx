import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Modal, Label, TextInput, Select, Button } from 'flowbite-react';
import Showing from '../types/Showing';
import Movie from '../types/Movie';

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

const CREATE_SHOWING_MUTATION = gql`
  mutation createShowing($showingInput: CreateShowingInput!) {
    createShowing(createShowingInput: $showingInput) {
      movieID
      movie {
        title
      }
      startTime
      endTime
      available
      theaterID
    }
  }
`;

const ShowingModal = ({ show, onClose, movie }) => {
  const [showing, setShowing] = useState({
    movieID: movie.movieID,
    theaterID: 0,
    available: true,
  });

  const [showDate, setShowDate] = useState('');
  const [startTime, setStartTime] = useState('8:00 AM');
  const [endTime, setEndTime] = useState('10:00 AM');

  // query to get all theaters
  const { data, loading, error } = useQuery(GET_THEATERS_QUERY);
  const { data: showingData, loading: showingLoading, error: showingError } = useQuery(GET_SHOWINGS_QUERY);

  // mutation to update showing
  const [createShowing] = useMutation(CREATE_SHOWING_MUTATION);

  if (loading || showingLoading) return <p>Loading...</p>;
  if (error || showingError) return <p>Error :(</p>;

  //   const handleShowingInput = (field, value) => {
  //     setShowing({ ...showing, [field]: value });
  //   };

  // take the valid display times and convert them to ISO time format
  const makeValidISOTimes = (date: string) => {
    const validTimes = [];
    for (let i = 8; i <= 22; i += 2) {
      if (i < 10) {
        validTimes.push(`${date}T0${i}:00:00.000Z`);
      } else {
        validTimes.push(`${date}T${i}:00:00.000Z`);
      }
    }
    return validTimes;
  };

  // check if any showing is already scheduled on certain date and time and remove those times from the valid times
  const checkValidTimes = (date: string) => {
    const validTimes = makeValidISOTimes(date);
    const showings = showingData.getAllShowings;
    const showingsOnDate = showings.filter((showing) => showing.date === date);
    showingsOnDate.forEach((showing) => {
      const showingTime = startTime;
      const showingIndex = validTimes.indexOf(showingTime);
      validTimes.splice(showingIndex, 1);
    });
    return validTimes;
  };

  const availableTheaters = data.theaters.filter((theater) => theater.available === true);

  // convert 12 hour time to ISO 8601 format
  const convertTime = (time: string) => {
    let newHour = '';
    const [hour, minute] = time.split(':');
    if (hour < '10') {
      newHour = `0${hour}`;
    } else {
      newHour = hour;
      if (minute !== undefined) {
        const [minuteNum, ampm] = minute.split(' ');
        if (ampm === 'PM' && newHour !== '12') {
          return `${parseInt(newHour) + 12}:${minuteNum}`;
        } else {
          return `${newHour}:${minuteNum}`;
        }
      }
    }
  };

  // handle user input for start time
  const handleShowingInput = (name: string, value: any) => {
    if (name === 'theaterID') {
      setShowing({ ...showing, [name]: parseInt(value) });
    } else if (name === 'date') {
      setShowDate(value);
    } else {
      // set end time to 2 hours after start time start time format in 24 hour time HH:MM
      const time = convertTime(value);
      setStartTime(time);
      const [hour, minute] = time.split(':');

      const endHour = parseInt(hour) + 2;
      const endMinute = minute;
      // if end hour is greater than 24, subtract 24 from end hour
      if (endHour > 24) {
        setEndTime(`${endHour - 24}:${endMinute}`);
      } else {
        setEndTime(`${endHour}:${endMinute}`);
      }
    }

    console.log(startTime /* showing.endTime */);
  };

  const handleCreateShowing = async () => {
    const showingInput = {
      movieID: showing.movieID,
      startTime: `${showDate} ${convertTime(startTime)}`,
      endTime: `${showDate} ${convertTime(endTime)}`,
      theaterID: showing.theaterID,
      available: showing.available,
    };
    console.log(showingInput);
    await createShowing({
      variables: {
        showingInput,
      },
      refetchQueries: [{ query: GET_MOVIES_QUERY }, { query: GET_SHOWINGS_QUERY }],
      onError: (err) => console.log(err),
    });
    setEndTime('');
    setStartTime('');
    setShowDate('');
    setShowing({
      movieID: movie.movieID,
      theaterID: 0,
      available: true,
    });

    onClose();
  };

  // makes vaild times for the start time select that are 2 hours apart and in 12 hour time and start at 8am to 10pm
  // parse 2022-11-26T20:00:00.000Z to 2022-11-26
  const makeValidDisplayTimes = () => {
    const validTimes = [];
    for (let i = 8; i <= 22; i += 2) {
      if (i < 12) {
        validTimes.push(`${i}:00 AM`);
      } else if (i === 12) {
        validTimes.push(`${i}:00 PM`);
      } else {
        validTimes.push(`${i - 12}:00 PM`);
      }
    }
    return validTimes;
  };

  // convert ISO 8601 time to 12 hour time
  const convertTo12HourTime = (time: string) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    if (hourNum < 12) {
      return `${hourNum}:00 AM`;
    } else if (hourNum === 12) {
      return `${hourNum}:00 PM`;
    } else {
      return `${hourNum - 12}:00 PM`;
    }
  };

  return (
    <Modal show={show} onClose={onClose} size="xl" popup>
      <Modal.Header />
      <Modal.Body>
        <form className="grid gap-4 w-full pt-4 pb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Create Showing for <i>{movie.title}</i>
          </h1>
          <div>
            {/* Theater */}
            <div className="mb-2 block">
              <Label htmlFor="theater" value="Theater" />
            </div>
            <Select
              id="theater"
              sizing="md"
              value={data.theaters.theaterID}
              onChange={(e) => handleShowingInput('theaterID', e.target.value)}
              required
            >
              {/* display each theater if its available */}
              {availableTheaters.map((theater) => (
                <option key={theater.theaterID} value={theater.theaterID}>
                  {theater.theaterID}
                </option>
              ))}
            </Select>
          </div>
          <div>
            {/* Date */}
            <div className="mb-2 block">
              <Label htmlFor="date" value="Date" />
            </div>
            <TextInput
              id="date"
              type="date"
              value={showDate}
              onChange={(e) => handleShowingInput('date', e.target.value)}
              required
            />
          </div>
          <div>
            {/* Time */}
            <div className="mb-2 block">
              <Label htmlFor="time" value="Time" />
            </div>
            <Select
              id="time"
              sizing="md"
              value={convertTo12HourTime(startTime)}
              onChange={(e) => handleShowingInput('startTime', e.target.value)}
              required
            >
              {/* Use makeValidTimes for the options */}
              {makeValidDisplayTimes().map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </Select>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleCreateShowing}>Create Showing</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShowingModal;
