import React from 'react';
import Cookies from 'js-cookie';
// import PropTypes from 'prop-types';
 import { getUserInfo } from '../../services/api';
import { Icon, message } from 'antd';
import {withRouter} from "react-router-dom"

/**
 * router v4
 */
 class Login extends React.Component{
  constructor(props, context) {
    super(props, context);
    this.state = {
      loginType: 'normal',
      dimission:""
    }; // 这样才行，如果只写props, 会把context 弄丢，所以super时始终建议这么写
  }
  //  contextTypes: {
  //   router: React.PropTypes.object
  // }
  componentDidMount() {

    Cookies.set('authorization', this.props.match.params.userId);
    Cookies.set('authType', 'wx'); // 认证方式
    console.log("write wx over!");

    let _self = this;
    // let presentURI = this.props.location.query.desp_redirect_uri;
   this.props.history.push('/');
    getUserInfo().then(function(res) {
      console.log(res);
      if(!res.jsonResult.user) return message.error('当前发生偶然错误，请从企业微信重新尝试登录！'); 
      Cookies.set('presentUserName', res.jsonResult.user.name);
      Cookies.set('presentUserId', res.jsonResult.user.id);
      Cookies.set('presentUserDingtalkId', res.jsonResult.user.userid);
      Cookies.set('presentUserWxId', res.jsonResult.user.wxid); // 20170712新增
      Cookies.set('presentUserCanCreateProject', res.jsonResult.user.canCreateProject);
      Cookies.set('presentUserIsConsole', res.jsonResult.user.administrator); // 是否管理员
      Cookies.set('presentUserIsDimission', res.jsonResult.user.dimission); // 就职状态
      Cookies.set('userInfo', JSON.stringify(res.jsonResult.user)); // 20160912前暂时未用

      if(res.jsonResult.user.dimission === '已离职') {
        // 已离职
        return _self.context.router.push('/dimission');
      }
      // else if(presentURI) {
      //   // 认证重定向
      //   return _self.context.router.push(presentURI);
      // }
      else {
        // 正常

        return  this.props.history.push('/'); //_self.context.router.push('/');
      }

    })

  }
  render() {
    return (
      <div>
        <Icon type="loading"/>
      </div>
    );
  }
}
 export default  withRouter(Login);
