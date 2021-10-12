import React, { useEffect, useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ShowData from '../../ShowData';
import { Button } from '@material-ui/core';
import OutlinedCard from './ProjectDetails';
import { Route, Router, Switch } from 'react-router';
import Navbar from '../../Components/Navigation';
import KPI from '../kpi/KPI';
import PMInput from '../pmInput';
import { Tab, Tabs } from 'react-bootstrap';
import { observer, Observer } from 'mobx-react';
import projectStore from '../../stores/ProjectStore';
import TablePagination from "@material-ui/core/TablePagination";
const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.common.black,
    borderColor:' #bebebe',
    fontSize:15,
    fontFamily:"'Montserrat', sans-serif"
    
  },
  body: {
    fontSize: 12,
    borderColor:'#bebebe',
    fontFamily:"'Montserrat', sans-serif"
    
  },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 400,
    
  },
  toolbar:{
    " & p:nth-of-type(2)":{
      fontFamily:"'Montserrat', sans-serif",
      color:'white'
    },
    " & p:nth-of-type(1)":{
      fontFamily:"'Montserrat', sans-serif",
      color:'white'
    }

  },
  input:{
    fontFamily:"'Montserrat', sans-serif",
    color:'white'
  },
  selectIcon:{
    color:'white'
  },
  root:{
    color:'white'
  }
});

