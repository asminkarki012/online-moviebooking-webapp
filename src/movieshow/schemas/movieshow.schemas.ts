import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes } from "mongoose";

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
  movieImage: string;

  @Prop({ type:String})
  movieShowTime: string;

  @Prop({ type:String})
  movieShowDate: string;

  @Prop({type:String})
  movieReleaseDate:string;

  @Prop({ type: SchemaTypes.ObjectId, ref: "Cinema" })
  cinemaId: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: "User" })
  userId: string;


}

export const MovieShowSchema = SchemaFactory.createForClass(MovieShow);
