import { CarType } from "../../config/Enums/CarType"
import { ReservationStatus } from "../../config/Enums/ReservationStatus"
import { ReservationType } from "../../config/Enums/ReservationType"

export default interface ReservationDetailDto {
    fromAddress: string;
    status: ReservationStatus
    toAddrress: string;
    duration?: number;
    reservationType: ReservationType;
    date: Date;
    carType: CarType;
    preferences: string[];
    comment: string;
    price: number;
    id: string;
    identifier: string;
}