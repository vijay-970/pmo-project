const bcrypt = require('bcrypt');
class Router{
   constructor(app,db){
       this.login(app,db);
       this.logout(app,db);
       this.isLoggedIn(app,db);
       this.showTables(app,db);
       this.showKPI(app,db);
       this.points(app,db);
       this.pmopoints(app,db);
       this.pmonotes(app,db);
       this.notes(app,db);   
       this.scores(app,db);  
       this.getPMInput(app,db);
       this.putPMInput(app,db);
       this.postPMInput(app,db);
       this.deletePMInput(app, db);
       this.putPMOInput(app,db);  
       this.getProjects(app,db);
       this.getAProject(app,db); 
       this.putProject(app,db);
       this.postProject(app,db); 
       this.getUsers(app, db);
       this.getPractice(app, db);
       this.pmkpiupdates(app,db);
       this.getKPI(app,db);
       this.prjkpiupdates(app,db);
   }

   login(app,db){
       app.post('/login',(req,res)=>{
           let username = req.body.username;
           let password = req.body.password;
        db.query('Select * from users_t where user_name= ?',[username],(err,data,fields) =>
           {
               console.log(data[0].PASSWORD);
                bcrypt.compare(password,data[0].PASSWORD,(bcrypterr,verified)=>{
                    if(verified) {
                        req.session.userID = data[0].USER_ID;
                        res.json({
                            success: true,
                            username: data[0].USER_NAME
                        })
                        return;
                    }
                });
          
       });

   }
       )
}



logout(app, db){
    app.get('logout', (req, res) => {
     if(req.session.userID){
         req.session.destroy();
         console.log('session Destroy');
         console.log(req.session.userID);
         res.json({
             success:true,
             username:''
         })
         return true;
     }else{
      res.json({
          success:false,
          username:''
      })
      return false;
     }
    }); 
    }

