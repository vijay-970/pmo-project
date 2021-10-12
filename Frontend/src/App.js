import React from 'react';
import UserStore from './stores/UserStore';
import { observer } from 'mobx-react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import LoginForm from './pages/Login';
// import LoginForm from './pages/Login';
import SubmitButton from './SubmitButton';
import './App.css';
import KPI from './pages/kpi/KPI';
import PMOInput from './pages/pmoinput';
//import KPI from './KPI';
import PMInput from './pages/pmInput';
import PMKPI from './pages/kpi/PMKPI'
import Home from './pages/home/home';
import Navbar from './Components/Navigation';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import MenuAppBar from './Components/AppBar';
import projectStore from './stores/ProjectStore';
//import ProjectHome from './pages/projects/ProjectHome';
import ProjectList from './pages/projects/ProjectList';
import ProjectEdit from './pages/projects/ProjectEdit';


class App extends React.Component {


  async componentDidMount() {
    try {
     // alert(UserStore.isLoggedIn);
      UserStore.loading = false;
     // UserStore.isLoggedIn = true;
      //UserStore.username ='sumit';
     let res = await fetch('http://localhost:5000/isLoggedIn', {
        method: 'get',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      let result = await res.json();
      if (result) {
        UserStore.loading = false;
        //UserStore.isLoggedIn = true;
        UserStore.username = result.sucess;

 //sessionStorage.setItem('username',result.username);
 sessionStorage.setItem('isLoggedIn', result.sucess);

      }
      else {
        UserStore.loading = false;
        UserStore.isLoggedIn = false;
        sessionStorage.setItem('username','');
        sessionStorage.setItem('isLoggedIn', false);

      }
      
    }
    catch (e) {
      console.log('eeexception');
      alert(e+"...");
      UserStore.loading = false;
      UserStore.isLoggedIn = false;

    }
  }

  async doLogout() {
    try {
      alert("logout123")
      alert(req.session.userID);
      let res = await fetch('http://localhost:5000/logout', {
        method: 'get',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      let result = await res.json();

      if (result && result.success) {
        UserStore.loading = false;
        UserStore.isLoggedIn = false;
        UserStore.username = '';
      }

    }
    catch (e) {
      console.log(e);
      console.log('eeexception');
      alert(e+"...");

    }
  }


  render() {

    if (UserStore.loading) {
      return (
        <div className="app">
          <div className="container">
            Loading, please wait..
            </div>
        </div>
      );
    }
    else {
     // alert(UserStore.username +"else"+UserStore.isLoggedIn+"..."+sessionStorage.getItem('isLoggedIn')+".."+sessionStorage.getItem('username'));
      if (sessionStorage.getItem('isLoggedIn')) {
        if ((sessionStorage.getItem('username'))) {
          console.log(projectStore.name);
          return (
           // <KPI data={[UserStore.username,1]}></KPI>
            <>
            <MenuAppBar/>
            <Grid position="fixed" styel={{color:"red"}}>PMO Audit Tool</Grid> 
              <Router>
                <Grid container spacing={3} >
                  <Grid item sm={1}>
                    <Navbar projectStore={projectStore} />
                    {/* <div justi>PMO Audit Tool</div> */}
                  </Grid>
                  <Grid  item sm={11}>
                    <Switch>
                      <Route path='/' exact={true} component={Home} />
                      <Route path='/pmInput' exact={true} render={(props) => (<PMInput data={projectStore.id} />)} />
                      <Route path='/pmoInput' exact={true} render={(props) => (<PMOInput data={projectStore.id} />)} />
                      <Route path='/KPI/PM' exact={true} render={(props) => (
                                            <PMKPI data={[sessionStorage.getItem('username'),projectStore.id]}/>)} />
                    {/*   <Route path='/KPI/SA' render={(props) => (
                                <KPI data={[sessionStorage.getItem('username'),projectStore.id]}/>)} />
                                
                    <Route path='/projects' exact={true} component={ProjectList}/> */}
                    </Switch>
                  </Grid>

                </Grid>
              </Router>
            </>

            // <div className="app">
            //   {/* <PMInput /> */}

            //   <Home/>
            //   <div className="containerTable">
            //     {/* <LoginForm/> */}

            //  <KPI></KPI>
            //     {/* <Tables data={UserStore.username}></Tables> */}
            //   </div>
            // </div>
            // <div className="app">
            //   <div className ="container">
            //     Welcome {UserStore.username}
            //     <SubmitButton text={'Log Out'} disabled ={false}
            //     onClick ={()=>this.doLogout()}/>
            //     </div>
            //     </div>
          );
        }
      }


      return (
        <div className="app">
          <div className="container">
            <Card>
              <CardContent>
                <LoginForm></LoginForm>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }
  }


}

export default observer(App);
