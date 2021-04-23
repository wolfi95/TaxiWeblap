import {ReservationType} from '../../config/Enums/ReservationType';
import { CarType } from '../../config/Enums/CarType';
import { ReservationStatus } from '../../config/Enums/ReservationStatus';

export default interface SearchReservationsDto {
    PageNumber: number;
    PageSize: number;
    FromDate?: Date | null;
    ToDate?: Date | null;
    MinPrice?: number;
    MaxPrice?: number;
    PrefIds: number[];
    ReservationType?: ReservationType;
    CarType?: CarType;
    Status?: ReservationStatus;
}