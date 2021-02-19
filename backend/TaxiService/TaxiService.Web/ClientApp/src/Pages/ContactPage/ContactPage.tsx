import { Button, Card, Snackbar, TextField } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/reducers/rootReducer';
import './ContactPage.scss'

interface IMappedProps {
    email: string;
    token: string;
}

function ContactPage() {

    const [reason, setReason] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const sendContactMessage = () => {
        if(reason.length < 3) {
            setError("Reason too short");
            return;
        }
        if(message.length < 8) {
            setError("Message too short");
            return;
        }
    }

    return (
        <div className="contact-page-wrapper">
            <h1>Contact Us</h1>
            <Card className="contact-card">
                <div>
                    <span>
                        Reason:
                    </span>
                    <TextField 
                        className="reason-input"
                        variant="outlined"
                        value={reason}
                        onChange={(e) => setReason(e.currentTarget.value)}/>
                </div>
                <div>
                    <span>
                        Message:
                    </span>
                    <TextField 
                        variant="outlined"
                        multiline
                        rows={20}
                        value={message}
                        onChange={(e) => setMessage(e.currentTarget.value)}/>
                </div>
                <Button
                    variant="outlined"
                    onClick={sendContactMessage}>
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