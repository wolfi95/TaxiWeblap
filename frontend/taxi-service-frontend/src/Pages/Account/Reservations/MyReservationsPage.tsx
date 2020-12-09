import { Card, CardActions, CardContent } from '@material-ui/core';
import React from 'react';
import { propTypes } from 'react-bootstrap/esm/Image';
import { connect } from 'react-redux';
import AccountPageWrapper from '../../../Components/AccountPageWrapper/AccountPageWrapper';
import { axiosInstance } from '../../../config/Axiosconfig';
import ReservationDetailDto from '../../../dtos/Reservation/ReservationDetailDto';
import { RootState } from '../../../redux/reducers/rootReducer';
import './MyReservationsPage.scss'

interface IMappedProps {
    id: string;
    token: string;
}

function MyReservationsPage(props: IMappedProps) {
    var myReservations: ReservationDetailDto[] = [];
    axiosInstance.defaults.headers["Authorization"] = "Bearer " + props.token;
    axiosInstance.get("/user/" + props.id + "/reservations")
        .then(res => {
            myReservations = res.data;
        })
        .catch(err => {
        })
        
    return (
        <AccountPageWrapper header="My Reservations">
            <div className="reservation-wrapper">
                {myReservations.map(res => {
                    return(
                        <Card variant="outlined">
                            <CardContent>
                            </CardContent>
                            <CardActions>

                            </CardActions>
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