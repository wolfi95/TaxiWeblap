import React, { useState } from 'react';
import './ReservationCardComponent.scss'
import { Button, Card, CardContent } from '@material-ui/core';
import { ReservationType, reservationTypeString } from '../../config/Enums/ReservationType';
import ReservationDetailDto from '../../dtos/Reservation/ReservationDetailDto'
import { RootState } from '../../redux/reducers/rootReducer';
import { connect } from 'react-redux';
import { UserRoles } from '../../dtos/User/UserDto';
import { ReservationStatus, reservationStatusString } from '../../config/Enums/ReservationStatus';
import { Redirect } from 'react-router';
import { dateToString } from '../../helpers/DateStringHelper'
import { carTypeString } from '../../config/Enums/CarType';

export interface ReservationCardProps {
    showDetails?: boolean;
    reservation: ReservationDetailDto;
    onAssignClicked?(id:string): void;
}

interface IMappedProps {
    role: string;
}

type Props = IMappedProps & ReservationCardProps

function ReservationCardComponent(props: Props) {
    const [detailsRedirect, setDetailsRedirect] = useState("");

    if(detailsRedirect !== ""){
        return <Redirect to={"/account/" + detailsRedirect + "/details"}/>
    }
    else
    return(
        <Card variant="outlined" className="res-card">
            <CardContent>
                <div className="address-column">
                    <div className="address-row">
                        <span>From: </span>
                        <span>{ props.reservation.fromAddress }</span>
                    </div>
                    {props.reservation.reservationType === ReservationType.Oneway 
                        ? (
                            <div className="address-row">
                                <span>To:</span>
                                <span>{ props.reservation.toAddrress }</span>                                                                                    
                            </div>
                        ) : (
                            <div className="address-row">
                                <span>Duration:</span>
                                <span>{ props.reservation.duration + " hours" }</span>                                                                                    
                            </div>
                        )}
                    <div className="address-row">
                        <span>Status: </span>
                        <span>{ reservationStatusString(props.reservation.status) }</span>
                    </div>
                    <div className="address-row">
                        <span>Reservation type: </span>
                        <span>{ reservationTypeString(props.reservation.reservationType) }</span>
                    </div>
                    <div className="address-row">
                        <span>Car type: </span>
                        <span>{ carTypeString(props.reservation.carType) }</span>
                    </div>
                </div>
                <div className="preferences-column">
                    <span>Preferences:</span>
                    {props.reservation.preferences.length !== 0 ? (
                    <ul>                                        
                        {props.reservation.preferences.map(pref => {
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
                    { (props.role === UserRoles.User || props.showDetails) && 
                        <Button variant="contained" color="primary" onClick={() => setDetailsRedirect(props.reservation.id)}>Details</Button> 
                    }
                    { (props.role === UserRoles.Administrator && props.reservation.status === ReservationStatus.Payed) &&
                        <Button variant="contained" color="primary" onClick={() => {if(props.onAssignClicked !== undefined) props.onAssignClicked(props.reservation.id)}}>Assign</Button> 
                    }
                    { (props.role === UserRoles.Worker && (props.reservation.status === ReservationStatus.Assigned || props.reservation.status === ReservationStatus.OnTheWay)) &&
                        <Button variant="contained" color="primary" onClick={() => {if(props.onAssignClicked !== undefined) props.onAssignClicked(props.reservation.id)}}>Update</Button> 
                    }
                    { props.role === UserRoles.Worker || 
                        <span>Price: {props.reservation.price + " "} .-</span>
                    }
                    <span>Date: {dateToString(props.reservation.date)} </span>
                </div>
            </CardContent>
        </Card>
    )
}

const mapStateToProps = (state: RootState): IMappedProps => {
    return {
        role: state.user.role
    }
}

const connector = connect(mapStateToProps);
export default connector(ReservationCardComponent);