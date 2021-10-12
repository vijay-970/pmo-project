import React, { useState, useEffect, useLayoutEffect } from 'react';
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
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#b31317',
    color: theme.palette.common.black,
    width:100,
    fontFamily:'Arial, Helvetica, sans-serif'


  },
  body: {
    fontSize: 12,
    height: 50,
    width:100,
    fontFamily:'Arial, Helvetica, sans-serif'
  }
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
   
   
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 600,
  },
  container: {
    maxHeight: 600
  }
});


export default function KPI(props) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [value, changeValue] = useState([0, 0, 0, 0, 0, 0]);
  const [pmovalue, pmoValue] = useState([0, 0, 0, 0, 0, 0]);
  const [notes, Notes] = useState([0, 0, 0, 0, 0, 0]);
  const [pmonotes, pmoNotes] = useState([0, 0, 0, 0, 0]);
  const [key, setKey] = useState("KPI");


  const reducer = (accumulator, currentValue) => parseFloat(accumulator) + parseFloat(currentValue);

  console.log(value[0]);

  useEffect(() => {
    fetch('http://localhost:5000/showKPI', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: props.data[0],
        project_id: props.data[1]
      }),
    })
      .then(resp => resp.json())
      .then(json => { localStorage.setItem('KPI', JSON.stringify(json)); setLoading(true) })
  }, []);

  if (value[0] !== 0) {
    fetch('http://localhost:5000/points', {
      method: 'PUT', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        POINTS: value[0],
        project_id: value[2],
        kpi_header_id: value[3],
        kpi_detail_id: value[4],
        ROLE: value[5]
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Success:", data); value[0] = 0; value[1] = 0; value[2] = 0; value[3] = 0; value[4] = 0;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  console.log(pmovalue);

  if (pmovalue[0] !== 0) {
    fetch('http://localhost:5000/pmopoints', {
      method: 'PUT', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        KPI_PMO_POINTS: pmovalue[0],
        project_id: pmovalue[2],
        kpi_header_id: pmovalue[3],
        kpi_detail_id: pmovalue[4]
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Success:", data); pmovalue[0] = 0; pmovalue[1] = 0; pmovalue[2] = 0; pmovalue[3] = 0; pmovalue[4] = 0;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  if (pmovalue[0] !== 0) {
    fetch('http://localhost:5000/scores', {
      method: 'PUT', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        KPI_SCORE: pmovalue[5],
        project_id: pmovalue[2],
        kpi_header_id: pmovalue[3],
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Success:", data); pmovalue[0] = 0; pmovalue[1] = 0; pmovalue[2] = 0; pmovalue[3] = 0; pmovalue[4] = 0;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  if (notes[0] !== 0) {
    fetch('http://localhost:5000/notes', {
      method: 'PUT', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        notes: notes[0],
        project_id: notes[2],
        kpi_header_id: notes[3],
        kpi_detail_id: notes[4],
        ROLE: notes[5]
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Success:", data); notes[0] = 0; notes[1] = 0; notes[2] = 0; notes[3] = 0; notes[4] = 0;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  if (pmonotes[0] !== 0) {
    fetch('http://localhost:5000/pmonotes', {
      method: 'PUT', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        KPI_PMO_NOTES: pmonotes[0],
        project_id: pmonotes[2],
        kpi_header_id: pmonotes[3],
        kpi_detail_id: pmonotes[4]
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Success:", data); pmonotes[0] = 0; pmonotes[1] = 0; pmonotes[2] = 0; pmonotes[3] = 0; pmonotes[4] = 0;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  console.log("Hello");

  if (loading) {

    let values = JSON.parse(localStorage.getItem('KPI'));
    const roleName = values.map(item => item.ROLE).filter((value, index, self) => self.indexOf(value) === index);
    //const updateValue = JSON.parse(localStorage.getItem('KPI'));
    const newUpdateValue = values.map((item) => {
      var temp = Object.assign({}, item);
      if (temp.kpi_header_id === value[3] && temp.kpi_detail_id === value[4]) {
        temp.POINTS = value[0];
      }
      if (temp.kpi_header_id === pmovalue[3] && temp.kpi_detail_id === pmovalue[4]) {
        temp.kpi_pmo_points = pmovalue[0];
      }
      if (temp.kpi_header_id === pmovalue[3]) {
        temp.kpi_score = pmovalue[5];
      }
      return temp;
    });
    localStorage.setItem('KPI', JSON.stringify(newUpdateValue));

    values = JSON.parse(localStorage.getItem('KPI'));

    //const reducer = (accumulator, currentValue) => parseInt(accumulator) + parseInt(currentValue);

    const unique = [];
    const map = new Map();
    for (let i of values) {
      if (!map.has(i.kpi_desc)) {
        map.set(i.kpi_desc, true);
        unique.push({ kpi_desc: i.kpi_desc, kpi_weight: i.kpi_weight, role: i.ROLE });
      }
    }
    console.log(roleName[0]);

      return (
        //   <Tabs
        //   id="controlled-tab-example"
        //   activeKey={key === 'KPI'?`${roleName[0]} ${key}`:'Home'}
        //   onSelect={(k) => setKey(k)}
        // >

        //   <Tab eventKey="Home" title="Home"><Tables data ={props.data[0]}/></Tab>

        //   <Tab eventKey="SA KPI" title="SA KPI">
        <div className="kpiTable">
          SA KPI
          <TableContainer  className={classes.container}>

            <Table stickyHeader aria-label="sticky table" className={classes.table}>
            
              <TableHead>
                <TableRow>
                  <StyledTableCell className="sticky"style={{maxWidth:100,textAlign:'center'}}><b>Category</b></StyledTableCell>
                  <StyledTableCell className="sticky"style={{maxWidth:100,textAlign:'left'}}><b>Details</b></StyledTableCell>
                  <StyledTableCell className="sticky"style={{maxWidth:100,textAlign:'center'}}><b>Max Points</b></StyledTableCell>
                  <StyledTableCell className="sticky"style={{maxWidth:100,textAlign:'center'}}><b>SA Points</b></StyledTableCell>
                  <StyledTableCell className="sticky"style={{maxWidth:100,textAlign:'center'}}><b>PMO Points</b></StyledTableCell>
                  <StyledTableCell className="sticky"style={{maxWidth:100,textAlign:'center'}}><b>Weight</b></StyledTableCell>
                  <StyledTableCell className="sticky"style={{maxWidth:100,textAlign:'center'}}><b>Score</b></StyledTableCell>
                  <StyledTableCell className="sticky"style={{maxWidth:100,textAlign:'left'}}><b>SA Notes</b></StyledTableCell>
                  <StyledTableCell className="sticky"style={{maxWidth:100,textAlign:'left'}}><b>PMO Notes</b></StyledTableCell>
                </TableRow>
              </TableHead>
              {unique.map((rows) => (
                <TableRow>
                 <StyledTableCell colSpan="9">
                  <Table className={classes.table} aria-label="customized table" style={{border:1}}>
                    <TableBody>
                    {values.filter((row) => (row.kpi_desc === rows.kpi_desc)).map((row,i,arr) => (
                      <StyledTableRow key={row}>
                        {i==0?<StyledTableCell component="td" rowSpan={arr.length} style={{maxWidth:100,textAlign:'center'}}>
                          {rows.kpi_desc}
                        </StyledTableCell>:null}
                        <StyledTableCell component="td" style={{maxWidth:100,textAlign:'left'}}>
                          {row.kpi_detail_task_name}
                        </StyledTableCell>
                        <StyledTableCell component="td" style={{maxWidth:100,textAlign:'center'}}>
                          {row.kpi_max_points}
                        </StyledTableCell>
                        <StyledTableCell component="td" style={{maxWidth:100,textAlign:'center'}}>
                        <input type="text" className="saInput" defaultValue={row.POINTS} size="1" onChange={event => changeValue([event.target.value || 0, rows.kpi_desc, row.project_id, row.kpi_header_id, row.kpi_detail_id, rows.role])} />
                        </StyledTableCell>
                        <StyledTableCell component="td" style={{maxWidth:100,textAlign:'center'}}>
                        <input type="text" className="saInput" defaultValue={row.kpi_pmo_points} size="1" onChange={event => pmoValue([event.target.value || 0, rows.kpi_desc, row.project_id, row.kpi_header_id, row.kpi_detail_id, values.filter((rowvalue) => (rowvalue.kpi_desc === rows.kpi_desc)).map((rowdata) => (rowdata.kpi_pmo_points)).reduce(reducer, (parseFloat(event.target.value || 0) - parseFloat(row.kpi_pmo_points))) * rows.kpi_weight / 100])} />
                        </StyledTableCell>
                      {i===0?<StyledTableCell component="td" rowSpan={arr.length} style={{maxWidth:100,textAlign:'center'}}>
                      {rows.kpi_weight}
                        </StyledTableCell>:null}
                        {i===0?<StyledTableCell component="td" rowSpan={arr.length} style={{maxWidth:100,textAlign:'center'}}> 
                        {(rows.kpi_desc === pmovalue[1] ? values.filter((row) => (row.kpi_desc === pmovalue[1])).map((row) => row.kpi_pmo_points).reduce(reducer) : values.filter((row) => (row.kpi_desc === rows.kpi_desc)).map((row) => row.kpi_pmo_points).reduce(reducer, 0)) * rows.kpi_weight / 100}
                        </StyledTableCell>:null}
                        <StyledTableCell style={{maxWidth:100,textAlign:'center'}}>
       <textarea style={{height:20,maxwidth:100,resize:'vertical'}}text-align="center" defaultValue={row.NOTES} className="saInput"  onBlur={event => Notes([event.target.value || 0, rows.kpi_desc, row.project_id, row.kpi_header_id, row.kpi_detail_id, rows.role])} />
     
    </StyledTableCell>
                        <StyledTableCell style={{maxWidth:100,textAlign:'center'}}><textarea style={{height:20,maxwidth:100,resize:'vertical'}} type="text" text-align="center" defaultValue={row.kpi_pmo_notes} className="saInput" size="10" onBlur={event => pmoNotes([event.target.value || 0, rows.kpi_desc, row.project_id, row.kpi_header_id, row.kpi_detail_id])} /></StyledTableCell>
                        </StyledTableRow>
                        ))}

                        <StyledTableRow key="hello">
                          
                          <StyledTableCell align="left">
                        </StyledTableCell>
                        <StyledTableCell align="left"><b>Total</b>
                       </StyledTableCell>
                       <StyledTableCell  style={{maxWidth:100,textAlign:'center'}}><b>{values.filter((row) => (row.kpi_desc === rows.kpi_desc)).map((row) => row.kpi_max_points).reduce(reducer)}</b>
                        </StyledTableCell>
                        <StyledTableCell id={rows} style={{maxWidth:100,textAlign:'center'}}><b>{rows.kpi_desc === value[1] ? values.filter((row) => (row.kpi_desc === value[1])).map((row) => row.POINTS).reduce(reducer) : values.filter((row) => (row.kpi_desc === rows.kpi_desc)).map((row) => row.POINTS).reduce(reducer, 0)}</b>
                        </StyledTableCell>
                        <StyledTableCell align="left" style={{maxWidth:100,textAlign:'center'}}><b>{rows.kpi_desc === pmovalue[1] ? values.filter((row) => (row.kpi_desc === pmovalue[1])).map((row) => row.kpi_pmo_points).reduce(reducer) : values.filter((row) => (row.kpi_desc === rows.kpi_desc)).map((row) => row.kpi_pmo_points).reduce(reducer, 0)}</b>
                        </StyledTableCell>
                        <StyledTableCell align="left" style={{maxWidth:100,textAlign:'center'}}>
                        </StyledTableCell>
                        <StyledTableCell align="left" style={{maxWidth:100,textAlign:'center'}}>
                        </StyledTableCell>
                        <StyledTableCell align="left" style={{maxWidth:100,textAlign:'center'}}>
                        </StyledTableCell>
                       </StyledTableRow> 
                        {/* // <StyledTableCell align="left">
                          
                        //     <StyledTableRow key={row.kpi_detail_task_name}>
                        //       <StyledTableCell align="left">{row.kpi_detail_task_name}</StyledTableCell>
                        //     </StyledTableRow>
  
                        // </StyledTableCell>
                        // <StyledTableCell align="left">
                        //   {values.filter((row) => (row.kpi_desc === rows.kpi_desc)).map((row) => ( 
                        //     <StyledTableRow key={row.kpi_detail_task_name}>
                        //       <StyledTableCell align="left">{row.kpi_max_points}</StyledTableCell>
                        //     </StyledTableRow>
                        //   ))}
                        // </StyledTableCell>
                        // <StyledTableCell align="left">
                        //   {values.filter((row) => (row.kpi_desc === rows.kpi_desc)).map((row) => (
                        //     <StyledTableRow key={row.kpi_detail_task_name}>
                        //       <StyledTableCell align="left"><input type="text" className="saInput" defaultValue={row.POINTS} size="1" onChange={event => changeValue([event.target.value || 0, rows.kpi_desc, row.project_id, row.kpi_header_id, row.kpi_detail_id, rows.role])} /></StyledTableCell>
                        //     </StyledTableRow>
                        //   ))}
                        // </StyledTableCell>
                        // <StyledTableCell align="left">
                        //   {values.filter((row) => (row.kpi_desc === rows.kpi_desc)).map((row) => (
                        //     <StyledTableRow key={row.kpi_detail_task_name}>
                        //       <StyledTableCell align="left"><input type="text" className="saInput" defaultValue={row.kpi_pmo_points} size="1" onChange={event => pmoValue([event.target.value || 0, rows.kpi_desc, row.project_id, row.kpi_header_id, row.kpi_detail_id, values.filter((rowvalue) => (rowvalue.kpi_desc === rows.kpi_desc)).map((rowdata) => (rowdata.kpi_pmo_points)).reduce(reducer, (parseFloat(event.target.value || 0) - parseFloat(row.kpi_pmo_points))) * rows.kpi_weight / 100])} /></StyledTableCell>
                        //     </StyledTableRow>
                        //   ))}
                        // </StyledTableCell>
                        // <StyledTableCell align="left"><StyledTableRow><StyledTableCell align="center">{rows.kpi_weight}
                        // </StyledTableCell></StyledTableRow></StyledTableCell>
                        // <StyledTableCell align="left"><StyledTableRow><StyledTableCell align="center">
                        //   {(rows.kpi_desc === pmovalue[1] ? values.filter((row) => (row.kpi_desc === pmovalue[1])).map((row) => row.kpi_pmo_points).reduce(reducer) : values.filter((row) => (row.kpi_desc === rows.kpi_desc)).map((row) => row.kpi_pmo_points).reduce(reducer, 0)) * rows.kpi_weight / 100}
                        // </StyledTableCell></StyledTableRow></StyledTableCell>
                        // <StyledTableCell align="left">&nbsp;</StyledTableCell>
                        // <StyledTableCell align="left">
                        //   {values.filter((row) => (row.kpi_desc === rows.kpi_desc)).map((row) => (
                        //     <StyledTableRow key={row.kpi_detail_task_name}>
                        //       <StyledTableCell align="left"><input type="text" defaultValue={row.NOTES} className="saInput" size="25" onBlur={event => Notes([event.target.value || 0, rows.kpi_desc, row.project_id, row.kpi_header_id, row.kpi_detail_id, rows.role])} /></StyledTableCell>
                        //     </StyledTableRow>
                        //   ))}
                        // </StyledTableCell>
                        // <StyledTableCell align="left">
                        //   {values.filter((row) => (row.kpi_desc === rows.kpi_desc)).map((row) => (
                        //     <StyledTableRow key={row.kpi_detail_task_name}>
                        //       <StyledTableCell align="left"><input type="text" defaultValue={row.kpi_pmo_notes} className="saInput" size="25" onBlur={event => pmoNotes([event.target.value || 0, rows.kpi_desc, row.project_id, row.kpi_header_id, row.kpi_detail_id])} /></StyledTableCell>
                        //     </StyledTableRow>
                        //   ))}
                        // </StyledTableCell>


                //       <StyledTableRow key="hello">
                //         <StyledTableCell align="left">
                //         </StyledTableCell>

                //         <StyledTableCell align="left"><b>Total</b>
                //         </StyledTableCell>
              
                //         <StyledTableCell align="left">&nbsp;
                // </StyledTableCell>
                //         <StyledTableCell align="left"><StyledTableRow></StyledTableRow>
                //         </StyledTableCell>
                //         <StyledTableCell align="left"><StyledTableRow></StyledTableRow>
                //         </StyledTableCell>
                //       </StyledTableRow> */}
                     </TableBody> 
                  </Table>
                  </StyledTableCell>
                </TableRow>
              ))}
            </Table>


          </TableContainer>
        </div>
        // </Tab>
        // </Tabs>

      );
              }

  //   if (roleName[0] === 'PM') {
  //     return (
  //       //   <Tabs
  //       //   id="controlled-tab-example"
  //       //   activeKey={key === 'KPI'?`${roleName[0]} ${key}`:'Home'}
  //       //   onSelect={(k) => setKey(k)}
  //       // >

  //       //   <Tab eventKey="Home" title="Home"><Tables data ={props.data[0]}/></Tab>

  //       //   <Tab eventKey="PM KPI" title="PM KPI">
  //       <div className="kpiTable">
  //         PM KPI
  //         <TableContainer component={Paper}>

  //           <Table className={classes.table} aria-label="customized table">

  //             {/* <TableHead>
  //           <TableRow>
  //             <StyledTableCell><b>Category</b></StyledTableCell>
  //             <StyledTableCell align="left"><b>Details</b></StyledTableCell>
  //             <StyledTableCell align="left"><b>Max Points</b></StyledTableCell>
  //             <StyledTableCell align="left"><b>SA Points</b></StyledTableCell>
  //             <StyledTableCell align="left"><b>PMO Points</b></StyledTableCell>
  //             <StyledTableCell align="left"><b>Weight</b></StyledTableCell>
  //             <StyledTableCell align="left"><b>Score</b></StyledTableCell>
  //           </TableRow>
  //         </TableHead> */}
  //             {unique.map((rows) => (
  //               <TableBody>
  //                 <TableRow>
  //                   <StyledTableCell style={{ backgroundColor: "#6ad4ff" }}><b>Category</b></StyledTableCell>
  //                   <StyledTableCell align="left" style={{ backgroundColor: "#6ad4ff" }}><b>Details</b></StyledTableCell>
  //                   <StyledTableCell align="left" style={{ backgroundColor: "#6ad4ff" }}><b>Max Points</b></StyledTableCell>
  //                   <StyledTableCell align="left" style={{ backgroundColor: "#6ad4ff" }}><b>PM Points</b></StyledTableCell>
  //                   <StyledTableCell align="left" style={{ backgroundColor: "#6ad4ff" }}><b>PMO Points</b></StyledTableCell>
  //                   <StyledTableCell align="left" style={{ backgroundColor: "#6ad4ff" }}><b>Weight</b></StyledTableCell>
  //                   <StyledTableCell align="left" style={{ backgroundColor: "#6ad4ff" }}><b>Score</b></StyledTableCell>
  //                   <StyledTableCell align="left">&nbsp;</StyledTableCell>
  //                   <StyledTableCell align="left" style={{ backgroundColor: "#6ad4ff" }}><b>PM Notes</b></StyledTableCell>
  //                   <StyledTableCell align="left" style={{ backgroundColor: "#6ad4ff" }}><b>PMO Notes</b></StyledTableCell>
  //                 </TableRow>

  //                 <StyledTableRow key={rows}>
  //                   <StyledTableCell component="th" scope="row">
  //                     {rows.kpi_desc}
  //                   </StyledTableCell>

  //                   <StyledTableCell align="left">
  //                     {values.filter((row) => (row.kpi_desc === rows.kpi_desc)).map((row) => (
  //                       <StyledTableRow key={row.kpi_detail_task_name}>
  //                         <StyledTableCell align="left">{row.kpi_detail_task_name}</StyledTableCell>
  //                       </StyledTableRow>
  //                     ))}
  //                   </StyledTableCell>
  //                   <StyledTableCell align="left">
  //                     {values.filter((row) => (row.kpi_desc === rows.kpi_desc)).map((row) => (
  //                       <StyledTableRow key={row.kpi_detail_task_name}>
  //                         <StyledTableCell align="left">{row.kpi_max_points}</StyledTableCell>
  //                       </StyledTableRow>
  //                     ))}
  //                   </StyledTableCell>
  //                   <StyledTableCell align="left">
  //                     {values.filter((row) => (row.kpi_desc === rows.kpi_desc)).map((row) => (
  //                       <StyledTableRow key={row.kpi_detail_task_name}>
  //                         <StyledTableCell align="left"><input type="text" className="saInput" defaultValue={row.POINTS} size="1" onChange={event => changeValue([event.target.value || 0, rows.kpi_desc, row.project_id, row.kpi_header_id, row.kpi_detail_id, rows.role])} /></StyledTableCell>
  //                       </StyledTableRow>
  //                     ))}
  //                   </StyledTableCell>
  //                   <StyledTableCell align="left">
  //                     {values.filter((row) => (row.kpi_desc === rows.kpi_desc)).map((row) => (
  //                       <StyledTableRow key={row.kpi_detail_task_name}>
  //                         <StyledTableCell align="left"><input type="text" className="saInput" defaultValue={row.kpi_pmo_points} size="1" onChange={event => pmoValue([event.target.value || 0, rows.kpi_desc, row.project_id, row.kpi_header_id, row.kpi_detail_id, values.filter((rowvalue) => (rowvalue.kpi_desc === rows.kpi_desc)).map((rowdata) => (rowdata.kpi_pmo_points)).reduce(reducer, (parseFloat(event.target.value || 0) - parseFloat(row.kpi_pmo_points))) * rows.kpi_weight / 100])} /></StyledTableCell>
  //                       </StyledTableRow>
  //                     ))}
  //                   </StyledTableCell>
  //                   <StyledTableCell align="left"><StyledTableRow><StyledTableCell align="center">{rows.kpi_weight}
  //                   </StyledTableCell></StyledTableRow></StyledTableCell>
  //                   <StyledTableCell align="left"><StyledTableRow><StyledTableCell align="center">
  //                     {(rows.kpi_desc === pmovalue[1] ? values.filter((row) => (row.kpi_desc === pmovalue[1])).map((row) => row.kpi_pmo_points).reduce(reducer) : values.filter((row) => (row.kpi_desc === rows.kpi_desc)).map((row) => row.kpi_pmo_points).reduce(reducer, 0)) * rows.kpi_weight / 100}
  //                   </StyledTableCell></StyledTableRow></StyledTableCell>
  //                   <StyledTableCell align="left">&nbsp;</StyledTableCell>
  //                   <StyledTableCell align="left">
  //                     {values.filter((row) => (row.kpi_desc === rows.kpi_desc)).map((row) => (
  //                       <StyledTableRow key={row.kpi_detail_task_name}>
  //                         <StyledTableCell align="left"><input type="text" defaultValue={row.NOTES} className="saInput" size="25" onBlur={event => Notes([event.target.value || 0, rows.kpi_desc, row.project_id, row.kpi_header_id, row.kpi_detail_id, rows.role])} /></StyledTableCell>
  //                       </StyledTableRow>
  //                     ))}
  //                   </StyledTableCell>
  //                   <StyledTableCell align="left">
  //                     {values.filter((row) => (row.kpi_desc === rows.kpi_desc)).map((row) => (
  //                       <StyledTableRow key={row.kpi_detail_task_name}>
  //                         <StyledTableCell align="left"><input type="text" defaultValue={row.kpi_pmo_notes} className="saInput" size="25" onBlur={event => pmoNotes([event.target.value || 0, rows.kpi_desc, row.project_id, row.kpi_header_id, row.kpi_detail_id])} /></StyledTableCell>
  //                       </StyledTableRow>
  //                     ))}
  //                   </StyledTableCell>
  //                 </StyledTableRow>

  //                 <StyledTableRow key="hello">
  //                   <StyledTableCell align="left">
  //                   </StyledTableCell>

  //                   <StyledTableCell align="left"><b>Total</b>
  //                   </StyledTableCell>
  //                   <StyledTableCell align="left"><StyledTableRow><StyledTableCell align="left"><b>{values.filter((row) => (row.kpi_desc === rows.kpi_desc)).map((row) => row.kpi_max_points).reduce(reducer)}</b></StyledTableCell></StyledTableRow>
  //                   </StyledTableCell>
  //                   <StyledTableCell align="left"><StyledTableRow><StyledTableCell id={rows} align="left"><b>{rows.kpi_desc === value[1] ? values.filter((row) => (row.kpi_desc === value[1])).map((row) => row.POINTS).reduce(reducer) : values.filter((row) => (row.kpi_desc === rows.kpi_desc)).map((row) => row.POINTS).reduce(reducer, 0)}</b></StyledTableCell></StyledTableRow>
  //                   </StyledTableCell>
  //                   <StyledTableCell align="left"><StyledTableRow><StyledTableCell align="left"><b>{rows.kpi_desc === pmovalue[1] ? values.filter((row) => (row.kpi_desc === pmovalue[1])).map((row) => row.kpi_pmo_points).reduce(reducer) : values.filter((row) => (row.kpi_desc === rows.kpi_desc)).map((row) => row.kpi_pmo_points).reduce(reducer, 0)}</b></StyledTableCell></StyledTableRow>
  //                   </StyledTableCell>
  //                   <StyledTableCell align="left"><StyledTableRow></StyledTableRow>
  //                   </StyledTableCell>
  //                   <StyledTableCell align="left"><StyledTableRow></StyledTableRow>
  //                   </StyledTableCell>
  //                   <StyledTableCell align="left">&nbsp;
  //               </StyledTableCell>
  //                   <StyledTableCell align="left"><StyledTableRow></StyledTableRow>
  //                   </StyledTableCell>
  //                   <StyledTableCell align="left"><StyledTableRow></StyledTableRow>
  //                   </StyledTableCell>
  //                 </StyledTableRow>
  //               </TableBody>
  //             ))}
  //           </Table>

  //         </TableContainer>
  //       </div>
  //       // </Tab>
  //       // </Tabs>
  //     )
  //   }

  // }

  else {
    return (
      <div>Loading Please Wait</div>
    )
  }
}
