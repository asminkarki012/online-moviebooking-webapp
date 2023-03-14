import { Module } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { BookingController } from "./booking.controller";
import { MovieShowModule } from "src/movieshow/movieshow.module";
import { MovieShowService } from "src/movieshow/movieshow.service";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";
import { MongooseModule } from "@nestjs/mongoose";
import { BookingSchema } from "./schemas/booking.schemas";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [
    MovieShowModule,
    CloudinaryModule,
    MongooseModule.forFeature([{ name: "Booking", schema: BookingSchema }]),AuthModule
  ],
  providers: [BookingService],
  controllers: [BookingController],
  exports: [BookingService],
})
export class BookingModule {}
