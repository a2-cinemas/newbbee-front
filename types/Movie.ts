import Showing from './Showing';

type Movie = {
  movieID?: number;
  title: string;
  director: string;
  producer: string;
  category: string;
  Cast: string;
  synopsis: string;
  rating: string;
  releaseDate: string;
  trailer: string;
  imageRef: string;
  nowShowing?: boolean;
  showings?: Showing[];
};

export default Movie;
