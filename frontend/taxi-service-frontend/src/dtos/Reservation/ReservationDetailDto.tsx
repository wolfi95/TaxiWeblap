import { CarType } from "../../config/Enums/CarType"
import { ReservationType } from "../../config/Enums/ReservationType"

export default interface ReservationDetailDto {
    FromAddress: string;
    ToAddrress: string;
    Duration?: number;
    ReservationType: ReservationType;
    Datee: Date;
    CarType: CarType;
    Preferences: string[];
    Comment: string;
    Price: number;
}