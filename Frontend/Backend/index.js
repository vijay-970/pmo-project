const express=require('express');
const cors=require('cors');
const bodyparser=require('body-parser');
const mysql=require('mysql');
const session = require('express-session');
const bcrypt = require('bcrypt');
const MySQLStore = require('express-mysql-session')(session)
const saltRounds = 10;
const Router  = require('./Router');
var nodemailer = require('nodemailer');
const cron = require('node-cron');
const app=express();

//****************************************/
app.use(cors());
app.use(bodyparser.json());
// app.use(bodyparser.urlencoded({ extended: true }));
// app.use(express.json());
//**********************************************/
app.listen(5000,(err,success)=>{console.log("Server Listening at 5000")});

//******************************** */
const mysqlConnection=mysql.createConnection(

    {
        host: "localhost",
        user: "root",
        password: "root",
        database: "pmo"
    }
);

const sessionStore = new MySQLStore({expiration:(1825*86400*1000),
endConnectionOnClose:false},mysqlConnection);

app.use(session({
    key:'42793jndndfjkfnsdjf7639kgerrg',
    secret:'ndsjgnsdk7945u94nvsdjkf7806m',
    store: sessionStore,
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:(1825*86400*100),
        httpOnly:false
    }
}));

mysqlConnection.connect((err)=>{
    if(!err) console.log("conncted to mysql");
    else
    console.log(err);
});

new Router(app, mysqlConnection);

   let hash;

// //********************************************* */

