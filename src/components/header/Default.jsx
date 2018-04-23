import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import { Avatar, Popover, Icon, Modal, Row, Col ,message} from 'antd';
// import _ from 'lodash';
import {
	// showProject,
	getUserInfo,
	getUserRolesOfProject,
	// getJsapiTicketConfig
} from "../../services/api";
import './Common.less';

class HeaderDefault extends Component {
	static contextTypes = {
		router: PropTypes.object
	}
	constructor(props, context) {
		super(props, context);
		this.state = {
			userName: ''||"用户名",
			avatar: ""|| 'http://docs.cq-tct.com/94H58PICREX_1024.jpg?imageView2/1/w/100/h/100',
			visible: false,
			reloadChecked: "",
			appName: "" || "请选择模块",
			isFullScreen: false ,//是否全屏
			projectId: Cookies.get('ProjectId'),
		};
	}
	componentDidMount() {
		if(Cookies.get('presentUserIsDimission') === '已离职') {
			 return this.context.router.push('/dimission');
		}else {
			this.isLogin();
			// console.log(this.state.projectId);
			if(this.state.projectId) {
				this.getUserRoles();
			}
		}
	}

	componentWillUpdate(nextProps, nextState) {
		
		if (nextState.reloadChecked !== this.state.reloadChecked) return true;
	}
	onChildChanged(newState) {
		//监听子组件的状态变化
		this.setState({ reloadChecked: newState });
	}
	isLogin() {
    //判断是否登录
    if(!Cookies.get('authorization')){
      return this.context.router.push('/#/unauthorized');
    }
    // let _self = this;
    getUserInfo().then((res) => {
			console.log(res.jsonResult);
			// message.success("登录成功")
			console.log(res);
      // Cookies.set('presentUserName', res.jsonResult.user.name);
      // Cookies.set('presentUserCanCreateProject', res.jsonResult.user.canCreateProject);
      // this.setState({
      //   userName: res.jsonResult.user.name,
      //   avatar: res.jsonResult.user.avatar || 'http://docs.cq-tct.com/94H58PICREX_1024.jpg?imageView2/1/w/100/h/100'
      // });
    })
  }
	getUserRoles() {
		getUserRolesOfProject(this.state.projectId).then((res) => {
			if(res.jsonResult.user) {
				Cookies.set('presentUserRolesOfProject', res.jsonResult.user.UserProjects.role);
			} 
			// console.log(res);
			// console.log(Cookies.get('presentUserRolesOfProject') );	 
		})
	}
	render() {
		const content = (
			<div className="des-header-user-detail-box">
				<div className="des-header-button-item">用户中心</div>
				<div className="des-content-block-u_d-small">状态：<span className="des-text-success">正常</span></div>
				<div className="des-content-block-u_d-small">角色：项目管理工程师</div>
			</div>
		);

		return (
			<div className="desp-header-container">
				<div className="des-header-container">
					<div className="des-header-left-menu-box"><Headerlogo/></div>
					<div className="des-header-left-menu-box"><HeaderRouter /> </div> 
					<div className="des-header-right-menu-box">
						<span style={{ marginRight: 24 }}>
							</span>
							 <Popover content={content} trigger="hover" placement="bottomRight">
							 <span className="des-header-user">
								 <Link to="/member/home">
									 <Avatar
										 className="des-header-img"
										 icon="user"
										 src={this.state.avatar}
									 />
										<span className="despUserName">{this.state.userName}</span>
								 </Link>
							 </span>
						 </Popover>
					</div> 
					<div className="des-header-right-menu-box">
					<HeaderApps/>
					</div> 
				</div>
			</div>
		);
	}
}

class HeaderApps extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modalName:''||"请选择项目",
			visible: false
		};
	}
	componentDidMount() {
		var projectId=Cookies.get('projectId')
		switch(projectId){
			case "1":
			this.setState({modalName:"DES移动端"});
			break;
			case "2":
			this.setState({modalName:"DES平台"});
			break;
			// case "3":
			// this.setState({modalName:"知识库"});
			// break;
			default:
		}
	}

	showModal = () => {
		this.setState({ visible: true });
	};
	handleOk = e => {
		this.setState({ visible: false });
	};
	handleCancel = e => {
		this.setState({ visible: false });
	};
	setApps(item) {
		this.setState({ visible: false });
		this.setState({ modalName: item.name });
		Cookies.set('projectId',item.projectId);
		Cookies.set('projectName',item.name);
		setTimeout(() => {
			window.location.reload();
		 }, 100);
		 message.success("已切换到 " + item.name + "项目");
	}

	render() {
		let modularArrs = [
			{
				path: "/",
				projectId:"1",
				name: 'DES移动端',
				imgUrl: "http://docs.cq-tct.com/desp/images/app_img01.png",
				isDisabled: false
			},
			{
				 path: "/",
				 projectId:"2",
				 name: "DES平台",
				 imgUrl: "http://docs.cq-tct.com/desp/images/app_img02.png",
				 isDisabled: false
			},
			// {
			// 	 path: "/",
			// 	 projectId:"3",
			// 	 name: "知识库",
			// 	 imgUrl: "http://docs.cq-tct.com/desp/images/app_img07.png",
			// 	 isDisabled: false
			// },
		];
		return (
			<div className="des-float-left des-content-block-l_r-default">
				<span onClick={this.showModal} className="des-cursor">
				<Icon type="appstore" />切换项目
					{this.state.modalName ? (
						<span >
							/{this.state.modalName}
						</span>
					) : null}
				</span>
				<Modal
					visible={this.state.visible}
					onOk={this.handleOk}
		      onCancel={this.handleCancel}
          footer=""
        >
          <Row>
            {modularArrs.map((item, key) => {
              return (
                <Col
                  key={key}
                  span={8}
                  onClick={this.setApps.bind(this, item)}
                  className="des-appicon-box"
                >
                  <img
                    src={item.imgUrl}
                    alt={item.name}
                  />
                  <div className="desp-icon-masklayer" />
                  {item.isDisabled ? (
                    <div className="desp-icon-masklayer-text">
                      <Icon type="lock" /> 锁定
                    </div>
                  ) : (
                    <Link to={item.path}>
                      <div className="desp-icon-masklayer-text">
                        <Icon type="unlock" /> 打开
                      </div>
                    </Link>
                  )}
                  <div>{item.name}</div>
                </Col>
              );
            })}
          </Row>
        </Modal>
      </div>
    );
  }
}

class HeaderRouter extends Component {
 render(){
    return (
      <div className="des-float-left">
        <ul className="nav">
        <li><a href="/qusetion/home">常见问题</a></li>
        <li><a href="/online/home">在线文档</a></li>
        <li><a href="/opinion/home">意见反馈</a></li>
        <li><a href="/update/home">更新日志</a></li>
       </ul>
      </div>
    )
  }
}
class Headerlogo extends Component {
  render(){
    return (
      <div className="logo-content">
          <a href="/"><img
            className="logo"
            src="http://docs.cq-tct.com/desp/images/logo_002.png"
            alt="img"
          /><div className="logo-text">&nbsp;&nbsp;帮助中心</div></a>
        </div>
      
    )
  }
}

export default HeaderDefault;