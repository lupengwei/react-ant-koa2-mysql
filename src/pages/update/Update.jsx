import React, { Component } from "react";
import { Collapse,message } from "antd";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // ES6
import _ from 'lodash';
import  './Common.less';
import Cookies from "js-cookie";
// import moment from "moment";
import {searchUpdate} from "../../services/api";
const Panel = Collapse.Panel;
class Update extends Component {
  constructor(props) {
    super();
    this.state = {
      loading: true,
      datas:[],
      nothingHTML:<div> 当前项目没有版本信息，请联系管理员添加。。。</div>
    }
  }
  componentDidMount(){
    this.handleSearchUpdates()
  }
  callback(key) {
    console.log(key);
  }
  handleSearchUpdates() {
    let projectId = Cookies.get("projectId");
    if(!projectId) return message.warning('请选择当前项目')
    console.log(projectId)
    searchUpdate(projectId).then((res) => {
      let datas =res.jsonResult.update;
      datas=_.sortBy(datas,[function(o){return -o.createAt}]);
      let tempArray=[];
      datas.map((item,key)=>{
        let tempJson={};
          tempJson.key=key+1;
          tempJson.version=item.version;
          tempJson.content=item.content;
          tempJson.date=item.date;
          tempJson.projectId=item.projectId;
          tempJson.projectName=item.projectName;
          tempArray.push(tempJson)
        return datas;
      })
      this.setState ({datas:tempArray, loading:false})
      console.log(this.state.datas)
      if(_.size(tempArray)===0) {this.setState({
        loading:true
      })}
    })
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
    const customPanelStyle = {
    background: '#f7f7f7',
    borderRadius: 8,
    marginBottom: 24,
    parginRight:9,
    float:"left",
    border: 0,
    overflow: 'hidden',
    };
    const kong ="_"
    return (
      <div className="des-body-container">
        <div style={{ height: "100%", paddingTop: 35}}>
        { this.state.loading ?this.state.nothingHTML: null}
          <div>
          <Collapse defaultActiveKey={['0']} onChange={this.callback}>
          {_.map(this.state.datas,(item,key)=>{
            return ( 
            <Panel style={{customPanelStyle}} header={"版本号:"+ item.version +kong+"更新时间:"+item.date } key={key}>  
              <div id ="update-textears">
                <ReactQuill
                  theme="bubble"
                  events={events}
                  modules={this.modules}
                  formats={this.formats}
                  onChange={this.handleChange}
                  defaultValue={item.content}
                  readOnly={true}
                >
                  <div className='my-editing-area'/>
                </ReactQuill>   
              </div>
            </Panel>) 
            })
          }
          </Collapse>   
          </div>
        </div>
      </div>
    );
  }
}
export default Update;
