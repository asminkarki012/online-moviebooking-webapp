import { Types } from 'mongoose';

export interface MovieShow{

  id?: Types.ObjectId;
  movieTitle: string;

  movieDescription: string;

  movieRating?: number;

  //here movieimage link is stored
  movieImage?: string;

  movieShowTime: string;

  movieShowDate: string;

  cinemaId?: string;

  userId?: string;

}