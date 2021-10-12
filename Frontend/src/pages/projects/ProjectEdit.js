import { Button, Table, TableContainer, TableHead ,Input} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { withStyles,makeStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom';
import { Form, FormGroup ,Label} from 'reactstrap';

const ProjectEdit = (props) => {
    const [pminputs, setpminputs] = useState([]);
    const [pmValues, setPmValues] = useState({});
    const projectId = props.data;
    useEffect(() => {
        getdata();
    }, []);

    async function getdata() {
        alert(props.data);
         fetch('http://localhost:5000/get-project/18')
            .then((resp) => resp.json())
            .then((json) => {
                setpminputs(json);
            });
    }

    const saveData = () => {
            console.log(pmValues); 
            fetch('http://localhost:5000/project-update', {
                method: 'PUT', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    PROJECT_ID: pmValues.PROJECT_ID,
                    PROJECT_NAME: pmValues.PROJECT_NAME,
                    PROJECT_DESCRIPTION:pmValues.PROJECT_DESCRIPTION,
                    PROJECT_START_DATE:pmValues.PROJECT_START_DATE,
                    PROJECT_END_DATE:pmValues.PROJECT_END_DATE,
                    PROJECT_TYPE : pmValues.PROJECT_TYPE,
                    PROJECT_METHODOLOGY :pmValues.PROJECT_METHODOLOGY,
                    PROJECT_STATUS : pmValues.PROJECT_STATUS,
                    PRACTICE:pmValues.PRACTICE,
                    PM_USERNAME:pmValues.PM_USERNAME,
                    SA_USERNAME:pmValues.SA_USERNAME
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
        //  this.props.history.push('/projects');
        console.log(pmValues);
    };

    return (
        <div className="projectList">
            <TableContainer  component={Paper}>
                <Table >
                    <TableHead>
                        <TableRow >
                           
                       </TableRow>
                    </TableHead>
                    <TableBody >
                        {pminputs.map((data) => (
                             <StyledTableRow key={data.PROJECT_ID}>
                            <StyledTableRow key={data.PROJECT_ID}>
                             <StyledTableCell component="th" scope="row" style={{paddingLeft:0,witdh:'5%'}}>
                                <td><Button  onClick={()=>{saveData()}}>Save</Button></td>
                                </StyledTableCell>
                                </StyledTableRow>
                             <StyledTableRow key={data.PROJECT_ID}>
                             <StyledTableCell  align="left"><b>Project</b></StyledTableCell>
                              <StyledTableCell component="th" scope="row"  style={{width: 100}}>
                                <td><InputText  style={{width: 100}} defaultValue={data.PROJECT_NAME}
                                        getValue={(value) => {
                                            setPmValues(
                                                Object.assign({},{...data}, {...pmValues}, {PROJECT_NAME: value}, {PROJECT_ID: data.PROJECT_ID})
                                                ); }} /></td></StyledTableCell>
                                                
                                </StyledTableRow>
                            <StyledTableRow key={data.PROJECT_ID}>
                            <StyledTableCell align="left"><b>Description</b></StyledTableCell>
                                <StyledTableCell component="th"  scope="row" style={{width: '10%'}}>
                                    <td><InputText defaultValue={data.PROJECT_DESCRIPTION}
                                        getValue={(value) => {setPmValues(
                                                Object.assign({},{...data}, {...pmValues}, {PROJECT_DESCRIPTION: value}, {PROJECT_ID: data.PROJECT_ID}));
                                        }} /></td>
                                </StyledTableCell>
                                </StyledTableRow>
                             <StyledTableRow key={data.PROJECT_ID}>
                             <StyledTableCell  align="left"><b>Start Date</b></StyledTableCell>
                                <StyledTableCell component="th"  scope="row" style={{width: '10%'}}>
                                    <td><InputText defaultValue={data.PROJECT_START_DATE}
                                        getValue={(value) => {setPmValues(
                                                Object.assign({},{...data}, {...pmValues}, {PROJECT_START_DATE: value.substr(0,10)}, {PROJECT_ID: data.PROJECT_ID}));
                                        }} /></td>
                                </StyledTableCell>
                                </StyledTableRow>
                            <StyledTableRow key={data.PROJECT_ID}>
                            <StyledTableCell  align="left"><b>End Date</b></StyledTableCell>
                                <StyledTableCell component="th"  scope="row" style={{width: '10%'}}>
                                    <td><InputText defaultValue={data.PROJECT_END_DATE}
                                        getValue={(value) => {setPmValues(
                                                Object.assign({},{...data}, {...pmValues}, {PROJECT_END_DATE: value.substr(0,10)}, {PROJECT_ID: data.PROJECT_ID}));
                                        }} /></td>
                                </StyledTableCell>
                                </StyledTableRow>
                             <StyledTableRow key={data.PROJECT_ID}>
                             <StyledTableCell  align="left"><b>Type</b></StyledTableCell>
                                <StyledTableCell component="th"  scope="row" style={{width: '10%'}}>
                                    <td><InputText defaultValue={data.PROJECT_TYPE}
                                        getValue={(value) => {setPmValues(
                                                Object.assign({},{...data}, {...pmValues}, {PROJECT_TYPE: value}, {PROJECT_ID: data.PROJECT_ID}));
                                        }} /></td>
                                </StyledTableCell>
                                </StyledTableRow>
                             <StyledTableRow key={data.PROJECT_ID}>
                             <StyledTableCell  align="left"><b>Methodology</b></StyledTableCell>
                                <StyledTableCell component="th"  scope="row" style={{width: '10%'}}>
                                    <td><InputText defaultValue={data.PROJECT_METHODOLOGY}
                                        getValue={(value) => {setPmValues(
                                                Object.assign({},{...data}, {...pmValues}, {PROJECT_METHODOLOGY: value}, {PROJECT_ID: data.PROJECT_ID}));
                                        }} /></td>
                                </StyledTableCell>
                                </StyledTableRow>
                             <StyledTableRow key={data.PROJECT_ID}>
                             <StyledTableCell  align="left"><b>Status</b></StyledTableCell>
                                <StyledTableCell component="th" style={{width: '5%'}} scope="row">
                                    <td><InputText style={{width: 5}}
                                        defaultValue={data.PROJECT_STATUS}
                                        getValue={(value) => {
                                            setPmValues(
                                                Object.assign({},{...data}, {...pmValues}, {PROJECT_STATUS: value}, {PROJECT_ID: data.PROJECT_ID})
                                                );
                                        }}  /></td> </StyledTableCell>
                                        </StyledTableRow>
                                <StyledTableRow key={data.PROJECT_ID}>
                                <StyledTableCell  align="left"><b>Practice</b></StyledTableCell>
                                <StyledTableCell component="th" scope="row" style={{width: '5%'}}>
                                    <td><InputText style={{width: '5%'}}
                                        defaultValue={data.PRACTICE}
                                        getValue={(value) => {
                                            setPmValues(
                                                Object.assign({},{...data}, {...pmValues}, {PRACTICE: value}, {PROJECT_ID: data.PROJECT_ID})
                                                ); }} /></td> </StyledTableCell>
                                                </StyledTableRow>
                                <StyledTableRow key={data.PROJECT_ID}>
                                <StyledTableCell  align="left"><b>Project Manager</b></StyledTableCell>
                                <StyledTableCell component="th" scope="row" style={{width: '5%'}}>
                                    <td><InputText style={{width: '5%'}} defaultValue={data.PM_USERNAME}
                                        getValue={(value) => {
                                            setPmValues(
                                                Object.assign({},{...data}, {...pmValues}, {PM_USERNAME: value}, {PROJECT_ID: data.PROJECT_ID})
                                                ); }} /></td> </StyledTableCell>
                                                </StyledTableRow>
                                <StyledTableRow key={data.PROJECT_ID}>
                                <StyledTableCell  align="left"><b>SA</b></StyledTableCell>
                                <StyledTableCell component="th" scope="row" style={{width: '5%'}}>
                                    <td><InputText style={{width: '5%'}} defaultValue={data.SA_USERNAME}
                                        getValue={(value) => {setPmValues(
                                                Object.assign({},{...data}, {...pmValues}, {SA_USERNAME: value}, {PROJECT_ID: data.PROJECT_ID})
                                                ); }} /></td> </StyledTableCell>      
                                </StyledTableRow>
                                </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
                {pminputs.map((data) => (
                   // <td><Button  onClick={()=>{saveData()}}>Save</Button></td
<Form  onSubmit={()=>{saveData()}}> 
  <FormGroup>
    <Label  for="projectname">Project Name</Label>
    <InputText  style={{width: 100}} defaultValue={data.PROJECT_NAME}
                                        getValue={(value) => {
                                            setPmValues(
                                                Object.assign({},{...data}, {...pmValues}, {PROJECT_NAME: value}, {PROJECT_ID: data.PROJECT_ID})
                                                ); }} />
  </FormGroup>
  <FormGroup>
    <Label for="Description">Description</Label>
    <InputText defaultValue={data.PROJECT_DESCRIPTION}
                                        getValue={(value) => {setPmValues(
                                                Object.assign({},{...data}, {...pmValues}, {PROJECT_DESCRIPTION: value}, {PROJECT_ID: data.PROJECT_ID}));
                                        }} />
  </FormGroup>          
  <FormGroup>
    <Label for="Start">Start Date</Label>
    <InputText defaultValue={data.PROJECT_DESCRIPTION}
                                        getValue={(value) => {setPmValues(
                                                Object.assign({},{...data}, {...pmValues}, {PROJECT_DESCRIPTION: value}, {PROJECT_ID: data.PROJECT_ID}));
                                        }} />
  </FormGroup>
  <FormGroup>
    <Label for="End">End Date</Label>
    <InputText defaultValue={data.PROJECT_DESCRIPTION}
                                        getValue={(value) => {setPmValues(
                                                Object.assign({},{...data}, {...pmValues}, {PROJECT_DESCRIPTION: value}, {PROJECT_ID: data.PROJECT_ID}));
                                        }} />
  </FormGroup>
  <FormGroup>
    <Label for="Methodology">Methodology</Label>
    <InputText defaultValue={data.PROJECT_DESCRIPTION}
                                        getValue={(value) => {setPmValues(
                                                Object.assign({},{...data}, {...pmValues}, {PROJECT_DESCRIPTION: value}, {PROJECT_ID: data.PROJECT_ID}));
                                        }} />
  </FormGroup>
  <FormGroup>
    <Label for="Type">Project Type</Label>
    <InputText defaultValue={data.PROJECT_DESCRIPTION}
                                        getValue={(value) => {setPmValues(
                                                Object.assign({},{...data}, {...pmValues}, {PROJECT_DESCRIPTION: value}, {PROJECT_ID: data.PROJECT_ID}));
                                        }} />
  </FormGroup>
  <FormGroup>
    <Label  for="Status">Status</Label>
    <InputText defaultValue={data.PROJECT_DESCRIPTION}
                                        getValue={(value) => {setPmValues(
                                                Object.assign({},{...data}, {...pmValues}, {PROJECT_DESCRIPTION: value}, {PROJECT_ID: data.PROJECT_ID}));
                                        }} />
  </FormGroup>
  <FormGroup>
    <Label for="insertdate">Insert Date</Label>
    <InputText defaultValue={data.PROJECT_DESCRIPTION}
                                        getValue={(value) => {setPmValues(
                                                Object.assign({},{...data}, {...pmValues}, {PROJECT_DESCRIPTION: value}, {PROJECT_ID: data.PROJECT_ID}));
                                        }} />
  </FormGroup>
  <FormGroup>
    <Label for="practice">Pratice</Label>
    <InputText defaultValue={data.PROJECT_DESCRIPTION}
                                        getValue={(value) => {setPmValues(
                                                Object.assign({},{...data}, {...pmValues}, {PROJECT_DESCRIPTION: value}, {PROJECT_ID: data.PROJECT_ID}));
                                        }} />
  </FormGroup>
  <FormGroup>
    <Label for="pmusername">Project Manager</Label>
    <InputText defaultValue={data.PROJECT_DESCRIPTION}
                                        getValue={(value) => {setPmValues(
                                                Object.assign({},{...data}, {...pmValues}, {PROJECT_DESCRIPTION: value}, {PROJECT_ID: data.PROJECT_ID}));
                                        }} />
  </FormGroup>
  <FormGroup>
    <Label for="sausername">Solution Architect</Label>
    <InputText defaultValue={data.PROJECT_DESCRIPTION}
                                        getValue={(value) => {setPmValues(
                                                Object.assign({},{...data}, {...pmValues}, {PROJECT_DESCRIPTION: value}, {PROJECT_ID: data.PROJECT_ID}));
                                        }} />
  </FormGroup>
  <FormGroup>
    <Button color="primary" type="submit">Save</Button>{' '}
    <Button color="secondary" tag={Link} to="/projects">Cancel</Button>
  </FormGroup>
</Form>
  ))}
            </TableContainer>


        </div >




    );

}

export default ProjectEdit;

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