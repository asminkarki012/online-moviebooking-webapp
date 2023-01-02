import { Module } from '@nestjs/common';
import { MovieShowService } from './movieshow.service';
import { MovieShowController } from './movieshow.controller';
import { MovieShowSchema } from './schemas/movieshow.schemas';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[MongooseModule.forFeature([{ name: "MovieShow", schema: MovieShowSchema }])],
  providers: [MovieShowService],
  controllers: [MovieShowController]
})
export class MovieshowModule {}
