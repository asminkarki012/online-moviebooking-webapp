export interface Cinema {
  id?: string;
  cinemaName: string;
  cinemaLocation: string;
  screen: Array<object>;
  seatInfo: Array<object>; //seatName = A1 A2 A3 A4 ...A70
}
