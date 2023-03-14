import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { AccessTokenGuard } from "src/auth/accessToken.guard";
import { Role } from "src/auth/role.enum";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { CinemaDto } from "./dtos/cinema.dto";
import { MovieShowDto } from "./dtos/movieshow.dto";
import { Cinema } from "./interfaces/cinema.interface";
import { MovieShow } from "./interfaces/movieshow.interface";
import { MovieShowService } from "./movieshow.service";

@Controller("/api/movieshow")
export class MovieShowController {
  constructor(private movieShowService: MovieShowService) {}

  //adding Movie
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post("/add")
  addMovie(@Body() movieShowDto: MovieShowDto): Promise<MovieShow> {
    return this.movieShowService.addMovieShow(movieShowDto);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete("/delete/:id")
  deleteMovieShowById(
    @Param("id") movieShowId
  ): Promise<object> | NotFoundException {
    try {
      return this.movieShowService.deleteMovieShowById(movieShowId);
    } catch (error) {
      return new NotFoundException(error);
    }
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put("/update/:id")
  updateMovieShow(
    @Param("id") movieShowId,
    @Body() movieShowDto: MovieShowDto
  ): Promise<MovieShow> | NotFoundException {
    try {
      return this.movieShowService.updateMovieShow(movieShowId, movieShowDto);
    } catch (error) {
      return new NotFoundException(error);
    }
  }

  //adding cinema
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post("/cinema/add")
  addCinema(@Body() cinemaDto: CinemaDto): Promise<Cinema | HttpException> {
    return this.movieShowService.addCinema(cinemaDto);
  }

  //adding movie by search using api
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post("/movieadd/:title")
  addMovieBySearch(@Param("title") title) {
    try {
      return this.movieShowService.addMoviesBySearch(title);
    } catch {
      return new HttpException("Something Went Wrong", HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete("/cinema/delete/:id")
  deleteCinemaById(@Param("id") cinemaId): Promise<object> | NotFoundException {
    try {
      return this.movieShowService.deleteCinemaById(cinemaId);
    } catch (error) {
      return new NotFoundException();
    }
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put("/delete/:id")
  UpdateCinemaById(
    @Param("id") cinemaId,
    @Body() cinemaDto: CinemaDto
  ): Promise<object> | NotFoundException {
    try {
      return this.movieShowService.updateCinemaById(cinemaId, cinemaDto);
    } catch (error) {
      return new NotFoundException();
    }
  }
}
