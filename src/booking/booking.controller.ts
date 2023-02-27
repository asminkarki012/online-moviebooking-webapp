import { Body, Controller, NotFoundException, Param, Post } from "@nestjs/common";
import { MovieShowService } from "src/movieshow/movieshow.service";
import { BookingService } from "./booking.service";
import { BookingDto } from "./dtos/booking.dto";
import { SendTicketDto } from "./dtos/sendticket.dto";
import { Booking } from "./schemas/booking.schemas";

@Controller("/booking")
export class BookingController {
  constructor(private movieShowService: MovieShowService,
    private bookingService:BookingService) {}

  @Post("/add")
  bookingSeat(@Body() bookingDto: BookingDto){


   return this.movieShowService.bookingSeat(bookingDto);
  }

  @Post("/sendticket/:id")
  uploadTicketPdf(@Param() bookingId){
    console.log(bookingId.id);
   return this.bookingService.uploadTicketPdf(bookingId.id);
  }

  // @Post("/add")
  // @UseInterceptors(AnyFileInterceptor("productpic"))
  // async addProduct(
  //   @Body() createProductDTO: CreateProductDTO,
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [
  //         new MaxFileSizeValidator({ maxSize: 250000 }), //250kb
  //         new FileTypeValidator({ fileType: ".pdf" }),
  //       ],
  //     })
  //   )
  //   file: Express.Multer.File
  // ) {
  //   // createProductDTO.productimageurl= this. 
  //   const product = await this.productService.addProduct(createProductDTO,file);
  //   return product;
  // }


}
