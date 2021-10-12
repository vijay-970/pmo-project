import { makeStyles } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import React from 'react'
import CircularProgressWithLabel from './progressBar'


export const Progress = (props) => {
    const projectData = JSON.parse(localStorage.getItem('tables'));
    console.log(projectData);
    for (let i of projectData) {
        if (props.data === i.project_name) {
            console.log("I am In");
            return (
                <div className="box">
                    <CircularProgressWithLabel size={125} value={i.project_complete_percent} progressColor={"green"} label="Project % Complete"/> 
                    <CircularProgressWithLabel size={125} value={i.project_fin_act_bud} progressColor={"red"} label="Project Fin (Act/Bud)"/>
                    <CircularProgressWithLabel size={125} value={i.project_fin_fct_bud} progressColor={"blue"} label="Project Fin (Fct/Bud)"/>
                </div>
            )
        }
    }
    return (
        <div>
            <CircularProgressWithLabel size={125} value={projectData[0].project_complete_percent} progressColor={"green"} label="Project % Complete"/> 
            <CircularProgressWithLabel size={125} value={projectData[0].project_fin_act_bud} progressColor={"red"} label="Project Fin (Act/Bud)"/>
            <CircularProgressWithLabel size={125} value={projectData[0].project_fin_fct_bud} progressColor={"blue"} label="Project Fin (Fct/Bud)"/>
        </div>
    )
}