cron.schedule('0 0 * * SUN', function() {
    console.log('---------------------');
    console.log('Running Cron Job');
    mysqlConnection.query('Select "Y" PMO, pmpoints,sapoints, practice_head, practice_mail,practice_name,pmopoints,kpi_updated_date,roleId,project_id,project_name,project_status,project_start_date,project_end_date,project_type,project_methodology,project_milestone,pm_pmoscore,pm_selfscore,sa_pmoscore,sa_selfscore,project_complete_percent,project_fin_act_bud,project_fin_fct_bud,max(SA_NAME) SA_NAME1,max(PM_NAME) PA_NAME1,max(SA_EMAIL) SA_EMAIL1,max(PM_EMAIL) PM_EMAIL1 from (Select  (Select group_concat(role_name separator ",") from roles_t where role_id in (Select user_role from user_role_projects_t where pr.project_id = project_id )) roleId,pr.project_id,pr.project_name,pr.project_start_date,pr.project_end_date,pr.project_status,pr.project_type,pr.project_methodology,prd.project_milestone,(select sum(kpi_score) from kpi_project_masters_t where project_id = pr.project_id and project_id = urp.project_id and kpi_header_id in (1,2,3,4,5))pm_pmoscore,(Select sum(S) pm_selfscore from(Select sum(kdd.kpi_pm_points)/km.kpi_weight S from kpi_detail_data_t kdd,kpi_project_masters_t km where kdd.project_id=km.project_id and kdd.kpi_header_id = km.kpi_header_id and kdd.project_id = pr.project_id and kpi_pm_points is not null group by kdd.kpi_header_id) ch)pm_selfscore,(select sum(kpi_score) from kpi_project_masters_t where project_id = pr.project_id and project_id = urp.project_id and kpi_header_id in (6,7,8,9,10,11,12))sa_pmoscore,(Select sum(S) sa_selfscore from(Select sum(kdd.kpi_sa_points)/km.kpi_weight S from kpi_detail_data_t kdd,kpi_project_masters_t km where kdd.project_id=km.project_id and kdd.kpi_header_id = km.kpi_header_id and kdd.project_id = pr.project_id and kpi_sa_points is not null group by kdd.kpi_header_id) ch) sa_selfscore,prd.project_complete_percent,prd.project_fin_act_bud,prd.project_fin_fct_bud,case when urp.user_role = 1 then (Select user_name from users_t where user_id = urp.user_id and urp.user_role = 1) end as PM_NAME,case when urp.user_role = 1 then (Select email_id from users_t where user_id = urp.user_id and urp.user_role = 1) end as PM_EMAIL, case when urp.user_role = 3 then (Select user_name from users_t where user_id = urp.user_id and urp.user_role = 3) end as SA_NAME,case when urp.user_role = 3 then (Select email_id from users_t where user_id = urp.user_id and urp.user_role = 3) end as SA_EMAIL , scores.pmpoints,scores.sapoints,scores.pmopoints, scores.last_update_date as kpi_updated_date,(select head from master_data_t where practice_id = pr.PRACTICE) as practice_head,(select email from master_data_t where practice_id = pr.PRACTICE) as practice_mail, (select practice from master_data_t where practice_id = pr.PRACTICE) as practice_name from projects_t pr,user_role_projects_t urp,project_details_t prd, (select kdd.project_id,sum(kdd.kpi_pm_points) as pmpoints ,sum(kdd.kpi_sa_points) as sapoints, sum(kdd.kpi_pmo_points) as pmopoints,kdd.last_update_date from KPI_DETAIL_DATA_T kdd  group by  kdd.project_id) as scores where pr.project_id = urp.project_id and pr.project_id=scores.project_id and prd.project_id=pr.project_id and urp.project_id=prd.project_id and urp.project_id in (Select project_id from user_role_projects_t))as tablename group by project_id,project_name,project_status,project_type,project_milestone,project_fin_act_bud,pm_pmoscore,project_complete_percent,project_fin_fct_bud,roleId,sa_pmoscore,pm_selfscore,sa_selfscore', function (err, result, fields) {
      if (err) throw err;
      //console.log(result);
      result.forEach(element => {
      let pname =element.project_name;
      let pStartDate = element.project_start_date.toISOString().split('T')[0];
      let pstatus = element.project_status;
      let pendDate =element.project_end_date.toISOString().split('T')[0];
      let sa_email1 = element.SA_EMAIL1;
      let pm_email1 = element.PM_EMAIL1;
      let pmName ;
      let pro_pa_name = element.PA_NAME1;
      if(pro_pa_name !== null && pro_pa_name!=='') {
        pmName = pro_pa_name;
     }else{
      pmName ='-';
     }
      let saName;
      let pro_sa_name = element.SA_NAME1;
      if(pro_sa_name !== null && pro_sa_name!=='') {
        saName = pro_sa_name;
     }else{
      saName ='-';
     }
      console.log(saName);
      let mileStone;
      let mileStone_check = element.project_milestone;
      if(mileStone_check !== null && mileStone_check !== '') {
        mileStone = mileStone_check;
     }else{
      mileStone = '-';
     }
      let ptype = element.project_type;
      let pcomper;
      let pr_com_per_check = element.project_complete_percent;
      if(pr_com_per_check !== null && pr_com_per_check !== '') {
        pcomper = pr_com_per_check;
     }else{
      pcomper = '-';
     }
     let pfinactbud; 
     let pfinact_check = element.project_fin_act_bud;
     if(pfinact_check !== null && pfinact_check !== '') {
      pfinactbud = pfinact_check;
   }else{
    pfinactbud = '-';
   }
      let pfinfctbud;
      let pfinfct_cheack =  element.project_fin_fct_bud;
      if(pfinfct_cheack !== null && pfinfct_cheack !== '') {
        pfinfctbud = pfinfct_cheack;
     }else{
      pfinfctbud = '-';
     }

      let pmpoints; 
      let pmpoints_check = element.pmpoints;
      if(pmpoints_check !== null && pmpoints_check !== '') {
        pmpoints = pmpoints_check;
     }else{
      pmpoints = '-';
     }
      let sapoints;
      let sa_points_check =  element.sapoints;
      if(sa_points_check !== null && sa_points_check !== '') {
        sapoints = sa_points_check;
     }else{
      sapoints = '-';
     }
      let pmopoints;
      let pmopoints_check =  element.pmopoints; 
      if(pmopoints_check !== null && pmopoints_check !== '') {
        pmopoints = pmopoints_check;
     }else{
      pmopoints = '-';
     }
      let kpi_last_update_date;
       let kpi_lupdated = element.kpi_updated_date;
      if(kpi_lupdated !== null && kpi_lupdated !== '') {
        kpi_last_update_date = kpi_lupdated;
     }else{
      kpi_last_update_date = '-';
     }
     let dmName; 
     let dmName_check = element.practice_head;
     if(dmName_check !== null && dmName_check !== '') {
      dmName = dmName_check;
   }else{
    dmName = '-';
   }
     let delivery_manager_email = element.practice_mail;
     let practiceName1; 
     let practiceName_check = element.practice_name;
     if(practiceName_check !== null && practiceName_check !== '') {
      practiceName1 = practiceName_check;
   }else{
    practiceName1 = '-';
   }
     let sa_email_id = element.SA_EMAIL1;
     let pm_email_id = element.PM_EMAIL1;
     var email_id = [];

     if(sa_email_id !== null && sa_email_id!=='') {
       email_id.push(sa_email_id);
   }else{
    return;
   } 
   if(pm_email_id !== null && pm_email_id!==''){
    email_id.push(pm_email_id);
   }else{
      email_id.push('svbhaskar500@gmail.com');
   }
    console.log('Email IDs =' + email_id);

     
    
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'svbhaskar200@gmail.com',
   // pass: 'BHASKARREDDY123'
    },tls: {
    rejectUnauthorized: false
  }
});

var mailOptions = {
  from: 'Vijay vijayabhaskar.reddy@accelalpha.com',
  to: 'svbhaskar500@gmail.com,sirajuddin.shaik@accelalpha.com',
  //to: email_id,
  subject: 'Self Audit of currently running Project '+' '+ pname,
  html: 'Dear '+ pmName+
  '<br>The following project is currently running. Please find details as below. Update the milestone and KPI score details<table border="1" style="width:50%"><tr ><td style="background-color:#FFA07A; height:25"></td><td style="background-color:#FFA07A; height:25"></td></tr><tr><td>Project :</td><td>'+pname+'</td></tr><tr><td>Start Date :</td><td>'+pStartDate+'</td></tr><tr><td>End Date</td><td>'+pendDate+'</td></tr><tr><td>Status</td><td>'+pstatus+'</td></tr><tr><td>Project Practise:</td><td>'+practiceName1+'</td></tr></table><br>'+
  '<table border="1" style="height:35%"> <tr> <td style="background-color:#FFA07A;">Project Team Details </td> <td style="background-color:#D3D3D3;">Project Manager</td> <td style="background-color:#D3D3D3;">Solution Architect</td> <td style="background-color:#D3D3D3;">Delivery Manager</td> </tr> <tr> <td style="height:25"></td> <td style="height:25">'+pmName+'</td> <td style="height:25">'+saName+'</td> <td style="height:25">'+dmName+'</td> </tr> <tr> <td style="background-color:#FFA07A;">Milestone Details</td> <td style="background-color:#D3D3D3;">%Complete</td> <td style="background-color:#D3D3D3;">Project Fin Act/Bud</td> <td style="background-color:#D3D3D3;">Project Fin Fcst/Bud</td> </tr> <tr> <td> '+mileStone +'</td> <td>'+pcomper+'</td> <td>'+pfinactbud+'</td> <td>'+pfinfctbud+'</td> </tr> </table><br><br>'+
  '<table border="1" style="height:25%"> <tr> <th style="background-color:#FFA07A;">KPI Data Score Details</th> <th colspan="3" style="background-color:#D3D3D3;">PM</th> <th colspan="3" style="background-color:#D3D3D3;">SA</th> <th colspan="3" style="background-color:#D3D3D3;">PMO</th> </tr> <tr> <th></th> <th style="background-color:#D3D3D3;">Score</th> <th style="background-color:#D3D3D3;">Last Update Date</th> <th style="background-color:#D3D3D3;">Due Date</th> <th style="background-color:#D3D3D3;">Score</th> <th style="background-color:#D3D3D3;">Last Update Date</th> <th style="background-color:#D3D3D3;">Due Date</th> <th style="background-color:#D3D3D3;">Score</th> <th style="background-color:#D3D3D3;">Last Update Date</th> <th style="background-color:#D3D3D3;">Due Date</th> </tr> <tr> <td></td> <td>'+pmpoints+'</td> <td>'+kpi_last_update_date+'</td> <td>78</td> <td>'+sapoints+'</td> <td>'+kpi_last_update_date+'</td> <td>81</td> <td>'+pmopoints+'</td> <td>'+kpi_last_update_date+'</td> <td></td> </tr> </table><br>'+
  'Please click URL below to update the project<br>'+
   '[URL to update the project]<br><br> Thank You <br>PMO'
};

  transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent Schedule 1: ' + info.response +' '+new Date());
  }
  }); 

  });

 });
});

