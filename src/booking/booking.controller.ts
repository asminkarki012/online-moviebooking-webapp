import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AccessTokenGuard } from "src/auth/accessToken.guard";
import { Role } from "src/auth/role.enum";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { MovieShowService } from "src/movieshow/movieshow.service";
import { BookingService } from "./booking.service";
import { BookingDto } from "./dtos/booking.dto";
import { SendTicketDto } from "./dtos/sendticket.dto";
import { Booking } from "./schemas/booking.schemas";

@Controller("/api/booking")
export class BookingController {
  constructor(
    private movieShowService: MovieShowService,
    private bookingService: BookingService
  ) {}

  @Post("/add")
  bookingSeat(@Body() bookingDto: BookingDto) {
    return this.movieShowService.bookingSeat(bookingDto);
  }

  // @UseGuards(AccessTokenGuard, RolesGuard)
  // @Roles(Role.Admin)
  @Post("/sendticket/:id")
  sendTicketLink(@Param("bookindId") bookingId) {
    return this.bookingService.uploadTicketPdf(bookingId);
  }

  // @UseGuards(AccessTokenGuard, RolesGuard)
  // @Roles(Role.Admin)
  @Delete("/delete/:id")
  deleteBookingById(@Param("id") bookingId) {
    return this.bookingService.deleteBookingById(bookingId);
  }

  @Get("/find/:id")
  findById(@Param("id") bookingId) {
    return this.bookingService.findById(bookingId);
  }

  // @UseGuards(AccessTokenGuard, RolesGuard)
  // @Roles(Role.Admin)
  @Post("/sendticket/:id")
  updateBookingById(
    @Param("bookingId") bookingId,
    @Body() bookingDto: BookingDto
  ) {
    return this.bookingService.updateBookingById(bookingId, bookingDto);
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
