export class BookingDto {
  readonly movieShowId: string;
  readonly userId: string;
  readonly cinemaId: string;
  bookingInfo?: Object[];
  totalPrice?: number;
  seatName: string[]; //A1 A2 A3
  paid?: boolean;
  payId?: string;
  ticketUrl?: string;
}
