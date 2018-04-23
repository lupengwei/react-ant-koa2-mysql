import React, { Component } from 'react';
import { Layout } from 'antd';
import HeaderDefault from '../header/Default';
import './Common.less';

const { Header, Content, Sider } = Layout;

class SiderDemo extends Component {
	render() {
		return (
			<Layout id="des-layout-default-trigger">
			<Header className="des-layout-header-container"><HeaderDefault /></Header>
				<Layout>
					<Sider>{ this.props.children[0] }</Sider>
					<Content className="des-layout-body-container">{ this.props.children[1] }</Content>
				</Layout>
			</Layout>
		);
	}
}

export default SiderDemo;