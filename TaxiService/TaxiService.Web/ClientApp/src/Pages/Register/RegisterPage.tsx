import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Redirect } from "react-router";
import UserRegisterDto from "../../dtos/User/UserRegisterDto"
import { Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import './RegisterPage.scss'
import { axiosInstance } from "../../config/Axiosconfig";
import AppCheckbox from '../../Components/AppCheckbox/Appcheckbox'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function RegisterPage() {
  const classes = useStyles();
  const [redirect, setRedirect] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailRe, setEmailRe] = useState("");
  const [pass, setPass] = useState("");
  const [passRe, setPassRe] = useState("");
  const [spam, setSpam] = useState(false);
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setError] = useState("");

  const tryRegister = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    var errors = "";
    var reg = new RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$");
    if (!reg.test(email))
      errors += "Invalid email format.\n"
    if(name === "")
      errors += "Name is required.\n"
    if(email !== emailRe)
      errors += "Email and confirmation doesn't match.\n"
    if(pass !== passRe)
      errors += "Password and confirmation doesn't match.\n"
    if(errors !== ""){
      setError(errors)
      setOpen(true);
      return;
    }

    var data: UserRegisterDto = {
      Email: email,
      EmailRe: emailRe,
      Password: pass,
      AllowSpam: spam,
      Name: name,
      PasswordRe: passRe
    }
    axiosInstance.post("user/register", data)
      .then(response => {
        setSuccess(true);
      })
      .catch(err => {})
  }

  if(success){
    return <Redirect to="/login" />;
  } else {
  if (redirect) {
    return <Redirect to="/" />;
  } else {
        return (
        <div>
            <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                Sign up
                </Typography>
                <form className={classes.form} noValidate>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                    <TextField
                        autoComplete="name"
                        name="Name"
                        variant="filled"
                        required
                        fullWidth
                        id="Name"
                        label="Name"
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.currentTarget.value)}
                    />
                    </Grid>                
                    <Grid item xs={12}>
                    <TextField
                        variant="filled"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.currentTarget.value)}
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                        variant="filled"
                        required
                        fullWidth
                        id="emailRe"
                        label="Email Address confirmation"
                        autoComplete="none"
                        name="emailRe"
                        value={emailRe}
                        onChange={(e) => setEmailRe(e.currentTarget.value)}
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                        variant="filled"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={pass}
                        onChange={(e) => setPass(e.currentTarget.value)}
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                        variant="filled"
                        required
                        fullWidth
                        name="passwordRe"
                        label="Password confirmation"
                        type="password"
                        id="passwordRe"
                        value={passRe}
                        onChange={(e) => setPassRe(e.currentTarget.value)}
                    />
                    </Grid>
                    <Grid item xs={12}>
                      <AppCheckbox
                        checked={spam}
                        label="I want to receive inspiration, marketing promotions and updates via email."
                        onChange={(e) => setSpam(!spam)}
                      />
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={(e) => tryRegister(e)}
                >
                    Sign Up
                </Button>
                <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    className={classes.submit}
                    onClick={() => {
                    setRedirect(true);
                    }}
                >
                    Cancel
                </Button>
                <Grid container justify="flex-end">
                    <Grid item>
                    <Link href="/login" variant="body2">
                        Already have an account? Sign in
                    </Link>
                    </Grid>
                </Grid>
                </form>
            </div>
            </Container>
            <Snackbar
            open={open}
            onClose={() => setOpen(!open)}
            >
            <Alert onClose={() => setOpen(!open)} severity="error" className="error-dialog">
                {errorMsg}
            </Alert>
            </Snackbar>
        </div>
        );
    }
  }
}
