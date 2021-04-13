import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { axiosInstance } from '../../../config/Axiosconfig';
import './ReservationDetailsPage.scss';
import ReservationSummaryDto from '../../../dtos/Reservation/ReservationSummaryDto'
import { CarType, carTypeString } from '../../../config/Enums/CarType';
import { ReservationType, reservationTypeString } from '../../../config/Enums/ReservationType';
import { ReservationStatus, reservationStatusString } from '../../../config/Enums/ReservationStatus';
import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

export interface IReservationDetailProps {
    id: string;
}

export default function ReservationDetailsPage() {
    const {id}: IReservationDetailProps = useParams();
    const [init, setInit] = useState(true);
    const [data, setData] = useState<ReservationSummaryDto>(
        {
            arriveTime: new Date(),
            assignedDriver: "",
            carType: CarType.Executive,
            comment: "",
            createdDate: new Date(),
            date: new Date(),
            discountCode: "",
            reservationType: ReservationType.ByTheHour,
            fromAddress: "",
            identifier: "",
            preferences: [],
            price: 0,
            status: ReservationStatus.Reserved,
            toAddress: "",
            duration: 0,
            editedDate: new Date()
        }
    )
    const [message, setMessage] = useState("");
    const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);

    const canCancel = () => {
        var now = new Date;
        var res = data.date > now;
        return res;
    }

    const tryStartBarionPayment = () => {
        axiosInstance.get("payment/" + id + "/barion")
            .then(res => {
                window.location.href = res.data;
            })
            .catch(err => {});
    }

    const tryCancelReservation = () => {
        axiosInstance.delete("reservation/" + id)
        .then(res => {
            setMessage("Your reservation has been cancelled. If applicable, your refund will reflect on this page shortly and you will be notified in email.")
        })
        .catch(err => {});
    }

    useEffect(() => {
        if(init) {
            axiosInstance.get("/reservation/" + id)
            .then(res => {
                var d = res.data;
                d.date = new Date(res.data.date)
                setData(d);
                setInit(false);
            })
            .catch(err => {});
        }
    })
    
    return (
        <Container className="reservation-details-wrapper">
            <div>
                <span>Reservation Identidier:</span>
                <span>{data.identifier}</span>
            </div>
            <div>
                <span>Reservation Type:</span>
                <span>{reservationTypeString(data.reservationType)}</span>
            </div>
            <div>
                <span>Car Type:</span>
                <span>{carTypeString(data.carType)}</span>
            </div>
            <div>
                <span>Date:</span>
                <span>{data.date.toString()}</span>
            </div>
            <div>
                <span>Activated Discount:</span>
                <span>{data.discountCode}</span>
            </div>
            <div>
                <span>From Address:</span>
                <span>{data.fromAddress}</span>
            </div>
            {data.reservationType === ReservationType.Oneway &&
                <div>
                    <span>To Address:</span>
                    <span>{data.toAddress}</span>
                </div>
            }
            {data.reservationType === ReservationType.ByTheHour &&
                <div>
                    <span>Reservation Duration:</span>
                    <span>{data.duration}</span>
                </div>
            }
            <div>
                <span>Comment:</span>
                <span>{data.comment}</span>
            </div>
            {data.preferences.length !== 0 && (
                <div>
                    <span>Selected Preferences:</span>
                    {data.preferences.map((p,i) => {
                        if((i + 1) !== data.preferences.length){
                        return (
                            <span>{p + ", "}</span>
                        )
                        }
                        else {
                            return p
                        }
                    })}
                </div>
            )}
            <div>
                <span>Price:</span>
                <span>{data.price + "HUF"}</span>
            </div>
            <div>
                <span>Reservation Status:</span>
                <span>{reservationStatusString(data.status)}</span>
            </div>
            {data.status === ReservationStatus.Reserved &&
                <div>
                    <span>Select payment option:</span>
                    <div>
                        <img src={require("../../../resources/images/barion-logo.png").default} onClick={() => tryStartBarionPayment()}/>
                    </div>
                </div>
            }
            {(data.status === ReservationStatus.Payed && canCancel()) &&
                <div>
                    <Button onClick={() => setCancelConfirmOpen(true)}>Cancel reservation</Button>
                </div>
            }
            {data.status === ReservationStatus.Assigned &&
                <div>
                    <span>Assigned Driver:</span>
                    <span>{data.assignedDriver}</span>
                </div>
            }
            {data.status === ReservationStatus.OnTheWay &&
                <div>
                    <span>Estimated Arrival Time:</span>
                    <span>{data.arriveTime.toString()}</span>
                </div>
            }
            {data.status === ReservationStatus.Arrived &&
                <div>
                    <span>Your car has arrived!</span>
                </div>
            }
            <div>
                <span>Reservation Made:</span>
                <span>{data.createdDate.toString()}</span>
            </div>
            <div>
                <span>Last Edited:</span>
                <span>{data.editedDate?.toString() ?? "-"}</span>
            </div>
            <Snackbar
                open={message !== ""}
                autoHideDuration={5000}
                onClose={() => setMessage("")}
            >
                <Alert onClose={() => setMessage("")} severity="success">
                    {message}
                </Alert>
            </Snackbar>
            <Dialog
                open={cancelConfirmOpen}
            >
                <DialogTitle>Confirm reservation cancellation</DialogTitle>
                <DialogContent>Are you sure you want to cancel this reservation? <span>Reservations within 12 hours are not applicable for refund!</span></DialogContent>
                <DialogActions>
                    <Button onClick={() => {setCancelConfirmOpen(false); tryCancelReservation()}}>Confirm</Button>
                    <Button onClick={() => setCancelConfirmOpen(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}