import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Switch } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import AccountPageWrapper from '../../../Components/AccountPageWrapper/AccountPageWrapper';
import { axiosInstance } from '../../../config/Axiosconfig';
import { RootState } from '../../../redux/reducers/rootReducer';
import './SettingsPage.scss'
import DeleteIcon from '@material-ui/icons/Delete'
import { bindActionCreators, Dispatch } from 'redux';
import { clearUserState, UserActionTypes } from '../../../redux/actions/userActions';

interface IMappedProps {
    token: string;
    id: string;
}

interface IDispatchedProps {
    clearUserState: () => void;
}

type Props = IMappedProps & IDispatchedProps;

function SettingsPage(props: Props) {
    const [emailChecked, setEmailChecked] = useState(false);
    const [init, setInit] = useState(true);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [logoutRedirect, setLogoutRedirect] = useState(false);

    const tryDeleteAccount = () => {
        axiosInstance.delete("/user/" + props.id)
            .then(res => {
                sessionStorage.clear();
                setLogoutRedirect(true);
            })
    }

    useEffect(() => {
        if(init) {
            setInit(false);
            axiosInstance.defaults.headers["Authorization"] = "Bearer " + props.token;
            axiosInstance.get("/user/" + props.id + "/settings")
                .then(res => {
                    setEmailChecked(res.data.allowEmails);
                })
        }
        if(logoutRedirect) {
            setLogoutRedirect(false);
            props.clearUserState();
        }
    })

    const trySetEmailChecked = () => {
        axiosInstance.post("/user/" + props.id + "/emailNotifications")
            .then(res => {
                setEmailChecked(!emailChecked)
            })
            .catch(err => {

            });
    }
    
    return(
        <AccountPageWrapper header="Settings">
            <div className="settings-root">
                <div className="switch-gorup">
                    <span>Email notifications:</span>
                    <Switch
                        checked={emailChecked}
                        onChange={() => trySetEmailChecked()}
                        color="primary"
                    />
                </div>
                <Button 
                    className="delete-button"
                    variant="contained"
                    startIcon={<DeleteIcon />}
                    onClick={() => setOpenConfirm(true)}>
                    Delete Account
                </Button>
                <Dialog
                    open={openConfirm}
                    onClose={() => setOpenConfirm(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Confirm account deletion"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure? this cannot be undone!
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenConfirm(false)} color="primary">
                            Cancel
                        </Button>
                        <Button
                            className="delete-button"
                            onClick={tryDeleteAccount}
                            >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </AccountPageWrapper>

    )
}

const mapStateToProps = (state: RootState): IMappedProps => {
    return { 
        token: state.user.token ,
        id: state.user.userId
    }
};
const mapDispatchToProps = (dispatch: Dispatch<UserActionTypes>) =>
    bindActionCreators(
      {
        clearUserState
      },
      dispatch
    );
const connector = connect(mapStateToProps,mapDispatchToProps)

export default connector(SettingsPage);