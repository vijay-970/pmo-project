import { action, makeObservable, observable } from 'mobx';
import { Row } from 'react-bootstrap';
import { PMSidebarData } from '../Components/PMSidebarData';
import { SASidebarData } from '../Components/SASideBarData';
import { PMOSidebarData } from '../Components/PMOSidebarData';

class ProjectStore {
  id = 1;
  name = 'default';
  projectPMO = 'default';

  sidebarArray = SASidebarData;
  roleName='SA'
  constructor() {
    makeObservable(this, {
      id: observable,
      name: observable,
      projectPMO:observable,
      changeProject: action,
      sidebarArray: observable,
      changeRole:action
    });
  }
  changeProject(name,id) {
    this.name = name;
    this.id = id;
    // if (name === 1) {
    //   this.sidebarArray = SASidebarData;
    // } else {
    //   this.sidebarArray = PMSidebarData;
    // }
  }
  changeRole(roleName,projectPMO){
      this.role=roleName;
      this.projectPMO = projectPMO;
      if (roleName === 'SA' && projectPMO === 'N') {
        this.sidebarArray = SASidebarData;
      } else if(roleName === 'PM' && projectPMO === 'N'){
        this.sidebarArray = PMSidebarData;
      }
      else if(projectPMO === 'Y'){
        this.sidebarArray = PMOSidebarData;
      }
  }

}
const projectStore = new ProjectStore();
export default projectStore;
