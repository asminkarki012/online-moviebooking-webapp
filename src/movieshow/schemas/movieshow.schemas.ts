import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document,SchemaTypes } from "mongoose";
import { User } from "src/auth/schemas/user.schema";
import { Cinema } from "./cinema.schemas";

export type MovieShowDocument = MovieShow & Document;

@Schema({
  timestamps: true,
})
export class MovieShow {
  @Prop({ type: String })
  movieTitle: string;

  @Prop({ type: String })
  movieDescription: string;

  @Prop({ type: Number })
  movieRating: number;

  //here movieimage link is stored
  @Prop({ type: String })
  movieImageUrl: string;

  @Prop({ type:String})
  movieShowTime: string;

  @Prop({ type:String})
  movieShowDate: string;

  @Prop({type:String})
  movieReleaseDate:string;

  @Prop({ type: SchemaTypes.ObjectId, ref: "Cinema" })
  cinemaId:Cinema;

  @Prop({ type: SchemaTypes.ObjectId, ref: "User" })
  userId: User;


}

export const MovieShowSchema = SchemaFactory.createForClass(MovieShow);
