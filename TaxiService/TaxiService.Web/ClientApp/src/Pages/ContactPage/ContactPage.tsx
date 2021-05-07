import { Button, Card, Snackbar, TextField } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { axiosInstance } from '../../config/Axiosconfig';
import { RootState } from '../../redux/reducers/rootReducer';
import './ContactPage.scss'
import ContactUsDto from '../../dtos/User/ContactUsDto'

interface IMappedProps {
    email: string;
    token: string;
}

function ContactPage() {

    const [reason, setReason] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const sendContactMessage = () => {
        if(reason.length < 3) {
            setError("Reason too short");
            return;
        }
        if(message.length < 8) {
            setError("Message too short");
            return;
        }
        var data: ContactUsDto = {
            reason: reason,
            message: message
        }
        axiosInstance.post("user/contact", data)
            .then(res => {
                setSuccess("Your message has been sent successfully.");
                setReason("");
                setMessage("");
            })
            .catch(err => {})
    }

    return (
        <div className="contact-page-wrapper">
            <h1>Contact Us</h1>
            <Card className="contact-card">
                <TextField
                    label="Reason"
                    className="reason-input"
                    variant="filled"
                    value={reason}
                    onChange={(e) => setReason(e.currentTarget.value)}/>
                <TextField
                    label="Message" 
                    variant="filled"
                    multiline
                    rows={20}
                    value={message}
                    onChange={(e) => setMessage(e.currentTarget.value)}/>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={() => sendContactMessage()}>
                    Send
                </Button>
            </Card>            
            <Snackbar
                    autoHideDuration={5000}
                    open={error !== ""}
                    onClose={() => setError("")}
                >
                    <Alert onClose={() => setError("")} severity="error">
                        {error}
                    </Alert>
            </Snackbar>
            <Snackbar
                    autoHideDuration={5000}
                    open={success !== ""}
                    onClose={() => setSuccess("")}
                >
                    <Alert onClose={() => setSuccess("")} severity="success">
                        {success}
                    </Alert>
            </Snackbar>
        </div>
    )
}

const mapStateToProps = (state: RootState): IMappedProps => {
    return {
      token: state.user.token,
      email: state.user.email
    }
  }

const connector = connect(mapStateToProps);
export default connector(ContactPage);