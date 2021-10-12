
import { Button, Table, TableContainer, TableHead } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { withStyles,makeStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
//import { render } from '@testing-library/react';


const PMInput = (props) => {
    const [pminputs, setpminputs] = useState([]);
    const [pmValues, setPmValues] = useState({});
    //
    const projectId = props.data;
    //const classes = useStyles();
    useEffect(() => {
        getdata();
    }, []);

    async function getdata() {
        fetch(`http://localhost:5000/pm-input/${projectId}`)
            .then((resp) => resp.json())
            .then((json) => {
                 json.push({ PROJECT_ID: json[0].PROJECT_ID,
                    PROJECT_COMPLETE_PERCENT: 0,
                    PROJECT_FIN_ACT_BUD: 0,
                    PROJECT_FIN_FCT_BUD: 0,
                    PROJECT_MILESTONE:"",
                    PROJECT_DETAIL_ID: -1

                });
                setpminputs(json);
            });
    }
///   http://localhost:5000/pminput-create
    const saveData = () => {
        console.log(pmValues);
        let url = 'http://localhost:5000/pm-input';
        let method = 'put';

        if(pmValues.PROJECT_DETAIL_ID == -1)
        {
            url = 'http://localhost:5000/pminput-create';
            method = 'post';
        }

        fetch(url, {
            method: method, // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({

                PROJECT_ID: pmValues.PROJECT_ID,
                PROJECT_COMPLETE_PERCENT: pmValues.PROJECT_COMPLETE_PERCENT,
                PROJECT_FIN_ACT_BUD: pmValues.PROJECT_FIN_ACT_BUD,
                PROJECT_FIN_FCT_BUD: pmValues.PROJECT_FIN_FCT_BUD,
                PROJECT_MILESTONE:pmValues.PROJECT_MILESTONE,
                PROJECT_DETAIL_ID: pmValues.PROJECT_DETAIL_ID
            }),
        })
            .then(response => response.json())
            .then(data => {
                console.log("Success:", data);
                getdata();
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        console.log("Hello");
        // get api
    };
    const deleteData = (i) => {
        let input=pminputs[i];
        console.log(pminputs);
        let method = 'post';
        fetch('http://localhost:5000/pm-input-delete', {
            method: 'PUT', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                PROJECT_ID: input.PROJECT_ID,
                PROJECT_DETAIL_ID: input.PROJECT_DETAIL_ID
            }),
        })
            .then(response => response.json())
            .then(data => {
                console.log("Success:", data);
                getdata();
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        console.log("Hello");
        // get api
    };
    

    return (
        <div className="pmInput"  style={{width: '95%'}} size="small">

            <h3>Project Manager Input</h3>
            <TableContainer  component={Paper}>
                <Table >
                    <TableHead>
                        <TableRow >
                            <StyledTableCell style={{width: '5%'}} align="left"><b>Actions</b></StyledTableCell>

                            <StyledTableCell style={{width: '10%'}} align="left"><b>Project</b></StyledTableCell>
                            <StyledTableCell style={{width: '15%'}} align="left"><b>Milestone</b></StyledTableCell>
                            <StyledTableCell style={{width: '5%'}} align="left"><b>% Completion</b></StyledTableCell>
                            <StyledTableCell style={{width: '5%'}} align="left"><b>% Fin (Act/Bud)</b></StyledTableCell>
                            <StyledTableCell style={{width: '5%'}} align="left"><b>% Fin (Fct/Bud)</b></StyledTableCell>
                            <StyledTableCell style={{width: '10%'}} align="left"><b>Last Update Date</b></StyledTableCell>
                            <StyledTableCell style={{width: '10%'}} align="left"><b>Last Update By</b></StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {pminputs.map((data,i) => (
                            <StyledTableRow key={data.PROJECT_ID}>
                                  <StyledTableCell component="th" scope="row" style={{paddingLeft:0,witdh:'5%'}}>
                                    <td>
                                        <Button  onClick={()=>{saveData()}}>
                                            {data.PROJECT_DETAIL_ID == -1 ? 'Add' : 'Save'}
                                            </Button>
                                            <Button  onClick={()=>{deleteData(i)}}>
                                            {data.PROJECT_DETAIL_ID == -1 ? '' : 'Delete'}
                                            </Button></td>
                                        </StyledTableCell>
                                <StyledTableCell component="th" scope="row" style={{width: '10%'}}>
                                    <td>{data.PROJECT_NAME}</td> </StyledTableCell>
                                <StyledTableCell component="th"  scope="row" style={{width: '15%'}}>
                                    <td><InputText
                                        defaultValue={data.PROJECT_MILESTONE}
                                        getValue={(value) => {
                                            setPmValues(
                                                Object.assign({},{...data}, {...pmValues}, {PROJECT_MILESTONE: value}, {PROJECT_DETAIL_ID: data.PROJECT_DETAIL_ID})
                                                );
                                        }}
                                       
                                    /></td> </StyledTableCell>
                                <StyledTableCell component="th" style={{width: '5%'}} scope="row">
                                    <td><InputField style={{width: 5}}
                                        defaultValue={data.PROJECT_COMPLETE_PERCENT}
                                        getValue={(value) => {
                                            setPmValues(
                                                Object.assign({},{...data}, {...pmValues}, {PROJECT_COMPLETE_PERCENT: value}, {PROJECT_DETAIL_ID: data.PROJECT_DETAIL_ID})
                                                );
                                        }}
                                       
                                    /></td> </StyledTableCell>
                                <StyledTableCell component="th" scope="row" style={{width: '5%'}}>
                                    <td><InputField  style={{width: '5%'}}
                                        defaultValue={data.PROJECT_FIN_ACT_BUD}
                                        getValue={(value) => {
                                            setPmValues(
                                                Object.assign({},{...data}, {...pmValues}, {PROJECT_FIN_ACT_BUD: value}, {PROJECT_DETAIL_ID: data.PROJECT_DETAIL_ID})
                                                );
                                        }}
                                      
                                    /></td> </StyledTableCell>
                                <StyledTableCell component="th" scope="row" style={{width: '5%'}}>
                                    <td><InputField style={{width: '5%'}}
                                        defaultValue={data.PROJECT_FIN_FCT_BUD}
                                        getValue={(value) => {
                                            setPmValues(
                                                Object.assign({},{...data}, {...pmValues}, {PROJECT_FIN_FCT_BUD: value}, {PROJECT_DETAIL_ID: data.PROJECT_DETAIL_ID})
                                                );
                                        }}
                                       
                                    /></td> </StyledTableCell>
                                <StyledTableCell component="th" scope="row" style={{width: '10%'}}>
                                    <td>{data.LAST_UPDATE_DATE===undefined || data.LAST_UPDATE_DATE===null?"2021-01-20":data.LAST_UPDATE_DATE.split("T")[0]}</td> </StyledTableCell>
                                <StyledTableCell component="th" scope="row" style={{width: '10%'}}>
                                    <td>himanshu</td> </StyledTableCell>
                                {/* <StyledTableCell align="left">{data.project_milestone}</StyledTableCell>
                                <StyledTableCell align="left">{data.project_type}</StyledTableCell>
                                <StyledTableCell align="left">{data.project_complete_percent}</StyledTableCell>
                                <StyledTableCell align="left"><Button size="small" ><u>{data.project_name}</u></Button></StyledTableCell> */}
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div >




    );
};

export default PMInput;

const InputField = (prop) => {
    const [value, setValue] = useState(prop.defaultValue);
    return (
        <input
            value={value}
            style={{width:"40px",fontFamily:"'Montserrat', sans-serif"}}
            type="number" size="1"
            onChange={(e) => {
                setValue(e.target.value);
                prop.getValue(e.target.value);
            }}
            onKeyPress={prop.onChange}
        />
    );
};
const InputText = (prop) => {
    const [value, setValue] = useState(prop.defaultValue);
    return (
        <input
            value={value}
            type="text" style={{width:'80px',fontFamily:"'Montserrat', sans-serif"}}
            onChange={(e) => {
                setValue(e.target.value);
                prop.getValue(e.target.value);
            }}
            onKeyPress={prop.onKeyPress}
        />
    );
};

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: '#b31317',
        color: 'white',
        fontFamily:"'Montserrat', sans-serif"
    },
    body: {
        fontSize: 12,
        fontFamily:"'Montserrat', sans-serif"
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
    Table: {
      minWidth: 600,
    },
    container: {
      maxHeight: 600
    }
  });