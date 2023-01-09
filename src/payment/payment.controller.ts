import { Body, Controller, Param, Post } from '@nestjs/common';
import { PaymentDto } from './dtos/payment.dto';
import { PaymentService } from './payment.service';

@Controller('/api/payment')
export class PaymentController {


  constructor(private paymentService:PaymentService) {}
    // paying
  @Post("/:id")
  payment(@Param() bookingId,@Body() paymentDto:PaymentDto)  {
    
    return this.paymentService.createPayment(bookingId.id,paymentDto);
  }


}