cron.schedule('0 0 * * SUN', function() {
  console.log('---------------------');
  console.log('Running Cron Job');
  mysqlConnection.query('Select "Y" PMO, pmpoints,sapoints, practice_head, practice_mail,practice_name,pmopoints,kpi_updated_date,roleId,project_id,project_name,project_status,project_start_date,project_end_date,project_type,project_methodology,project_milestone,pm_pmoscore,pm_selfscore,sa_pmoscore,sa_selfscore,project_complete_percent,project_fin_act_bud,project_fin_fct_bud,max(SA_NAME) SA_NAME1,max(PM_NAME) PA_NAME1,max(SA_EMAIL),max(PM_EMAIL) from (Select  (Select group_concat(role_name separator ",") from roles_t where role_id in (Select user_role from user_role_projects_t where pr.project_id = project_id )) roleId,pr.project_id,pr.project_name,pr.project_start_date,pr.project_end_date,pr.project_status,pr.project_type,pr.project_methodology,prd.project_milestone,(select sum(kpi_score) from kpi_project_masters_t where project_id = pr.project_id and project_id = urp.project_id and kpi_header_id in (1,2,3,4,5))pm_pmoscore,(Select sum(S) pm_selfscore from(Select sum(kdd.kpi_pm_points)/km.kpi_weight S from kpi_detail_data_t kdd,kpi_project_masters_t km where kdd.project_id=km.project_id and kdd.kpi_header_id = km.kpi_header_id and kdd.project_id = pr.project_id and kpi_pm_points is not null group by kdd.kpi_header_id) ch)pm_selfscore,(select sum(kpi_score) from kpi_project_masters_t where project_id = pr.project_id and project_id = urp.project_id and kpi_header_id in (6,7,8,9,10,11,12))sa_pmoscore,(Select sum(S) sa_selfscore from(Select sum(kdd.kpi_sa_points)/km.kpi_weight S from kpi_detail_data_t kdd,kpi_project_masters_t km where kdd.project_id=km.project_id and kdd.kpi_header_id = km.kpi_header_id and kdd.project_id = pr.project_id and kpi_sa_points is not null group by kdd.kpi_header_id) ch) sa_selfscore,prd.project_complete_percent,prd.project_fin_act_bud,prd.project_fin_fct_bud,case when urp.user_role = 1 then (Select user_name from users_t where user_id = urp.user_id and urp.user_role = 1) end as PM_NAME,case when urp.user_role = 1 then (Select email_id from users_t where user_id = urp.user_id and urp.user_role = 1) end as PM_EMAIL, case when urp.user_role = 3 then (Select user_name from users_t where user_id = urp.user_id and urp.user_role = 3) end as SA_NAME,case when urp.user_role = 3 then (Select email_id from users_t where user_id = urp.user_id and urp.user_role = 3) end as SA_EMAIL , scores.pmpoints,scores.sapoints,scores.pmopoints, scores.last_update_date as kpi_updated_date,(select head from master_data_t where practice_id = pr.PRACTICE) as practice_head,(select email from master_data_t where practice_id = pr.PRACTICE) as practice_mail, (select practice from master_data_t where practice_id = pr.PRACTICE) as practice_name from projects_t pr,user_role_projects_t urp,project_details_t prd, (select kdd.project_id,sum(kdd.kpi_pm_points) as pmpoints ,sum(kdd.kpi_sa_points) as sapoints, sum(kdd.kpi_pmo_points) as pmopoints,kdd.last_update_date from KPI_DETAIL_DATA_T kdd  group by  kdd.project_id) as scores where pr.project_id = urp.project_id and pr.project_id=scores.project_id and prd.project_id=pr.project_id and urp.project_id=prd.project_id and urp.project_id in (Select project_id from user_role_projects_t))as tablename group by project_id,project_name,project_status,project_type,project_milestone,project_fin_act_bud,pm_pmoscore,project_complete_percent,project_fin_fct_bud,roleId,sa_pmoscore,pm_selfscore,sa_selfscore', function (err, result, fields) {
    if (err) throw err;
    result.forEach(element => {
    let pname;
    let pname_check = element.project_name;
    if(pname_check !== null && pname_check !== '') {
      pname = pname_check;
   }else{
    pname = '-';
   }
    let pStartDate; 
    let pst_date_check = element.project_start_date.toISOString().split('T')[0];
    if(pst_date_check !== null && pst_date_check !== '') {
      pStartDate = pst_date_check;
   }else{
    pStartDate = '-';
   }
    let pstatus;
    let pstatus_check =  element.project_status;
    if(pstatus_check !== null && pstatus_check !== '') {
      pstatus = pstatus_check;
   }else{
    pstatus = '-';
   }
    let pendDate;
    let end_date_check = element.project_end_date.toISOString().split('T')[0];
    if(end_date_check !== null && end_date_check !== '') {
      pendDate = end_date_check;
   }else{
    pendDate = '-';
   }
    let pmName ;
    let pro_pa_name = element.PA_NAME1;
    if(pro_pa_name !== null && pro_pa_name!=='') {
      pmName = pro_pa_name;
   }else{
    pmName ='-';
   }
    let saName;
    let pro_sa_name = element.SA_NAME1;
    if(pro_sa_name !== null && pro_sa_name!=='') {
      saName = pro_sa_name;
   }else{
    saName =' ';
   }
    let mileStone; 
    let milestone_check =element.project_milestone;
    if(milestone_check !== null && milestone_check!=='') {
      mileStone = milestone_check;
   }else{
    mileStone ='-';
   }
    let pcomper; 
    let pcom_check = element.project_complete_percent;
    if(pcom_check !== null && pcom_check!=='') {
      pcomper = pcom_check;
   }else{
    pcomper ='-';
   }
   let pfinactbud;
   let pfinat_check =  element.project_fin_act_bud;
   if(pfinat_check !== null && pfinat_check!=='') {
    pfinactbud = pfinat_check;
 }else{
  pfinactbud ='-';
 }
    let pfinfctbud;
    let pfinact_check1 =  element.project_fin_fct_bud;
    if(pfinact_check1 !== null && pfinact_check1!=='') {
      pfinfctbud = pfinact_check1;
   }else{
    pfinfctbud ='-';
   }
    let pmpoints;
    let pmpoints_check1 = element.pmpoints;
    if(pmpoints_check1 !== null && pmpoints_check1!=='') {
      pmpoints = pmpoints_check1;
   }else{
    pmpoints ='-';
   }
    let sapoints; 
    let sa_points_check1 = element.sapoints;
    if(sa_points_check1 !== null && sa_points_check1!=='') {
      sapoints = sa_points_check1;
   }else{
    sapoints ='-';
   }
    let pmopoints; 
    let pmopoints_check1 = element.pmopoints;
    if(pmopoints_check1 !== null && pmopoints_check1!=='') {
      pmopoints = pmopoints_check1;
   }else{
    pmopoints ='-';
   }
    let kpi_last_update_date;
     let kpi_lupdated = element.kpi_updated_date;
    if(kpi_lupdated !== null && kpi_lupdated !== '') {
      kpi_last_update_date = kpi_lupdated;
   }else{
    kpi_last_update_date = new Date().toISOString().split('T')[0];
   }
   let dmName; 
   let dmName_check1 = element.practice_head; 
   if(dmName_check1 !== null && dmName_check1 !== '') {
    dmName = dmName_check1;
 }else{
  dmName = '-';
 }
   let dm_email_id ;
   let dm_email_id_check = element.practice_mail;
   if(dm_email_id_check !== null && dm_email_id_check !== '') {
    dm_email_id = dm_email_id_check;
 }else{
  dm_email_id = 'svbhaskar500@gmail.com';
 }
   let dm_prct_name; 
   let dm_prct_name_check = element.practice_name;
   if(dm_prct_name_check !== null && dm_prct_name_check !== '') {
    dm_prct_name = dm_prct_name_check;
 }else{
  dm_prct_name = '-';
 }
  
var transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
  user: 'svbhaskar200@gmail.com',
 // pass: 'BHASKARREDDY123'
},tls: {
  rejectUnauthorized: false
}
});

var mailOptions = {
from: 'Vijay svbhaskar200@gmail.com',
to: 'svbhaskar500@gmail.com,sirajuddin.shaik@accelalpha.com',
//to: dm_email_id,
subject: 'Review of currently running Project  '+' '+ pname,
html: 'Dear '+ dmName+
'<br>The following project is currently running. Please find details as below <table border="1" style="width:50%"><tr ><td style="background-color:#FFA07A; height:25"></td><td style="background-color:#FFA07A; height:25"></td></tr><tr><td>Project :</td><td>'+pname+'</td></tr><tr><td>Start Date :</td><td>'+pStartDate+'</td></tr><tr><td>End Date</td><td>'+pendDate+'</td></tr><tr><td>Status</td><td>'+pstatus+'</td></tr><tr><td>Project Practise:</td><td>'+dm_prct_name+'</td></tr></table><br>'+
'<table border="1"style="height:35%"><tr><td style="background-color:#FFA07A;">Project Team Details </td><td style="background-color:#D3D3D3;">Project Manager</td><td style="background-color:#D3D3D3;">Solution Architect</td><td style="background-color:#D3D3D3;">Delivery Manager</td></tr><tr> <td style="height:25"></td><td style="height:25">'+pmName+'</td><td style="height:25">'+saName+'</td><td style="height:25"'+dmName+'></td></tr><tr><td style="background-color:#FFA07A;">Milestone Details</td> <td style="background-color:#D3D3D3;">%Complete</td> <td style="background-color:#D3D3D3;">Project Fin</td> <td style="background-color:#D3D3D3;">Project Fin</td></tr><tr> <td style="height:25">'+mileStone+'</td> <td style="height:25">'+pcomper+'</td> <td style="height:25">'+pfinactbud+'</td> <td style="height:25">'+pfinfctbud+'</td></tr></table><br>'+
'<table border="1" style="height:25%"> <tr> <th style="background-color:#FFA07A;">KPI Data Score Details</th> <th colspan="3" style="background-color:#D3D3D3;">PM</th> <th colspan="3" style="background-color:#D3D3D3;">SA</th> <th colspan="3" style="background-color:#D3D3D3;">PMO</th> </tr> <tr> <th></th> <th style="background-color:#D3D3D3;">Score</th> <th style="background-color:#D3D3D3;">Last Update Date</th> <th style="background-color:#D3D3D3;">Due Date</th> <th style="background-color:#D3D3D3;">Score</th> <th style="background-color:#D3D3D3;">Last Update Date</th> <th style="background-color:#D3D3D3;">Due Date</th> <th style="background-color:#D3D3D3;">Score</th> <th style="background-color:#D3D3D3;">Last Update Date</th> <th style="background-color:#D3D3D3;">Due Date</th> </tr> <tr> <td></td> <td>'+pmpoints+'</td> <td>'+kpi_last_update_date+'</td> <td></td> <td>'+sapoints+'</td> <td>'+kpi_last_update_date+'</td> <td></td> <td>'+pmopoints+'</td> <td>'+kpi_last_update_date+'</td> <td></td> </tr> </table><br>'+
'Please click URL below for further details<br>'+
 '[URL to update the project]<br><br> Thank You <br>PMO'
};

  transporter.sendMail(mailOptions, function(error, info){
if (error) {
  console.log(error);
} else {
  console.log('Email sent Schedule 2: ' + info.response);
}
}); 

});

});
});

