import React, { Component } from 'react';
import LayoutDefault from '../../components/layout/Default';
import SideBar from './SideBar';
import Manage from './Manage';
import Types from './Types';
import Hot from './Hot';
import ShowItem from './components/ShowItem';
import ShowCommon from './components/ShowCommon';
// import styles from './Common.less';
class Qusetion extends Component {
  constructor(props) {       
    super(props);       
    this.state = {
      loading: false,
    }
  }
  render() {
    let routePrams = this.props.match.params.type,
         subComponents = <Hot />;
    let presentURL = window.location.hash === ''? window.location.pathname: window.location.hash;
    let presentURLArray = presentURL.split('?')[0].replace( "").split('/'); //根目录会是两个空串["",""]
    if( presentURLArray[3] === "common"){
      subComponents = < ShowCommon datas={routePrams} />;
      console.log(routePrams);
    }
    switch (routePrams) {
      case "hot":
        subComponents = <Hot />;
        break;
      case "types":
       subComponents = <Types />;
        break;
      case "manage":
       subComponents = <Manage />;
        break;
      case "showitem":
       subComponents = <ShowItem />;
        break;
        default:
      }
    return (
      <LayoutDefault>
        <SideBar  />
        {subComponents }
      </LayoutDefault>
    );
  }
}

export default Qusetion;
