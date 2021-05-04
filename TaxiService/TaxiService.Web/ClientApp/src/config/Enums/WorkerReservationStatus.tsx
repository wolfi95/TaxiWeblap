export enum WorkerReservationStatus {
    OnTheWay = 3,
    Arrived = 4,
}

export const workerReservationStatusString = (r: WorkerReservationStatus): string => {
    return r === WorkerReservationStatus.OnTheWay 
            ? "On the way"
            : r === WorkerReservationStatus.Arrived
                ? "Arrived"
                : "";
}
//make it available in all windwos
const _global = (window /* browser */ || global /* node */) as any
_global.workerReservationStatusString = workerReservationStatusString;