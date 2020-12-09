import { Button, Snackbar, TextField } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import AccountPageWrapper from '../../../Components/AccountPageWrapper/AccountPageWrapper';
import { axiosInstance } from '../../../config/Axiosconfig';
import ChangePersonalDataDto from '../../../dtos/Account/ChangePersonalDataDto';
import { RootState } from '../../../redux/reducers/rootReducer';
import { updateUserState, UserActionTypes } from '../../../redux/actions/userActions'
import './ChangePersonalDataPage.scss';

interface IMappedProps {
    id: string;
    token: string;
    name: string;
    email: string;
    address: string;
}

type Props = IMappedProps;

function ChangePersonalDataPage(props: Props) {
    const [name, setName] = useState(props.name);
    const [email, setEmail] = useState(props.email);
    const [address, setAddress] = useState(props.address);
    const [emailError, setEmailError] = useState("");
    const [open, setOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const dispatchH = useDispatch()

    const validateEmail = (emailString: string): string => {
        var reg = new RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$");
        if (!reg.test(emailString))
          return "Invalid email format."
        return "";
    }

    const handleSubmit = () => {
        setEmailError("");
        var x = validateEmail(email);
        if(x !== "") {
            setEmailError(x);
            return;
        }
        var newState = {Address: address, Email: email, Name: name} as  ChangePersonalDataDto        
        axiosInstance.defaults.headers["Authorization"] = "Bearer " + props.token;
        axiosInstance.post("user/" + props.id + "/changeData", newState)
            .then(res => {
                dispatchH(updateUserState(newState))
                setErrorMsg("");
            })
            .catch(err => {
                setErrorMsg(err.response.data?.message);
            })
            .finally(() =>{
                setOpen(true);
            });
    }

    return(
        <AccountPageWrapper header="Change Personal Data">
            <div className="form-wrapper">
                <TextField id="name-field" label="Name" variant="outlined" value={name} onChange={(e) => setName(e.currentTarget.value)}/>
                <TextField id="email-field"  error={emailError !== ""} label="Email" variant="outlined" value={email} onChange={(e) => setEmail(e.currentTarget.value)}/>
                {emailError && <span className="error-text">{emailError}</span>}
                <TextField id="address-field" label="Address" variant="outlined" value={address} onChange={(e) => setAddress(e.currentTarget.value)}/>
                <Button className="change-button" variant="outlined" onClick={() => handleSubmit()}>Change</Button>
                <Snackbar
                    autoHideDuration={5000}
                    open={open}
                    onClose={() => setOpen(!open)}
                >
                    <Alert onClose={() => setOpen(!open)} severity={errorMsg !== "" ? "error" : "success"}>
                    {errorMsg !== "" ? errorMsg : "Data changed successfully"}
                    </Alert>
                </Snackbar>
            </div>
        </AccountPageWrapper>
    )
}

const mapStateToProps = (state: RootState): IMappedProps => {
    return {
        id: state.user.userId,
        token: state.user.token,
        address: state.user.address,
        email: state.user.email,
        name: state.user.name
    }
}

const mapDispatchToProps = (dispatch: Dispatch<UserActionTypes>) =>
  bindActionCreators(
    {
      updateUserState
    },
    dispatch
);

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(ChangePersonalDataPage);