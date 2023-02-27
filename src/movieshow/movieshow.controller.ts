import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AccessTokenGuard } from "src/auth/accessToken.guard";
import { Role } from "src/auth/role.enum";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { CinemaDto } from "./dtos/cinema.dto";
import { MovieShowDto } from "./dtos/movieshow.dto";
import { Cinema } from "./interfaces/cinema.interface";
import { MovieShow } from "./interfaces/movieshow.interface";
import { MovieShowService } from "./movieshow.service";

@Controller("/movieshow")
export class MovieShowController {
  constructor(private movieShowService: MovieShowService) {}

  //adding Movie
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post("/add")
  addMovie(@Body() movieShowDto: MovieShowDto): Promise<MovieShow> {
    return this.movieShowService.addMovieShow(movieShowDto);
  }

  //adding cinema
  @Post("/cinema/add")
  addCinema(@Body() cinemaDto: CinemaDto): Promise<Cinema> {
    return this.movieShowService.addCinema(cinemaDto);
  }


}
