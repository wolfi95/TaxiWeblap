import { CarType } from "../../config/Enums/CarType";
import { ReservationType } from "../../config/Enums/ReservationType";

export default interface ReservationPriceDto {
    FromAddress: string;
    ToAddrress: string;
    Duration?: number;
    ReservationType: ReservationType;
    CarType: CarType;
    PreferenceIds: number[];
}