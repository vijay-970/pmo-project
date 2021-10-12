import React, { useState,useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import UserStore from '../../stores/UserStore';
import { useSnackbar } from 'notistack';
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function LoginForm() {
  const { enqueueSnackbar} = useSnackbar();

  const classes = useStyles();

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
    rememberPassword: false,
  });
  const [validInput, setValidInput] = useState({username:true,password:true});
  useEffect(() => {
    localStorage.clear();

    
  }, []);
  const setUsernameValue = (val) => {
    val = val.trim();
    if (val.length > 12) {
      return;
    }
    setUsername(val)

  }
  const setPasswordValue = (val) => {
    val = val.trim();
    if (val.length > 12) {
      return;
    }
    setPassword(val)

  }
  const { rememberPassword } = inputs;


  const doLogin = async () => {
    if (!username) {
      setValidInput(input => ({ ...input, username: false }))
      return;
    
    }
    if (!password) {
      setValidInput(input => ({ ...input, password: false }))
      return;
    }
setValidInput({username:true,password:true})

    try {
      let res = await fetch('http://localhost:5000/login', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });
      let result = await res.json();
      if (result && result.success) {
        enqueueSnackbar("Login Successfull")
        UserStore.isLoggedIn = true;
        UserStore.username = result.username;
        sessionStorage.setItem('username',result.username);
        sessionStorage.setItem('isLoggedIn', result.success);
        localStorage.setItem('username',result.username);
      }
      else if (result && result.success == false) {
        resetForm();
        enqueueSnackbar("Invalid Credential")
        
      }

    }
    catch (e) {
      //console.log(e);
      resetForm();
    }
  }
  const resetForm = () => {
    setUsername("")
    setPassword("")
  }
  function handleChange(e) {
    const { name, value } = e.target;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

  function handleChechbox(e) {
    const { name, value } = e.target;
    console.log("eeeeee check", e.target.type);
    console.log("eeeeee check", e.target.checked);
    console.log("eeeeee check inputs", inputs);
    console.log("eeeeee check inputs remember", inputs.rememberPassword);
    if (e.target.type === "checkbox" && !e.target.checked) {
      setInputs((inputs) => ({ ...inputs, [name]: "" }));
    } else {
      setInputs((inputs) => ({ ...inputs, [name]: value }));
    }
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
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
            label="User Name"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={event => setUsernameValue(event.target.value)}
            value={username}
            error={!validInput.username}
            helperText={!validInput.username ?" User Name Required.":''}
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
            onChange={event => setPasswordValue(event.target.value)}
            value={password}
            error={!validInput.password}
            helperText={!validInput.password ?" Password Required.":''}
          />
          <div className="form-actions">
            <br />
            <div className="form-check">
              {/* <input
                type="checkbox"
                className="form-check-input"
                id="rememberPassword"
                name="checkbox"
                checked={rememberPassword}
                onChange={(event) => handleChechbox(event)}
              // required
              /> */}
              {/* <label className="form-check-label" for="rememberPassword">
                Remember me
                    </label> */}
            </div>
          </div>
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={doLogin}
          >
            Sign In
          </Button>
          <Grid container>
            {/* <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid> */}
            {/* <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid> */}
          </Grid>
        </form>
      </div>
    
      <Box mt={8}>

      </Box>
    </Container>
  );
}

