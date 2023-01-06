import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BookingDto } from "./dtos/booking.dto";
import { Booking, BookingDocument } from "./schemas/booking.schemas";
import { v4 as uuidv4 } from "uuid";
import { MovieShowService } from "src/movieshow/movieshow.service";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { MailerService } from "@nestjs-modules/mailer";
import { SendTicketDto } from "./dtos/sendticket.dto";
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
  async generateTicketPdf(populatedData: any) {
    console.log("generateTicketPDF fucntion");
    console.log(populatedData);

    const qrFileName = `qrCodeImage${uuidv4()}`;
    const pdfFileName = `${populatedData._id}`;
    const bookingId = JSON.stringify(populatedData.movieShowId);
    await qr.toFile(
      `./qrcode/${qrFileName}.png`,
      bookingId,
      function (code: any, error: any) {
        if (error) return console.log(error);

        const doc = new PDFDocument();

        // Saving the pdf file in root directory.
        doc.pipe(
          fs.createWriteStream(`./ticketpdf/${pdfFileName}.pdf`)
          // to upload pdf ticket url in database
        );
        doc.image("ticketheader.png", {
          fit: [500, 500],
          align: "center",
          valign: "top",
        });

        doc.moveDown();
        doc.fontSize(24).text(`Entrance Pass`, {
          width: 410,
          align: "center",
        });

        doc.moveDown();
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

    // const {email} = JSON.stringify(populatedData.userId);

    const ticketPdfUrl = await this.cloudinary.uploadPdfTicketInCloudinary(
      populatedData._id
    );
    console.log(ticketPdfUrl);
    // ticketPdfUrl.then(function(result) { //   return result:
    // })
    // const result = await v2.uploader.upload(`./ticketpdf/${pdfFileName}`);
    await this.bookingModel.findByIdAndUpdate(populatedData._id, {
      $set: { ticketUrl: ticketPdfUrl },
    });
    console.log(populatedData.userId);
    return await this.movieShowService.sendTicketMail(
      populatedData.userId,
      ticketPdfUrl
    );

    // await this.sendTicketMail(populatedData.userId.email, ticketPdfUrl);
  }
}

//    async uploadTicketPdf(pdfFileName:string,bookingId:string,email:string):Promise<void>{
//     console.log("upload pdf");
//    const ticketPdfUrl = await this.cloudinary.uploadPdfTicketInCloudinary(pdfFileName);
//    console.log(ticketPdfUrl);
//  await  this.movieShowService.updateTicketUrl(ticketPdfUrl,bookingId,email);
//     // ticketPdfUrl.then(function(result) { //   return result:
//     // })
//     // const result = await v2.uploader.upload(`./ticketpdf/${pdfFileName}`);
//   }
// }

//  uploadTicketPdf(pdfFileName:string){
// const ticketPdf = await this.cloudinary.uploadPdf(file);
// console.log(productPic);
// const addProfilePicUrl = await this.productModel.findByIdAndUpdate(
//   { _id: id, $set: { profilepic: productPic.url } },
//   { new: true }
// );
// console.log(typeof(productPic.url));
