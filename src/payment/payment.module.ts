import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { BookingModule } from 'src/booking/booking.module';

@Module({
  imports:[BookingModule],
  providers: [PaymentService],
  controllers: [PaymentController]
})
export class PaymentModule {}
