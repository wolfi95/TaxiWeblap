import { CarType } from "../../config/Enums/CarType";
import { ReservationType } from "../../config/Enums/ReservationType";
import { ReservationStatus } from "../../config/Enums/ReservationStatus";

export default interface ReservationSummaryDto {
    identifier: string;
    reservationType: ReservationType;
    carType: CarType;
    fromAddress: string;
    toAddress: string;
    price: number;
    duration?: number;
    date: Date;
    preferences : string[];
    comment: string;
    discountCode: string;
    arriveTime: Date;
    assignedDriver: string;
    createdDate: Date;
    editedDate?: Date;
    status : ReservationStatus;
}