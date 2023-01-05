import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BookingDto } from "./dtos/booking.dto";
import { Booking, BookingDocument } from "./schemas/booking.schemas";
const PDFDocument = require("pdfkit");
const fs = require("fs");
const qr = require("qrcode");

@Injectable()
export class BookingService {
  constructor(
    // @InjectModel("Booking")
    // private readonly bookingModel: Model<BookingDocument>
  ) {}
  async generateTicketPdf(populatedData: any) {
    console.log("generateTicketPDF fucntion");
    console.log(populatedData);

    const qrFileName = `qrCodeImage${Math.round(Math.random() * 565)}`;
    const bookingId = JSON.stringify(populatedData._id);
    qr.toFile(
      `./qrcode/${qrFileName}.png`,
      bookingId,
      function (code: any, error: any) {
        if (error) return console.log(error);

        const doc = new PDFDocument();

        // Saving the pdf file in root directory.
        doc.pipe(
          fs.createWriteStream(
            `./ticketpdf/ticketfor_${
              populatedData.movieShowId.movieTitle
            }_${Math.round((Date.now() / 1000) * 60 * 60 * 60)}.pdf`
          )
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
        doc.image(`./qrcode/${qrFileName}`, {
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
      }
    );
  }


}
