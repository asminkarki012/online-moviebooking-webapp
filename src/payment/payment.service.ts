import { Injectable } from "@nestjs/common";
import { Stripe } from "stripe";
import { configVar } from "src/config";
import { BookingService } from "src/booking/booking.service";
import { PaymentDto } from "./dtos/payment.dto";

@Injectable()
export class PaymentService {
  private stripe;

  constructor(private bookingService: BookingService) {
    this.stripe = new Stripe(configVar.STRIPE_SECRETKEY, {
      apiVersion: "2022-11-15",
    });
  }

  async createPayment(id: string,paymentDto:PaymentDto): Promise<any> {
    console.log("create Payment service");
    
    const totalPrice = await this.bookingService.findById(id);
    if(totalPrice === paymentDto.paidAmount){
    return await this.stripe.charges.create({
      amount: totalPrice,
      currency:"USD",
      source:"tok_mastercard",

    });
  }else{
    return {message:"Invalid Fund!! Please entered proper Amount"};
  }
  }
}
