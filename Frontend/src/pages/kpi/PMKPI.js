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

export default function PMKPI(props) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [pmonotes, pmoNotes] = useState([0, 0, 0, 0, 0]);
  const [key, setKey] = useState('KPI');

  const [kpi, setKpi] = useState([]);

  const reducer = (accumulator, currentValue) =>
    parseFloat(accumulator) + parseFloat(currentValue);

  useEffect(() => {
    alert(props.data[0]+".."+props.data[1]);
    fetch('http://localhost:5000/getKPI', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: props.data[0],
        PROJECT_ID: props.data[1],
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


  if (loading) {
    // let values = JSON.parse(localStorage.getItem('KPI'));

    let maintable = JSON.parse(localStorage.getItem('tables'));
    //const projectPMO =['Y'];
    const projectPMO = maintable.map((item) => item.PMO).filter((value, index, self) => self.indexOf(value) === index);
    console.log('projectPMO', projectPMO);
   // alert(projectPMO);

    const roleName = kpi
      .map((item) => item.ROLE)
      .filter((value, index, self) => self.indexOf(value) === index);



    const unique = [];
    const map = new Map();
    for (let i of kpi) {
      const mapKey= `${i.MILESTONE_ID}~${i.CYCLE_ID}`
      if (!map.has(mapKey)) {
        map.set(mapKey, true);
        unique.push({
          MILESTONE_ID: i.MILESTONE_ID,
          MILESTONE: i.MILESTONE,
          CYCLE_ID: i.CYCLE_ID,
          KPI_WEIGHT: i.KPI_WEIGHT,
          KPI_SCORE: i.KPI_SCORE,
          role: i.ROLE,
        });
      }
    }
    console.log(roleName[0]);

    const handleChange = (change) => {
   

      const updateeKPI = kpi.map((item) => {
        if (
          item.PROJECT_ID === change.PROJECT_ID &&
          item.MILESTONE_ID === change.MILESTONE_ID &&
          item.PARAMETER_ID === change.PARAMETER_ID &&
          item.CYCLE_ID === change.CYCLE_ID
        ) {
          item[change.objectID] = change.value;
          item.isRowUpdated = true;
          item.KPI_SCORE=(   ((kpi.filter( (row) => row.MILESTONE === item.MILESTONE && row.CYCLE_ID===item.CYCLE_ID)
          .map((row) => row.KPI_PMO_POINTS || 0).reduce(reducer, 0) ) /
            kpi.filter((row) => row.MILESTONE === item.MILESTONE && row.CYCLE_ID===item.CYCLE_ID)
          .map((row) => row.MAX_SCORE).reduce(reducer) )* item.KPI_WEIGHT);
          //alert(   (kpi.filter( (row) => row.MILESTONE === item.MILESTONE).map((row) => row.KPI_PMO_POINTS || 0).reduce(reducer, 0) * item.KPI_WEIGHT) /100);
      
         
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
          item.PROJECT_ID === change.PROJECT_ID &&
          item.MILESTONE_ID === change.MILESTONE_ID &&
          item.PARAMETER_ID === change.PARAMETER_ID &&
          item.CYCLE_ID === change.CYCLE_ID
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
      fetch('http://localhost:5000/prjkpiupdate', {
        method: 'PUT', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({kpi}),
      })
        .then((response) => response.json())
        .then((data) => {
          //console.log('Success:', data);
            console.log('.....',data);
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
      //{maintable.filter((row)=>row.PROJECT_ID===projectStore.name?row.project_name:null)}
     // <Button onClick={handleSave}>Save</Button>
      <div className="kpiTable">
        <button color="primary" type="submit" onClick={handleSave}>SAVE</button>
        
        <TableContainer >
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell  style={{ width: 180, textAlign: 'left' }}><b>Milestone</b></StyledTableCell>
                <StyledTableCell  style={{ width: 330, textAlign: 'left' }}><b>Parameters</b></StyledTableCell>
                <StyledTableCell  style={{ width: 30, textAlign: 'left' }}><b>Max Points</b></StyledTableCell>
                <StyledTableCell  style={{ width: 40, textAlign: 'left' }}><b>PM Points</b></StyledTableCell>
                <StyledTableCell  style={{ width: 40, textAlign: 'left' }}><b>PMO Points</b></StyledTableCell>
                <StyledTableCell  style={{ width: 30, textAlign: 'left'}}><b>Weight </b>  </StyledTableCell>
                <StyledTableCell style={{ width: 30, textAlign: 'left'}}><b> Score</b></StyledTableCell>
                <StyledTableCell  style={{ width: 150, textAlign: 'left' }} ><b>PM Notes</b></StyledTableCell>
                <StyledTableCell  style={{ maxWidth: 150, textAlign: 'left' }}> <b>PMO Notes</b></StyledTableCell>
              </TableRow>
            </TableHead>
            {unique.filter((rows) => rows.role === 'PM' || rows.role === 'SA').map((rows) => (
                <TableRow>
                  <StyledTableCell colSpan="9" style={{border:'1px solid black' }}>
                <Table className={classes.table} aria-label="customized table" style={{ border: 1 }}>
                      <TableBody>
                        {kpi.filter((row) => row.MILESTONE === rows.MILESTONE && row.CYCLE_ID===rows.CYCLE_ID ).map((row, i, arr) => (
                            <TableRow key={row.PARAMETER_NAME}>
                              {i == 0 ? (
                              <StyledTableCell component="td" rowSpan={arr.length} style={{ width: 150,textAlign: 'left'}}>
                                <b>{rows.MILESTONE}-{rows.CYCLE_ID}</b></StyledTableCell>) : null}
                              <StyledTableCell component="td" style={{ width: 250,textAlign:'left'}}>
                                {row.PARAMETER_NAME}</StyledTableCell>
                              <StyledTableCell component="td" style={{ width: 40, textAlign: 'left' }}>
                                {row.MAX_SCORE}</StyledTableCell>
                              <StyledTableCell component="td" style={{ width: 50, textAlign: 'left' }}>
                                <input type="text" className="saInput" defaultValue={row.KPI_POINTS || 0} size="1" style={{ fontSize: 12, fontFamily: "'Montserrat', sans-serif" }}
                                  onChange={(event) =>
                                    handleChange({
                                      value: event.target.value || 0,
                                      MILESTONE: rows.MILESTONE,
                                      PROJECT_ID: row.PROJECT_ID,
                                      MILESTONE_ID: row.MILESTONE_ID,
                                      PARAMETER_ID: row.PARAMETER_ID,
                                      CYCLE_ID: row.CYCLE_ID,
                                      role: rows.role,
                                      objectID: 'KPI_POINTS',
                                    })
                                  }
                                  disabled={row.ROLE === row.OWNER && row.PMO === 'N' ? null : 'disabled' }
                                />
                              </StyledTableCell>
                              <StyledTableCell component="td" style={{ width: 50, textAlign: 'left' }}>
                                <input type="text" className="saInput" defaultValue={row.KPI_PMO_POINTS || 0} size="1"
                                  style={{ fontSize: 12,fontFamily: "'Montserrat', sans-serif"}}
                                  onChange={(event) =>
                                    handleChange({
                                      value: event.target.value || 0,
                                      MILESTONE: rows.MILESTONE,
                                      PROJECT_ID: row.PROJECT_ID,
                                      MILESTONE_ID: row.MILESTONE_ID,
                                      PARAMETER_ID: row.PARAMETER_ID,
                                      CYCLE_ID: row.CYCLE_ID,
                                      role: rows.role,
                                      objectID: 'KPI_PMO_POINTS',
                                    })
                                  }
                                  disabled={
                                    row.PMO === 'N' ? 'disabled' : null
                                  }
                                />
                              </StyledTableCell>
                              {i === 0 ? (
                                <StyledTableCell component="td" rowSpan={arr.length} style={{ width: 50, textAlign: 'center', borderBottom: 'none'}}>
                                  {rows.KPI_WEIGHT}
                                </StyledTableCell>
                              ) : null}
                              {i === 0 ? (
                                <StyledTableCell  component="td" rowSpan={arr.length} style={{ width: 50,textAlign: 'center',borderBottom: 'none'}}>  
                                      {   ((kpi.filter( (row) => row.MILESTONE === rows.MILESTONE && row.CYCLE_ID===rows.CYCLE_ID)
                                    .map((row) => row.KPI_PMO_POINTS || 0).reduce(reducer, 0) ) /
                                      kpi.filter((row) => row.MILESTONE === rows.MILESTONE && row.CYCLE_ID===rows.CYCLE_ID)
                                .map((row) => row.MAX_SCORE).reduce(reducer) )                            
                                  * rows.KPI_WEIGHT}
                                </StyledTableCell>
                              ) : null}
                              <StyledTableCell style={{width: 180,textAlign: 'left',borderBottom: 'none'}}>
                                {!row.editPMNotes && (
                                  <>
                                  <a style={{display: "table-cell"}} href={row.KPI_PM_NOTES} target="_blank">{row.KPI_PM_NOTES}</a>
                                    {row.PMO === 'N' && (
                                      <IconButton
                                        aria-label="account of current user"
                                        aria-controls="menu-appbar"
                                        aria-haspopup="true"
                                        color="inherit"
                                        onClick={(event) =>
                                          handleEditIconClick({
                                            MILESTONE: rows.MILESTONE,
                                            PROJECT_ID: row.PROJECT_ID,
                                            MILESTONE_ID: row.MILESTONE_ID,
                                            PARAMETER_ID: row.PARAMETER_ID,
                                            CYCLE_ID: row.CYCLE_ID
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
                                      defaultValue={row.KPI_PM_NOTES}
                                      className="saInput"
                                      onBlur={(event) => {
                                        handleChange({
                                          value: event.target.value || 0,
                                          MILESTONE: rows.MILESTONE,
                                          PROJECT_ID: row.PROJECT_ID,
                                          MILESTONE_ID: row.MILESTONE_ID,
                                          PARAMETER_ID: row.PARAMETER_ID,
                                          CYCLE_ID:row.CYCLE_ID,
                                          role: rows.role,
                                          objectID: 'KPI_PM_NOTES',
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
                                <textarea disabled={row.PMO === 'N' ? 'disabled' : null }
                                  style={{
                                    height: 20,
                                    width: 150,
                                    resize: 'none',
                                    fontSize: 12,
                                    fontFamily: "'Montserrat', sans-serif",
                                  }}
                                  type="text"
                                  text-align="left"
                                  defaultValue={row.KPI_PMO_NOTES}
                                  className="saInput"
                                  size="12"
                                  onBlur={(event) => {
                                    handleChange({
                                      value: event.target.value || 0,
                                      MILESTONE: rows.MILESTONE,
                                      PROJECT_ID: row.PROJECT_ID,
                                      MILESTONE_ID: row.MILESTONE_ID,
                                      PARAMETER_ID: row.PARAMETER_ID,
                                      CYCLE_ID: row.CYCLE_ID,
                                      role: rows.role,
                                      objectID: 'KPI_PMO_NOTES',
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

                        <TableRow key={rows.MILESTONE}>
                          <StyledTableCell style={{ width: 150,borderBottom: 'none'}}></StyledTableCell>
                          <StyledTableCell style={{width: 300,textAlign: 'left'}} align="left"><b>Total</b></StyledTableCell>
                          <StyledTableCell style={{ width: 40,textAlign: 'left'}}>
                            <b>
                              {kpi
                                .filter((row) => row.MILESTONE === rows.MILESTONE && row.CYCLE_ID === rows.CYCLE_ID)
                                .map((row) => row.MAX_SCORE)
                                .reduce(reducer)}
                            </b>
                          </StyledTableCell>
                          <StyledTableCell
                            id={rows}
                            style={{  textAlign: 'left' }}>
                            <b>
                              {kpi
                                .filter((row) => row.MILESTONE === rows.MILESTONE && row.CYCLE_ID === rows.CYCLE_ID)
                                .map((row) => row.KPI_POINTS || 0)
                                .reduce(reducer, 0)}
                            </b>
                          </StyledTableCell>
                          <StyledTableCell
                            align="left"
                            style={{ textAlign: 'left' }}
                          >
                            <b>
                              {kpi
                                .filter((row) => row.MILESTONE === rows.MILESTONE && row.CYCLE_ID===rows.CYCLE_ID)
                                .map((row) => row.KPI_PMO_POINTS || 0)
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
