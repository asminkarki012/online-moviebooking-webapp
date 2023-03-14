import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BookingDto } from "./dtos/booking.dto";
import { Booking, BookingDocument } from "./schemas/booking.schemas";
import { v4 as uuidv4 } from "uuid";
import { MovieShowService } from "src/movieshow/movieshow.service";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { MailerService } from "@nestjs-modules/mailer";
const PDFDocument = require("pdfkit");
const fs = require("fs");
const qr = require("qrcode");

@Injectable()
export class BookingService {
  constructor(
    private mailService: MailerService,
    @InjectModel("Booking")
    private readonly bookingModel: Model<BookingDocument>,
    //to remove circular dependency forwardRef is used in app module BookingModule is imported first and MovieShowModule is imported in bookingmodule
    @Inject(forwardRef(() => MovieShowService))
    private movieShowService: MovieShowService,
    private cloudinary: CloudinaryService
  ) {}
  async generateTicketPdf(bookingId:string) {
    console.log("generateTicketPDF fucntion");

    const populatedData = await this.bookingModel
      .findById(bookingId)
      .populate(
        "userId movieShowId cinemaId",
        "movieTitle movieShowTime movieShowDate cinemaName cinemaLocation screen"
      );

    const qrFileName = `qrCodeImage${uuidv4()}`;
    const pdfFileName = `${populatedData._id}`;
    const qrData = JSON.stringify(populatedData.movieShowId);
    await qr.toFile(
      `./qrcode/${qrFileName}.png`,
      qrData,
      function (code: any, error: any) {
        if (error) return console.log(error);

        const doc = new PDFDocument();

        // Saving the pdf file in root directory.
        doc.pipe(
          fs.createWriteStream(`./ticketpdf/${pdfFileName}.pdf`)
        );


        doc.moveUp();
        doc.image("ticketheader.png", {
          fit: [241, 72],
          align: "center",
          valign: "top",
        });

        doc.moveDown();
        doc.fontSize(24).text(`Entrance Pass`, {
          width: 410,
          align: "center",
        });

        // doc.moveDown();
        doc.fontSize(18).text(`${populatedData.cinemaId.cinemaName}`, {
          width: 410,
          align: "center",
        });

        doc.fontSize(18).text(`${populatedData.cinemaId.cinemaLocation}`, {
          width: 410,
          align: "center",
        });

        doc.moveDown();
        doc.fontSize(18).text(`Seatinfo: ${populatedData.seatName}`, {
          width: 410,
          align: "right",
        });

        doc.fontSize(18).text(`TicketPrice: ${populatedData.totalPrice}`, {
          width: 410,
          align: "right",
        });

        // for qrcode in ticket
        doc.moveDown();
        doc.image(`./qrcode/${qrFileName}.png`, {
          fit: [100, 100],
          align: "left",
          valign: "bottom",
        });

        doc.moveDown();
        doc
          .fontSize(18)
          .text(`${populatedData.cinemaId.screen[0].screenName}`, {
            width: 410,
            align: "left",
          });

        doc.moveDown();
        doc.fontSize(18).text(`${populatedData.movieShowId.movieTitle}`, {
          width: 410,
          align: "left",
        });

        doc.moveDown();
        doc
          .fontSize(18)
          .text(
            `${populatedData.movieShowId.movieShowDate} ${populatedData.movieShowId.movieShowTime}`,
            {
              width: 410,
              align: "left",
            }
          );

        doc.moveDown();
        doc.fontSize(30).text(`Enjoy Your Movie`, {
          width: 410,
          align: "center",
        });

        // doc.fontSize(27).text(``, 100, 100);

        doc.end();
        console.log("writing file completed");
      }
    );
  }

  async uploadTicketPdf(bookingId: string): Promise<object> {
    console.log("upload pdf");
    console.log(typeof bookingId);
    const populatedData = await this.bookingModel
      .findById(bookingId)
      .populate(
        "userId movieShowId cinemaId",
        "email movieTitle movieShowTime movieShowDate cinemaName cinemaLocation screen"
      );

    const ticketPdfUrl = await this.cloudinary.uploadPdfTicketInCloudinary(
      populatedData._id
    );

    await this.bookingModel.findByIdAndUpdate(populatedData._id, {
      $set: { ticketUrl: ticketPdfUrl },
    });
    return await this.sendTicketMail(populatedData);
  }

  async findById(id: string){
    return await this.bookingModel.findById(id);
    // return booking;
  }


  async findAll():Promise<object>{
   const getAllbooking=await this.bookingModel.find();
    return {success:true,message:"All Booking Data Fetched",data:getAllbooking};
  }

  async deleteBookingById(id: string): Promise<object> {
    const deletedBooking = await this.bookingModel.findByIdAndDelete(id);
    return {
      success: true,
      message: "Booking Deleted Successfully",
      data: deletedBooking,
    };
  }

  async updateBookingById(id: string, bookingDto: BookingDto): Promise<object> {
    const updatedBooking = await this.bookingModel.findByIdAndUpdate(
      id,
      {
        $set: bookingDto,
      },
      { new: true }
    );
    return {
      success: true,
      message: "Booking Updated Successfully",
      data: updatedBooking,
    };
  }

  async updatePaymentStatus(bookingId: string, payId: string): Promise<void> {
    await this.bookingModel.findByIdAndUpdate(bookingId, {
      $set: { paid: true, payId: payId },
    });
  }

  //send ticket link in email
  async sendTicketMail(populatedBookingData: any): Promise<object> {
    console.log("sendTicketMail function");
    if (populatedBookingData.paid !== true) {
      return { success: false, message: "Please Pay First" };
    }
    const recepient = populatedBookingData.userId.email;

    await this.mailService.sendMail({
      to: recepient,
      from: "noreply@movieticketmail <Photosharing2078@gmail.com>",
      subject: "Ticket Sales Confirmation",
      html: `<div>
      <p>Dear	${recepient},</p>
      <p>You have successfully purchased your tickets at QFX Cinemas. 
        The details of your
    transaction are as follows:</p>
      <ul style="list-style-type:none;">
    <li>Theatre:	${populatedBookingData.cinemaId.cinemaName}</li>
    <li>Auditorium:	${populatedBookingData.cinemaId.screen[0].screenName}</li>
    <li>Movie Name:	${populatedBookingData.movieShowId.movieTitle}</li>
    <li>Show Date/Time:	${populatedBookingData.movieShowId.movieShowDate} ${populatedBookingData.movieShowId.movieShowTime}</li>
    <li>No. of Tickets:	${populatedBookingData.seatName.length}</li>
    <li>Seat Details:	${populatedBookingData.seatName}</li>
    <li>Ticket Price:	${populatedBookingData.totalPrice}</li>
    <li>Best Regards,</li>
    <li>cineapp</li>
     </ul>
    </div>
      <h4><a href=${populatedBookingData.ticketUrl}>Your Ticket Link Here</a></h4>`,
    });

    return {
      success: true,
      message: "Ticket Send Successfully",
      data: populatedBookingData,
    };
  }
}
