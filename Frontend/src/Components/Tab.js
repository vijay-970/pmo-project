import {useState} from 'react';
import {Tabs,Tab} from 'react-bootstrap';
import Tables from '../pages/home/ProjectHealth';
import KPI from './KPI';

export default function ControlledTabs(props) {
    const [key, setKey] = useState('profile');
  
    return (
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
      >
          
        <Tab eventKey="home" title="Home">
          <Tables data ={props.data[0]}/>
        </Tab>
        
        <Tab eventKey="profile" title="Profile">
          <KPI data = {[props.data[0],props.data[1]]}/>
        </Tab>
        <Tab eventKey="contact" title="Contact">
          Hello world 3
        </Tab>
      </Tabs>
    );
  }