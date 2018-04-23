import React, { Component } from 'react';
import LayoutDefault from '../../components/layout/Default';
import Sider from './SideBar';
import Welcome from "./Welcome";
import OpinionLists from "./OpinionLists";
// import CompareProjects from "./CompareProjects";
// import DynamicInfo from "./DynamicInfo";

import "./Common.less";
class Opinion extends Component {
	constructor(props) {			 
		super(props);			 
		this.state = {
		}
	}
	render() {
		let routePrams = this.props.match.params.type,
				subComponents = <OpinionLists />;
				console.log(routePrams);
		switch (routePrams) {
			case "lists":
				subComponents = <OpinionLists />;
				break;
			case "list":
				subComponents = <Welcome />;
				break;
			// case "dynamic":
			//	 subComponents = <DynamicInfo showType="self" />;
			//	 break;
			// case "honor":
			//	 subComponents = <Honor />;
			default:
		}
		return (
			<LayoutDefault>
				<Sider />
				{subComponents}
			</LayoutDefault>
		);
	}
}

export default Opinion;

