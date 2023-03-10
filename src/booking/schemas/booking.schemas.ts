import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypeOptions, SchemaTypes } from "mongoose";

export type BookingDocument = Booking & Document;

@Schema({
  timestamps: true,
})
export class Booking {
  //to book multiple MovieShow using same userId for future update
  @Prop({ type: SchemaTypes.ObjectId, ref: "MovieShow" })
  movieShowId: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: "User" })
  userId: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: "Cinema" })
  cinemaId: string;

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
