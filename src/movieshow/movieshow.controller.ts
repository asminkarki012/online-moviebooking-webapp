import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { CinemaDto } from "./dtos/cinema.dto";
import { MovieShowDto } from "./dtos/movieshow.dto";
import { Cinema } from "./interfaces/cinema.interface";
import { MovieShow } from "./interfaces/movieshow.interface";
import { MovieShowService } from "./movieshow.service";

@Controller("/api/movieshow")
export class MovieShowController {
  constructor(private movieShowService: MovieShowService) {}

  //adding Movie
  // @UseGuards(AccessTokenGuard, RolesGuard)
  // @Roles(Role.Admin)
  // @Post("/add")
  // addMovie(@Body() movieShowDto: MovieShowDto): Promise<MovieShow> {
  //   return this.movieShowService.addMovieShow(movieShowDto);
  // }

  // @UseGuards(AccessTokenGuard, RolesGuard)
  // @Roles(Role.Admin)
  @Delete("/delete/:id")
  deleteMovieShow(@Param("id") movieShowId): Promise<MovieShow | object> {
    return this.movieShowService.deleteMovieShow(movieShowId);
  }

  // @UseGuards(AccessTokenGuard, RolesGuard)
  // @Roles(Role.Admin)
  @Put("/add/:id")
  updateMovieShow(
    @Param("id") movieShowId,
    @Body() movieShowDto: MovieShowDto
  ): Promise<MovieShow> {
    return this.movieShowService.updateMovieShow(movieShowId, movieShowDto);
  }

  //adding cinema
  // @UseGuards(AccessTokenGuard, RolesGuard)
  // @Roles(Role.Admin)
  @Post("/cinema/add")
  addCinema(@Body() cinemaDto: CinemaDto): Promise<Cinema | HttpException> {
    return this.movieShowService.addCinema(cinemaDto);
  }


  //adding movie by search using api
  // @UseGuards(AccessTokenGuard, RolesGuard)
  // @Roles(Role.Admin)
  @Post("/movieadd/:title")
    addMovieBySearch(@Param("title") title){
      try{
      return this.movieShowService.addMoviesBySearch(title);
      }catch{

        return new HttpException(
          "Something Went Wrong",
          HttpStatus.BAD_REQUEST
        );
      }
    }
}