cron.schedule('0 0 * * SUN', function() {
  console.log('---------------------');
  console.log('Running Cron Job');
  mysqlConnection.query('Select "Y" PMO, pmpoints,sapoints, practice_head, practice_mail,practice_name,pmopoints,kpi_updated_date,roleId,project_id,project_name,project_status,project_start_date,project_end_date,project_type,project_methodology,project_milestone,pm_pmoscore,pm_selfscore,sa_pmoscore,sa_selfscore,project_complete_percent,project_fin_act_bud,project_fin_fct_bud,max(SA_NAME) SA_NAME1,max(PM_NAME) PA_NAME1,max(SA_EMAIL) SA_EMAIL1,max(PM_EMAIL) PM_EMAIL1 from (Select  (Select group_concat(role_name separator ",") from roles_t where role_id in (Select user_role from user_role_projects_t where pr.project_id = project_id )) roleId,pr.project_id,pr.project_name,pr.project_start_date,pr.project_end_date,pr.project_status,pr.project_type,pr.project_methodology,prd.project_milestone,(select sum(kpi_score) from kpi_project_masters_t where project_id = pr.project_id and project_id = urp.project_id and kpi_header_id in (1,2,3,4,5))pm_pmoscore,(Select sum(S) pm_selfscore from(Select sum(kdd.kpi_pm_points)/km.kpi_weight S from kpi_detail_data_t kdd,kpi_project_masters_t km where kdd.project_id=km.project_id and kdd.kpi_header_id = km.kpi_header_id and kdd.project_id = pr.project_id and kpi_pm_points is not null group by kdd.kpi_header_id) ch)pm_selfscore,(select sum(kpi_score) from kpi_project_masters_t where project_id = pr.project_id and project_id = urp.project_id and kpi_header_id in (6,7,8,9,10,11,12))sa_pmoscore,(Select sum(S) sa_selfscore from(Select sum(kdd.kpi_sa_points)/km.kpi_weight S from kpi_detail_data_t kdd,kpi_project_masters_t km where kdd.project_id=km.project_id and kdd.kpi_header_id = km.kpi_header_id and kdd.project_id = pr.project_id and kpi_sa_points is not null group by kdd.kpi_header_id) ch) sa_selfscore,prd.project_complete_percent,prd.project_fin_act_bud,prd.project_fin_fct_bud,case when urp.user_role = 1 then (Select user_name from users_t where user_id = urp.user_id and urp.user_role = 1) end as PM_NAME,case when urp.user_role = 1 then (Select email_id from users_t where user_id = urp.user_id and urp.user_role = 1) end as PM_EMAIL, case when urp.user_role = 3 then (Select user_name from users_t where user_id = urp.user_id and urp.user_role = 3) end as SA_NAME,case when urp.user_role = 3 then (Select email_id from users_t where user_id = urp.user_id and urp.user_role = 3) end as SA_EMAIL , scores.pmpoints,scores.sapoints,scores.pmopoints, scores.last_update_date as kpi_updated_date,(select head from master_data_t where practice_id = pr.PRACTICE) as practice_head,(select email from master_data_t where practice_id = pr.PRACTICE) as practice_mail, (select practice from master_data_t where practice_id = pr.PRACTICE) as practice_name from projects_t pr,user_role_projects_t urp,project_details_t prd, (select kdd.project_id,sum(kdd.kpi_pm_points) as pmpoints ,sum(kdd.kpi_sa_points) as sapoints, sum(kdd.kpi_pmo_points) as pmopoints,kdd.last_update_date from KPI_DETAIL_DATA_T kdd  group by  kdd.project_id) as scores where pr.project_id = urp.project_id and pr.project_id=scores.project_id and prd.project_id=pr.project_id and urp.project_id=prd.project_id and urp.project_id in (Select project_id from user_role_projects_t))as tablename group by project_id,project_name,project_status,project_type,project_milestone,project_fin_act_bud,pm_pmoscore,project_complete_percent,project_fin_fct_bud,roleId,sa_pmoscore,pm_selfscore,sa_selfscore', function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    result.forEach(element => {
    let pname;
     let pname_check2 = element.project_name;
    if(pname_check2 !== null && pname_check2 !== '') {
      pname = pname_check2;
   }else{
    pname = '-';
   }
    let pStartDate;
    let pst_date1 = element.project_start_date.toISOString().split('T')[0];
    if(pst_date1 !== null && pst_date1 !== '') {
      pStartDate = pst_date1;
   }else{
    pStartDate = '-';
   }
    let pstatus;
    let pstatus_check2 = element.project_status;
    if(pstatus_check2 !== null && pstatus_check2 !== '') {
      pstatus = pstatus_check2;
   }else{
    pstatus = '-';
   }
    let pendDate;
    let pend_date2 =element.project_end_date.toISOString().split('T')[0]; 
    if(pend_date2 !== null && pend_date2 !== '') {
      pendDate = pend_date2;
   }else{
    pendDate = '-';
   }

    let pmName ;
    let pro_pa_name = element.PA_NAME1;
    if(pro_pa_name !== null && pro_pa_name!=='') {
      pmName = pro_pa_name;
   }else{
    pmName ='-';
   }
    let saName;
    let pro_sa_name = element.SA_NAME1;
    if(pro_sa_name !== null && pro_sa_name!=='') {
      saName = pro_sa_name;
   }else{
    saName ='-';
   }
    let mileStone; 
    let milestone_check2 = element.project_milestone;
    if(milestone_check2 !== null && milestone_check2!=='') {
      mileStone = milestone_check2;
   }else{
    mileStone ='-';
   }
    let pcomper; 
   let pcom_check2 = element.project_complete_percent;
    if(pcom_check2 !== null && pcom_check2!=='') {
      pcomper = pcom_check2;
   }else{
    pcomper ='-';
   }
   let pfinactbud; 
     let pfinact_check2 = element.project_fin_act_bud;
   if(pfinact_check2 !== null && pfinact_check2!=='') {
    pfinactbud = pfinact_check2;
      }else{
        pfinactbud ='-';
     }
    let pfinfctbud;
      let pfinfct_cheack2 = element.project_fin_fct_bud;
    if(pfinfct_cheack2 !== null && pfinfct_cheack2!=='') {
      pfinfctbud = pfinfct_cheack2;
        }else{
          pfinfctbud ='-';
       }
    let pmpoints;
    let pmpoints_check2 =  element.pmpoints;
    if(pmpoints_check2 !== null && pmpoints_check2!=='') {
      pmpoints = pmpoints_check2;
        }else{
          pmpoints ='-';
       }
    let sapoints;
    let sa_points_check2 = element.sapoints;
    if(sa_points_check2 !== null && sa_points_check2!=='') {
      sapoints = sa_points_check2;
        }else{
          sapoints ='-';
       }
    let pmopoints = element.pmopoints;
    let kpi_last_update_date;
     let kpi_lupdated = element.kpi_updated_date;
    if(kpi_lupdated !== null && kpi_lupdated !== '') {
      kpi_last_update_date = kpi_lupdated;
   }else{
    kpi_last_update_date = new Date().toISOString().split('T')[0];
   }
   let dmName; 
   let dmName_check2 = element.practice_head;
   if(dmName_check2 !== null && dmName_check2!=='') {
    dmName = dmName_check2;
      }else{
        dmName ='-';
     }
   let pract_name; 
   let pract_name_check = element.practice_name;
   if(pract_name_check !== null && pract_name_check!=='') {
    pract_name = pract_name_check;
      }else{
        pract_name ='-';
     }

     let pm_email_id4;
     let pm_email_id_check1 = element.PM_EMAIL1;
     if(pm_email_id_check1 !== null && pm_email_id_check1!=='') {
      pm_email_id4 = pm_email_id_check1;
        }else{
          pm_email_id4 ='svbhaskar500@gmail.com';
       }
       console.log('Email : '+ pm_email_id4)
 
   
  
var transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
  user: 'svbhaskar200@gmail.com',
 // pass: 'BHASKARREDDY123'
},tls: {
  rejectUnauthorized: false
}
});

var mailOptions = {
from: 'Vijay svbhaskar200@gmail.com',
to: 'svbhaskar500@gmail.com,sirajuddin.shaik@accelalpha.com',
//to: pm_email_id4,
subject: 'Audit of currently running Project  '+' '+ pname,
html: 'Dear '+ dmName+
'<br>The following project’s KPI scores have been updated by PM/SA. Please find details as below. Update PMO score<table border="1" style="width:50%"><tr ><td style="background-color:#FFA07A; height:25"></td><td style="background-color:#FFA07A; height:25"></td></tr><tr><td>Project :</td><td>'+pname+'</td></tr><tr><td>Start Date :</td><td>'+pStartDate+'</td></tr><tr><td>End Date</td><td>'+pendDate+'</td></tr><tr><td>Status</td><td>'+pstatus+'</td></tr><tr><td>Project Practise:</td><td>'+pract_name+'</td></tr></table><br>'+
'<table border="1"style="height:35%"> <tr> <td style="background-color:#FFA07A;">Project Team Details </td> <td style="background-color:#D3D3D3;">Project Manager</td> <td style="background-color:#D3D3D3;">Solution Architect</td> <td style="background-color:#D3D3D3;">Delivery Manager</td> </tr> <tr> <td style="height:25"></td> <td style="height:25">'+pmName+'</td> <td style="height:25">'+saName+'</td> <td style="height:25">'+dmName+'</td> </tr> <tr> <td style="background-color:#FFA07A;">Milestone Details</td> <td style="background-color:#D3D3D3;">%Complete</td> <td style="background-color:#D3D3D3;">Project Fin Act/Bud</td> <td style="background-color:#D3D3D3;">Project Fin Fcst/Bud</td> </tr> <tr> <td>'+mileStone+' </td> <td>'+pcomper+'</td> <td>'+pfinactbud+'</td> <td>'+pfinfctbud+'</td> </tr> <tr> <td style="background-color:#FFA07A;">KPI Data Score Details</td> <td style="background-color:#D3D3D3;">PM Score</td> <td style="background-color:#D3D3D3;">SA Score</td> <td style="background-color:#D3D3D3;">Date of last Score</td> </tr> <tr> <td style="height:25"></td> <td>'+pmpoints+'</td> <td>'+sapoints+'</td> <td>'+kpi_last_update_date+'</td> </tr> <tr> <td style="height:25"></td> <td style="height:25"></td> <td style="height:25"></td> <td style="height:25"></td> </tr> </table>'+
'Please click URL below for further details<br>'+
 '[URL to update the project]<br><br> Thank You <br>PMO'
};

  transporter.sendMail(mailOptions, function(error, info){
if (error) {
  console.log(error);
} else {
  console.log('Email sent Schedule 3: ' + info.response);
}
}); 

});

});
});

