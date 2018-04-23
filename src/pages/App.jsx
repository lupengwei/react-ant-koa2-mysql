import React, { Component } from 'react';
import './App.less';
import { Row,Col } from 'antd';
import { Link} from 'react-router-dom';
import { Layout ,Carousel,} from 'antd';
import HeaderDefault from '../components/header/Default';
import Footers from '../components/header/Footer';
// import { getProjectStatusAtGlobal } from '../services/api';
const { Header, Footer,	Content } = Layout;

class App extends Component {

	// handleGetProjectStatus() {
	// 	getProjectStatusAtGlobal().then((res) => {
	// 		console.log(res.jsonResult)
	// 	})
	// }

	render() {
		console.log('this is app.jsx')
		return (
		<Layout>
			<Header className="des-layout-header-container"><HeaderDefault/></Header>
			 <Content><Apppage/> </Content>
			<Footer><Footers/></Footer>
		</Layout>
		);
	}
}

export default App;

class Apppage extends Component {
	render(){
		return(
			<div className="App">
							<Carousel autoplay height="400">
							 <a href="/online/home"><div className="App-header1"></div></a> 
							 <a href="/qusetion/home"><div className="App-header2"></div></a> 
							 <a href="/update/home"><div className="App-header3"></div></a> 
							 <a href="/opinion/home"><div className="App-header4"></div></a> 
							</Carousel>
			 
					<div className="App-box">
						<div className='item-choise'>
							<Row gutter={16}>
								<Col className="gutter-row" span={6}>
									 <Link to="/qusetion/home"> 
										<div className="gutter-box">
											<div className="circle">
													<i className="iconfont icon-circle icon-changjianwenti1" />
											</div>
											<div className="gutter-text"> 常见问题</div>
										</div>
									 </Link> 
								</Col>
								<Col className="gutter-row" span={6}>
									 <Link to="/online/home"> 
										<div className="gutter-box">
											<div className="circle"><i className="iconfont icon-circle icon-wendang" />
											</div>
											<div className="gutter-text"> 在线文档</div>
										</div>
										
									 </Link> 
								</Col>
								<Col className="gutter-row" span={6}>
									 <Link to="/opinion/home"> 
										<div className="gutter-box">
											<div className="circle"><i className="iconfont icon-circle icon-yijianfankui1" />
											</div>
											<div className="gutter-text"> 意见反馈</div>
										</div>
									 </Link> 
								</Col>
								<Col className="gutter-row" span={6}>
									 <Link to="/update/home"> 
										<div className="gutter-box">
											<div className="circle"><i className="iconfont icon-circle icon-banbengengxin" />
											</div>
											<div className="gutter-text"> 更新日志</div>
										</div>
									 </Link> 
								</Col>
							</Row>
						</div>
						{/* 382483996425088529 */}
						{/* <Link className="button-item" to="/login/wx/382483996425088529"> 
						<Button>从企业微信登录</Button>
						</Link>
										<Link className="button-item" to="/login/wx/8423546243924183822"> 
						<Button> 测试 从企业微信登录</Button>
						</Link> */}
						{/* <Headerimg/> */}
					</div>
			</div>
				
	
		)
	}
}
