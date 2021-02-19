import { CarType } from "../../config/Enums/CarType"
import { ReservationType } from "../../config/Enums/ReservationType"

export default interface ReservationDetailDto {
    fromAddress: string;
    toAddrress: string;
    duration?: number;
    reservationType: ReservationType;
    date: Date;
    carType: CarType;
    preferences: string[];
    comment: string;
    price: number;
}