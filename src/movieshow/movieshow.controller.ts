import { Body, Controller, Post } from "@nestjs/common";
import { MovieShowDto } from "./dtos/movieshow.dto";
import { MovieShow } from "./interfaces/movieshow.interface";
import { MovieShowService } from "./movieshow.service";
@Controller("/movieshow")
export class MovieShowController {
  constructor(private movieShowService: MovieShowService) {}


  @Post("/add")
 addMovie(@Body() movieShowDto:MovieShowDto):Promise<MovieShow> {

    return this.addMovie(movieShowDto);
  }
}
