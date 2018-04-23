import React from 'react';
import _ from 'lodash';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // ES6
// import moment from 'moment';
 import { Divider,Col,Row  } from 'antd';
//  import queryString from "query-string";
import {   getItemQuestion } from '../../../services/api';
import  './Common.less';
class  ShowItem extends React.Component{
    constructor(props) {       
      super(props);       
      this.state = {
          loading: true,
          dataSource:[],
          id:'',
          modifyQuestionHtml:""
      }
    }
    componentDidMount() {
      let presentURL =
			window.location.hash === ""
				? window.location.pathname
				: window.location.hash;
		  let presentURLArray = presentURL
			.split("?")[0]
			.replace(/#/, "")
      .split("/"); //根目录会是两个空串["",""]
      this.gitpersentItemQuestion(presentURLArray[3]);
      // if ( presentURLArray[3] = "undefined")  return this.setState({
      //   modifyQuestionHtml: (
      //     <NoDate
      //     />
      //   )
      // }); ;
    }
    gitpersentItemQuestion(id){
      getItemQuestion(id).then((res)=>{
        let datas= res.jsonResult.question;
        datas = _.sortBy(datas, [function(o)  { return o.id; }]);
        console.log(datas); 
        let tempArray = [];
        datas.map((item, key) => {
          let tempJson = {};
          tempJson.id=item.id
          tempJson.key = key+1;
          tempJson.title = item.title;
          tempJson.flag = item.flag;
          tempJson.type = item.type;
          tempJson.content = item.content;
          tempJson.projectName = item.projectName;
          tempJson.projectId = item.projectId;
          tempArray.push(tempJson);
          return datas;
        })
        this.setState({ dataSource: tempArray});
       console.log(this.state.dataSource)
      })
    }
    noQuestion(){
      this.setState({
        modifyQuestionHtml: (
          <NoDate
          />
        )
      });
    }
    modules = {
      toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline','strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image'],
        ['clean']
      ],
    };
  
    formats = [
      'header',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'link', 'image'
    ];
    render() {
      const events = {
        'text-change': delta => {
          console.log(delta)
        }
      }
    return (
      <div >
          <div className="bg-title">
            {
              _.map(this.state.dataSource, (item, key) => {
                return <h3 key={item.id} >{item.title}</h3>
              })
            }
          </div>
              <Row>
                <Col span={1}>
                </Col>
                <Col span={6}>
                  {/* <span>解决方案如下：</span> */}
                  {/* {
                    _.map(this.state.dataSource, (item, key) => {
                      return <span key={item.id} >{item.type}</span>
                    })
                  } */}
                </Col>
                <Col span={17}>
                </Col>
              </Row> 
        <center className="questionTitle" >
          <div id ="textear">
            {
                _.map(this.state.dataSource, (item, key) => {
                  return <div key={key}><ReactQuill
                  theme="bubble"
                  events={events}
                  modules={this.modules}
                  formats={this.formats}
                  onChange={this.handleChange}
                  defaultValue={item.content}
                  readOnly={true}
                >
                <div className='my-editing-area'/>
               </ReactQuill></div>
                })
            }
          </div>
        </center>
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
      <Divider></Divider>
        <div className="search-box">
          <center>
            <Row style={{paddingTop:33}}>
            <Col span={5} />
                <Col span={14}>
                <h3>很抱歉，找不到您搜索的“<span className="search-red">{ this.props.value}</span>”相符的内容或信息</h3>
                </Col>
            </Row>
            <Col span={5}/>
            <Row style={{paddingTop:33}}>
            <Col span={5} />
                <Col span={14}>
                <h4> 温馨提示:</h4>
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
export default ShowItem;