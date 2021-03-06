import { Button, Card, CardContent } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import AccountPageWrapper from '../../../Components/AccountPageWrapper/AccountPageWrapper';
import { axiosInstance } from '../../../config/Axiosconfig';
import { ReservationType } from '../../../config/Enums/ReservationType';
import ReservationDetailDto from '../../../dtos/Reservation/ReservationDetailDto';
import { RootState } from '../../../redux/reducers/rootReducer';
import './MyReservationsPage.scss'

interface IMappedProps {
    id: string;
    token: string;
}

function MyReservationsPage(props: IMappedProps) {
    var [myReservations, setReservations] = useState([] as ReservationDetailDto[]);
    
    useEffect(() => {
        if(myReservations.length === 0) {
        axiosInstance.defaults.headers["Authorization"] = "Bearer " + props.token;
        axiosInstance.get("/user/" + props.id + "/reservations")
            .then(res => {
                setReservations(res.data);
            })
            .catch(err => {
            })
        }
    })

    const isNotPastCancelDate = (date: Date): boolean => {
        var now = new Date();
        var min = new Date(now.setHours(now.getHours() + 12));
        return min < new Date(date);
    }
    
    return (
        <AccountPageWrapper header="My Reservations">
            <div className="reservation-wrapper">
                {myReservations.map(res => {
                    console.log(res) 
                    return(
                        <Card variant="outlined">
                            <CardContent>
                                <div className="address-column">
                                    <div className="address-row">
                                        <span>From: </span>
                                        <span>{ res.fromAddress }</span>
                                    </div>
                                    {res.reservationType === ReservationType.Oneway 
                                        ? (
                                            <div className="address-row">
                                                <span>To:</span>
                                                <span>{ res.toAddrress }</span>                                                                                    
                                            </div>
                                        ) : (
                                            <div className="address-row">
                                                <span>Duration:</span>
                                                <span>{ res.duration }</span>                                                                                    
                                            </div>
                                        )}
                                </div>
                                <div className="preferences-column">
                                    <span>Preferences:</span>
                                    {res.preferences.length !== 0 ? (
                                    <ul>                                        
                                        {res.preferences.map(pref => {
                                            return (
                                                <li>
                                                    {pref}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                    ) : (
                                        <span className="no-preference">-</span>
                                    )
                                    }
                                </div>
                                <div className="last-column">
                                    {isNotPastCancelDate(res.date) &&
                                    <Button variant="outlined">Cancel</Button>}
                                    <span>Price: {res.price + " "} .-</span>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })
                }
            </div>
        </AccountPageWrapper>
    )
}

const mapStateToProps = (state: RootState): IMappedProps => {
    return {
        id: state.user.userId,
        token: state.user.token
    }
}

const connector = connect(mapStateToProps);
export default connector(MyReservationsPage);