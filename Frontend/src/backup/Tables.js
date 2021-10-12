import React, { useState, useEffect, useLayoutEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { render } from '@testing-library/react';
import Button from '@material-ui/core/Button';
import KPI from '../KPI';

import ShowData from '../ShowData';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.common.black
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

function createData(projectname, milestone, tm, com) {
  return { projectname, milestone, tm, com };
}

// const rows = [
//   createData('Costco', 'Sprint5', 'FP', '70%'),
//   createData('FSC', 'CRP3', 'FP', '30%'),
//   createData('M Sumi', 'SIT', 'TM', '80%')
// ];

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

//localStorage.setItem('tables',JSON.stringify([{"project_name":"","project_status":"","project_start_date":"2020-07-20T18:30:00.000Z","project_type":"TM","project_milestone":"","project_complete_percent":80,"project_fin_act_bud":90,"project_fin_fct_bud":105,"SA_NAME1":"himanshu","PA_NAME1":"nikhil","max(SA_EMAIL)":"himanshu.kumar@accelalpha.com","max(PM_EMAIL)":"nikhil.chandra@accelalpha.com"},{"project_name":"FSC","project_status":"ON-HOLD","project_start_date":"2020-05-20T18:30:00.000Z","project_type":"TM","project_milestone":"SIT","project_complete_percent":60,"project_fin_act_bud":80,"project_fin_fct_bud":80,"SA_NAME1":"john","PA_NAME1":"himanshu","max(SA_EMAIL)":"john.saunders@accelalpha.com","max(PM_EMAIL)":"himanshu.kumar@accelalpha.com"},{"project_name":"M SUMI","project_status":"OPEN","project_start_date":"2020-08-20T18:30:00.000Z","project_type":"TM","project_milestone":"CRP1","project_complete_percent":30,"project_fin_act_bud":70,"project_fin_fct_bud":80,"SA_NAME1":null,"PA_NAME1":null,"max(SA_EMAIL)":null,"max(PM_EMAIL)":null}]))

export default function Tables(props) {
  const classes = useStyles();
  const username = props.data;
  console.log(username);
  const [projectname, setProjectname] = useState('Default');
  const [loading, setLoading] = useState(false);
  const [change, changePage] = useState(false);
  useEffect(() => {
    fetch(`http://localhost:5000/showTables/${username}`)
      .then(resp => resp.json())
      .then(json => { localStorage.setItem('tables', JSON.stringify(json)); setLoading(true) })
  }, []);
  // localStorage.setItem('tables', JSON.stringify(json))
  console.log(loading);
  let rows = JSON.parse(localStorage.getItem('tables'));
  if (change) {
    return (
      <KPI></KPI>
    )
  }
  else {
    if (loading) {

      return (
        <div className="tableField">
          <ShowData data={projectname} />
          <h3>Project Health Dashboard</h3>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell><b>Project Name</b></StyledTableCell>
                  <StyledTableCell align="left"><b>Milestone</b></StyledTableCell>
                  <StyledTableCell align="left"><b>FP/TM</b></StyledTableCell>
                  <StyledTableCell align="left"><b>%Com</b></StyledTableCell>
                  <StyledTableCell align="left"><b>KPI</b></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <StyledTableRow key={row.project_name}>
                    <StyledTableCell component="th" scope="row">
                      <Button size="small" onClick={() => setProjectname(row.project_name)}>{row.project_name}</Button>
                    </StyledTableCell>
                    <StyledTableCell align="left">{row.project_milestone}</StyledTableCell>
                    <StyledTableCell align="left">{row.project_type}</StyledTableCell>
                    <StyledTableCell align="left">{row.project_complete_percent}</StyledTableCell>
                    <StyledTableCell align="left"><Button size="small" onClick={() => changePage(true)}><u>{row.project_name}</u></Button></StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      );
    }
    else {
      return (
        <div className="app">
          <div className="container">
            Loading, please wait..
        </div>
        </div>
      );
    }
  }
}


