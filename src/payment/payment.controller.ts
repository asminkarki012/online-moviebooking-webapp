import { Body, Controller, HttpException, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/accessToken.guard';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { PaymentDto } from './dtos/payment.dto';
import { PaymentService } from './payment.service';

@Controller('/api/payment')
export class PaymentController {


  constructor(private paymentService:PaymentService) {}


  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.Admin,Role.User)
  @Post("/:id")
  payment(@Param("id") bookingId,@Body() paymentDto:PaymentDto)  {
   try{ 
    return this.paymentService.createPayment(bookingId,paymentDto);
   }catch(error){
    return HttpException;
   }
  }


}
