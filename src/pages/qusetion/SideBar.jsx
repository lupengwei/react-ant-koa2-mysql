import React, { Component } from "react";
import { Layout, Menu, Icon,Divider,message } from "antd";
import { NavLink } from "react-router-dom";
import _ from "lodash";
import Cookies from "js-cookie";
import "./Common.less";
import {
  searchQuestionType,
} from "../../services/api";
const {  Sider } = Layout;
const {SubMenu}=Menu;

class SideBar extends Component {
  constructor(props) {
    super();
    this.state = {
      loading: false,
      isBelongOfProject: false,
      dataSource: [],
      // reloadChecked:props.initialChecked || 0, //用于父组件更新this.props.initialChecked
      };
  }
  componentDidMount() {
		this.searchQuestionTypeMsg();
  }
  searchQuestionTypeMsg(){
    let projectId = Cookies.get("projectId");
    if (!projectId) return message.warning("请选择您要查询的项目");
    searchQuestionType(projectId).then((res)=>{
      let datas= res.jsonResult.questionType;
      datas = _.sortBy(datas, [function(o)  { return o.id; }]);
      // console.log(datas); 
      let tempArray = [];
			datas.map((item, key) => {
        let tempJson = {};
        tempJson.id=item.id
				tempJson.key = key+1;
				tempJson.name = item.name;
				tempJson.projectId = item.projectId;
					tempArray.push(tempJson);
				return datas;
      })
      this.setState({ dataSource: tempArray, loading: false });
      // this.props.callbackParent(newState);
      //  console.log(this.state.dataSource)
    })
  }
  render() {
    return (
      <Layout style={{  background: '#fff' }}>
        <Sider width={200} className="des-sider-content"  >
        <div className="icons-content">
          <div className="icon-icon"> <i className="iconfont icon-text icon-changjianwenti1" /> 
          <a className="text-text">常见问题</a>
          </div>           
        </div>
        <Divider />
      <Menu mode="inline"  defaultSelectedKeys={["hot"]}>
           <SubMenu key="sub1" title={<span><Icon type="tool" />问题管理</span>}>
              <Menu.Item key="types">
              <NavLink activeClassName="activeStyle"  to="/qusetion/types"  >
               <Icon type="database" />
                <span>设置问题类型</span>
              </NavLink>
            </Menu.Item>
            <Menu.Item key="manage">
                <NavLink activeClassName="activeStyle"  to="/qusetion/manage"  >
                <Icon type="pushpin" />
                  <span>设置问题管理</span>
                </NavLink>
              </Menu.Item>
          </SubMenu>
          <Menu.Item key="hot">
            <NavLink activeClassName="activeStyle"  to="/qusetion/hot"  >
            <Icon type="like-o" />
              <span>热门问题</span>
            </NavLink>
          </Menu.Item>
          {
            _.size(this.state.dataSource) === 0 ?
            <Menu.Item key={222}>
            <NavLink  to=""  >
            <Icon type="like-o" />
              <span>暂无分类</span>
            </NavLink>
          </Menu.Item>
            :
              _.map(this.state.dataSource, (item, key) => {
                return (
                  <Menu.Item key={key+1000}>
                    <NavLink activeClassName="activeStyle"  to={"/qusetion/" +item.name +"/common"}  >
                    <Icon type="appstore-o" />
                      <span>{item.name}</span>
                    </NavLink>
                  </Menu.Item>
                )
              })
          }
       </Menu> 
      </Sider>
    </Layout>
    );
  }
}

export default SideBar;
