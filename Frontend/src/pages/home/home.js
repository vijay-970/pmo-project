import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CustomizedTables from './ProjectHealth';
import { Button, CircularProgress } from '@material-ui/core';
import CircularProgressWithLabel from './progressBar';
import OutlinedCard from './ProjectDetails';
import Tables from './ProjectHealth';
import UserStore from '../../stores/UserStore';
import ShowData from '../../ShowData';
import { Progress } from './Progress';
import { Image } from 'react-bootstrap';
import projectStore from '../../stores/ProjectStore';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

export default function Home(props) {
    const username = sessionStorage.getItem('username');
    //const username = UserStore.username;
    console.log(username);
    const [loading, setLoading] = useState(false);
  const [change, changePage] = useState(false);
  const [role, changeRole] = useState(0);
  const [key, setKey] = useState('home');
    useEffect(() => {
        fetch(`http://localhost:5000/showTables/${username}`)
          .then(resp => resp.json())
          .then(json => {
            console.log({ json });
            localStorage.setItem('tables', JSON.stringify(json));
            setLoading(true);
          });
      }, []);
      console.log(loading);
      let rows = JSON.parse(localStorage.getItem('tables'));
      console.log(key.includes('PM'));
    
    const classes = useStyles();
    const [projectname, setProjectname] = useState(projectStore.name);
    const [progress, setProgress] = useState({ value: 10, color: 'black' })
    useEffect(() => {
        setProgressColor(progress.value)
    }, [progress.value])

    function setProgressColor(value) {
        if (value >= 0 && value <= 20) setProgress(p => ({ ...p, color: 'red' }))
        if (value === 40) setProgress(p => ({ ...p, color: 'green' }))
        if (value === 60) setProgress(p => ({ ...p, color: 'blue' }))
    }
    if(loading){
    return (
        <div className={classes.root}>
            {/* <Grid className="Logoo"  item sm={10}
            container 
            direction="row"
            justify="center"
            alignItems="baseline"
            variant="contained" style={{backgroundColor:"white",color:"red"}}>PMO Audit Tool
                
            </Grid> */}
            
            <Grid container spacing={2}>
                {/* <Grid item sm={2}
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="stretch"> hello anurag
                </Grid> */}
                <Grid item sm={9}>

                    <Grid container spacing={2} direction="column" >

                        <Grid item style={{margin:3}} spacing={5} >
                            <Tables projectStore={projectStore} data={UserStore.username} getProjectName={(projectname1) => 
                                {setProjectname(projectname1)}} />
                        </Grid>
                        {/* <Grid item >
                            <Progress data={projectname} />
                        </Grid> */}
                    </Grid>

                </Grid>
                <Grid item sm={3}>

                    <OutlinedCard data={projectname} />


                </Grid>
            </Grid>
        </div>
    );
}
else{
    return(
    <div>
      Loading please wait....
    </div>
    )
}

}

