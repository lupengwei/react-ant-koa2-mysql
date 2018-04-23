import React, { Component } from 'react';
import LayoutDefault from '../../components/layout/Default';
import Sider from './SideBar';
 import Manage from './Manage';
import './Common.less';
import Update from "./Update";

class Qusetion extends Component {
  constructor(props) {       
    super(props);       
    this.state = {
      loading: true, 
    }
  }
  render() {
    let routePrams = this.props.match.params.type,
        subComponents = <Update />;
    console.log(routePrams);
    switch (routePrams) {
      case "home":
        subComponents = <Update />;
        break;
      case "manage":
        subComponents = <Manage />;
        break;
      // case "tracking":
      //   // state.isBelongOfProject ? subComponents = <MeetsTrackingTable /> : subComponents = <Warning datas="你不是本组织成员，无权查看会议跟踪表!" />;
      //   subComponents = <MeetsTrackingTable />;
      //   break;
        default:
      }
    return (
      <LayoutDefault>
        <Sider/>
        {subComponents}
      </LayoutDefault>
    );
  }
}

export default Qusetion;
