import { MailerService } from "@nestjs-modules/mailer";
import {
  forwardRef,
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
import { UserId } from "./interfaces/populateddata.interface";
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
    private bookingService: BookingService,
    private cloudinary: CloudinaryService
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

  async findById(id: string): Promise<any> {
    console.log("findOne function");
    const movieShow = await this.movieShowModel.findById({ id: id });
    return movieShow;
  }

  async updateMovieShow(id: string, movieShow: MovieShow): Promise<any> {
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
        newBooking.populate<{ userid: UserId }>(
          "userId movieShowId cinemaId",
          "email movieTitle movieShowTime movieShowDate cinemaName cinemaLocation screen"
        )
      );

    await this.bookingService.generateTicketPdf(populatedData);

    return populatedData;
  }

  //send ticket link in email
  async sendTicketMail(
    userId: string,
    ticketPdfUrl: Promise<any>
  ): Promise<object> {
    
    console.log("sendTicketMail function");
    // const hashedOtp
    const user = await this.authService.findById(userId);
    const recepient = user.email;

    await this.mailService.sendMail({
      to: recepient,
      from: "noreplyticketconfirmation",
      subject: "Ticket Sales Confirmation",
      html: `<a href=${ticketPdfUrl}>Your Ticket Link Here</a>`,
    });

    return { success: true, message: "TicketSend Successfully" };
  }
}
