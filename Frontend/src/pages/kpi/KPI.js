import React, { useState, useEffect, useLayoutEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import CreateIcon from '@material-ui/icons/Create';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';

//import Button from '@material-ui/core/Button';
//import Paper from '@material-ui/core/Paper';
//import Typography from '@material-ui/core/Typography';
//import projectStore from '../../stores/ProjectStore';
//import { handleInputChange } from 'react-select/src/utils';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#b31317',
    color: 'white',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 11,
  },
  body: {
    fontSize: 11,
    height: 50,
    padding: 3,
    fontFamily: "'Montserrat', sans-serif",
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
  container: {
    maxHeight: 500,
  },
});

export default function KPI(props) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  // const [value, changeValue] = useState([0, 0, 0, 0, 0, 0]);
  // const [pmovalue, pmoValue] = useState([0, 0, 0, 0, 0, 0]);
  // const [notes, Notes] = useState([0, 0, 0, 0, 0, 0]);
  const [pmonotes, pmoNotes] = useState([0, 0, 0, 0, 0]);
  const [key, setKey] = useState('KPI');

  const [kpi, setKpi] = useState([]);

  const reducer = (accumulator, currentValue) =>
    parseFloat(accumulator) + parseFloat(currentValue);

  useEffect(() => {
    fetch('http://localhost:5000/showKPI', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: props.data[0],
        project_id: props.data[1],
      }),
    })
      .then((resp) => resp.json())
      .then((json) => {
        localStorage.setItem('KPI', JSON.stringify(json));
        const tableData = json.map((item) => {
          return { ...item, editPMNotes: false, isRowUpdated: false };
        });
        setKpi(tableData);
        console.log('hi', tableData);
        setLoading(true);
      });
  }, []);

  /*
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
        ROLE: value[5],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        value[0] = 0;
        value[1] = 0;
        value[2] = 0;
        value[3] = 0;
        value[4] = 0;
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
        kpi_detail_id: pmovalue[4],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        pmovalue[0] = 0;
        pmovalue[1] = 0;
        pmovalue[2] = 0;
        pmovalue[3] = 0;
        pmovalue[4] = 0;
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
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        pmovalue[0] = 0;
        pmovalue[1] = 0;
        pmovalue[2] = 0;
        pmovalue[3] = 0;
        pmovalue[4] = 0;
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
        ROLE: notes[5],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        notes[0] = 0;
        notes[1] = 0;
        notes[2] = 0;
        notes[3] = 0;
        notes[4] = 0;
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
        kpi_detail_id: pmonotes[4],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        pmonotes[0] = 0;
        pmonotes[1] = 0;
        pmonotes[2] = 0;
        pmonotes[3] = 0;
        pmonotes[4] = 0;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  console.log('Hello');
  */
  if (loading) {
    // let values = JSON.parse(localStorage.getItem('KPI'));

    let maintable = JSON.parse(localStorage.getItem('tables'));

    const projectPMO = maintable
      .map((item) => item.PMO)
      .filter((value, index, self) => self.indexOf(value) === index);

    console.log('projectPMO', projectPMO);

    const roleName = kpi
      .map((item) => item.ROLE)
      .filter((value, index, self) => self.indexOf(value) === index);

    /*
    //const updateValue = JSON.parse(localStorage.getItem('KPI'));
    const newUpdateValue = values.map((item) => {
      var temp = Object.assign({}, item);
      if (temp.kpi_header_id === value[3] && temp.kpi_detail_id === value[4]) {
        temp.POINTS = value[0];
      }
      if (
        temp.kpi_header_id === pmovalue[3] &&
        temp.kpi_detail_id === pmovalue[4]
      ) {
        temp.kpi_pmo_points = pmovalue[0];
      }
      if (temp.kpi_header_id === pmovalue[3]) {
        temp.kpi_score = pmovalue[5];
      }
      return temp;
    });
    localStorage.setItem('KPI', JSON.stringify(newUpdateValue));

    values = JSON.parse(localStorage.getItem('KPI'));
    */

    //const reducer = (accumulator, currentValue) => parseInt(accumulator) + parseInt(currentValue);

    const unique = [];
    const map = new Map();
    for (let i of kpi) {
      if (!map.has(i.kpi_desc)) {
        map.set(i.kpi_desc, true);
        unique.push({
          kpi_desc: i.kpi_desc,
          kpi_weight: i.kpi_weight,
          kpi_score: i.kpi_score,
          role: i.ROLE,
        });
      }
    }
    console.log(roleName[0]);

    const handleChange = (change) => {
   

      const updateeKPI = kpi.map((item) => {
        if (
          item.project_id === change.project_id &&
          item.kpi_header_id === change.kpi_header_id &&
          item.kpi_detail_id === change.kpi_detail_id
        ) {
          item[change.objectID] = change.value;
          item.isRowUpdated = true;
          item.kpi_score=(kpi.filter( (row) => row.kpi_desc === item.kpi_desc).map((row) => row.kpi_pmo_points || 0).reduce(reducer, 0) * item.kpi_weight) /100;
          //alert(   (kpi.filter( (row) => row.kpi_desc === item.kpi_desc).map((row) => row.kpi_pmo_points || 0).reduce(reducer, 0) * item.kpi_weight) /100);
       
         
          return { ...item };
        } else {
          return item;
        }
      });
      setKpi(updateeKPI);
    };

    const handleEditIconClick = (change) => {
      const updateeKPI = kpi.map((item) => {
        if (
          item.project_id === change.project_id &&
          item.kpi_header_id === change.kpi_header_id &&
          item.kpi_detail_id === change.kpi_detail_id
        ) {
          return { ...item, editPMNotes: true };
        } else {
          return item;
        }
      });
      setKpi(updateeKPI);
    };

    const handleSave = () => {
      console.log('saving data', JSON.stringify({kpi}));
      fetch('http://localhost:5000/pmkpiupdate', {
        method: 'PUT', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({kpi}),
      })
        .then((response) => response.json())
        .then((data) => {
          //console.log('Success:', data);
            //console.log('.....',data);
           
 
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  

      //make api call to update data
    };

    return (
      //   <Tabs
      //   id="controlled-tab-example"
      //   activeKey={key === 'KPI'?`${roleName[0]} ${key}`:'Home'}
      //   onSelect={(k) => setKey(k)}
      // >

      //   <Tab eventKey="Home" title="Home"><Tables data ={props.data[0]}/></Tab>

      //   <Tab eventKey="SA KPI" title="SA KPI">
      //{maintable.filter((row)=>row.project_id===projectStore.name?row.project_name:null)}
     // <Button onClick={handleSave}>Save</Button>
      <div className="kpiTable">
        <button color="primary" type="submit" onClick={handleSave}>SAVE</button>
        
        <TableContainer >
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell  style={{ width: 200, textAlign: 'left' }}><b>Category</b></StyledTableCell>
                <StyledTableCell  style={{ width: 280, textAlign: 'left' }}><b>Details</b></StyledTableCell>
                <StyledTableCell  style={{ width: 30, textAlign: 'left' }}><b>Max Points</b></StyledTableCell>
                <StyledTableCell  style={{ width: 40, textAlign: 'left' }}><b>SA Points</b></StyledTableCell>
                <StyledTableCell  style={{ width: 40, textAlign: 'left' }}><b>PMO Points</b></StyledTableCell>
                <StyledTableCell  style={{ width: 30, textAlign: 'left'}}><b>Weight </b>  </StyledTableCell>
                <StyledTableCell style={{ width: 30, textAlign: 'left'}}><b> Score</b></StyledTableCell>
                <StyledTableCell  style={{ width: 150, textAlign: 'left' }} ><b>SA Notes</b></StyledTableCell>
                <StyledTableCell  style={{ maxWidth: 150, textAlign: 'left' }}> <b>PMO Notes</b></StyledTableCell>
              </TableRow>
            </TableHead>
            {unique.filter((rows) => rows.role === 'SA').map((rows) => (
                <TableRow>
                  <StyledTableCell colSpan="9" style={{border:'1px solid black' }}>
                <Table className={classes.table} aria-label="customized table" style={{ border: 1 }}>
                      <TableBody>
                        {kpi.filter((row) => row.kpi_desc === rows.kpi_desc).map((row, i, arr) => (
                            <TableRow key={row.kpi_detail_task_name}>
                              {i == 0 ? (
                              <StyledTableCell component="td" rowSpan={arr.length} style={{ width: 200,textAlign: 'left'}}>
                                <b>{rows.kpi_desc}</b></StyledTableCell>) : null}
                              <StyledTableCell component="td" style={{ width: 250,textAlign:'left'}}>
                                {row.kpi_detail_task_name}</StyledTableCell>
                              <StyledTableCell component="td" style={{ width: 40, textAlign: 'left' }}>
                                {row.kpi_max_points}</StyledTableCell>
                              <StyledTableCell component="td" style={{ width: 50, textAlign: 'left' }}>
                                <input type="text" className="saInput" defaultValue={row.POINTS} size="1" style={{ fontSize: 12, fontFamily: "'Montserrat', sans-serif" }}
                                  onChange={(event) =>
                                    handleChange({
                                      value: event.target.value || 0,
                                      kpi_desc: rows.kpi_desc,
                                      project_id: row.project_id,
                                      kpi_header_id: row.kpi_header_id,
                                      kpi_detail_id: row.kpi_detail_id,
                                      role: rows.role,
                                      objectID: 'POINTS',
                                    })
                                  }
                                  disabled={projectPMO[0] === 'Y' ? 'disabled' : null }
                                />
                              </StyledTableCell>
                              <StyledTableCell component="td" style={{ width: 50, textAlign: 'left' }}>
                                <input type="text" className="saInput" defaultValue={row.kpi_pmo_points || 0} size="1"
                                  style={{ fontSize: 12,fontFamily: "'Montserrat', sans-serif"}}
                                  onChange={(event) =>
                                    handleChange({
                                      value: event.target.value || 0,
                                      kpi_desc: rows.kpi_desc,
                                      project_id: row.project_id,
                                      kpi_header_id: row.kpi_header_id,
                                      kpi_detail_id: row.kpi_detail_id,
                                      role: rows.role,
                                      objectID: 'kpi_pmo_points',
                                    })
                                  }
                                  disabled={
                                    projectPMO[0] === 'N' ? 'disabled' : null
                                  }
                                />
                              </StyledTableCell>
                              {i === 0 ? (
                                <StyledTableCell
                                  component="td"
                                  rowSpan={arr.length}
                                  style={{
                                    width: 50,
                                    textAlign: 'center',
                                    borderBottom: 'none',
                                  }}
                                >
                                  {rows.kpi_weight}
                                </StyledTableCell>
                              ) : null}
                              {i === 0 ? (
                                <StyledTableCell
                                  component="td"
                                  rowSpan={arr.length}
                                  style={{
                                    width: 50,
                                    textAlign: 'center',
                                    borderBottom: 'none'}}>                                
                                     {(kpi.filter( (row) => row.kpi_desc === rows.kpi_desc)
                                    .map((row) => row.kpi_pmo_points || 0)
                                    .reduce(reducer, 0) * rows.kpi_weight) /100}
                                </StyledTableCell>
                              ) : null}
                              <StyledTableCell
                                style={{
                                  width: 180,
                                  textAlign: 'left',
                                  borderBottom: 'none',
                                }}
                              >
                                {!row.editPMNotes && (
                                  <>
                                  <a style={{display: "table-cell"}} href={row.NOTES} target="_blank">{row.NOTES}</a>
                                    {projectPMO[0] === 'N' && (
                                      <IconButton
                                        aria-label="account of current user"
                                        aria-controls="menu-appbar"
                                        aria-haspopup="true"
                                        color="inherit"
                                        onClick={(event) =>
                                          handleEditIconClick({
                                            kpi_desc: rows.kpi_desc,
                                            project_id: row.project_id,
                                            kpi_header_id: row.kpi_header_id,
                                            kpi_detail_id: row.kpi_detail_id,
                                          })
                                        }
                                      >
                                        <CreateIcon />
                                      </IconButton>
                                    )}
                                  </>
                                )}
                                {row.editPMNotes && (
                                  <>
                                    <textarea
                                      style={{
                                        height: 20,
                                        width: 150,
                                        resize: 'none',
                                        fontSize: 12,
                                        fontFamily: "'Montserrat', sans-serif",
                                      }}
                                      text-align="left"
                                      defaultValue={row.NOTES}
                                      className="saInput"
                                      onBlur={(event) => {
                                        handleChange({
                                          value: event.target.value || 0,
                                          kpi_desc: rows.kpi_desc,
                                          project_id: row.project_id,
                                          kpi_header_id: row.kpi_header_id,
                                          kpi_detail_id: row.kpi_detail_id,
                                          role: rows.role,
                                          objectID: 'NOTES',
                                        });
                                        setDefaultHeight(event, '20px');
                                      }}
                                      onClick={(event) =>
                                        setInputHeight(event, '20px')
                                      }
                                      onChange={(event) =>
                                        setInputHeight(event, '20px')
                                      }
                                    />
                                  </>
                                )}
                              </StyledTableCell>
                              <StyledTableCell
                                style={{ width: 180,
                                  textAlign: 'left',
                                  fontSize: 12,
                                  borderBottom: 'none',
                                }}
                              >
                                <textarea disabled={projectPMO[0] === 'N' ? 'disabled' : null }
                                  style={{
                                    height: 20,
                                    width: 150,
                                    resize: 'none',
                                    fontSize: 12,
                                    fontFamily: "'Montserrat', sans-serif",
                                  }}
                                  type="text"
                                  text-align="left"
                                  defaultValue={row.kpi_pmo_notes}
                                  className="saInput"
                                  size="12"
                                  onBlur={(event) => {
                                    handleChange({
                                      value: event.target.value || 0,
                                      kpi_desc: rows.kpi_desc,
                                      project_id: row.project_id,
                                      kpi_header_id: row.kpi_header_id,
                                      kpi_detail_id: row.kpi_detail_id,
                                      role: rows.role,
                                      objectID: 'kpi_pmo_notes',
                                    });

                                    setDefaultHeight(event, '20px');
                                  }}
                                  onClick={(event) =>
                                    setInputHeight(event, '20px')
                                  }
                                  onChange={(event) =>
                                    setInputHeight(event, '20px')
                                  }
                                />
                              </StyledTableCell>
                            </TableRow>
                          ))}

                        <TableRow key={rows.kpi_desc}>
                          <StyledTableCell style={{ width: 150,borderBottom: 'none'}}></StyledTableCell>
                          <StyledTableCell style={{width: 300,textAlign: 'left'}} align="left"><b>Total</b></StyledTableCell>
                          <StyledTableCell style={{ width: 40,textAlign: 'left'}}>
                            <b>
                              {kpi
                                .filter((row) => row.kpi_desc === rows.kpi_desc)
                                .map((row) => row.kpi_max_points)
                                .reduce(reducer)}
                            </b>
                          </StyledTableCell>
                          <StyledTableCell
                            id={rows}
                            style={{  textAlign: 'left' }}>
                            <b>
                              {kpi
                                .filter((row) => row.kpi_desc === rows.kpi_desc)
                                .map((row) => row.POINTS || 0)
                                .reduce(reducer, 0)}
                            </b>
                          </StyledTableCell>
                          <StyledTableCell
                            align="left"
                            style={{ textAlign: 'left' }}
                          >
                            <b>
                              {kpi
                                .filter((row) => row.kpi_desc === rows.kpi_desc)
                                .map((row) => row.kpi_pmo_points || 0)
                                .reduce(reducer, 0)}
                            </b>
                          </StyledTableCell>
                          <StyledTableCell
                            align="left"
                            style={{
                              textAlign: 'left',
                              borderBottom: 'none',
                            }}
                          ></StyledTableCell>
                          <StyledTableCell
                            align="left"
                            style={{
                              maxWidth: 50,
                              textAlign: 'left',
                              borderBottom: 'none',
                            }}
                          ></StyledTableCell>
                          <StyledTableCell
                            align="left"
                            style={{
                              textAlign: 'left',
                              borderBottom: 'none',
                            }}
                          ></StyledTableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </StyledTableCell>
                </TableRow>
              ))}
          </Table>
        </TableContainer>
        
      </div>
    );
  } else {
    return <div>Loading Please Wait</div>;
  }
}
const setInputHeight = (element, defaultHeight) => {
  if (element) {
    const target = element.target ? element.target : element;
    target.style.height = defaultHeight;
    target.style.height = `${target.scrollHeight}px`;
  }
};
const setDefaultHeight = (element, defaultHeight) => {
  if (element) {
    const target = element.target ? element.target : element;
    target.style.height = defaultHeight;
  }
};

//,parseInt(value[0])||0
