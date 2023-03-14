import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CinemaDocument = Cinema & Document;

@Schema({
  timestamps: true,
})
export class Cinema {
  @Prop({ type: String })
  cinemaName: string;

  @Prop({ type: String })
  cinemaLocation: string;

  @Prop({ type: Number })
  ticketRate: number;

  @Prop({ type: [Object] })
  screen: [{ screenName: { type: String },numOfSeat: { type: Number } }];

  //for cinema with multiple screen screen name and seat should be together
  // @Prop({ type: [Object] })
  // screen: [{ screenName: String; numOfSeat: Number,{seatName:{type:String,unique:true },sold:{type:Boolean}}}];

  @Prop({ type: [Object] })
  seatInfo: [
    { seatName: { type: String; unique: true },sold: { type: Boolean } }
  ];
}

export const CinemaSchema = SchemaFactory.createForClass(Cinema);