  isLoggedIn(app, db){
    app.get('/isLoggedIn', (req,res)=>{
        if(req.session.userID){
            let username  = [req.session.userID];
            db.query('Select * from users_t where user_name= ? LIMIT 1',[username],(err,data,fields) =>{
          if(data && data.length ==1){
              res.json({
                  success: true,
                  username: data[0].username
              })
              return true;
            }else{
                res.json({
                    success: false
                })
             }
          });
     
       }else{
        res.json({
            success: false
        }) 
       }
        
     });
    }

showTables(app,db){
    app.get('/showTables/:ID',(req,res)=>{
        const tablesqlpmo='Select "Y" PMO,roleId,project_id,project_name,project_status,project_start_date,project_type,project_methodology,project_milestone,pm_pmoscore,pm_selfscore,sa_pmoscore,sa_selfscore,project_complete_percent,project_fin_act_bud,project_fin_fct_bud,max(SA_NAME) SA_NAME1,max(PM_NAME) PA_NAME1,max(SA_EMAIL),max(PM_EMAIL) from (Select  (Select group_concat(role_name separator ",") from roles_t where role_id in (Select user_role from user_role_projects_t where pr.project_id = project_id )) roleId,pr.project_id,pr.project_name,pr.project_start_date,pr.project_status,pr.project_type,pr.project_methodology,prd.project_milestone,(Select sum(SCORE) pm_pmoscore from(select FLOOR((sum(prj_param.KPI_PMO_POINTS)/sum(param.MAX_SCORE))*mile.KPI_WEIGHT) as SCORE from pmo_milestone_masters_t mile,pmo_parameters_masters_t param,kpi_project_milestones_t prj_mile,kpi_project_parameters_t prj_param where mile.MILESTONE_ID=param.MILESTONE_ID and mile.MILESTONE_ID= prj_mile.MILESTONE_ID and param.MILESTONE_ID= prj_mile.MILESTONE_ID and prj_param.PROJECT_ID=prj_mile.PROJECT_ID and mile.MILESTONE_ID= prj_param.MILESTONE_ID and prj_mile.MILESTONE_ID= prj_param.MILESTONE_ID and param.MILESTONE_ID= prj_param.MILESTONE_ID and param.PARAMETER_ID=prj_param.PARAMETER_ID and prj_mile.CYCLE_ID=prj_param.CYCLE_ID and param.OWNER="SA" and prj_mile.PROJECT_ID=pr.project_id  group by mile.MILESTONE_ID) ch)pm_pmoscore,(Select sum(SCORE) pm_selfscore from(select FLOOR((sum(prj_param.KPI_POINTS)/sum(param.MAX_SCORE))*mile.KPI_WEIGHT) as SCORE from pmo_milestone_masters_t mile,pmo_parameters_masters_t param,kpi_project_milestones_t prj_mile,kpi_project_parameters_t prj_param where mile.MILESTONE_ID=param.MILESTONE_ID and mile.MILESTONE_ID= prj_mile.MILESTONE_ID and param.MILESTONE_ID= prj_mile.MILESTONE_ID and prj_param.PROJECT_ID=prj_mile.PROJECT_ID and mile.MILESTONE_ID= prj_param.MILESTONE_ID and prj_mile.MILESTONE_ID= prj_param.MILESTONE_ID and param.MILESTONE_ID= prj_param.MILESTONE_ID and param.PARAMETER_ID=prj_param.PARAMETER_ID and prj_mile.CYCLE_ID=prj_param.CYCLE_ID and param.OWNER="PM" and prj_mile.PROJECT_ID=pr.project_id group by mile.MILESTONE_ID) ch)pm_selfscore,(Select sum(SCORE) sa_pmoscore from(select FLOOR((sum(prj_param.KPI_PMO_POINTS)/sum(param.MAX_SCORE))*mile.KPI_WEIGHT) as SCORE from pmo_milestone_masters_t mile,pmo_parameters_masters_t param,kpi_project_milestones_t prj_mile,kpi_project_parameters_t prj_param where mile.MILESTONE_ID=param.MILESTONE_ID and mile.MILESTONE_ID= prj_mile.MILESTONE_ID and param.MILESTONE_ID= prj_mile.MILESTONE_ID and prj_param.PROJECT_ID=prj_mile.PROJECT_ID and mile.MILESTONE_ID= prj_param.MILESTONE_ID and prj_mile.MILESTONE_ID= prj_param.MILESTONE_ID and param.MILESTONE_ID= prj_param.MILESTONE_ID and param.PARAMETER_ID=prj_param.PARAMETER_ID and prj_mile.CYCLE_ID=prj_param.CYCLE_ID and param.OWNER="SA" and prj_mile.PROJECT_ID=pr.project_id group by mile.MILESTONE_ID) ch)sa_pmoscore,(Select sum(SCORE) sa_selfscore from(select FLOOR((sum(prj_param.KPI_POINTS)/sum(param.MAX_SCORE))*mile.KPI_WEIGHT) as SCORE from pmo_milestone_masters_t mile,pmo_parameters_masters_t param,kpi_project_milestones_t prj_mile,kpi_project_parameters_t prj_param where mile.MILESTONE_ID=param.MILESTONE_ID and mile.MILESTONE_ID= prj_mile.MILESTONE_ID and param.MILESTONE_ID= prj_mile.MILESTONE_ID and prj_param.PROJECT_ID=prj_mile.PROJECT_ID and mile.MILESTONE_ID= prj_param.MILESTONE_ID and prj_mile.MILESTONE_ID= prj_param.MILESTONE_ID and param.MILESTONE_ID= prj_param.MILESTONE_ID and param.PARAMETER_ID=prj_param.PARAMETER_ID and prj_mile.CYCLE_ID=prj_param.CYCLE_ID and param.OWNER="SA" and prj_mile.PROJECT_ID=pr.project_id group by mile.MILESTONE_ID) ch) sa_selfscore,prd.project_complete_percent,prd.project_fin_act_bud,prd.project_fin_fct_bud,case when urp.user_role = 1 then (Select user_name from users_t where user_id = urp.user_id and urp.user_role = 1) end as PM_NAME,case when urp.user_role = 1 then (Select email_id from users_t where user_id = urp.user_id and urp.user_role = 1) end as PM_EMAIL,case when urp.user_role = 3 then (Select user_name from users_t where user_id = urp.user_id and urp.user_role = 3) end as SA_NAME,case when urp.user_role = 3 then (Select email_id from users_t where user_id = urp.user_id and urp.user_role = 3) end as SA_EMAIL from projects_t pr,user_role_projects_t urp,project_details_t prd where pr.project_id = urp.project_id and prd.project_id=pr.project_id and urp.project_id=prd.project_id and urp.project_id in (Select project_id from user_role_projects_t))as tablename group by project_id,project_name,project_status,project_type,project_milestone,project_fin_act_bud,pm_pmoscore,project_complete_percent,project_fin_fct_bud,roleId,sa_pmoscore,pm_selfscore,sa_selfscore;'
const tablesql = 'Select "N" PMO,roleId,project_id,project_name,project_status,project_start_date,project_type,project_methodology,project_milestone,project_complete_percent,project_fin_act_bud,project_fin_fct_bud,pm_pmoscore,pm_selfscore,sa_pmoscore,sa_selfscore,max(SA_NAME) SA_NAME1,max(PM_NAME) PA_NAME1,max(SA_EMAIL),max(PM_EMAIL) from (Select  (Select group_concat(role_name separator ",") from roles_t where role_id in (Select user_role from user_role_projects_t where pr.project_id = project_id and user_id =(Select user_id from users_t where user_name = ?))) roleId,pr.project_id,pr.project_name,pr.project_start_date,pr.project_status,pr.project_type,pr.project_methodology,prd.project_milestone,(Select sum(SCORE) pm_pmoscore from(select FLOOR((sum(prj_param.KPI_PMO_POINTS)/sum(param.MAX_SCORE))*mile.KPI_WEIGHT) as SCORE from pmo_milestone_masters_t mile,pmo_parameters_masters_t param,kpi_project_milestones_t prj_mile,kpi_project_parameters_t prj_param where mile.MILESTONE_ID=param.MILESTONE_ID and mile.MILESTONE_ID= prj_mile.MILESTONE_ID and param.MILESTONE_ID= prj_mile.MILESTONE_ID and prj_param.PROJECT_ID=prj_mile.PROJECT_ID and mile.MILESTONE_ID= prj_param.MILESTONE_ID and prj_mile.MILESTONE_ID= prj_param.MILESTONE_ID and param.MILESTONE_ID= prj_param.MILESTONE_ID and param.PARAMETER_ID=prj_param.PARAMETER_ID and prj_mile.CYCLE_ID=prj_param.CYCLE_ID and param.OWNER="SA" and prj_mile.PROJECT_ID=pr.project_id  group by mile.MILESTONE_ID) ch)pm_pmoscore,(Select sum(SCORE) pm_selfscore from(select FLOOR((sum(prj_param.KPI_POINTS)/sum(param.MAX_SCORE))*mile.KPI_WEIGHT) as SCORE from pmo_milestone_masters_t mile,pmo_parameters_masters_t param,kpi_project_milestones_t prj_mile,kpi_project_parameters_t prj_param where mile.MILESTONE_ID=param.MILESTONE_ID and mile.MILESTONE_ID= prj_mile.MILESTONE_ID and param.MILESTONE_ID= prj_mile.MILESTONE_ID and prj_param.PROJECT_ID=prj_mile.PROJECT_ID and mile.MILESTONE_ID= prj_param.MILESTONE_ID and prj_mile.MILESTONE_ID= prj_param.MILESTONE_ID and param.MILESTONE_ID= prj_param.MILESTONE_ID and param.PARAMETER_ID=prj_param.PARAMETER_ID and prj_mile.CYCLE_ID=prj_param.CYCLE_ID and param.OWNER="PM" and prj_mile.PROJECT_ID=pr.project_id group by mile.MILESTONE_ID) ch)pm_selfscore,(Select sum(SCORE) sa_pmoscore from(select FLOOR((sum(prj_param.KPI_PMO_POINTS)/sum(param.MAX_SCORE))*mile.KPI_WEIGHT) as SCORE from pmo_milestone_masters_t mile,pmo_parameters_masters_t param,kpi_project_milestones_t prj_mile,kpi_project_parameters_t prj_param where mile.MILESTONE_ID=param.MILESTONE_ID and mile.MILESTONE_ID= prj_mile.MILESTONE_ID and param.MILESTONE_ID= prj_mile.MILESTONE_ID and prj_param.PROJECT_ID=prj_mile.PROJECT_ID and mile.MILESTONE_ID= prj_param.MILESTONE_ID and prj_mile.MILESTONE_ID= prj_param.MILESTONE_ID and param.MILESTONE_ID= prj_param.MILESTONE_ID and param.PARAMETER_ID=prj_param.PARAMETER_ID and prj_mile.CYCLE_ID=prj_param.CYCLE_ID and param.OWNER="SA" and prj_mile.PROJECT_ID=pr.project_id group by mile.MILESTONE_ID) ch)sa_pmoscore,(Select sum(SCORE) sa_selfscore from(select FLOOR((sum(prj_param.KPI_POINTS)/sum(param.MAX_SCORE))*mile.KPI_WEIGHT) as SCORE from pmo_milestone_masters_t mile,pmo_parameters_masters_t param,kpi_project_milestones_t prj_mile,kpi_project_parameters_t prj_param where mile.MILESTONE_ID=param.MILESTONE_ID and mile.MILESTONE_ID= prj_mile.MILESTONE_ID and param.MILESTONE_ID= prj_mile.MILESTONE_ID and prj_param.PROJECT_ID=prj_mile.PROJECT_ID and mile.MILESTONE_ID= prj_param.MILESTONE_ID and prj_mile.MILESTONE_ID= prj_param.MILESTONE_ID and param.MILESTONE_ID= prj_param.MILESTONE_ID and param.PARAMETER_ID=prj_param.PARAMETER_ID and prj_mile.CYCLE_ID=prj_param.CYCLE_ID and param.OWNER="SA" and prj_mile.PROJECT_ID=pr.project_id group by mile.MILESTONE_ID) ch) sa_selfscore,prd.project_complete_percent,prd.project_fin_act_bud,prd.project_fin_fct_bud,case when urp.user_role = 1 then (Select user_name from users_t where user_id = urp.user_id and urp.user_role = 1) end as PM_NAME,case when urp.user_role = 1 then (Select email_id from users_t where user_id = urp.user_id and urp.user_role = 1) end as PM_EMAIL,case when urp.user_role = 3 then (Select user_name from users_t where user_id = urp.user_id and urp.user_role = 3) end as SA_NAME,case when urp.user_role = 3 then (Select email_id from users_t where user_id = urp.user_id and urp.user_role = 3) end as SA_EMAIL from projects_t pr,user_role_projects_t urp,project_details_t prd where pr.project_id = urp.project_id and prd.project_id=pr.project_id and urp.project_id=prd.project_id and urp.project_id in (Select project_id from user_role_projects_t where user_id = (Select user_id from users_t where user_name = ?)))as tablename group by project_id,project_name,project_status,project_type,project_milestone,project_fin_act_bud,project_complete_percent,project_fin_fct_bud,roleId,pm_pmoscore,pm_selfscore,sa_pmoscore,sa_selfscore;'

        //const tablesqlpmo='Select "Y" PMO,roleId,project_id,project_name,project_status,project_start_date,project_type,project_methodology,project_milestone,pm_pmoscore,pm_selfscore,sa_pmoscore,sa_selfscore,project_complete_percent,project_fin_act_bud,project_fin_fct_bud,max(SA_NAME) SA_NAME1,max(PM_NAME) PA_NAME1,max(SA_EMAIL),max(PM_EMAIL) from (Select  (Select group_concat(role_name separator ",") from roles_t where role_id in (Select user_role from user_role_projects_t where pr.project_id = project_id )) roleId,pr.project_id,pr.project_name,pr.project_start_date,pr.project_status,pr.project_type,pr.project_methodology,prd.project_milestone,(select sum(kpi_score) from kpi_project_masters_t where project_id = pr.project_id and project_id = urp.project_id and kpi_header_id in (1,2,3,4,5))pm_pmoscore,(Select sum(S) pm_selfscore from(Select sum(kdd.kpi_pm_points)/km.kpi_weight S from kpi_detail_data_t kdd,kpi_project_masters_t km where kdd.project_id=km.project_id and kdd.kpi_header_id = km.kpi_header_id and kdd.project_id = pr.project_id and kpi_pm_points is not null group by kdd.kpi_header_id) ch)pm_selfscore,(select sum(kpi_score) from kpi_project_masters_t where project_id = pr.project_id and project_id = urp.project_id and kpi_header_id in (6,7,8,9,10,11,12))sa_pmoscore,(Select sum(S) sa_selfscore from(Select sum(kdd.kpi_sa_points)/km.kpi_weight S from kpi_detail_data_t kdd,kpi_project_masters_t km where kdd.project_id=km.project_id and kdd.kpi_header_id = km.kpi_header_id and kdd.project_id = pr.project_id and kpi_sa_points is not null group by kdd.kpi_header_id) ch) sa_selfscore,prd.project_complete_percent,prd.project_fin_act_bud,prd.project_fin_fct_bud,case when urp.user_role = 1 then (Select user_name from users_t where user_id = urp.user_id and urp.user_role = 1) end as PM_NAME,case when urp.user_role = 1 then (Select email_id from users_t where user_id = urp.user_id and urp.user_role = 1) end as PM_EMAIL, case when urp.user_role = 3 then (Select user_name from users_t where user_id = urp.user_id and urp.user_role = 3) end as SA_NAME,case when urp.user_role = 3 then (Select email_id from users_t where user_id = urp.user_id and urp.user_role = 3) end as SA_EMAIL  from projects_t pr,user_role_projects_t urp,project_details_t prd where pr.project_id = urp.project_id and prd.project_id=pr.project_id and urp.project_id=prd.project_id and urp.project_id in (Select project_id from user_role_projects_t))as tablename group by project_id,project_name,project_status,project_type,project_milestone,project_fin_act_bud,pm_pmoscore,project_complete_percent,project_fin_fct_bud,roleId,sa_pmoscore,pm_selfscore,sa_selfscore;'
//const tablesql = 'Select "N" PMO,roleId,project_id,project_name,project_status,project_start_date,project_type,project_methodology,project_milestone,project_complete_percent,project_fin_act_bud,project_fin_fct_bud,pm_pmoscore,pm_selfscore,sa_pmoscore,sa_selfscore,max(SA_NAME) SA_NAME1,max(PM_NAME) PA_NAME1,max(SA_EMAIL),max(PM_EMAIL) from (Select  (Select group_concat(role_name separator ",") from roles_t where role_id in (Select user_role from user_role_projects_t where pr.project_id = project_id and user_id =(Select user_id from users_t where user_name = ?))) roleId,pr.project_id,pr.project_name,pr.project_start_date,pr.project_status,pr.project_type,pr.project_methodology,prd.project_milestone,(select sum(kpi_score) from kpi_project_masters_t where project_id = pr.project_id and project_id = urp.project_id and kpi_header_id in (1,2,3,4,5))pm_pmoscore,(Select sum(S) pm_selfscore from(Select sum(kdd.kpi_pm_points)/km.kpi_weight S from kpi_detail_data_t kdd,kpi_project_masters_t km where kdd.project_id=km.project_id and kdd.kpi_header_id = km.kpi_header_id and kdd.project_id = pr.project_id and kpi_pm_points is not null group by kdd.kpi_header_id) ch)pm_selfscore,(select sum(kpi_score) from kpi_project_masters_t where project_id = pr.project_id and project_id = urp.project_id and kpi_header_id in (6,7,8,9,10,11,12))sa_pmoscore,(Select sum(S) sa_selfscore from(Select sum(kdd.kpi_sa_points)/km.kpi_weight S from kpi_detail_data_t kdd,kpi_project_masters_t km where kdd.project_id=km.project_id and kdd.kpi_header_id = km.kpi_header_id and kdd.project_id = pr.project_id and kpi_sa_points is not null group by kdd.kpi_header_id) ch) sa_selfscore,prd.project_complete_percent,prd.project_fin_act_bud,prd.project_fin_fct_bud,case when urp.user_role = 1 then (Select user_name from users_t where user_id = urp.user_id and urp.user_role = 1) end as PM_NAME,case when urp.user_role = 1 then (Select email_id from users_t where user_id = urp.user_id and urp.user_role = 1) end as PM_EMAIL, case when urp.user_role = 3 then (Select user_name from users_t where user_id = urp.user_id and urp.user_role = 3) end as SA_NAME,case when urp.user_role = 3 then (Select email_id from users_t where user_id = urp.user_id and urp.user_role = 3) end as SA_EMAIL  from projects_t pr,user_role_projects_t urp,project_details_t prd where pr.project_id = urp.project_id and prd.project_id=pr.project_id and urp.project_id=prd.project_id and urp.project_id in (Select project_id from user_role_projects_t where user_id = (Select user_id from users_t where user_name = ?)))as tablename group by project_id,project_name,project_status,project_type,project_milestone,project_fin_act_bud,project_complete_percent,project_fin_fct_bud,roleId,pm_pmoscore,pm_selfscore,sa_pmoscore,sa_selfscore;'
       // const tablesqlpmo='Select "Y" PMO,roleId,project_id,project_name,project_status,project_start_date,project_type,project_methodology,project_milestone,pm_pmoscore,pm_selfscore,sa_pmoscore,sa_selfscore,project_complete_percent,project_fin_act_bud,project_fin_fct_bud,max(SA_NAME) SA_NAME1,max(PM_NAME) PA_NAME1,max(SA_EMAIL),max(PM_EMAIL) from (Select  (Select group_concat(role separator ",") from (select "PM" as role from users_t ut,projects_t pt where pt.pm_username=ut.user_name and pr.project_id = pt.project_id union select "SA" as role from users_t ut,projects_t pt where pt.sa_username=ut.user_name and pr.project_id = pt.project_id ) roles) roleId,pr.project_id,pr.project_name,pr.project_start_date,pr.project_status,pr.project_type,pr.project_methodology,prd.project_milestone,(select sum(kpi_score) from kpi_project_masters_t where project_id = pr.project_id and kpi_header_id in (1,2,3,4,5))pm_pmoscore,(Select sum(S) pm_selfscore from(Select sum(kdd.kpi_pm_points)/km.kpi_weight S from kpi_detail_data_t kdd,kpi_project_masters_t km where kdd.project_id=km.project_id and kdd.kpi_header_id = km.kpi_header_id and kdd.project_id = pr.project_id and kpi_pm_points is not null group by kdd.kpi_header_id) ch)pm_selfscore,(select sum(kpi_score) from kpi_project_masters_t where project_id = pr.project_id and kpi_header_id in (6,7,8,9,10,11,12))sa_pmoscore,(Select sum(S) sa_selfscore from(Select sum(kdd.kpi_sa_points)/km.kpi_weight S from kpi_detail_data_t kdd,kpi_project_masters_t km where kdd.project_id=km.project_id and kdd.kpi_header_id = km.kpi_header_id and kdd.project_id = pr.project_id and kpi_sa_points is not null group by kdd.kpi_header_id) ch) sa_selfscore,prd.project_complete_percent,prd.project_fin_act_bud,prd.project_fin_fct_bud,(pr.pm_username) as PM_NAME,(Select email_id from users_t where user_name = pr.pm_username) as PM_EMAIL,(pr.sa_username) as SA_NAME,(Select email_id from users_t where user_name = pr.sa_username) as SA_EMAIL from projects_t pr,project_details_t prd where prd.project_id=pr.project_id )as tablename group by project_id,project_name,project_status,project_type,project_milestone,project_fin_act_bud,pm_pmoscore,project_complete_percent,project_fin_fct_bud,roleId,sa_pmoscore,pm_selfscore,sa_selfscore order by project_name;'
//const tablesql = 'Select "N" PMO,roleId,project_id,project_name,project_status,project_start_date,project_type,project_methodology,project_milestone,project_complete_percent,project_fin_act_bud,project_fin_fct_bud,pm_pmoscore,pm_selfscore,sa_pmoscore,sa_selfscore,max(SA_NAME) SA_NAME1,max(PM_NAME) PA_NAME1,max(SA_EMAIL),max(PM_EMAIL) from (Select  (Select group_concat(role_name separator ",") from roles_t where role_id in (Select user_role from user_role_projects_t where pr.project_id = project_id and user_id =(Select user_id from users_t where user_name = ?))) roleId,pr.project_id,pr.project_name,pr.project_start_date,pr.project_status,pr.project_type,pr.project_methodology,prd.project_milestone,(select sum(kpi_score) from kpi_project_masters_t where project_id = pr.project_id and project_id = urp.project_id and kpi_header_id in (1,2,3,4,5))pm_pmoscore,(Select sum(S) pm_selfscore from(Select sum(kdd.kpi_pm_points)/km.kpi_weight S from kpi_detail_data_t kdd,kpi_project_masters_t km where kdd.project_id=km.project_id and kdd.kpi_header_id = km.kpi_header_id and kdd.project_id = pr.project_id and kpi_pm_points is not null group by kdd.kpi_header_id) ch)pm_selfscore,(select sum(kpi_score) from kpi_project_masters_t where project_id = pr.project_id and project_id = urp.project_id and kpi_header_id in (6,7,8,9,10,11,12))sa_pmoscore,(Select sum(S) sa_selfscore from(Select sum(kdd.kpi_sa_points)/km.kpi_weight S from kpi_detail_data_t kdd,kpi_project_masters_t km where kdd.project_id=km.project_id and kdd.kpi_header_id = km.kpi_header_id and kdd.project_id = pr.project_id and kpi_sa_points is not null group by kdd.kpi_header_id) ch) sa_selfscore,prd.project_complete_percent,prd.project_fin_act_bud,prd.project_fin_fct_bud,case when urp.user_role = 1 then (Select user_name from users_t where user_id = urp.user_id and urp.user_role = 1) end as PM_NAME,case when urp.user_role = 1 then (Select email_id from users_t where user_id = urp.user_id and urp.user_role = 1) end as PM_EMAIL, case when urp.user_role = 3 then (Select user_name from users_t where user_id = urp.user_id and urp.user_role = 3) end as SA_NAME,case when urp.user_role = 3 then (Select email_id from users_t where user_id = urp.user_id and urp.user_role = 3) end as SA_EMAIL  from projects_t pr,user_role_projects_t urp,project_details_t prd where pr.project_id = urp.project_id and prd.project_id=pr.project_id and urp.project_id=prd.project_id and urp.project_id in (Select project_id from user_role_projects_t where user_id = (Select user_id from users_t where user_name = ?)))as tablename group by project_id,project_name,project_status,project_type,project_milestone,project_fin_act_bud,project_complete_percent,project_fin_fct_bud,roleId,pm_pmoscore,pm_selfscore,sa_pmoscore,sa_selfscore;'
//const tablesql = 'Select "N" PMO,roleId,project_id,project_name,project_status,project_start_date,project_type,project_methodology,project_milestone,project_complete_percent,project_fin_act_bud,project_fin_fct_bud,pm_pmoscore,pm_selfscore,sa_pmoscore,sa_selfscore,max(SA_NAME) SA_NAME1,max(PM_NAME) PA_NAME1,max(SA_EMAIL),max(PM_EMAIL) from (Select  (Select group_concat(role separator ",") from (select "PM" as role from users_t ut,projects_t pt where pt.pm_username=ut.user_name and pr.project_id = pt.project_id and ut.user_name = ? union select "SA" as role from users_t ut,projects_t pt where pt.sa_username=ut.user_name and pr.project_id = pt.project_id and ut.user_name = ?)roles) roleId,pr.project_id,pr.project_name,pr.project_start_date,pr.project_status,pr.project_type,pr.project_methodology,prd.project_milestone,(select sum(kpi_score) from kpi_project_masters_t where project_id = pr.project_id and kpi_header_id in (1,2,3,4,5))pm_pmoscore,(Select sum(S) pm_selfscore from(Select sum(kdd.kpi_pm_points)/km.kpi_weight S from kpi_detail_data_t kdd,kpi_project_masters_t km where kdd.project_id=km.project_id and kdd.kpi_header_id = km.kpi_header_id and kdd.project_id = pr.project_id and kpi_pm_points is not null group by kdd.kpi_header_id) ch)pm_selfscore,(select sum(kpi_score) from kpi_project_masters_t where project_id = pr.project_id and kpi_header_id in (6,7,8,9,10,11,12))sa_pmoscore,(Select sum(S) sa_selfscore from(Select sum(kdd.kpi_sa_points)/km.kpi_weight S from kpi_detail_data_t kdd,kpi_project_masters_t km where kdd.project_id=km.project_id and kdd.kpi_header_id = km.kpi_header_id and kdd.project_id = pr.project_id and kpi_sa_points is not null group by kdd.kpi_header_id) ch) sa_selfscore,prd.project_complete_percent,prd.project_fin_act_bud,prd.project_fin_fct_bud,pr.pm_username as PM_NAME,(Select email_id from users_t where user_name=pr.pm_username) as PM_EMAIL,pr.sa_username as SA_NAME,(Select email_id from users_t where user_name=pr.sa_username) as SA_EMAIL  from projects_t pr,project_details_t prd where prd.project_id=pr.project_id and pr.project_id in (select project_id from projects_t where pm_username=? or sa_username=?))as tablename group by project_id,project_name,project_status,project_type,project_milestone,project_fin_act_bud,project_complete_percent,project_fin_fct_bud,roleId,pm_pmoscore,pm_selfscore,sa_pmoscore,sa_selfscore order by project_name;'   
const tablesql1 ='Select max(case when user_id in (Select user_id from users_t where user_name=?) then 1 when user_id not in (Select user_id from users_t where user_name =?) then 0 end) pmo from user_role_projects_t;'
        db.query(tablesql1,[req.params.ID,req.params.ID],(err,rows,field)=>{
            console.log(rows);
            if(rows[0]['pmo']===1){
        db.query(tablesql,[req.params.ID,req.params.ID,req.params.ID,req.params.ID],(err,rows,field)=>{
            if(!err){
                res.json(rows);
            }
            else{
                res.json(err);
            }
        })}
    else{
        db.query(tablesqlpmo,(err,rows,field)=>{
            if(!err){
                res.json(rows);
            }
            else{
                res.json(err);
            }
        })
    }})
    })

}

showKPI(app,db){
    app.post('/showKPI',(req,res)=>{
        const tablesql = 'select kpm.kpi_desc,kpm.kpi_header_id,kdd.kpi_detail_id,kdd.project_id,kdd.kpi_detail_task_name, kdd.kpi_max_points, case when urp.USER_ROLE =  1 then kdd.kpi_pm_points when  urp.USER_ROLE =  3 then kdd.kpi_sa_points else  "" end POINTS, kdd.kpi_pmo_points, kpm.kpi_score,case when urp.USER_ROLE =  1 then kdd.kpi_pm_notes when  urp.USER_ROLE =  3 then kdd.kpi_sa_notes else  "" end NOTES, kdd.kpi_pmo_notes,kpm.kpi_weight, case when urp.USER_ROLE =  1 then "PM" when  urp.USER_ROLE =  3 then "SA" else  "" end ROLE from USER_ROLE_PROJECTS_T urp, KPI_PROJECT_MASTERS_T kpm, KPI_DETAIL_DATA_T kdd where urp.PROJECT_ID = kpm.PROJECT_ID and kpm.KPI_HEADER_ID = kdd.KPI_HEADER_ID and kpm.PROJECT_ID = kdd.PROJECT_ID and ((urp.USER_ROLE = 1 and kpm.KPI_HEADER_ID in (1,2,3,4,5)) or (urp.USER_ROLE = 3 and kpm.KPI_HEADER_ID in (6,7,8,9,10,11,12))) and urp.USER_ID = (Select user_id from users_t where user_name = ?) and urp.USER_ROLE in (1,3) and urp.PROJECT_ID = ?'
        const tablesql1 = 'Select max(case when user_id in (Select user_id from users_t where user_name=?) then 1 when user_id not in (Select user_id from users_t where user_name =?) then 0 end) pmo from user_role_projects_t;'
        const tablesqlpmo ='select kpm.kpi_desc,kpm.kpi_header_id,kdd.kpi_detail_id,kdd.project_id,kdd.kpi_detail_task_name, kdd.kpi_max_points, case when urp.USER_ROLE =  1 then kdd.kpi_pm_points when  urp.USER_ROLE =  3 then kdd.kpi_sa_points else  "" end POINTS, kdd.kpi_pmo_points, kpm.kpi_score,case when urp.USER_ROLE =  1 then kdd.kpi_pm_notes when  urp.USER_ROLE =  3 then kdd.kpi_sa_notes else  "" end NOTES, kdd.kpi_pmo_notes,kpm.kpi_weight, case when urp.USER_ROLE =  1 then "PM" when  urp.USER_ROLE =  3 then "SA" else  "" end ROLE from USER_ROLE_PROJECTS_T urp, KPI_PROJECT_MASTERS_T kpm, KPI_DETAIL_DATA_T kdd where urp.PROJECT_ID = kpm.PROJECT_ID and kpm.KPI_HEADER_ID = kdd.KPI_HEADER_ID and kpm.PROJECT_ID = kdd.PROJECT_ID and ((urp.USER_ROLE = 1 and kpm.KPI_HEADER_ID in (1,2,3,4,5)) or (urp.USER_ROLE = 3 and kpm.KPI_HEADER_ID in (6,7,8,9,10,11,12)))  and urp.USER_ROLE in (1,3) and urp.PROJECT_ID = ?'
        console.log('Hi I am here');
        db.query(tablesql1,[req.body.username,req.body.username],(err,rows,field)=>{
            if(rows[0]['pmo']===1){
                console.log('hello I am inside kpi with username');
        db.query(tablesql,[req.body.username,req.body.project_id],(err,rows,field)=>{
            if(!err){
                res.json(rows);
            }
            else{
                res.json("Error");
            }
              })}
          else{
                db.query(tablesqlpmo,[req.body.project_id],(err,rows,field)=>{
            if(!err){
                res.json(rows);
            }
            else{
                res.json("Error");
            }
        }) 
    }})
    })

}
points(app,db){
    app.put('/points',(req,res)=>{
        if(req.body.ROLE === 'SA'){
        const tablesql = 'update kpi_detail_data_t set KPI_SA_POINTS = ? where project_id = ? and kpi_header_id = ? and kpi_detail_id = ?'
        console.log('SA POINTS');
        db.query(tablesql,[req.body.POINTS,req.body.project_id,req.body.kpi_header_id,req.body.kpi_detail_id],(err,rows,field)=>{
            if(!err){
                console.log(rows);
                res.json(rows);
            }
            else{
                res.json("Error");
            }
        })
    }
     if(req.body.ROLE === 'PM'){
        const tablesql = 'update kpi_detail_data_t set KPI_PM_POINTS = ? where project_id = ? and kpi_header_id = ? and kpi_detail_id = ?'
        console.log('PM POINTS');
        db.query(tablesql,[req.body.POINTS,req.body.project_id,req.body.kpi_header_id,req.body.kpi_detail_id],(err,rows,field)=>{
            if(!err){
                console.log(rows);
                res.json(rows);
            }
            else{
                res.json("Error");
            }
        })
     }
})

}



scores(app,db){
    app.put('/scores',(req,res)=>{
        const tablesql = 'update kpi_project_masters_t set KPI_SCORE = ? where project_id = ? and kpi_header_id=?'
        console.log('Update score');
        db.query(tablesql,[req.body.KPI_SCORE,req.body.project_id,req.body.kpi_header_id],(err,rows,field)=>{
            if(!err){
                console.log(rows);
                res.json(rows);
            }
            else{
                res.json("Error");
            }
        })
    })

}
pmopoints(app,db){
    app.put('/pmopoints',(req,res)=>{
        const tablesql = 'update kpi_detail_data_t set KPI_PMO_POINTS = ? where project_id = ? and kpi_header_id=? and kpi_detail_id =?'
        console.log('Update pmopoints');
        db.query(tablesql,[req.body.KPI_PMO_POINTS,req.body.project_id,req.body.kpi_header_id,req.body.kpi_detail_id],(err,rows,field)=>{
            if(!err){
                console.log(rows);
                res.json(rows);
            }
            else{
                res.json("Error");
            }
        })
    })

}
pmonotes(app,db){
    app.put('/pmonotes',(req,res)=>{
        const tablesql = 'update kpi_detail_data_t set KPI_PMO_NOTES = ? where project_id = ? and kpi_header_id = ? and kpi_detail_id = ?'
        console.log('Hi I am here');
        db.query(tablesql,[req.body.KPI_PMO_NOTES,req.body.project_id,req.body.kpi_header_id,req.body.kpi_detail_id],(err,rows,field)=>{
            if(!err){
                console.log(rows);
                res.json(rows);
            }
            else{
                res.json("Error");
            }
        })
    })

}
notes(app,db){
    app.put('/notes',(req,res)=>{
        if(req.body.ROLE ==='SA'){
        const tablesql = 'update kpi_detail_data_t set KPI_SA_NOTES = ? where project_id = ? and kpi_header_id = ? and kpi_detail_id = ?'
        console.log('Hi I am here');
        db.query(tablesql,[req.body.notes,req.body.project_id,req.body.kpi_header_id,req.body.kpi_detail_id],(err,rows,field)=>{
            if(!err){
                console.log(rows);
                res.json(rows);
            }
            else{
                res.json("Error");
            }
        })
    }
    if(req.body.ROLE ==='PM'){
        const tablesql = 'update kpi_detail_data_t set KPI_PM_NOTES = ? where project_id = ? and kpi_header_id = ? and kpi_detail_id = ?'
        console.log('Hi I am here');
        db.query(tablesql,[req.body.notes,req.body.project_id,req.body.kpi_header_id,req.body.kpi_detail_id],(err,rows,field)=>{
            if(!err){
                console.log(rows);
                res.json(rows);
            }
            else{
                res.json("Error");
            }
        })
    }
})

}

pmkpiupdates(app,db){
    app.put('/pmkpiupdate',(req,res)=>{
        
        console.log(".........................................");
        console.log(req);
        let data=req.body.kpi;
        data.forEach(element => {
            if(element.isRowUpdated){
                const tablesql1 = 'update kpi_project_masters_t set KPI_SCORE = ?,last_update_date=sysdate() where project_id = ? and kpi_header_id=?'
                db.query(tablesql1,[element.kpi_score,element.project_id,element.kpi_header_id],(err,rows,field)=>{
                         if(!err){
                        console.log(rows);
                       // res.json(rows);
                    }
                    else{
                        res.json(err);
                    }
                })

                if(element.ROLE === 'SA'){
                    const tablesql = 'update kpi_detail_data_t set KPI_SA_POINTS =?,KPI_PMO_POINTS =?,KPI_PMO_NOTES = ?,KPI_SA_NOTES = ? where project_id = ? and kpi_header_id = ? and kpi_detail_id = ?'
                    console.log('SA POINTS');
                    db.query(tablesql,[element.POINTS,element.kpi_pmo_points,element.kpi_pmo_notes,element.NOTES,element.project_id,element.kpi_header_id,element.kpi_detail_id],(err,rows,field)=>{
                        if(!err){
                            console.log(rows);
                            //res.json(rows);
                        }
                        else{
                            res.json(err);
                        }
                    })
                }
            if(element.ROLE === 'PM'){
                    const tablesql = 'update kpi_detail_data_t set KPI_PM_POINTS =?,KPI_PMO_POINTS =?,KPI_PMO_NOTES = ?,KPI_PM_NOTES = ? where project_id = ? and kpi_header_id = ? and kpi_detail_id = ?'
                    console.log('PM POINTS');
                    db.query(tablesql,[element.POINTS,element.kpi_pmo_points,element.kpi_pmo_notes,element.NOTES,element.project_id,element.kpi_header_id,element.kpi_detail_id],(err,rows,field)=>{
                        if(!err){
                            console.log(rows);
                            //res.json(rows);
                        }
                        else{
                            res.json(err);
                        }
                    })
            }
            }
            console.log(element.kpi_header_id);
        });
        res.json( (req.body.kpi));
        //req.body.forEach(element => {console.log(element);});
    /*    const tablesql = 'update kpi_detail_data_t set KPI_PMO_POINTS = ? where project_id = ? and kpi_header_id=? and kpi_detail_id =?'
        console.log('Update pmopoints');
       db.query(tablesql,[req.body.KPI_PMO_POINTS,req.body.project_id,req.body.kpi_header_id,req.body.kpi_detail_id],(err,rows,field)=>{
            if(!err){
                console.log(rows);
                res.json(rows);
            }
            else{
                res.json("Error");
            } 
        }) */
    })

}

getPMInput(app, db) {
    app.get('/pm-input/:ID', (req, res) => {
        const query = 'select pdt.*,upper(pt.project_name) PROJECT_NAME from PROJECT_DETAILs_T pdt,projects_t pt where pt.PROJECT_ID = pdt.PROJECT_ID and pdt.project_id = ?;';
        db.query(query,req.params.ID, (err, rows, field) => {

            if (!err) {
                console.log(rows);
                res.json(rows);
            }
            else {
                res.json("Error");
            }
        })
    })
}

putPMInput(app, db) {
    app.put('/pm-input', (req, res) => {
        const { PROJECT_COMPLETE_PERCENT,PROJECT_MILESTONE,
            PROJECT_FIN_ACT_BUD,
            PROJECT_FIN_FCT_BUD,PROJECT_DETAIL_ID,
            PROJECT_ID } = req.body;
        const query = 'update PROJECT_DETAILS_T set PROJECT_COMPLETE_PERCENT=?,PROJECT_MILESTONE=?,PROJECT_FIN_ACT_BUD=?,PROJECT_FIN_FCT_BUD=? where PROJECT_ID=? and PROJECT_DETAIL_ID=?';
        db.query(query, [PROJECT_COMPLETE_PERCENT,PROJECT_MILESTONE,
            PROJECT_FIN_ACT_BUD,
            PROJECT_FIN_FCT_BUD,
            PROJECT_ID,PROJECT_DETAIL_ID], (err, rows, field) => {
                if (!err) {
                    console.log(rows);
                    res.json(rows);
                }
                else {
                    res.json("Error");
                }
            })
    })
}

postPMInput(app, db) {
    app.post('/pminput-create', (req, res) => {
        const { PROJECT_COMPLETE_PERCENT,PROJECT_MILESTONE,PROJECT_FIN_ACT_BUD,PROJECT_FIN_FCT_BUD,PROJECT_ID } = req.body;
        const query = 'insert into PROJECT_DETAILS_T (PROJECT_COMPLETE_PERCENT,PROJECT_MILESTONE,PROJECT_FIN_ACT_BUD,PROJECT_FIN_FCT_BUD, PROJECT_ID) values (?,?,?,?,?)';
        db.query(query, [PROJECT_COMPLETE_PERCENT,PROJECT_MILESTONE,PROJECT_FIN_ACT_BUD,PROJECT_FIN_FCT_BUD,
            PROJECT_ID], (err, rows, field) => {
                if (!err) {
                    console.log(rows);
                    res.json(rows);
                }
                else {
                    res.json(err);
                }
            })
    })
}

deletePMInput(app, db) {
    app.put('/pm-input-delete', (req, res) => {
        const {PROJECT_ID, PROJECT_DETAIL_ID } = req.body;
        const query = 'delete from PROJECT_DETAILS_T where PROJECT_ID=? and PROJECT_DETAIL_ID=?';
        db.query(query, [PROJECT_ID,PROJECT_DETAIL_ID], (err, rows, field) => {
                if (!err) {
                    console.log(rows);
                    res.json(rows);
                }
                else {
                    res.json(err);
                }
            })
    })
}

putPMOInput(app, db) {
    app.put('/pmo-input', (req, res) => {
        const { PROJECT_TYPE,PROJECT_METHODOLOGY,PROJECT_STATUS,project_id } = req.body;
        const query = 'update PROJECTS_T set PROJECT_TYPE=?,PROJECT_METHODOLOGY=?,PROJECT_STATUS=? where project_id=?';
        db.query(query, [PROJECT_TYPE,PROJECT_METHODOLOGY,PROJECT_STATUS,project_id], (err, rows, field) => {
                if (!err) {
                    console.log(rows);
                    res.json(rows);
                }
                else {
                    res.json("Error");
                }
            })
    })
}



getUsers(app, db) {
    app.get('/get-users/', (req, res) => {
        const query = 'select user_name  from users_t;';
        db.query(query,req.params.ID, (err, rows, field) => {
            if (!err) {
                console.log(rows);
                res.json(rows);
            }
            else {
                res.json("Error");
            }
        })
    })
}

getPractice(app, db) {
    app.get('/get-practice/', (req, res) => {
        const query = 'select practice,location,PRACTICE_ID from master_data_t;';
        db.query(query,req.params.ID, (err, rows, field) => {
            if (!err) {
                console.log(rows);
                res.json(rows);
            }
            else {
                console.log(err);
                res.json(err);
            }
        })
    })
}


getProjects(app, db) {
    app.get('/get-projects/', (req, res) => {
        const query = 'select pt.PROJECT_ID,pt.PROJECT_NAME,pt.PROJECT_DESCRIPTION,date_format(pt.PROJECT_START_DATE,"%d-%m-%Y") as PROJECT_START_DATE,date_format(pt.PROJECT_END_DATE,"%d-%m-%Y") as PROJECT_END_DATE,pt.PROJECT_TYPE,pt.PROJECT_METHODOLOGY,pt.PROJECT_STATUS,pt.INSERT_DATE,pt.PRACTICE,pt.PM_USERNAME,pt.SA_USERNAME,( SELECT CONCAT(practice, "-", location,"(",head,")") FROM  master_data_t where practice_id=pt.PRACTICE) as practice_detail from projects_t pt;';
        db.query(query,req.params.ID, (err, rows, field) => {

            if (!err) {
               // console.log(rows);
                res.json(rows);
            }
            else {
                res.json("Error");
            }
        })
    })
}


getAProject(app, db) {
    app.get('/get-project/:ID', (req, res) => {
        const query = 'select pt.*  from projects_t pt where pt.project_id = ?;';
        db.query(query,req.params.ID, (err, rows, field) => {

            if (!err) {
                console.log(rows);
                res.json(rows);
            }
            else {
                res.json("Error");
            }
        })
    })
}

putProject(app, db) {
    app.put('/project-update', (req, res) => {
        const { PROJECT_NAME,PROJECT_DESCRIPTION,PROJECT_START_DATE,PROJECT_END_DATE,PROJECT_TYPE,PROJECT_METHODOLOGY,PROJECT_STATUS,PRACTICE,PM_USERNAME,SA_USERNAME,PROJECT_ID } = req.body;
        const query = 'update PROJECTS_T set PROJECT_NAME=?,PROJECT_DESCRIPTION=?,PROJECT_START_DATE=?,PROJECT_END_DATE=?,PROJECT_TYPE=?,PROJECT_METHODOLOGY=?,PROJECT_STATUS=?,PRACTICE=?,PM_USERNAME=?,SA_USERNAME=? where PROJECT_ID=?';
        const queryPMRole='insert into USER_ROLE_PROJECTS_T(PROJECT_ID,USER_PROJ_START_DATE,USER_PROJ_END_DATE,USER_ID,USER_ROLE,INSERT_DATE,INSERT_BY,LAST_UPDATE_DATE,LAST_UPDATE_BY) select prj.project_id,prj.project_start_date,prj.project_end_date,usr.user_id,1,SYSDATE(),null,SYSDATE(),null from projects_t prj,users_t usr where prj.PROJECT_NAME=? and usr.user_name=prj.pm_username ON DUPLICATE KEY UPDATE  USER_ID=usr.user_id;';
        const querySARole='insert into USER_ROLE_PROJECTS_T(PROJECT_ID,USER_PROJ_START_DATE,USER_PROJ_END_DATE,USER_ID,USER_ROLE,INSERT_DATE,INSERT_BY,LAST_UPDATE_DATE,LAST_UPDATE_BY) select prj.project_id,prj.project_start_date,prj.project_end_date,usr.user_id,3,SYSDATE(),null,SYSDATE(),null from projects_t prj,users_t usr where prj.PROJECT_NAME=? and usr.user_name=prj.sa_username ON DUPLICATE KEY UPDATE  USER_ID=usr.user_id;';
        db.query(query, [PROJECT_NAME,PROJECT_DESCRIPTION,PROJECT_START_DATE,PROJECT_END_DATE,PROJECT_TYPE,PROJECT_METHODOLOGY,PROJECT_STATUS,PRACTICE,PM_USERNAME,SA_USERNAME,PROJECT_ID], (err, rows, field) => {
                if (!err) {
                    console.log(rows);
                   // res.json(rows);
                }
                else {
                    console.log(err);
                    res.json(err);
                }
            })

            db.query(queryPMRole, [PROJECT_NAME], (err, rows, field) => {
                if (!err) {
                    console.log(rows);
                   // res.json(rows);
                }
                else {
                    console.log(err);
                    res.json(err);
                }
            })  
            db.query(querySARole, [PROJECT_NAME], (err, rows, field) => {
                if (!err) {
                    console.log(rows);
                    //res.json(rows);
                }
                else {
                    console.log(err);
                    res.json(err);
                }
            })
    })
}

postProject(app, db) {
    app.post('/project-create', (req, res) => {
const { PROJECT_NAME,PROJECT_DESCRIPTION,PROJECT_START_DATE,PROJECT_END_DATE,PROJECT_TYPE,PROJECT_METHODOLOGY,PROJECT_STATUS,PRACTICE,PM_USERNAME,SA_USERNAME } = req.body;
const query = 'insert into PROJECTS_T(PROJECT_NAME,PROJECT_DESCRIPTION,PROJECT_START_DATE,PROJECT_END_DATE,PROJECT_TYPE,PROJECT_METHODOLOGY,PROJECT_STATUS,INSERT_DATE,PRACTICE,PM_USERNAME,SA_USERNAME) values(?,?,?,?,?,?,?,sysdate(),?,?,?)';
const queryPMRole='insert into USER_ROLE_PROJECTS_T(PROJECT_ID,USER_PROJ_START_DATE,USER_PROJ_END_DATE,USER_ID,USER_ROLE,INSERT_DATE,INSERT_BY,LAST_UPDATE_DATE,LAST_UPDATE_BY) select prj.project_id,prj.project_start_date,prj.project_end_date,usr.user_id,1,SYSDATE(),null,SYSDATE(),null from projects_t prj,users_t usr where prj.PROJECT_NAME=? and usr.user_name=prj.pm_username ON DUPLICATE KEY UPDATE  USER_ID=usr.user_id;';
const querySARole='insert into USER_ROLE_PROJECTS_T(PROJECT_ID,USER_PROJ_START_DATE,USER_PROJ_END_DATE,USER_ID,USER_ROLE,INSERT_DATE,INSERT_BY,LAST_UPDATE_DATE,LAST_UPDATE_BY) select prj.project_id,prj.project_start_date,prj.project_end_date,usr.user_id,3,SYSDATE(),null,SYSDATE(),null from projects_t prj,users_t usr where prj.PROJECT_NAME=? and usr.user_name=prj.sa_username ON DUPLICATE KEY UPDATE  USER_ID=usr.user_id;';
db.query(query,[PROJECT_NAME,PROJECT_DESCRIPTION,PROJECT_START_DATE,PROJECT_END_DATE,PROJECT_TYPE,PROJECT_METHODOLOGY,PROJECT_STATUS,PRACTICE,PM_USERNAME,SA_USERNAME], (err, rows, field) => {
                if (!err) {
                    console.log(rows);
                   // res.json(rows);
                }
                else {
                    console.log(err);
                    res.json(err);
                }
            })

          db.query(queryPMRole, [PROJECT_NAME], (err, rows, field) => {
                if (!err) {
                    console.log(rows);
                   // res.json(rows);
                }
                else {
                    console.log(err);
                    res.json(err);
                }
            })  
            db.query(querySARole, [PROJECT_NAME], (err, rows, field) => {
                if (!err) {
                    console.log(rows);
                    res.json(rows);
                }
                else {
                    console.log(err);
                    res.json(err);
                }
            }) 

            const projectssql='select project_id from projects_t  where PROJECT_NAME=?';

            db.query(projectssql, [PROJECT_NAME], (err, rows, field) => {
                if (!err) {
                   const proj_id=rows[0].project_id;
                   const insertMilestones='INSERT INTO `kpi_project_milestones_t` VALUES (1,'+proj_id+',1,"NO",null,sysdate(),"admin",sysdate(),"admin"),'+
                   '(2,'+proj_id+',1,"NO",null,sysdate(),"admin",sysdate(),"admin"),'+
                   '(3,'+proj_id+',1,"NO",null,sysdate(),"admin",sysdate(),"admin"),'+
                   '(4,'+proj_id+',1,"NO",null,sysdate(),"admin",sysdate(),"admin"),'+
                   '(5,'+proj_id+',1,"NO",null,sysdate(),"admin",sysdate(),"admin"),'+
                   '(6,'+proj_id+',1,"NO",null,sysdate(),"admin",sysdate(),"admin"),'+
                   '(7,'+proj_id+',1,"NO",null,sysdate(),"admin",sysdate(),"admin");';
                   // res.json(rows[0].project_id);
                   db.query(insertMilestones, null, (err, rows, field) => {
                    if (!err) {
                        console.log(rows);
                       // res.json(rows);
                    }
                    else {
                        console.log(err);
                        res.json(err);
                    }
                })

        const proj_details = 'insert into PROJECT_DETAILS_T (PROJECT_COMPLETE_PERCENT,PROJECT_MILESTONE,PROJECT_FIN_ACT_BUD,PROJECT_FIN_FCT_BUD, PROJECT_ID) values (0,"CRP",0,0,'+proj_id+')';
        db.query(proj_details, null, (err, rows, field) => {
            if (!err) {
                console.log(rows);
               // res.json(rows);
            }
            else {
                console.log(err);
                res.json(err);
            }
        })
                
const insertMilestoneParams=   'INSERT INTO `kpi_project_parameters_t` VALUES'+ 
'('+proj_id+',1,1,1,"NO",null,null,null,null,sysdate(),"admin",sysdate(),"admin"),'+
'('+proj_id+',1,2,1,"NO",null,null,null,null,sysdate(),"admin",sysdate(),"admin"),'+
'('+proj_id+',1,3,1,"NO",null,null,null,null,sysdate(),"admin",sysdate(),"admin"),'+
'('+proj_id+',1,4,1,"NO",null,null,null,null,sysdate(),"admin",sysdate(),"admin"),'+
'('+proj_id+',1,5,1,"NO",null,null,null,null,sysdate(),"admin",sysdate(),"admin"),'+
'('+proj_id+',1,6,1,"NO",null,null,null,null,sysdate(),"admin",sysdate(),"admin"),'+
'('+proj_id+',1,7,1,"NO",null,null,null,null,sysdate(),"admin",sysdate(),"admin"),'+
'('+proj_id+',2,8,1,"NO",null,null,null,null,sysdate(),"admin",sysdate(),"admin"),'+
'('+proj_id+',2,9,1,"NO",null,null,null,null,sysdate(),"admin",sysdate(),"admin"),'+
'('+proj_id+',2,10,1,"NO",null,null,null,null,sysdate(),"admin",sysdate(),"admin"),'+
'('+proj_id+',2,11,1,"NO",null,null,null,null,sysdate(),"admin",sysdate(),"admin"),'+
'('+proj_id+',2,12,1,"NO",null,null,null,null,sysdate(),"admin",sysdate(),"admin"),'+
'('+proj_id+',2,13,1,"NO",null,null,null,null,sysdate(),"admin",sysdate(),"admin"),'+
'('+proj_id+',2,14,1,"NO",null,null,null,null,sysdate(),"admin",sysdate(),"admin"),'+
'('+proj_id+',2,15,1,"NO",null,null,null,null,sysdate(),"admin",sysdate(),"admin"),'+
'('+proj_id+',2,16,1,"NO",null,null,null,null,sysdate(),"admin",sysdate(),"admin"),'+
'('+proj_id+',2,17,1,"NO",null,null,null,null,sysdate(),"admin",sysdate(),"admin"),'+
'('+proj_id+',3,18,1,"NO",null,null,null,null,sysdate(),"admin",sysdate(),"admin"),'+
'('+proj_id+',3,19,1,"NO",null,null,null,null,sysdate(),"admin",sysdate(),"admin"),'+
'('+proj_id+',3,20,1,"NO",null,null,null,null,sysdate(),"admin",sysdate(),"admin"),'+
'('+proj_id+',3,21,1,"NO",null,null,null,null,sysdate(),"admin",sysdate(),"admin"),'+
'('+proj_id+',3,22,1,"NO",null,null,null,null,sysdate(),"admin",sysdate(),"admin"),'+
'('+proj_id+',3,23,1,"NO",null,null,null,null,sysdate(),"admin",sysdate(),"admin"),'+
'('+proj_id+',3,24,1,"NO",null,null,null,null,sysdate(),"admin",sysdate(),"admin"),'+
'('+proj_id+',3,25,1,"NO",null,null,null,null,sysdate(),"admin",sysdate(),"admin"),'+
'('+proj_id+',3,26,1,"NO",null,null,null,null,sysdate(),"admin",sysdate(),"admin");';

db.query(insertMilestoneParams, null, (err, rows, field) => {
    if (!err) {
        console.log(rows);
        res.json(rows);
    }
    else {
        console.log(err);
        res.json(err);
    }
})

                }
                else {
                    console.log(err);
                    res.json(err);
                }
            })
                 
    })
}

getKPI(app,db){
    app.post('/getKPI',(req,res)=>{
        const tablesql = 'select distinct mile.MILESTONE_ID,mile.MILESTONE,mile.KPI_WEIGHT,param.PARAMETER_ID,prj_mile.CYCLE_ID,param.PARAMETER_NAME,param.DELIVERABLE,param.OWNER,param.MAX_SCORE,prj_mile.PROJECT_ID,prj_mile.PMO_EXCEPTION,prj_mile.KPI_SCORE,prj_param.KPI_POINTS,prj_param.KPI_PMO_POINTS,prj_param.KPI_PM_NOTES,prj_param.KPI_PMO_NOTES, case when urp.USER_ROLE =  1 then "PM" when  urp.USER_ROLE =  3 then "SA" else  "" end ROLE,"N" as PMO from pmo_milestone_masters_t mile,pmo_parameters_masters_t param,kpi_project_milestones_t prj_mile,kpi_project_parameters_t prj_param,USER_ROLE_PROJECTS_T urp where mile.MILESTONE_ID=param.MILESTONE_ID and mile.MILESTONE_ID= prj_mile.MILESTONE_ID and param.MILESTONE_ID= prj_mile.MILESTONE_ID and prj_param.PROJECT_ID=prj_mile.PROJECT_ID and mile.MILESTONE_ID= prj_param.MILESTONE_ID and prj_mile.MILESTONE_ID= prj_param.MILESTONE_ID and param.MILESTONE_ID= prj_param.MILESTONE_ID and param.PARAMETER_ID=prj_param.PARAMETER_ID and prj_mile.CYCLE_ID=prj_param.CYCLE_ID and urp.PROJECT_ID = prj_mile.PROJECT_ID and prj_mile.PROJECT_ID=urp.PROJECT_ID and urp.USER_ID = (Select user_id from users_t where user_name =?) and urp.USER_ROLE in (1,3) and urp.PROJECT_ID = ? order by mile.MILESTONE_ID,prj_mile.CYCLE_ID;'
        const tablesql1 = 'Select max(case when user_id in (Select user_id from users_t where user_name=?) then 1 when user_id not in (Select user_id from users_t where user_name =?) then 0 end) pmo from user_role_projects_t;'
        const tablesqlpmo ='select distinct mile.MILESTONE_ID,mile.MILESTONE,mile.KPI_WEIGHT,param.PARAMETER_ID,prj_mile.CYCLE_ID,param.PARAMETER_NAME,param.DELIVERABLE,param.OWNER,param.MAX_SCORE,prj_mile.PROJECT_ID,prj_mile.PMO_EXCEPTION,prj_mile.KPI_SCORE,prj_param.KPI_POINTS,prj_param.KPI_PMO_POINTS,prj_param.KPI_PM_NOTES,prj_param.KPI_PMO_NOTES, "PM" as ROLE,"Y" as PMO from pmo_milestone_masters_t mile,pmo_parameters_masters_t param,kpi_project_milestones_t prj_mile,kpi_project_parameters_t prj_param,USER_ROLE_PROJECTS_T urp where mile.MILESTONE_ID=param.MILESTONE_ID and mile.MILESTONE_ID= prj_mile.MILESTONE_ID and param.MILESTONE_ID= prj_mile.MILESTONE_ID and prj_param.PROJECT_ID=prj_mile.PROJECT_ID and mile.MILESTONE_ID= prj_param.MILESTONE_ID and prj_mile.MILESTONE_ID= prj_param.MILESTONE_ID and param.MILESTONE_ID= prj_param.MILESTONE_ID and param.PARAMETER_ID=prj_param.PARAMETER_ID and prj_mile.CYCLE_ID=prj_param.CYCLE_ID and prj_mile.PROJECT_ID = ? order by mile.MILESTONE_ID,prj_mile.CYCLE_ID;';
          db.query(tablesql1,[req.body.username,req.body.username],(err,rows,field)=>{
               if(rows[0]['pmo']===1){
                   console.log('hello I am inside kpi with username');
           db.query(tablesql,[req.body.username,req.body.PROJECT_ID],(err,rows,field)=>{
               if(!err){
                   res.json(rows);
               }
               else{
                   res.json(err);
               }
                 })}
             else{
                   db.query(tablesqlpmo,[req.body.PROJECT_ID],(err,rows,field)=>{
               if(!err){
                   res.json(rows);
               }
               else{
                   res.json(err);
               }
           }) 
       }})
       })

 /*   app.post('/getKPI',(req,res)=>{
        const tablesql = 'select distinct mile.MILESTONE_ID,mile.MILESTONE,mile.KPI_WEIGHT,param.PARAMETER_ID,prj_mile.CYCLE_ID,param.PARAMETER_NAME,param.DELIVERABLE,param.OWNER,param.MAX_SCORE,prj_mile.PROJECT_ID,prj_mile.PMO_EXCEPTION,prj_mile.KPI_SCORE,prj_param.KPI_POINTS,prj_param.KPI_PMO_POINTS,prj_param.KPI_PM_NOTES,prj_param.KPI_PMO_NOTES, case when urp.USER_ROLE =  1 then "PM" when  urp.USER_ROLE =  3 then "SA" else  "" end ROLE from pmo_milestone_masters_t mile,pmo_parameters_masters_t param,kpi_project_milestones_t prj_mile,kpi_project_parameters_t prj_param,USER_ROLE_PROJECTS_T urp where mile.MILESTONE_ID=param.MILESTONE_ID and mile.MILESTONE_ID= prj_mile.MILESTONE_ID and param.MILESTONE_ID= prj_mile.MILESTONE_ID and prj_param.PROJECT_ID=prj_mile.PROJECT_ID and mile.MILESTONE_ID= prj_param.MILESTONE_ID and prj_mile.MILESTONE_ID= prj_param.MILESTONE_ID and param.MILESTONE_ID= prj_param.MILESTONE_ID and param.PARAMETER_ID=prj_param.PARAMETER_ID and prj_mile.CYCLE_ID=prj_param.CYCLE_ID and urp.PROJECT_ID = prj_mile.PROJECT_ID and prj_mile.PROJECT_ID=urp.PROJECT_ID and urp.USER_ID = (Select user_id from users_t where user_name =?) and urp.USER_ROLE in (1,3) and urp.PROJECT_ID = ? order by mile.MILESTONE_ID,prj_mile.CYCLE_ID;'
            db.query(tablesql,[req.body.username,req.body.PROJECT_ID],(err,rows,field)=>{
            if(!err){
                res.json(rows);
            }
            else{
                res.json(err);
            }
            }
            )
           })
           */
}

prjkpiupdates(app,db){
    app.put('/prjkpiupdate',(req,res)=>{       
        console.log(".........................................");
        console.log(req);
        let data=req.body.kpi;
        data.forEach(element => {
            if(element.isRowUpdated){
                const tablesql1 = 'update kpi_project_milestones_t set KPI_SCORE = ?,last_update_date=sysdate() where project_id = ? and MILESTONE_ID=? and CYCLE_ID=?'
                db.query(tablesql1,[element.KPI_SCORE,element.PROJECT_ID,element.MILESTONE_ID,element.CYCLE_ID],(err,rows,field)=>{
                         if(!err){
                        console.log(rows);
                       // res.json(rows);
                    }
                    else{
                        res.json(err);
                    }
                })
               const tablesql = 'update kpi_project_parameters_t set KPI_POINTS =?,KPI_PMO_POINTS =?,KPI_PMO_NOTES = ?,KPI_PM_NOTES = ? where project_id = ? and MILESTONE_ID = ? and PARAMETER_ID = ? and CYCLE_ID=?'
                    console.log('PM POINTS');
                    db.query(tablesql,[element.KPI_POINTS,element.KPI_PMO_POINTS,element.KPI_PMO_NOTES,element.KPI_PM_NOTES,element.PROJECT_ID,element.MILESTONE_ID,element.PARAMETER_ID,element.CYCLE_ID],(err,rows,field)=>{
                        if(!err){
                            console.log(rows);
                            //res.json(rows);
                        }
                        else{
                            res.json(err);
                        }
                    })
            }    
            console.log(element.MILESTONE_ID);
        });
        res.json( (req.body.kpi));
    })
}
       
}

module.exports = Router;