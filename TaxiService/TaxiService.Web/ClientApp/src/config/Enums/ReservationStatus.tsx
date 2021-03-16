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