cron.schedule('0 0 * * SUN', function() {
  console.log('---------------------');
  console.log('Running Cron Job');
  mysqlConnection.query('Select "Y" PMO, pmpoints,sapoints, practice_head, practice_mail,practice_name,pmopoints,kpi_updated_date,roleId,project_id,project_name,project_status,project_start_date,project_end_date,project_type,project_methodology,project_milestone,pm_pmoscore,pm_selfscore,sa_pmoscore,sa_selfscore,project_complete_percent,project_fin_act_bud,project_fin_fct_bud,max(SA_NAME) SA_NAME1,max(PM_NAME) PA_NAME1,max(SA_EMAIL),max(PM_EMAIL) from (Select  (Select group_concat(role_name separator ",") from roles_t where role_id in (Select user_role from user_role_projects_t where pr.project_id = project_id )) roleId,pr.project_id,pr.project_name,pr.project_start_date,pr.project_end_date,pr.project_status,pr.project_type,pr.project_methodology,prd.project_milestone,(select sum(kpi_score) from kpi_project_masters_t where project_id = pr.project_id and project_id = urp.project_id and kpi_header_id in (1,2,3,4,5))pm_pmoscore,(Select sum(S) pm_selfscore from(Select sum(kdd.kpi_pm_points)/km.kpi_weight S from kpi_detail_data_t kdd,kpi_project_masters_t km where kdd.project_id=km.project_id and kdd.kpi_header_id = km.kpi_header_id and kdd.project_id = pr.project_id and kpi_pm_points is not null group by kdd.kpi_header_id) ch)pm_selfscore,(select sum(kpi_score) from kpi_project_masters_t where project_id = pr.project_id and project_id = urp.project_id and kpi_header_id in (6,7,8,9,10,11,12))sa_pmoscore,(Select sum(S) sa_selfscore from(Select sum(kdd.kpi_sa_points)/km.kpi_weight S from kpi_detail_data_t kdd,kpi_project_masters_t km where kdd.project_id=km.project_id and kdd.kpi_header_id = km.kpi_header_id and kdd.project_id = pr.project_id and kpi_sa_points is not null group by kdd.kpi_header_id) ch) sa_selfscore,prd.project_complete_percent,prd.project_fin_act_bud,prd.project_fin_fct_bud,case when urp.user_role = 1 then (Select user_name from users_t where user_id = urp.user_id and urp.user_role = 1) end as PM_NAME,case when urp.user_role = 1 then (Select email_id from users_t where user_id = urp.user_id and urp.user_role = 1) end as PM_EMAIL, case when urp.user_role = 3 then (Select user_name from users_t where user_id = urp.user_id and urp.user_role = 3) end as SA_NAME,case when urp.user_role = 3 then (Select email_id from users_t where user_id = urp.user_id and urp.user_role = 3) end as SA_EMAIL , scores.pmpoints,scores.sapoints,scores.pmopoints, scores.last_update_date as kpi_updated_date,(select head from master_data_t where practice_id = pr.PRACTICE) as practice_head,(select email from master_data_t where practice_id = pr.PRACTICE) as practice_mail, (select practice from master_data_t where practice_id = pr.PRACTICE) as practice_name from projects_t pr,user_role_projects_t urp,project_details_t prd, (select kdd.project_id,sum(kdd.kpi_pm_points) as pmpoints ,sum(kdd.kpi_sa_points) as sapoints, sum(kdd.kpi_pmo_points) as pmopoints,kdd.last_update_date from KPI_DETAIL_DATA_T kdd  group by  kdd.project_id) as scores where pr.project_id = urp.project_id and pr.project_id=scores.project_id and prd.project_id=pr.project_id and urp.project_id=prd.project_id and urp.project_id in (Select project_id from user_role_projects_t))as tablename group by project_id,project_name,project_status,project_type,project_milestone,project_fin_act_bud,pm_pmoscore,project_complete_percent,project_fin_fct_bud,roleId,sa_pmoscore,pm_selfscore,sa_selfscore', function (err, result, fields) {
    if (err) throw err;
    result.forEach(element => {
    let pname;
    let pname_check3 = element.project_name;
    if(pname_check3 !== null && pname_check3!=='') {
      pname = pname_check3;
        }else{
          pname ='-';
       }
    let pStartDate;
    let pst_date2 = element.project_start_date.toISOString().split('T')[0];
    if(pst_date2 !== null && pst_date2!=='') {
      pStartDate = pst_date2;
        }else{
      pStartDate ='-';
       }
   
    let pstatus; 
    let pstatus_check3 = element.project_status;
    if(pstatus_check3 !== null && pstatus_check3!=='') {
      pstatus = pstatus_check3;
        }else{
          pstatus ='-';
       }
    let pendDate;
    let pend_date3 = element.project_end_date.toISOString().split('T')[0];
    if(pend_date3 !== null && pend_date3!=='') {
      pendDate = pend_date3;
        }else{
          pendDate ='-';
       }
    let pmName ;
    let pro_pa_name = element.PA_NAME1;
    if(pro_pa_name !== null && pro_pa_name!=='') {
      pmName = pro_pa_name;
   }else{
    pmName ='-';
   }
    let saName;
    let pro_sa_name = element.SA_NAME1;
    if(pro_sa_name !== null && pro_sa_name!=='') {
      saName = pro_sa_name;
   }else{
    saName =' ';
   }
    console.log(saName);
    let mileStone = element.project_milestone;
    console.log(mileStone);
    let ptype = element.project_type;
    let pcomper = element.project_complete_percent;
   let pfinactbud = element.project_fin_act_bud;
    let pfinfctbud = element.project_fin_fct_bud;
    let pmpoints = element.pmpoints;
    let sapoints = element.sapoints;
    let pmopoints = element.pmopoints;
    let kpi_last_update_date;
     let kpi_lupdated = element.kpi_updated_date;
    if(kpi_lupdated !== null && kpi_lupdated !== '') {
      kpi_last_update_date = kpi_lupdated;
   }else{
    kpi_last_update_date = new Date().toISOString().split('T')[0];
   }
   let dmName;
    let dm_name_check = element.practice_head;
   if(dm_name_check !== null && dm_name_check !== '') {
    dmName = dm_name_check;
 }else{
  dmName = '-';
 }
   let prct_name;
   let prct_name_check2 = element.practice_name;
   if(prct_name_check2 !== null && prct_name_check2 !== '') {
    prct_name = prct_name_check2;
 }else{
  prct_name = '-';
 }
   
  
var transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
  user: 'svbhaskar200@gmail.com',
 // pass: 'BHASKARREDDY123'
},tls: {
  rejectUnauthorized: false
}
});

var mailOptions = {
from: 'Vijay svbhaskar200@gmail.com'+' '+pname,
to: 'svbhaskar500@gmail.com,sirajuddin.shaik@accelalpha.com',
subject: 'Projects with KPI updates pending more than [N] days from PM',
html: 'Dear '+ dmName+
'<br>   The following projects have not been updated in the PMO Automation system with the KPI scores and/or the milestone information for more than [N] days<br>'+
'<table border="1"style="height:20%"> <tr> <td style="background-color:#FFA07A;">Project Name </td> <td style="background-color:#FFA07A;">Practice</td> <td style="background-color:#FFA07A;">Project Start Date</td> <td style="background-color:#FFA07A;">Project Manager</td> <td style="background-color:#FFA07A;">SA</td> <td style="background-color:#FFA07A;">Current Score</td> <td style="background-color:#FFA07A;">Last Updated Date</td> </tr> <tr> <td >'+pname+'</td> <td >'+prct_name+'</td> <td >'+pStartDate+'</td> <td >'+pmName+'</td> <td >'+saName+'</td> <td>'+pmopoints+'</td> <td>'+kpi_last_update_date+'</td> </tr> <tr> <td style="height:25"></td> <td style="height:25"></td> <td style="height:25"></td> <td style="height:25"></td> <td style="height:25"></td> <td style="height:25"></td> <td style="height:25"></td> </tr> </table>'+
'Please click URL below for further details<br>'+
 '[URL to update the project]<br><br> Thank You <br>PMO' +
 '<br> Note: Based on practice and location, for time limit threshold 1, email should go to practice head and for time limit threshold 2, email should go to operations head'
};

 transporter.sendMail(mailOptions, function(error, info){
if (error) {
  console.log(error);
} else {
  console.log('Email sent Schedule 4: ' + info.response);
}
}); 

});

});
});

