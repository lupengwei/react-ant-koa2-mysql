import React, { Component } from 'react';
import LayoutDefault from '../../components/layout/Default';
import Sider from './SideBar';
import Manage from './Manage';
import List from './List';
import ShowCommon from './components/ShowCommon'
import './Common.less';

class Qusetion extends Component {
	constructor(props) {			 
		super(props);			 
		this.state = {
			loading: true, 
		}
	}
	render() {
    let routePrams = this.props.match.params.type,
         subComponents = <List />;
    let presentURL = window.location.hash === ''? window.location.pathname: window.location.hash;
    let presentURLArray = presentURL.split('?')[0].replace( "").split('/'); //根目录会是两个空串["",""]
    if( presentURLArray[3] === "common"){
      subComponents = < ShowCommon datas={routePrams} />;
      console.log(routePrams);
    }
		switch (routePrams) {
			case "list":
				subComponents = <List />;
				break;
			case "manage":
			 subComponents = <Manage />;
				break;
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
