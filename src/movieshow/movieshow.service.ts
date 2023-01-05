import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuthService } from "src/auth/auth.service";
import { BookingService } from "src/booking/booking.service";
import { BookingDto } from "src/booking/dtos/booking.dto";
import { Booking, BookingDocument } from "src/booking/schemas/booking.schemas";
import { CinemaDto } from "./dtos/cinema.dto";
import { MovieShowDto } from "./dtos/movieshow.dto";
import { Cinema } from "./interfaces/cinema.interface";
import { MovieShow } from "./interfaces/movieshow.interface";
import { CinemaDocument } from "./schemas/cinema.schemas";
import { MovieShowDocument } from "./schemas/movieshow.schemas";

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

  async findAll(): Promise<MovieShow[]> {
    console.log("findAll function");
    return await this.movieShowModel.find();
  }

  async findById(id: string): Promise<MovieShow> {
    console.log("findOne function");
    const movieShow = await this.movieShowModel.findById({ id: id });
    return movieShow;
  }

  async updateMovieShow(id: string, movieShow: MovieShow): Promise<MovieShow> {
    const updateMovieShow = await this.movieShowModel.findByIdAndUpdate(
      { id: id },
      {
        $set: movieShow,
      },
      { new: true }
    );
    return updateMovieShow;
  }

  async deleteMovieShow(id: string): Promise<MovieShow> {
    return await this.movieShowModel.findByIdAndDelete({ id: id });
  }

  async addCinema(cinemaDto: CinemaDto): Promise<Cinema> {
    const newCinema = new this.cinemaModel(cinemaDto);
    return await newCinema.save();
  }

  // update sold status of seat in db
  async bookingSeat(
    bookingDto: BookingDto
  ): Promise<Booking | NotFoundException> {
    console.log("bookingSeat in movieShowService Running");
    const movieShow = await this.movieShowModel.findById(
      bookingDto.movieShowId
    );
    const user = await this.authService.findById(bookingDto.userId);
    const cinema = await this.cinemaModel.findById(movieShow.cinemaId);
    if (!movieShow && !user && !cinema) {
      return new NotFoundException();
    }
    // const newhashedPass = await bcrypt.hash(confirmpassword, 10);
    let availableSeat = [];
    availableSeat = cinema.seatInfo;
    for (let i in availableSeat) {
      const selectedSeat = availableSeat[i].seatName.includes(
        bookingDto.seatName[i]
      );
      if (selectedSeat) {
        availableSeat[i].sold = true;
      }
    }
    bookingDto.totalPrice = cinema.ticketRate * bookingDto.seatName.length;

    const updateSeatStatus = await this.cinemaModel.findByIdAndUpdate(
      movieShow.cinemaId,
      { $set: { seatInfo: availableSeat } },
      { new: true }
    );
    const newBooking = new this.bookingModel(bookingDto);
    const populatedData = await newBooking
      .save()
      .then((newBooking) =>
        newBooking.populate(
          "userId movieShowId cinemaId",
          "email movieTitle movieShowTime movieShowDate cinemaName cinemaLocation screen"
        )
      );

    //settingup mail to send populated and also include a qr code in html when sending mail
    this.bookingService.generateTicketPdf(populatedData);

    return populatedData;
  }

  //send ticket link in email
  // async sendTicketMail(recepient: string): Promise<any> {
  //   console.log("authservice mailer function");
  //   // const hashedOtp

  //   await this.mailService.sendMail({
  //     to: recepient,
  //     from: "Testingnoreply@gmail.com",
  //     subject: "OTP",
  //     html: `Your OTP code is <b>${otp}</b> \n expires in 2 minutes`,
  //   });

  //   return this.addOtp(recepient, otp);
  // }
}
