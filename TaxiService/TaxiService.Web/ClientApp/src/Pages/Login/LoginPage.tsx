import { Button, Container, CssBaseline, Grid, Link, makeStyles, Snackbar, TextField, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Redirect } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { axiosInstance } from '../../config/Axiosconfig';
import UserLoginDto from '../../dtos/User/UserLoginDto';
import { ErrorActionTypes } from '../../redux/actions/errorActions';
import { saveToken, UserActionTypes } from '../../redux/actions/userActions';
import { setError } from '../../redux/actions/errorActions';
import { RootState } from '../../redux/reducers/rootReducer';
import './LoginPage.scss'


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: "20px",
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface Mapped {
  token: string;
}

function LoginPage(props: Mapped) {
  const classes = useStyles();
  const [redirect, setRedirect] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const dispatchH = useDispatch();

  const tryLogin = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    var data: UserLoginDto = {
      Email: email,
      Password: pass
    }
    axiosInstance.post("user/login", data)
      .then(response => {
        axiosInstance.defaults.headers["Authorization"] = "Bearer " + response.data
        dispatchH(saveToken(response.data));
        setRedirect(true);
      })
      .catch(err => {})
  }

  if (redirect) {
    return (<Redirect to="/home" />)
  }
  else
    return (
      <div className="wrapper">
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => { setEmail(e.currentTarget.value) }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={pass}
                onChange={(e) => { setPass(e.currentTarget.value) }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                className={classes.submit}
                onClick={(e) => tryLogin(e)}
              >
                Sign In
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={() => { setRedirect(true) }}
              >
                Cancel
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/register" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </Container>
      </div>
    );
}

const mapDispatchToProps = (dispatch: Dispatch<UserActionTypes>) =>
  bindActionCreators(
    {
      saveToken
    },
    dispatch
);

const mapStateToProps = (state: RootState): Mapped => {
  return {
    token: state.user.token
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage);
