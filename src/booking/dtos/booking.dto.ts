export class BookingDto {
  movieShowId: string;
  userId: string;
  cinemaId: string;
  bookingInfo?: Object[];
  totalPrice?: number;
  seatName: string[]; //A1 A2 A3
}
