import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CinemaDocument = Cinema & Document;

@Schema({
 timestamps:true 
})
export class Cinema {
  @Prop({ type:String })
  cinemaName: string;

  @Prop({ type:String })
  cinemaLocation: string;

  @Prop({type:[Object]})
  screen:[{screenName:String,screenSeatName:String,numOfSeat:Number}]
}

export const CinemaSchema = SchemaFactory.createForClass(Cinema);

