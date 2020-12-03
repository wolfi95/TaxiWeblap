import React from 'react';
import { connect } from 'react-redux';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import FooterComponent from './Components/Footer/FooterComponent';
import HeaderComponent from './Components/Header/HeaderComponent';
import LoginPage from './Pages/Login/LoginPage';
import RegisterPage from './Pages/Register/RegisterPage';
import ReservationPage from './Pages/Reservation/ReservationPage';
import { RootState } from './redux/reducers/rootReducer';

interface IMappedState{
    token:string;
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
                            <Route exact path="/home" component={ReservationPage}/>
                            <Route exact path="/about"/>
                            <Route exact path="/account"/>
                            <Route exact path="/contact"/>
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
      token: state.user.token
    }
}
const connector = connect(mapStateToProps)
export default connector(RouterPage)