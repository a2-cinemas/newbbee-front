import Theater from './Theater';

type Showing = {
  showingID: number;
  movieID?: number;
  startTime: string;
  endTime?: string;
  available?: boolean;
  theaterID?: number;
  theater?: Theater;
  title?: string;
};

export default Showing;
