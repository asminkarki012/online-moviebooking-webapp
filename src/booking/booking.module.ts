import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { MovieShowModule } from 'src/movieshow/movieshow.module';

@Module({
  imports:[MovieShowModule],
  providers: [BookingService],
  controllers: [BookingController]
})
export class BookingModule {}
