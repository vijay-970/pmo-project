import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
const useStyles = makeStyles({
    root: {
        minWidth: 400,
        color:'white'
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
        fontFamily:"'Montserrat', sans-serif",
        fontSize:11
    },
});

export default function OutlinedCard(props) {
    const projectData = JSON.parse(localStorage.getItem('tables'));
    console.log(props.data);
    const classes = useStyles();
    for (let i of projectData) {
        //debugger
        if (props.data === i.project_name) {
            console.log("I am In");
            return (
                <div >
                    <Card className="projectBudget shadowClass"  style={{boxShadow:'none'}}>
                        <CardContent>
                            <Typography className={classes.pos} variant="h7" component="h4" color="textPrimary" gutterBottom style={{color:'black'}}> Project Name
                            <Typography className={classes.pos}>{i.project_name}</Typography></Typography>
                            <Typography className={classes.pos} variant="h7" component="h4" color="textPrimary" gutterBottom style={{color:'black'}}>Project Start Date
                            <Typography className={classes.pos}>{i.project_start_date.split("T")[0]}</Typography></Typography>
                            <Typography className={classes.pos} variant="h7" component="h4" color="textPrimary" gutterBottom style={{color:'black'}}>PM Name
                            <Typography className={classes.pos}>{i.PA_NAME1}</Typography></Typography>
                            <Typography className={classes.pos} variant="h7" component="h4" color="textPrimary" gutterBottom style={{color:'black'}}>PM Email
                            <Typography className={classes.pos}>{i["max(PM_EMAIL)"]}</Typography></Typography>
                            <Typography className={classes.pos} variant="h7" component="h4" color="textPrimary" gutterBottom style={{color:'black'}}>SA Name
                            <Typography className={classes.pos}>{i.SA_NAME1}</Typography></Typography>
                            <Typography className={classes.pos} variant="h7" component="h4" color="textPrimary" gutterBottom style={{color:'black'}}>SA Email
                            <Typography className={classes.pos}>{i["max(SA_EMAIL)"]}</Typography></Typography>
                            <Typography className={classes.pos} variant="h7" component="h4" color="textPrimary" gutterBottom style={{color:'black'}}>Project Status
                            <Typography className={classes.pos}>{i.project_status}</Typography></Typography>
                            {/* <Typography className={classes.pos} variant="h7" component="h4" color="textPrimary" gutterBottom style={{color:'#d93'}}>Project Status
                            <Typography className={classes.pos}>{i.project_status}</Typography></Typography>
                            <Typography className={classes.pos} variant="h7" component="h3" color="textPrimary" gutterBottom style={{color:'#d93'}}>FP/TM
                            <Typography className={classes.pos}>{i.project_type}</Typography></Typography>
                            <Typography className={classes.pos} variant="h7" component="h3" color="textPrimary" gutterBottom style={{color:'#d93'}}>Project Milestone
                            <Typography className={classes.pos}>{i.project_milestone}</Typography></Typography>
                            <Typography className={classes.pos} variant="h7" component="h3" color="textPrimary" gutterBottom style={{color:'#d93'}}>Project % Complete
                            <Typography className={classes.pos}>{i.project_complete_percent}</Typography></Typography>
                            <Typography className={classes.pos} variant="h7" component="h3" color="textPrimary" gutterBottom style={{color:'#d93'}}>Project Fin (Act/Bud)
                            <Typography className={classes.pos}>{i.project_fin_act_bud}</Typography></Typography>
                            <Typography className={classes.pos} variant="h7" component="h3" color="textPrimary" gutterBottom style={{color:'#d93'}}>Project Fin (Fct/Bud)
                            <Typography className={classes.pos}>{i.project_fin_fct_bud}</Typography></Typography> */}
                        </CardContent>

                    </Card>
                </div>
            );
        }
    }
    return (
        <div >
            <Card className="projectBudget shadowClass " style={{boxShadow:'none'}}>

                <CardContent style={{borderBottom:'none'}}>
                    <Typography className={classes.pos} variant="h7" component="h4" color="textPrimary" gutterBottom style={{color:'black'}}> Project Name
                    <Typography className={classes.pos}>{projectData[0].project_name}</Typography></Typography>
                    <Typography className={classes.pos} variant="h7" component="h4" color="textPrimary" gutterBottom style={{color:'black'}}>Project Start Date
                    <Typography className={classes.pos}>{projectData[0].project_start_date.split("T")[0]}</Typography></Typography>
                    <Typography className={classes.pos} variant="h7" component="h4" color="textPrimary" gutterBottom style={{color:'black'}}>PM Name
                    <Typography className={classes.pos}>{projectData[0].PA_NAME1}</Typography></Typography>
                    <Typography className={classes.pos} variant="h7" component="h4" color="textPrimary" gutterBottom style={{color:'black'}}>PM Email
                    <Typography className={classes.pos}>{projectData[0]["max(PM_EMAIL)"]}</Typography></Typography>
                    <Typography className={classes.pos} variant="h7" component="h4" color="textPrimary" gutterBottom style={{color:'black'}}>SA Name
                    <Typography className={classes.pos}>{projectData[0].SA_NAME1}</Typography></Typography>
                    <Typography className={classes.pos} variant="h7" component="h4" color="textPrimary" gutterBottom style={{color:'black'}}>SA Email
                    <Typography className={classes.pos}>{projectData[0]["max(SA_EMAIL)"]}</Typography></Typography>
                    <Typography className={classes.pos} variant="h7" component="h4" color="textPrimary" gutterBottom style={{color:'black'}}>Project Status
                    <Typography className={classes.pos}>{projectData[0].project_status}</Typography></Typography>
                    {/* <Typography className={classes.pos} variant="h7" component="h3" color="textPrimary" gutterBottom style={{color:'#d93'}}>Project Status
                    <Typography className={classes.pos}>{projectData[0].project_status}</Typography></Typography>
                    <Typography className={classes.pos} variant="h7" component="h3" color="textPrimary" gutterBottom style={{color:'#d93'}}>FP/TM
                    <Typography className={classes.pos}>{projectData[0].project_type}</Typography></Typography>
                    <Typography className={classes.pos} variant="h7" component="h3" color="textPrimary" gutterBottom style={{color:'#d93'}}>Project Milestone
                    <Typography className={classes.pos}>{projectData[0].project_milestone}</Typography></Typography>
                    <Typography className={classes.pos} variant="h7" component="h3" color="textPrimary" gutterBottom style={{color:'#d93'}}>Project % Complete
                            <Typography className={classes.pos}>{projectData[0].project_complete_percent}</Typography></Typography>
                            <Typography className={classes.pos} variant="h7" component="h3" color="textPrimary" gutterBottom style={{color:'#d93'}}>Project Fin (Act/Bud)
                            <Typography className={classes.pos}>{projectData[0].project_fin_act_bud}</Typography></Typography>
                            <Typography className={classes.pos} variant="h7" component="h3" color="textPrimary" gutterBottom style={{color:'#d93'}}>Project Fin (Fct/Bud)
                            <Typography className={classes.pos}>{projectData[0].project_fin_fct_bud}</Typography></Typography> */}
                </CardContent>

            </Card>
        </div>
    );
}