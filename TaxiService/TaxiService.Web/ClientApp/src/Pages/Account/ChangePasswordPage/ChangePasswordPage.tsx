import { Button, Snackbar, TextField } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import AccountPageWrapper from '../../../Components/AccountPageWrapper/AccountPageWrapper';
import { axiosInstance } from '../../../config/Axiosconfig';
import ChangePasswordDto from '../../../dtos/Account/ChangePasswordDto';
import { RootState } from '../../../redux/reducers/rootReducer';
import './ChangePasswordPage.scss';

interface IMappedProps {
    id: string;
    token: string;
}

function ChangePasswordPage(props: IMappedProps) {
    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [newPassRe, setNewPassRe] = useState("");
    const [error, setError] = useState("");
    const [passwordInvalid, setPasswordInvalid] = useState("");
    const [open, setOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const resetPage = () => {
        setOldPass("");
        setNewPass("");
        setNewPassRe("");
        setError("");
        setPasswordInvalid("");
    }

    const validatePassword = (pass: string): string => {
        if(pass.length < 6) {
            return "Password must be longer then 6 characters.";
        }
        if(!pass.match('\\d')) {
            return "Password must contain at least one number.";
        }
        if(!pass.match('[a-z]') || !pass.match('[A-Z]')) {
            return "Password must contain lowercase and uppercase characters as well."
        }
        for (var c = 0; c < pass.length; c++) {
            if(!'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+'.includes(pass[c])){
                return("Invalid character in new password: " + pass[c]);
            }
          }
        return "";
    }

    const handleSubmit = () => {
        setError("");
        setPasswordInvalid("");
        if(newPass !== newPassRe) {
            setError("Password and confirmation doesnt match");
            return;
        }
        var x = validatePassword(newPass);
        if(x !== "") {
            setPasswordInvalid(x);
            return;
        }        
        axiosInstance.defaults.headers["Authorization"] = "Bearer " + props.token;
        axiosInstance.post("user/changePassword", {NewPassword: newPass, NewPasswordConfirm: newPassRe, OldPassword: oldPass} as  ChangePasswordDto)
            .then(res => {
                setErrorMsg("");
                resetPage();
                setOpen(true);
            })
            .catch(err=>{})
    }

    return(
        <AccountPageWrapper header="Change Password">
            <div className="form-wrapper">
                <TextField id="old-pass-field" label="Old password" type="password" variant="filled" value={oldPass} onChange={(e) => setOldPass(e.currentTarget.value)}/>
                <TextField id="new-pass-field"  error={passwordInvalid !== ""} label="New password" type="password" variant="filled" value={newPass} onChange={(e) => setNewPass(e.currentTarget.value)}/>
                {passwordInvalid && <span className="error-text">{passwordInvalid}</span>}
                <TextField id="new-pass-re-field" error={error !== ""} label="New password confirm" type="password" variant="filled" value={newPassRe} onChange={(e) => setNewPassRe(e.currentTarget.value)}/>
                {error && <span className="error-text">{error}</span>}
                <Button color="primary" className="change-button" variant="contained" onClick={() => handleSubmit()}>Change</Button>
                <Snackbar
                    autoHideDuration={5000}
                    open={open}
                    onClose={() => setOpen(!open)}
                >
                    <Alert onClose={() => setOpen(!open)} severity={errorMsg !== "" ? "error" : "success"}>
                    {errorMsg !== "" ? errorMsg : "Password changed successfully"}
                    </Alert>
                </Snackbar>
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

export default connector(ChangePasswordPage);