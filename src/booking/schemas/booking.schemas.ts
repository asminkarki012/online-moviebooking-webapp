import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypeOptions, SchemaTypes } from "mongoose";
import { User } from "src/auth/schemas/user.schema";
import { Cinema } from "src/movieshow/schemas/cinema.schemas";
import { MovieShow } from "src/movieshow/schemas/movieshow.schemas";

export type BookingDocument = Booking & Document;

@Schema({
  timestamps: true,
})
export class Booking {
  //to book multiple MovieShow using same userId for future update
  @Prop({ type: SchemaTypes.ObjectId, ref: "MovieShow" })
  movieShowId: MovieShow;

  @Prop({ type: SchemaTypes.ObjectId, ref: "User" })
  userId: User;

  @Prop({ type: SchemaTypes.ObjectId, ref: "Cinema" })
  cinemaId: Cinema;

  @Prop({type:Boolean,default:false})
  paid:boolean;

  @Prop({type:String})
  payId:string;

  @Prop({ type: [String] })
  seatName: [string];

  @Prop({type:Number})
  totalPrice:number;

  @Prop({ type: String })
  ticketUrl: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
