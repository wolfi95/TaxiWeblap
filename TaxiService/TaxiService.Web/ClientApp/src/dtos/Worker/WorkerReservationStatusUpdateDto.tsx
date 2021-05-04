import { WorkerReservationStatus } from "../../config/Enums/WorkerReservationStatus";

export default interface WorkerReservationStatusUpdateDto {
    Status: WorkerReservationStatus;
    ArriveTime?: Date
}