export enum ReservationStatus {
    Reserved,
    Payed,
    Assigned,
    OnTheWay,
    Arrived,
    Canceled,
    Refunded
}

export const reservationStatusString = (r: ReservationStatus): string => {
    return r === ReservationStatus.Reserved 
            ? "Reserved"
            : r === ReservationStatus.Payed
                ? "Payed"
                : r === ReservationStatus.Assigned
                    ? "Assigned"
                    : r === ReservationStatus.OnTheWay
                        ? "On the way"
                        : r === ReservationStatus.Arrived
                            ? "Arrived"
                            : r === ReservationStatus.Canceled
                                ? "Canceled"
                                : r === ReservationStatus.Refunded
                                    ? "Refunded"
                                    : "";
}
//make it available in all windwos
const _global = (window /* browser */ || global /* node */) as any
_global.reservationStatusString = reservationStatusString;