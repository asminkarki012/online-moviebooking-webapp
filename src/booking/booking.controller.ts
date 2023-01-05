import { Body, Controller, NotFoundException, Post } from "@nestjs/common";
import { MovieShowService } from "src/movieshow/movieshow.service";
import { BookingService } from "./booking.service";
import { BookingDto } from "./dtos/booking.dto";
import { Booking } from "./schemas/booking.schemas";

@Controller("/booking")
export class BookingController {
  constructor(private movieShowService: MovieShowService,
    private bookingService:BookingService) {}
  @Post("/add")
  bookingSeat(@Body() bookingDto: BookingDto){


   return this.movieShowService.bookingSeat(bookingDto);
  }
}
