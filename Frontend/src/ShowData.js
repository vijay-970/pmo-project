import react from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.common.black,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  root: {
    minWidth: 350,
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
  },
});



export default function ShowData(props) {
  const projectData = JSON.parse(localStorage.getItem('tables'));
  console.log(projectData);
  const classes = useStyles();
  for (let i of projectData) {
    if (props.data === i.project_name) {
      console.log("I am In");
      return (
        <div className="projectDetails">
          <div className="projectType">
            <Card className={classes.root} variant="outlined">
              <CardContent>
                <Table className={classes.table} aria-label="customized table">
                  <TableBody>
                    <TableRow>
                      <StyledTableCell style={{ backgroundColor: "#6ad4ff" }}>Project Name</StyledTableCell>
                      <StyledTableCell align="left">{i.project_name}</StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell style={{ backgroundColor: "#78d8ff" }}>Project Start Date</StyledTableCell>
                      <StyledTableCell align="left">{i.project_start_date}</StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell style={{ backgroundColor: "#87dcff" }}>PM Name</StyledTableCell>
                      <StyledTableCell align="left">{i.PA_NAME1}</StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell style={{ backgroundColor: "#96e0ff" }}>PM Email</StyledTableCell>
                      <StyledTableCell align="left">{i["max(PM_EMAIL)"]}</StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell style={{ backgroundColor: "#a5e5ff" }}>SA Name</StyledTableCell>
                      <StyledTableCell align="left">{i.SA_NAME1}</StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell style={{ backgroundColor: "#a5e5ff" }}>SA Email</StyledTableCell>
                      <StyledTableCell align="left">{i["max(SA_EMAIL)"]}</StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell style={{ backgroundColor: "#c3edff" }}>Project Status</StyledTableCell>
                      <StyledTableCell align="left">{i.project_status}</StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell style={{ backgroundColor: "#d2f2ff" }}>FP/TM</StyledTableCell>
                      <StyledTableCell align="left">{i.project_type}</StyledTableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <div className="projectBudget">
            <Card className={classes.root} variant="outlined">
              <CardContent>
                <Table className={classes.table} aria-label="customized table">
                  <TableBody>
                    <TableRow>
                      <StyledTableCell style={{ backgroundColor: "#6ad4ff" }}>Project Milestone</StyledTableCell>
                      <StyledTableCell align="left">{i.project_milestone}</StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell style={{ backgroundColor: "#96e0ff" }}>Project % Complete</StyledTableCell>
                      <StyledTableCell align="left">{i.project_complete_percent}</StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell style={{ backgroundColor: "#b4e9ff" }}>Project Fin (Act/Bud)</StyledTableCell>
                      <StyledTableCell align="left">{i.project_fin_act_bud}</StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell style={{ backgroundColor: "#d2f2ff" }}>Project Fin (Fct/Bud)</StyledTableCell>
                      <StyledTableCell align="left">{i.project_fin_fct_bud}</StyledTableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="projectDetails">
      <div className="projectType">
        <Card className={classes.root} variant="outlined">
          <CardContent>
            <Table className={classes.table} aria-label="customized table">
              <TableBody>
                <TableRow>
                  <StyledTableCell style={{ backgroundColor: "#6ad4ff" }}>Project Name</StyledTableCell>
                  <StyledTableCell align="left">{projectData[0].project_name}</StyledTableCell>
                </TableRow>
                <TableRow>
                  <StyledTableCell style={{ backgroundColor: "#78d8ff" }}>Project Start Date</StyledTableCell>
                  <StyledTableCell align="left">{projectData[0].project_start_date}</StyledTableCell>
                </TableRow>
                <TableRow>
                  <StyledTableCell style={{ backgroundColor: "#87dcff" }}>PM Name</StyledTableCell>
                  <StyledTableCell align="left">{projectData[0].PA_NAME1}</StyledTableCell>
                </TableRow>
                <TableRow>
                  <StyledTableCell style={{ backgroundColor: "#96e0ff" }}>PM Email</StyledTableCell>
                  <StyledTableCell align="left">{projectData[0]["max(PM_EMAIL)"]}</StyledTableCell>
                </TableRow>
                <TableRow>
                  <StyledTableCell style={{ backgroundColor: "#a5e5ff" }}>SA Name</StyledTableCell>
                  <StyledTableCell align="left">{projectData[0].SA_NAME1}</StyledTableCell>
                </TableRow>
                <TableRow>
                  <StyledTableCell style={{ backgroundColor: "#a5e5ff" }}>SA Email</StyledTableCell>
                  <StyledTableCell align="left">{projectData[0]["max(SA_EMAIL)"]}</StyledTableCell>
                </TableRow>
                <TableRow>
                  <StyledTableCell style={{ backgroundColor: "#c3edff" }}>Project Status</StyledTableCell>
                  <StyledTableCell align="left">{projectData[0].project_status}</StyledTableCell>
                </TableRow>
                <TableRow>
                  <StyledTableCell style={{ backgroundColor: "#d2f2ff" }}>FP/TM</StyledTableCell>
                  <StyledTableCell align="left">{projectData[0].project_type}</StyledTableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div className="projectBudget">
        <Card className={classes.root} variant="outlined">
          <CardContent>
            <Table className={classes.table} aria-label="customized table">
              <TableBody>
                <TableRow>
                  <StyledTableCell style={{ backgroundColor: "#6ad4ff" }}>Project Milestone</StyledTableCell>
                  <StyledTableCell align="left">{projectData[0].project_milestone}</StyledTableCell>
                </TableRow>
                <TableRow>
                  <StyledTableCell style={{ backgroundColor: "#96e0ff" }}>Project % Complete</StyledTableCell>
                  <StyledTableCell align="left">{projectData[0].project_complete_percent}</StyledTableCell>
                </TableRow>
                <TableRow>
                  <StyledTableCell style={{ backgroundColor: "#b4e9ff" }}>Project Fin (Act/Bud)</StyledTableCell>
                  <StyledTableCell align="left">{projectData[0].project_fin_act_bud}</StyledTableCell>
                </TableRow>
                <TableRow>
                  <StyledTableCell style={{ backgroundColor: "#d2f2ff" }}>Project Fin (Fct/Bud)</StyledTableCell>
                  <StyledTableCell align="left">{projectData[0].project_fin_fct_bud}</StyledTableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

{/* <Typography className={classes.title}>
                  
                  </Typography>
                  <Typography variant="h5" component="h2">
                    hello boy
                  </Typography>
                  <Typography className={classes.pos} color="textSecondary">
                    adjective
                  </Typography>
                  <Typography variant="body2" component="p">
                    well meaning and kindly.
                    <br />
                    {'"a benevolent smile"'}
                  </Typography>
                  <Typography variant="body2" component="p">
                    well meaning and kindly.
                    <br />
                    {'"a benevolent smile"'}
                  </Typography>
                  <Typography variant="body2" component="p">
                    well meaning and kindly.
                    <br />
                    {'"a benevolent smile"'}
                  </Typography>
                  <Typography variant="body2" component="p">
                    well meaning and kindly.
                    <br />
                    {'"a benevolent smile"'}
</Typography> */}