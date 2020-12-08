import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { clearUserState, UserActionTypes } from '../../redux/actions/userActions';
import { RootState } from '../../redux/reducers/rootReducer';
import './HeaderComponent.scss'
import Navbar from 'react-bootstrap/Navbar';
import { Button, Menu, MenuItem } from '@material-ui/core';
import { Redirect } from 'react-router';

interface IMappedProps{
    token: string;
    email: string;
}

interface IDispatchedProps {
    clearUserState: () => void;
}

type Props = IMappedProps & IDispatchedProps;

function HeaderComponent(props: Props) {

    const [redirect, setRedirect] = useState(false);
    const [loginRedirect, setLoginRedirect] = useState(false);
    const [servicesRedirect, setServicesRedirect] = useState("");
    const [accountRedirect, setAccountRedirect] = useState(false);
    const [aboutRedirect, setAboutRedirect] = useState(false);
    const [contactRedirect, setContactRedirect] = useState(false);    

    useEffect(() => {
        if(redirect) {
            setRedirect(false);
            props.clearUserState();
        }
        if(loginRedirect)
            setLoginRedirect(false);
        if(servicesRedirect !== "")
            setServicesRedirect("");        
        if(accountRedirect) {
            setAccountRedirect(false);
        }
        if(aboutRedirect) {
            setAboutRedirect(false);
        }
        if(contactRedirect) {
            setContactRedirect(false);
        }
    })

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = (redirectString: string) => {
        setAnchorEl(null);
        setServicesRedirect(redirectString);
    }

    if(redirect) {
        return(<Redirect to="/home"/>)
    }
    else 
    if(loginRedirect) {
        return(<Redirect to="/login"/>)
    }
    else
    if(servicesRedirect){
        return(<Redirect to={servicesRedirect}/>)
    }
    else
    if(accountRedirect) {
        return(<Redirect to="/account/overview"/>)
    }
    else
    if(aboutRedirect) {
        return(<Redirect to="/about"/>)
    }
    else
    if(contactRedirect) {
        return(<Redirect to="/contact"/>)
    }
    else {
        return (
            <Navbar variant="dark" expand="md" className="header-container">                        
                <img
                className="header-img"
                //src={require("../images/logo_black.jpg")}
                ></img>
                <span className="header-title">TAXI SERVICES</span>
                <Navbar.Toggle />            
                <Navbar.Collapse className="menu">
                    <Button onClick={() => setRedirect(true)}>
                        HOME
                    </Button>
                    <Button onClick={() => setAboutRedirect(true)}>
                        ABOUT US
                    </Button>
                    <Button aria-controls="services-menu" aria-haspopup="true" onClick={handleClick}>
                        SERVICES
                    </Button>
                    <Menu
                        id="services-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={() => handleMenuClose("")}>
                            <MenuItem onClick={() => handleMenuClose("/services/airport")}>Airport Transfers</MenuItem>
                            <MenuItem onClick={() => handleMenuClose("/services/chaffeurs")}>Corporate Chaffeurs</MenuItem>
                            <MenuItem onClick={() => handleMenuClose("/services/events")}>Event Chaffeuring</MenuItem>
                    </Menu>
                    <Button onClick={() => setContactRedirect(true)}>
                        CONTACT US
                    </Button>
                    <div className="end">
                    {!props.token ? 
                    (
                        <Button onClick={() => setLoginRedirect(true)}>
                            LOG IN
                        </Button>
                    ) :
                    (
                        <div className="d-flex align-items-center">
                            <Button onClick={() => {setAccountRedirect(true)}}>
                                ACCOUNT
                            </Button>
                            <Button onClick={() => {sessionStorage.clear(); setRedirect(true)}}>
                                LOG OUT
                            </Button>
                            <span className="user-email">Email: {props.email}</span>
                        </div>
                    )}
                    </div>
                </Navbar.Collapse>     
            </Navbar>
        )
    }
}

const mapDispatchToProps = (dispatch: Dispatch<UserActionTypes>) =>
    bindActionCreators(
      {
        clearUserState
      },
      dispatch
    );
  
  const mapStateToProps = (state: RootState): IMappedProps => {
    return {
      token: state.user.token,
      email: state.user.email
    }
  }

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(HeaderComponent);