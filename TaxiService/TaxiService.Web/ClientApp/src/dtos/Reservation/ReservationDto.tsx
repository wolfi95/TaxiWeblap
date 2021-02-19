import { CarType } from "../../config/Enums/CarType";
import { ReservationType } from "../../config/Enums/ReservationType";

export default interface ReservationDto {
    FromAddress: string;
    ToAddrress: string;
    Duration?: number;
    ReservationType: ReservationType;
    Date: string;
    CarType: CarType;
    PreferenceIds: number[];
    Comment: string;
}