cron.schedule('0 0 * * SUN', function() {
  console.log('---------------------');
  console.log('Running Cron Job');
  let projectsString='';
  mysqlConnection.query('Select "Y" PMO, pmpoints,sapoints, practice_head, practice_mail,practice_name,pmopoints,kpi_updated_date,roleId,project_id,project_name,project_status,project_start_date,project_end_date,project_type,project_methodology,project_milestone,pm_pmoscore,pm_selfscore,sa_pmoscore,sa_selfscore,project_complete_percent,project_fin_act_bud,project_fin_fct_bud,max(SA_NAME) SA_NAME1,max(PM_NAME) PA_NAME1,max(SA_EMAIL),max(PM_EMAIL) from (Select  (Select group_concat(role_name separator ",") from roles_t where role_id in (Select user_role from user_role_projects_t where pr.project_id = project_id )) roleId,pr.project_id,pr.project_name,pr.project_start_date,pr.project_end_date,pr.project_status,pr.project_type,pr.project_methodology,prd.project_milestone,(select sum(kpi_score) from kpi_project_masters_t where project_id = pr.project_id and project_id = urp.project_id and kpi_header_id in (1,2,3,4,5))pm_pmoscore,(Select sum(S) pm_selfscore from(Select sum(kdd.kpi_pm_points)/km.kpi_weight S from kpi_detail_data_t kdd,kpi_project_masters_t km where kdd.project_id=km.project_id and kdd.kpi_header_id = km.kpi_header_id and kdd.project_id = pr.project_id and kpi_pm_points is not null group by kdd.kpi_header_id) ch)pm_selfscore,(select sum(kpi_score) from kpi_project_masters_t where project_id = pr.project_id and project_id = urp.project_id and kpi_header_id in (6,7,8,9,10,11,12))sa_pmoscore,(Select sum(S) sa_selfscore from(Select sum(kdd.kpi_sa_points)/km.kpi_weight S from kpi_detail_data_t kdd,kpi_project_masters_t km where kdd.project_id=km.project_id and kdd.kpi_header_id = km.kpi_header_id and kdd.project_id = pr.project_id and kpi_sa_points is not null group by kdd.kpi_header_id) ch) sa_selfscore,prd.project_complete_percent,prd.project_fin_act_bud,prd.project_fin_fct_bud,case when urp.user_role = 1 then (Select user_name from users_t where user_id = urp.user_id and urp.user_role = 1) end as PM_NAME,case when urp.user_role = 1 then (Select email_id from users_t where user_id = urp.user_id and urp.user_role = 1) end as PM_EMAIL, case when urp.user_role = 3 then (Select user_name from users_t where user_id = urp.user_id and urp.user_role = 3) end as SA_NAME,case when urp.user_role = 3 then (Select email_id from users_t where user_id = urp.user_id and urp.user_role = 3) end as SA_EMAIL , scores.pmpoints,scores.sapoints,scores.pmopoints, scores.last_update_date as kpi_updated_date,(select head from master_data_t where practice_id = pr.PRACTICE) as practice_head,(select email from master_data_t where practice_id = pr.PRACTICE) as practice_mail, (select practice from master_data_t where practice_id = pr.PRACTICE) as practice_name from projects_t pr,user_role_projects_t urp,project_details_t prd, (select kdd.project_id,sum(kdd.kpi_pm_points) as pmpoints ,sum(kdd.kpi_sa_points) as sapoints, sum(kdd.kpi_pmo_points) as pmopoints,kdd.last_update_date from KPI_DETAIL_DATA_T kdd  group by  kdd.project_id) as scores where pr.project_id = urp.project_id and pr.project_id=scores.project_id and prd.project_id=pr.project_id and urp.project_id=prd.project_id and urp.project_id in (Select project_id from user_role_projects_t))as tablename group by project_id,project_name,project_status,project_type,project_milestone,project_fin_act_bud,pm_pmoscore,project_complete_percent,project_fin_fct_bud,roleId,sa_pmoscore,pm_selfscore,sa_selfscore', function (err, result, fields) {
    if (err) throw err;
    result.forEach(element => {
    let pname;
    let pname_check3 = element.project_name;
    if(pname_check3 !== null && pname_check3!=='') {
      pname = pname_check3;
        }else{
          pname ='-';
       }
    let pStartDate;
    let pst_date2 = element.project_start_date.toISOString().split('T')[0];
    if(pst_date2 !== null && pst_date2!=='') {
      pStartDate = pst_date2;
        }else{
      pStartDate ='-';
       }
   
    let pstatus; 
    let pstatus_check3 = element.project_status;
    if(pstatus_check3 !== null && pstatus_check3!=='') {
      pstatus = pstatus_check3;
        }else{
          pstatus ='-';
       }
    let pendDate;
    let pend_date3 = element.project_end_date.toISOString().split('T')[0];
    if(pend_date3 !== null && pend_date3!=='') {
      pendDate = pend_date3;
        }else{
          pendDate ='-';
       }
    let pmName ;
    let pro_pa_name = element.PA_NAME1;
    if(pro_pa_name !== null && pro_pa_name!=='') {
      pmName = pro_pa_name;
   }else{
    pmName ='-';
   }
    let saName;
    let pro_sa_name = element.SA_NAME1;
    if(pro_sa_name !== null && pro_sa_name!=='') {
      saName = pro_sa_name;
   }else{
    saName =' ';
   }
    console.log(saName);
    let mileStone = element.project_milestone;
    console.log(mileStone);
    let ptype;
    let proj_type  = element.project_type;
    if(proj_type !== null && proj_type !== '') {
      ptype = proj_type;
   }else{
    ptype = '-';
   }
    let pcomper; 
     let prj_com_per = element.project_complete_percent;
    if(prj_com_per !== null && prj_com_per !== '') {
      pcomper = prj_com_per;
   }else{
    pcomper = '-';
   }
   let pfinactbud ;
   let prfinact1 =  element.project_fin_act_bud;
   if(prfinact1 !== null && prfinact1 !== '') {
    pfinactbud = prfinact1;
 }else{
  pfinactbud = '-';
 }

    let pfinfctbud;
    let prfinfct1 = element.project_fin_fct_bud; 
    if(prfinfct1 !== null && prfinfct1 !== '') {
      pfinfctbud = prfinfct1;
   }else{
    pfinfctbud = '-';
   }
    let pmpoints; 
    let pmpoints1 = element.pmpoints;
    if(pmpoints1 !== null && pmpoints1 !== '') {
      pmpoints = pmpoints1;
   }else{
    pmpoints = '-';
   }
    let sapoints;
    let sapoints1  = element.sapoints;
    if(sapoints1 !== null && sapoints1 !== '') {
      sapoints = sapoints1;
   }else{
    sapoints = '-';
   }
    let pmopoints;
    let pmopoints1  = element.pmopoints;
    if(pmopoints1 !== null && pmopoints1 !== '') {
      pmopoints = pmopoints1;
   }else{
    pmopoints = '-';
   }
    let kpi_last_update_date;
     let kpi_lupdated = element.kpi_updated_date;
    if(kpi_lupdated !== null && kpi_lupdated !== '') {
      kpi_last_update_date = kpi_lupdated;
   }else{
    kpi_last_update_date = new Date().toISOString().split('T')[0];
   }
   let dmName;
    let dm_name_check = element.practice_head;
   if(dm_name_check !== null && dm_name_check !== '') {
    dmName = dm_name_check;
 }else{
  dmName = '-';
 }
   let prct_name;
   let prct_name_check2 = element.practice_name;
   if(prct_name_check2 !== null && prct_name_check2 !== '') {
    prct_name = prct_name_check2;
 }else{
  prct_name = '-';
 }
   
  projectsString=projectsString+'<tr> <td>'+pname+'</td> <td>'+mileStone+'</td> <td>'+ptype+'</td> <td style="background-color:yellow">'+pmpoints+'</td> <td>'+pmopoints+'</td> <td style="background-color:yellow">'+pmopoints+'</td> <td >'+sapoints+'</td> <td style="background-color:#FFA07A">'+pmopoints+'</td> <td style="background-color:yellow">'+pfinactbud+'</td> <td style="background-color:#FF6347">'+pfinfctbud+'</td> </tr> ';

 

 

});

 

var transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
  user: 'svbhaskar200@gmail.com',
  //pass: 'BHASKARREDDY123'
},tls: {
  rejectUnauthorized: false
}
});

 

var mailOptions = {
from: 'Vijay svbhaskar200@gmail.com',
to: 'svbhaskar500@gmail.com,sirajuddin.shaik@accelalpha.com',
subject: 'Review of currently running ProjectHealth Dashboard',
html: 'Dear '+
'<br>      Please find below the project health dashboard<br>'+
'<input type="text" style="text-align:center" value="Project Health Dashboard" readonly><br><br> <table  border="1" width="300px" height="auto"> <tr> <th>Project Name</th> <th>Mile Stone</th> <th>FP/TM</th> <th>Com</th> <th colspan="2">PM KPI</th> <th colspan="2">SA KPI</th> <th colspan="2">Proj Fin</th> </tr> <tr> <td colspan="4"></td> <td>Self</td> <td>PMO</td> <td>Self</td> <td>PMO</td> <td>Act/Bud</td> <td >Fcst/Bud</td> </tr>' +projectsString +'</table><br>'+
'Please click URL below for further details<br>'+
 '[URL to update the project]<br> <br>Thank You <br>PMO' +
 '<br> Note: Based on practice and location, for time limit threshold 1, email should go to practice head and for time limit threshold 2, email should go to operations head'
};

 

  transporter.sendMail(mailOptions, function(error, info){
if (error) {
  console.log(error);
} else {
  console.log('Email sent Schedule 5: ' + info.response);
}
}); 

 

});
});




// //****************************************** */