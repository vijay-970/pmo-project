import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import UserStore from '../stores/UserStore';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 5,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function MenuAppBar() {
  const classes = useStyles();
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const history = useHistory();

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

   const handleLogout= async ()=> {
     /*
    let res = await fetch('http://localhost:5000/logout', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
    });
    let result = await res.json();

    if (result && result.success) {
      window.history.push('/');
    }
    */
    try {
      alert("logout1")
       sessionStorage.clear();
     // localStorage.clear();
     sessionStorage.setItem('isLoggedIn',false);
     //sessionStorage.setItem('username',null);
      UserStore.username = '';
      let res =  fetch('http://localhost:5000/logout', {
        method: 'get',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
       // alert(res);
      //let result =  res.json();

      /*if (result && result.success) {
        UserStore.loading = false;
        UserStore.isLoggedIn = false;
        UserStore.username = '';
      } */

    }
    catch (e) {
      console.log(e);
      console.log('eeexception');
      alert(e+"...");

    }
    UserStore.loading = false;
    UserStore.isLoggedIn = false;
    UserStore.username = '';

    sessionStorage.setItem('username',null);
    sessionStorage.setItem('isLoggedIn', 'false');
    window.location.href='/';
   };

  return (
    <div className="AppBar ">
      <div className={classes.root}>
        {/* <FormGroup>
        <FormControlLabel
          control={<Switch checked={auth} onChange={handleChange} aria-label="login switch" />}
          label={auth ? 'Logout' : 'Login'}
        />
      </FormGroup> */}
        <AppBar
          style={{ backgroundColor: '#b31317' }}
          className="Logo"
          position="fixed"
        >
          <Toolbar>
            {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton> */}
            <Typography variant="h6" className={classes.title}></Typography>
            {auth && (
              <div>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                  <MenuItem onClick={handleClose}>My account</MenuItem>
                  <MenuItem onClick={handleLogout}>Log out</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </div>
    </div>
  );
}
