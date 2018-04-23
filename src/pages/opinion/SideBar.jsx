import React, { Component } from "react";
import { Layout, Menu,Divider} from "antd";
// import _ from "lodash";
// // import Cookies from "js-cookie";
// import { NavLink } from "react-router-dom";
import "./Common.less";
// const SubMenu = Menu.SubMenu;
const { Sider } = Layout;

class SiderDemo extends Component {
	render() {
		return (
			<Sider
				trigger={null}
				collapsible
				className="des-sider-content"
			> 
				<div className="icons-content">
					<div className="icon-icon"> <i className="iconfont icon-text icon-yijianfankui1" /> 
					<a className="text-text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>
					</div>			 
				</div>
				<Divider /> 
				<Menu mode="inline"	defaultSelectedKeys={["lists"]}>
				</Menu> 
			</Sider>
		);
	}
}
export default SiderDemo;