const Tables = props => {
  const classes = useStyles();
  const username = props.data;
  console.log(username+".....");
  const [loading, setLoading] = useState(false);
  const [change, changePage] = useState(false);
  const [role, changeRole] = useState(0);
  const [key, setKey] = useState('home');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(3);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  // localStorage.setItem('project',JSON.stringify('project'));
  console.log(key);
  useEffect(() => {
    fetch(`http://localhost:5000/showTables/${username}`)
      .then(resp => resp.json())
      .then(json => {
        console.log({ json });
          props.projectStore.changeRole(json[0].roleId,json[0].PMO);
        localStorage.setItem('tables', JSON.stringify(json));
        setLoading(true);
      });
  }, []);
  console.log(loading);
  let rows = JSON.parse(localStorage.getItem('tables'));
  console.log(key.includes('PM'));
  const projectPMO = rows.map(item=>item.PMO).filter((value,index,self)=>self.indexOf(value)===index);
  console.log(projectPMO[0]);
  let roleId = JSON.parse(localStorage.getItem('project'));

 // style={{ borderRadius: '4px' }}
  if (loading) {
    if (props.projectStore.id===rows[0].project_id) {
      props.projectStore.changeRole(rows[0].roleId,rows[0].PMO);
    }
    else{
      props.projectStore.changeRole(roleId,rows[0].PMO);
    }
    return (
      <div className="tableHead shadowClass" style={{ borderRadius: '9px' }} >
              {/* <ShowData data={projectname}/> */}
              {/* <OutlinedCard data={projectname}/> */}
              <h2><b>Project Health Dashboard</b></h2>
              <TableContainer
                component={Paper}
                style={{ borderRadius: '10px',border:'2px solid black'}}
              >
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow className="tableField">
                      <StyledTableCell align="center" style={{backgroundColor:"#DCDCDC"}}>
                        <b>Project</b>
                      </StyledTableCell>
                      <StyledTableCell align="left" style={{backgroundColor:"#DCDCDC"}}><b>Milestone</b></StyledTableCell>
                      <StyledTableCell align="left" style={{backgroundColor:"#DCDCDC"}}><b>FP/TM</b></StyledTableCell>
                      <StyledTableCell align="left" style={{borderRight:'1px solid',backgroundColor:"#DCDCDC"}}><b>
                        Comp</b>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        colSpan="2"
                        className="border" style={{borderRight:'1px solid',backgroundColor:"#DCDCDC"}}
                      >
                        <b>PM KPI</b>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        colSpan="2"
                        className="border" style={{borderRight:'1px solid',backgroundColor:"#DCDCDC"}}
                      >
                        <b>SA KPI</b>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        colSpan="2"
                        className="border" style={{backgroundColor:"#DCDCDC"}}
                      >
                        <b>Proj Fin</b>
                      </StyledTableCell>
                    </TableRow>
                    <StyledTableRow key="first row">
                      <StyledTableCell component="th" scope="row" colSpan='4' style={{borderRight:'1px solid'}}>
                        
                      </StyledTableCell>
                      {/* <StyledTableCell align="left">&nbsp;</StyledTableCell>
                      <StyledTableCell align="left">&nbsp;</StyledTableCell>
                      <StyledTableCell align="left">&nbsp;</StyledTableCell> */}
                      <StyledTableCell align="left" className="border" style={{fontSize:13}}>
                       <b>Self</b>
                      </StyledTableCell>
                      <StyledTableCell align="left" className="border" style={{fontSize:13,borderRight:'1px solid'}}>
                        <b>PMO</b>
                      </StyledTableCell>
                      <StyledTableCell align="left" className="border" style={{fontSize:13}}>
                        <b>Self</b>
                      </StyledTableCell>
                      <StyledTableCell align="left" className="border" style={{fontSize:13,borderRight:'1px solid'}}>
                        <b>PMO</b>
                      </StyledTableCell>
                      <StyledTableCell align="left" className="border" style={{fontSize:13}}>
                        <b>Act/Bud</b>
                      </StyledTableCell>
                      <StyledTableCell align="left" className="border" style={{fontSize:13}}>
                        <b>Fct/Bud</b>
                      </StyledTableCell>
                      {/* <StyledTableCell align="left">&nbsp;</StyledTableCell> */}
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    
                    {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
                      <StyledTableRow key={row.project_name}>
                        <StyledTableCell
                          align="left"
                          component="th"
                          scope="row"
                        >
                          <Button
                            className="btn"
                            size="small"
                            style={{fontSize:15,fontWeight:'bold',fontFamily:"'Montserrat', sans-serif"}}
                            onClick={() => {
                              props.getProjectName(row.project_name);
                              localStorage.setItem(
                                'project',
                                JSON.stringify(row.roleId)
                              );
                              props.projectStore.changeProject(row.project_name,row.project_id);
                              props.projectStore.changeRole(row.roleId,projectPMO[0]);
                            }}
                          >
                            {row.project_name}
                          </Button>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.project_milestone}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.project_type}
                        </StyledTableCell>
                        <StyledTableCell align="center" style={{borderRight:'1px solid'}}>
                          {row.project_complete_percent}%
                        </StyledTableCell>
                        <StyledTableCell align="left" style={{borderRight:'1px solid'}}>{(row.pm_selfscore||0).toFixed(0)||0}%</StyledTableCell>
                        {row.pm_pmoscore >=85?<StyledTableCell align="left" style={{borderRight:'1px solid',backgroundColor:'green'}}>{row.pm_pmoscore||0}%</StyledTableCell>:row.pm_pmoscore >=70&&row.pm_pmoscore <85?<StyledTableCell align="left" style={{borderRight:'1px solid',backgroundColor:'yellow'}}>{row.pm_pmoscore||0}%</StyledTableCell>:row.pm_pmoscore <70?<StyledTableCell align="left" style={{borderRight:'1px solid',backgroundColor:'red'}}>{row.pm_pmoscore||0}%</StyledTableCell>:null}
                        <StyledTableCell align="left" style={{borderRight:'1px solid'}}>{(row.sa_selfscore||0).toFixed(0)}%</StyledTableCell>
                        {row.sa_pmoscore >=85?<StyledTableCell align="left" style={{borderRight:'1px solid',backgroundColor:'green'}}>{row.sa_pmoscore||0}%</StyledTableCell>:row.sa_pmoscore >=70&&row.sa_pmoscore <85?<StyledTableCell align="left" style={{borderRight:'1px solid',backgroundColor:'yellow'}}>{row.sa_pmoscore||0}%</StyledTableCell>:row.sa_pmoscore <70?<StyledTableCell align="left" style={{borderRight:'1px solid',backgroundColor:'red'}}>{row.sa_pmoscore||0}%</StyledTableCell>:null}
                        {row.project_fin_act_bud > 110 && row.project_type==='FP'?<StyledTableCell style={{backgroundColor:'red',borderRight:'1px solid'}}align="center">
                          {row.project_fin_act_bud}%
                        </StyledTableCell>:row.project_fin_act_bud > 101 && row.project_fin_act_bud <=110 && row.project_type==='FP'?<StyledTableCell style={{backgroundColor:'yellow',borderRight:'1px solid'}}align="center">
                          {row.project_fin_act_bud}%
                        </StyledTableCell>:row.project_fin_act_bud <= 100 && row.project_type==='FP'?<StyledTableCell style={{backgroundColor:'green',borderRight:'1px solid'}}align="center">
                          {row.project_fin_act_bud}%
                        </StyledTableCell>:row.project_fin_act_bud<= 80 && row.project_type==='TM'?<StyledTableCell style={{backgroundColor:'red',borderRight:'1px solid'}} align="center">
                          {row.project_fin_act_bud}%
                        </StyledTableCell>:row.project_fin_act_bud>80&&row.project_fin_act_bud<=100&& row.project_type==='TM'?<StyledTableCell style={{backgroundColor:'yellow',borderRight:'1px solid'}}align="center">
                          {row.project_fin_act_bud}%
                        </StyledTableCell>:row.project_fin_act_bud>100 && row.project_type==='TM'?<StyledTableCell style={{backgroundColor:'green',borderRight:'1px solid'}}align="center">
                          {row.project_fin_act_bud}%
                        </StyledTableCell>:<StyledTableCell align="center" style={{borderRight:'1px solid'}}>
                          {row.project_fin_act_bud}%
                        </StyledTableCell>}
                        {row.project_fin_fct_bud>120&&row.project_type==='FP'?<StyledTableCell style={{backgroundColor:'red'}}align="center">
                          {row.project_fin_fct_bud}%
                        </StyledTableCell>:row.project_fin_fct_bud>110&&row.project_fin_fct_bud<=120&&row.project_type==='FP'?<StyledTableCell style={{backgroundColor:'yellow'}}align="center">
                          {row.project_fin_fct_bud}%
                        </StyledTableCell>:row.project_fin_fct_bud<=110&&row.project_type==='FP'?<StyledTableCell style={{backgroundColor:'green'}}align="center">
                          {row.project_fin_fct_bud}%
                        </StyledTableCell>:row.project_fin_fct_bud<=70&&row.project_type==='TM'?<StyledTableCell style={{backgroundColor:'red'}}align="center">
                          {row.project_fin_fct_bud}%
                        </StyledTableCell>:row.project_fin_fct_bud>70&&row.project_fin_fct_bud<=100&&row.project_type==='TM'?<StyledTableCell style={{backgroundColor:'yellow'}}align="center">
                          {row.project_fin_fct_bud}%
                        </StyledTableCell>:row.project_fin_fct_bud>100&&row.project_type==='TM'?<StyledTableCell style={{backgroundColor:'green'}}align="center">
                          {row.project_fin_fct_bud}%
                        </StyledTableCell>:<StyledTableCell align="center">
                          {row.project_fin_fct_bud}%
                        </StyledTableCell>}
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
        rowsPerPageOptions={[3, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        classes ={{
          toolbar: classes.toolbar,
          input:classes.input,
          selectIcon:classes.selectIcon,
          root:classes.root
        }}
      />
            </div>
    );
  } else {
    return (
      <div className="app">
        <div className="container">Loading, please wait..</div>
      </div>
    );
  }
};
export default observer(Tables);
