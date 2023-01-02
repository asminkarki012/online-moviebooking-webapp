import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MovieShowDto } from "./dtos/movieshow.dto";
import { MovieShow } from "./interfaces/movieshow.interface";
import { MovieShowDocument } from "./schemas/movieshow.schemas";
@Injectable()
export class MovieShowService {
  constructor(
    @InjectModel("MovieShow")
    private readonly movieShowModel: Model<MovieShowDocument>
  ) {}

  async addMovieShow(movieShowDto: MovieShowDto): Promise<MovieShow> {
    const newMovieShow = new this.movieShowModel(movieShowDto);
    return await newMovieShow.save();
  }

  async findAll(): Promise<MovieShow[]> {
    console.log("findAll function");
    return await this.movieShowModel.find();
  }

  async findOne(id: string): Promise<MovieShow> {
    console.log("findOne function");
    const movieShow = await this.movieShowModel.findById({ id: id });
    return movieShow;
  }

  async updateMovieShow(id: string, movieShow: MovieShow): Promise<MovieShow> {
    const updateMovieShow = await this.movieShowModel.findByIdAndUpdate(
      { id: id },
      {
        $set: movieShow,
      },
      { new: true }
    );
    return updateMovieShow;
  }

  async deleteMovieShow(id: string): Promise<MovieShow> {
    return await this.movieShowModel.findByIdAndDelete({ id: id });
  }


}
