import Showing from './Showing';

type Theater = {
  theaterID: number;
  capacity?: number;
  available?: boolean;
  showings?: Showing[];
};

export default Theater;
