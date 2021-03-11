import React from 'react';
import { connect } from 'react-redux';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import FooterComponent from './Components/Footer/FooterComponent';
import HeaderComponent from './Components/Header/HeaderComponent';
import { UserRoles } from './dtos/User/UserDto';
import ChangePasswordPage from './Pages/Account/ChangePasswordPage/ChangePasswordPage';
import ChangePersonalDataPage from './Pages/Account/ChangePersonalData/ChangePersonalDataPage';
import OverViewPage from './Pages/Account/Overview/OverViewPage'
import MyReservationsPage from './Pages/Account/Reservations/MyReservationsPage';
import SettingsPage from './Pages/Account/Settings/SettingsPage';
import ContactPage from './Pages/ContactPage/ContactPage';
import LoginPage from './Pages/Login/LoginPage';
import RegisterPage from './Pages/Register/RegisterPage';
import ReservationPage from './Pages/Reservation/ReservationPage';
import { RootState } from './redux/reducers/rootReducer';
import ReservationsPage from './Pages/Admin/Reservations/ReservationsPage'
import UsersPage from './Pages/Admin/Users/UsersPage';
import UserReservationsPage from './Pages/Admin/Users/UserReservationsPage'
import ManagePage from './Pages/Admin/Manage/ManagePage'

interface IMappedState{
    token:string;
    role:string;
}

function RouterPage(props: IMappedState){    
    return(
        <Router>
        <HeaderComponent/>
            <Switch>  
                <Route exact path="/login">
                    <LoginPage />
                </Route>
                <Route exact path="/register">
                    <RegisterPage />
                </Route>
                
                {!props.token ? 
                    (
                        <Redirect to="/login"/>
                    ) : (
                        <React.Fragment>
                                    {props.role === UserRoles.Administrator && <Route exact path="/users" component={UsersPage}/>}
                                    {props.role === UserRoles.Administrator && <Route exact path="/users/:id" component={UserReservationsPage}/>}
                                    {props.role === UserRoles.Administrator && <Route exact path="/home" component={ReservationsPage}/>}
                                    {props.role === UserRoles.Administrator && <Route exact path="/manage" component={ManagePage}/>}
                                    {props.role === UserRoles.Administrator && <Route exact path="/reserve" component={ReservationPage}/>}
                                    {props.role === UserRoles.Administrator || <Route exact path="/home" component={ReservationPage}/>}
                                    <Route exact path="/about"/>
                                    <Route exact path="/account/overview" component={OverViewPage}/>
                                    <Route exact path="/account/pass" component={ChangePasswordPage}/>
                                    <Route exact path="/account/personal" component={ChangePersonalDataPage}/>
                                    <Route exact path="/account/reservations" component={MyReservationsPage}/>
                                    <Route exact path="/account/settings" component={SettingsPage}/>
                                    <Route exact path="/contact" component={ContactPage}/>
                                    <Route exact path="/services/airport"/>
                                    <Route exact path="/services/chaffeurs"/>
                                    <Route exact path="/services/events"/>
                                    <Redirect to="/home"/>
                        </React.Fragment>
                    )
                }
                <Redirect to="/login"/>
            </Switch>
        <FooterComponent/>
        </Router>
    )
}

const mapStateToProps = (state: RootState): IMappedState => {
    return {
      token: state.user.token,
      role: state.user.role
    }
}
const connector = connect(mapStateToProps)
export default connector(RouterPage)