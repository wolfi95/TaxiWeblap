import { Button, Card, CardContent } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import AccountPageWrapper from '../../../Components/AccountPageWrapper/AccountPageWrapper';
import ReservationCardComponent from '../../../Components/ReservationCard/ReservationCardComponent';
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
    const [init, setInit] = useState(true);
    const [detailsRedirect, setDetailsRedirect] = useState("");
    
    useEffect(() => {        
        if(init) {
            axiosInstance.defaults.headers["Authorization"] = "Bearer " + props.token;
            axiosInstance.get("/user/reservations")
                .then(res => {
                    setReservations(res.data);
                    setInit(false);
                })
                .catch(err => {
                    setInit(false);
                })            
        }
    })

    if(detailsRedirect !== ""){
        return <Redirect to={"/account/" + detailsRedirect + "/details"}/>
    }
    else
    return (
        <AccountPageWrapper header="My Reservations">
            <div className="reservation-wrapper">
                {myReservations.map(res => {
                    return(
                        <ReservationCardComponent reservation={res} showDetails />
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