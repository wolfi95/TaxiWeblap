import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import FooterComponent from './Components/Footer/FooterComponent';
import HeaderComponent from './Components/Header/HeaderComponent';
import { UserRoles } from './dtos/User/UserDto';
import ChangePasswordPage from './Pages/Account/ChangePasswordPage/ChangePasswordPage';
import ChangePersonalDataPage from './Pages/Account/ChangePersonalData/ChangePersonalDataPage';
import OverViewPage from './Pages/Account/Overview//OverViewPage';
import MyReservationsPage from './Pages/Account/Reservations/MyReservationsPage';
import SettingsPage from './Pages/Account/Settings/SettingsPage';
import ContactPage from './Pages/ContactPage/ContactPage';
import LoginPage from './Pages/Login/LoginPage';
import RegisterPage from './Pages/Register/RegisterPage';
import ReservationPage from './Pages/Reservation/ReservationPage';
import { RootState } from './redux/reducers/rootReducer';
import ReservationsPage from './Pages/Admin/Reservations/ReservationsPage'
import UsersPage from './Pages/Admin/Users/UsersPage';
import UserReservationsPage from './Pages/Admin/Users/UserReservationsPage';
import ManagePage from './Pages/Admin/Manage/ManagePage';
import ReservationDetailsPage from './Pages/Account/ReservationDetails/ReservationDetailsPage';
import SuccessfulPaymentPage from './Pages/Reservation/SuccessfulPaymentPage';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { clearError, setError } from './redux/actions/errorActions';
import { axiosInstance } from './config/Axiosconfig';
import JobsPage from './Pages/Worker/Jobs/JobsPage';
import AboutPage from './Pages/About/AboutPage'

interface IMappedState{
    token: string;
    role: string;
    error: string;
}

interface IDispatchedProps {
    clearError: () => void;
    setError: (msg: string) => void;
}

type Props = IMappedState & IDispatchedProps;

function RouterPage(props: Props){

    const [init, setInit] = useState(true);

    useEffect(() => {
        if(init){            
            axiosInstance.interceptors.response.use((response) => response, (error) => {
                if (error.response?.status === 404) {
                    props.setError("Unknown error occured");
                }
                else {
                    if (error.response?.data !== undefined) {
                        props.setError(error.response.data.message);
                    }
                    else {
                        props.setError("Cannot reach server");
                    }
                }
                throw error;
            });
            setInit(false);
        }
    })
    
    return(
        <Router >
            <HeaderComponent/>
            <Switch>  
                <Route exact path="/login">
                    <LoginPage />
                </Route>
                <Route exact path="/register">
                    <RegisterPage />
                </Route>
                <Route exact path="/about" component={AboutPage}/>
                <Route exact path="/services/airport"/>
                <Route exact path="/services/chaffeurs"/>
                <Route exact path="/services/events"/>
                {props.token || <Redirect to="/login"/>}
                {props.role === UserRoles.Administrator && <Route exact path="/users" component={UsersPage}/>}
                {props.role === UserRoles.Administrator && <Route exact path="/users/:id" component={UserReservationsPage}/>}
                {props.role === UserRoles.Administrator && <Route exact path="/home" component={ReservationsPage}/>}
                {props.role === UserRoles.Administrator && <Route exact path="/manage" component={ManagePage}/>}
                {props.role === UserRoles.Administrator && <Route exact path="/reserve" component={ReservationPage}/>}
                {props.role === UserRoles.User && <Route exact path="/home" component={ReservationPage}/>}
                {props.role === UserRoles.Worker && <Route exact path="/home" component={JobsPage}/>}
                <Route exact path="/successfulPayment"  component={SuccessfulPaymentPage} />
                <Route exact path="/account/overview" component={OverViewPage}/>
                <Route exact path="/account/pass" component={ChangePasswordPage}/>
                <Route exact path="/account/personal" component={ChangePersonalDataPage}/>
                <Route exact path="/account/reservations" component={MyReservationsPage}/>
                <Route exact path="/account/:id/details" component={ReservationDetailsPage}/>
                <Route exact path="/account/settings" component={SettingsPage}/>
                <Route exact path="/contact" component={ContactPage}/>
                <Redirect to="/home"/>
            </Switch>
            <FooterComponent/>
            <Snackbar
                open={props.error !== ""}
                onClose={() => props.clearError()}
                >
                <Alert onClose={() => props.clearError()} severity="error">
                    {props.error}
                </Alert>
            </Snackbar>
        </Router>
    )
}

const mapStateToProps = (state: RootState): IMappedState => {
    return {
      token: state.user.token,
      role: state.user.role,
      error: state.error.message
    }
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
    bindActionCreators(
      {
        clearError,
        setError
      },
      dispatch
    );
const connector = connect(mapStateToProps, mapDispatchToProps)
export default connector(RouterPage)