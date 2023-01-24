import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { BookingModule } from 'src/booking/booking.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[BookingModule,AuthModule],
  providers: [PaymentService],
  controllers: [PaymentController]
})
export class PaymentModule {}
