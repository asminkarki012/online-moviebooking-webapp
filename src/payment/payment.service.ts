import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { Stripe } from "stripe";
import { configVar } from "src/config";
import { BookingService } from "src/booking/booking.service";
import { PaymentDto } from "./dtos/payment.dto";

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(private bookingService: BookingService) {
    this.stripe = new Stripe(configVar.STRIPE_SECRETKEY, {
      apiVersion: "2022-11-15",
    });
  }

// generate ticket after payment
  async createPayment(bookingId: string, paymentDto: PaymentDto): Promise<any> {
    console.log("create Payment service");
    const { paidAmount } = paymentDto;

   const booking = await this.bookingService.findById(bookingId);
    if(!booking){
    return new NotFoundException();
    }

    const {totalPrice} = booking;
    if (totalPrice === paidAmount) {
      const newPayment = await this.stripe.charges.create({
        amount: totalPrice,
        currency: "USD",
        source: "tok_mastercard",
      });
      
      this.bookingService.updatePaymentStatus(bookingId,newPayment.id);

      this.bookingService.generateTicketPdf(bookingId);

      return {
        success: true,
        message: "Payment Done Successfully",
        data: newPayment,
      };

    } else {
      return {success:false, message: "Invalid Fund!! Please enter proper Amount" };
    }
  }
}
