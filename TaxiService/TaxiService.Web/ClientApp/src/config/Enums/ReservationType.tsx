export enum ReservationType {
  Oneway = 0,
  ByTheHour = 1,
}

export const reservationTypeString = (r: ReservationType): string => {
  return r === ReservationType.Oneway ? "Oneway" : "By the hour";
}