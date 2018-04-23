import React from 'react';
import _ from "lodash";
import Cookies from "js-cookie";
// /import moment from 'moment';
import { NavLink } from "react-router-dom";
import { Divider, Row, Col  ,Input, message } from 'antd';
import {  searchProjectQuestion ,searchQuestion } from '../../services/api';
// import styles from './Common.less';
const Search = Input.Search;
class Usually extends React.Component{
  constructor(props) {       
    super(props);       
    this.state = {
        loading: true,
        value:'',
        dataSource:""
    }
  }
  componentDidMount() {
    this.searchQuestionMsg();
  }
  searchQuestionMsg(){
    let projectId = Cookies.get("projectId");
    if (!projectId) return message.warning("请选择您要查询的项目");
    searchProjectQuestion(projectId).then((res)=>{
      let datas= res.jsonResult.question;
      datas = _.sortBy(datas, [function(o)  { return -o.id; }]);
      console.log(datas); 
      let tempArray = [];
			datas.map((item, key) => {
        let tempJson = {};
        tempJson.id=item.id
				tempJson.key = key+1;
				tempJson.content = item.content;
				tempJson.name = item.name;
				tempJson.title = item.title;
				tempJson.projectId = item.projectId;
					tempArray.push(tempJson);
				return datas;
      })
       this.setState({ dataSource: tempArray, loading: false });
       console.log(this.state.dataSource)
    })
  }
  search=(value)=>{
    this.setState({ value: value })
    console.log(value);
    searchQuestion(value).then((res)=>{
      let datas= res.jsonResult.question;
      datas = _.sortBy(datas, [function(o)  { return -o.id; }]);
      console.log(datas); 
      let tempArray = [];
			datas.map((item, key) => {
        let tempJson = {};
        tempJson.id=item.id
				tempJson.content = item.content;
				tempJson.name = item.name;
				tempJson.title = item.title;
					tempArray.push(tempJson);
				return datas;
      })
       this.setState({ dataSource: tempArray, loading: false });
       console.log(this.state.dataSource)
    })
  }
  handleChange=(value)=> {
    // console.log(`selected ${value}`);
    this.setState({id:value})
  }
render() {
return (
  <div className="desp-box-content">
      <div className="search-box">
        <center>
            <Row>
            <Col span={3} />
            <Col span={18}>
                  <Search
                  placeholder="请输入您的疑问..."
                  onSearch={this.search }
                   size = "large"
                  enterButton
                  /> 
              </Col>
              <Col span={3}> </Col>
            </Row>
            
        </center>
      </div>
     <Divider></Divider>
      {/* {this.state.loading}? */}
      <Row style={{paddingTop:33}}>
      <Col span={3} />
      <Col span={18}>
      <div className="task-lists">
        <ul className="task-lists">
          {
            _.map(this.state.dataSource, (item, key) => {
              return  <NavLink key={key} activeClassName="activeStyle"  to={"/qusetion/showitem/" +item.id} >
              <li>{item.title} </li>
              </NavLink> 
            })
          }
        </ul>
      </div>
      </Col>
      <Col span={3}/>
      </Row>
      {
        _.size(this.state.dataSource) ?
        null
        :
        <NoDate value={this.state.value}/>
      }
  </div>
    )
  }
};

class NoDate extends React.Component{
  constructor(props) {       
    super(props);       
    this.state = {
    loading: true,
    }
  }  
  render() {
    return (
      <div className="desp-box-content">
        <div className="search-box">
          <center>
            <Row style={{paddingTop:22}}>
            <Col span={5} />
                <Col span={14}>
                <h3>很抱歉，找不到您搜索的“<span className="search-red">{ this.props.value}</span>”相符的内容或信息</h3>
                </Col>
            </Row>
            <Col span={5}/>
            <Row style={{paddingTop:33}}>
            <Col span={5} />
                <Col span={14}>
                <h4> 温馨提示：      </h4>
                </Col>
            </Row>
            <Col span={5}/>
            <Row style={{paddingTop:33}}>
              <Col span={5} />
              <Col span={14}>
                <div>
                <h4>您可以采用“模块+关键字”的形式进行搜索，以便获得更精确的结果，若还是无法接近请到在线文档中查询操作手册或联系平台管理员。</h4>  
                </div>
              </Col>
            </Row>
            <Col span={5}/>
          </center> 
        </div>
     </div>
    )
  }
};

export default Usually;