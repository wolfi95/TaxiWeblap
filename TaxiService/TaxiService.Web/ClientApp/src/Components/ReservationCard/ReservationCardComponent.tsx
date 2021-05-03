import React, { useState } from 'react';
import './ReservationCardComponent.scss'
import { Button, Card, CardContent } from '@material-ui/core';
import { ReservationType } from '../../config/Enums/ReservationType';
import ReservationDetailDto from '../../dtos/Reservation/ReservationDetailDto'
import { RootState } from '../../redux/reducers/rootReducer';
import { connect } from 'react-redux';
import { UserRoles } from '../../dtos/User/UserDto';
import { ReservationStatus } from '../../config/Enums/ReservationStatus';
import { Redirect } from 'react-router';

export interface ReservationCardProps {
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
                                <span>{ props.reservation.duration }</span>                                                                                    
                            </div>
                        )}
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
                    { props.role === UserRoles.Administrator || 
                        <Button onClick={() => setDetailsRedirect(props.reservation.id)} variant="outlined">Details</Button> 
                    }
                    { (props.role === UserRoles.Administrator && props.reservation.status === ReservationStatus.Payed) &&
                        <Button onClick={() => {if(props.onAssignClicked !== undefined) props.onAssignClicked(props.reservation.id)}} variant="outlined">Assign</Button> 
                    }
                    <span>Price: {props.reservation.price + " "} .-</span>
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