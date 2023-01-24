import { Injectable } from "@nestjs/common";
// import toStream = require("buffer-to-stream");
import { UploadApiResponse, UploadApiErrorResponse, v2 } from "cloudinary";
@Injectable()
export class CloudinaryService {
  async uploadPdfTicketInCloudinary(
    pdfFileName: string
  ): Promise<UploadApiResponse | UploadApiErrorResponse | any> {
    console.log("cloudinary service working");
    console.log(`${pdfFileName}.pdf`);
    const result = await v2.uploader.upload(`./ticketpdf/${pdfFileName}.pdf`);
    return result.url;
    // return new Promise((resolve, reject) => {
    //   const upload = v2.uploader.upload()          // toStream(file.buffer).pipe(upload);
    // });
  }
}
