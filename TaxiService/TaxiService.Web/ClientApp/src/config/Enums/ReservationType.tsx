export enum ReservationType {
  Oneway = 0,
  ByTheHour = 1,
}

export const reservationTypeString = (r: ReservationType): string => {
  return r === ReservationType.Oneway ? "Oneway" : "By the hour";
}
//make it available in all windwos
const _global = (window /* browser */ || global /* node */) as any
_global.reservationTypeString = reservationTypeString;