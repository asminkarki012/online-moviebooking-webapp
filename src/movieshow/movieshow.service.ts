import { MailerService } from "@nestjs-modules/mailer";
import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { v2 } from "cloudinary";
import { Model, Schema, SchemaTypeOptions } from "mongoose";
import { AuthService } from "src/auth/auth.service";
import { User } from "src/auth/schemas/user.schema";
import { BookingService } from "src/booking/booking.service";
import { BookingDto } from "src/booking/dtos/booking.dto";
import { Booking, BookingDocument } from "src/booking/schemas/booking.schemas";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { configVar } from "src/config";
import { CinemaDto } from "./dtos/cinema.dto";
import { MovieShowDto } from "./dtos/movieshow.dto";
import { Cinema } from "./interfaces/cinema.interface";
import { MovieShow } from "./interfaces/movieshow.interface";
import { CinemaDocument } from "./schemas/cinema.schemas";
import { MovieShowDocument } from "./schemas/movieshow.schemas";
import axios, { all } from "axios";
import * as moment from "moment";

@Injectable()
export class MovieShowService {
  constructor(
    @InjectModel("MovieShow")
    private readonly movieShowModel: Model<MovieShowDocument>,
    @InjectModel("Booking")
    private readonly bookingModel: Model<BookingDocument>,
    @InjectModel("Cinema")
    private readonly cinemaModel: Model<CinemaDocument>,
    private authService: AuthService,
    private mailService: MailerService,
    private bookingService: BookingService
  ) {}

  async addMovieShow(movieShowDto: MovieShowDto): Promise<MovieShow | any> {
    const cinema = await this.cinemaModel.findById(movieShowDto.cinemaId);
    const user = await this.authService.findById(movieShowDto.userId);
    if (!cinema || !user) {
      return new NotFoundException();
    }
    const newMovieShow = new this.movieShowModel(movieShowDto);
    return await newMovieShow.save();
  }

  async addMoviesBySearch(title: string): Promise<Object> {
    console.log(title);
    const options = {
      method: "GET",
      url: "https://1mdb-data-searching.p.rapidapi.com/om",
      params: { t: title },
      headers: {
        "X-RapidAPI-Key": "f56af64348mshedf739e8623badbp175538jsn84157ca13bcc",
        "X-RapidAPI-Host": "1mdb-data-searching.p.rapidapi.com",
      },
    };

    const movieInfo = await axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        return response.data;
      })
      .catch(function (error) {
        console.error(error);
      });

    const movie = {
      movieImageUrl: movieInfo.Poster,
      movieTitle: movieInfo.Title,
      movieReleaseDate: movieInfo.Released,
      movieDescription: movieInfo.Plot,
      movieRating: movieInfo.imdbRating,
    };
    const newMovieShow = new this.movieShowModel(movie);
    await newMovieShow.save();
    return {
      success: true,
      message: "Movie Added Successfully",
      data: newMovieShow,
    };
  }

  async findAll(): Promise<MovieShow[]> {
    console.log("findAll function");
    return await this.movieShowModel.find();
  }

  async findById(id: string): Promise<any> {
    console.log("findOne function");
    const movieShow = await this.movieShowModel.findById({ id: id });
    return movieShow;
  }

  async updateMovieShow(id: string, movieShow: MovieShow): Promise<any> {
    const updateMovieShow = await this.movieShowModel.findByIdAndUpdate(
      id,
      {
        $set: movieShow,
      },
      { new: true }
    );
    return {
      success: true,
      message: "Movie Updated Successfully",
      data: updateMovieShow,
    };
  }

  async deleteMovieShow(id: string): Promise<MovieShow | object> {
    return await this.movieShowModel.findByIdAndDelete(id);
  }

  async addCinema(cinemaDto: CinemaDto): Promise<Cinema | HttpException> {
    if (cinemaDto.seatInfo.length !== cinemaDto.screen[0].numOfSeat) {
      return new HttpException(
        "Cinema Seat Size Doesnot Match",
        HttpStatus.BAD_REQUEST
      );
    }
    const newCinema = new this.cinemaModel(cinemaDto);
    return await newCinema.save();
  }

  // update sold status of seat in db
  async bookingSeat(
    bookingDto: BookingDto
  ): Promise<Booking | NotFoundException | HttpException | Object> {
    console.log("bookingSeat in movieShowService Running");

    //using populate to query require data of userId and cinemaId
    const populatedMovieShowData = await this.movieShowModel
      .findById(bookingDto.movieShowId)
      .populate(
        "userId cinemaId",
        "email movieTitle movieShowTime movieShowDate cinemaName cinemaLocation screen seatInfo ticketRate"
      );
    if (!populatedMovieShowData) {
      return new NotFoundException();
    }

    // console.log(typeof populatedMovieShowData.movieShowDate);
    // console.log(moment(populatedMovieShowData.movieShowTime, "hA").fromNow());

    const timeValid = moment(
      `
      ${populatedMovieShowData.movieShowDate} ${populatedMovieShowData.movieShowTime}`,
      "YYYY-MM-DD hA"
    ).fromNow();

    if (timeValid.includes("ago")) {
      return new HttpException(
        "Invalid Movie Show Time",
        HttpStatus.BAD_REQUEST
      );
    }

    // const newhashedPass = await bcrypt.hash(confirmpassword, 10);
    let allSeats = [];
    allSeats = populatedMovieShowData.cinemaId.seatInfo;

    //filtering only for seat which are not sold ie sold===false
    const allSeatsArray = [];
    let indexOfSeat = [];
    allSeats.forEach((seat) => allSeatsArray.push(seat.seatName));

    const availableSeat = allSeats.filter((seat) => seat.sold === false);
    const availableSeatArray = [];
    availableSeat.forEach((seat) => availableSeatArray.push(seat.seatName));

    for (let i = 0; i < bookingDto.seatName.length; i++) {
      const selectedSeat = availableSeatArray.includes(bookingDto.seatName[i]);

      if (selectedSeat) {
        indexOfSeat.push(
          allSeatsArray.findIndex((x) => x === bookingDto.seatName[i])
        );
      } else {
        return new HttpException(
          "Seat is not available",
          HttpStatus.BAD_REQUEST
        );
      }
    }
    console.log(populatedMovieShowData);
    indexOfSeat.forEach((i) => (allSeats[i].sold = true));

    bookingDto.totalPrice =
      populatedMovieShowData.cinemaId.ticketRate * bookingDto.seatName.length;

      console.log(typeof bookingDto.totalPrice)


    // const updateSeatStatus = await this.cinemaModel.findByIdAndUpdate(
    //   populatedMovieShowData.cinemaId,
    //   { $set: { seatInfo: allSeats } },
    //   { new: true }
    // );
    console.log(bookingDto);
    const newBooking = new this.bookingModel(bookingDto);
    const bookingPopulatedData = await newBooking.save();
    // .then((newBooking) =>
    //   newBooking.populate<{ userid: UserId }>(
    //     "userId movieShowId cinemaId",
    //     "email movieTitle movieShowTime movieShowDate cinemaName cinemaLocation screen"
    //   )
    // );

    return { success: true, message: "Booking Successfull", data: newBooking };
  }
}
