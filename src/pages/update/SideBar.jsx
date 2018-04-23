import React, { Component } from "react";
import { Layout, Menu, Icon,Divider } from "antd";
import { NavLink } from "react-router-dom";
import "./Common.less";
const {   Sider } = Layout;
class SiderDemo extends Component {
  render() {
    return (
      <Layout>
      <Sider width={200} style={{ background: '#fff' }}>
      <div className="icons-content">
        <div className="icon-icon">  <i className="iconfont icon-text icon-banbengengxin" />
         <a  herf ="/update/home"  className="text-text">更新日志</a>
        </div>            
      </div>
      <Divider />
        <Menu mode="inline" defaultSelectedKeys={[]}>
          <Menu.Item key="home">
            <NavLink activeClassName="activeStyle"  to="/update/home" >
              <Icon type="update" />
              <span>更新记录</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="manage">
            <NavLink activeClassName="activeStyle"  to="/update/manage" >
              <Icon type="update" />
              <span>更新日志</span>
            </NavLink>
          </Menu.Item>
        </Menu> 
      </Sider>
    </Layout>
    );
  }
}

export default SiderDemo;
