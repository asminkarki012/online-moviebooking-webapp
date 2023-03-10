import { Module } from "@nestjs/common";
import { MovieShowService } from "./movieshow.service";
import { MovieShowController } from "./movieshow.controller";
import { MovieShowSchema } from "./schemas/movieshow.schemas";
import { CinemaSchema } from "./schemas/cinema.schemas";
import { MongooseModule } from "@nestjs/mongoose";
import { BookingSchema } from "src/booking/schemas/booking.schemas";
import { BookingService } from "src/booking/booking.service";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "MovieShow", schema: MovieShowSchema }]),
    MongooseModule.forFeature([{ name: "Booking", schema: BookingSchema }]),
    MongooseModule.forFeature([{ name: "Cinema", schema: CinemaSchema }]),
    CloudinaryModule,AuthModule
  ],
  providers: [MovieShowService,BookingService],
  controllers: [MovieShowController],
  exports:[MovieShowService]
})
export class MovieShowModule {}
