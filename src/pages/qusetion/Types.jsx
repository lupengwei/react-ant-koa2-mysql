import React, { Component } from "react";
import _ from "lodash";
//import moment from "moment"; 
import Cookies from "js-cookie";
import {
  Table,
  Input,
  Button,
  Icon,
  Row,Col,
  message,
  Popconfirm,
  Form,
  Modal
} from "antd";

import {
  createQuestionType,
  getQuestionType,
  deleteQuestionType,
  searchQuestionItem
} from "../../services/api";

// import styles from "./Common.less";
const  FormItem = Form.Item;

// main
class Manage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isBelongOfProject: false,
      dataSource: [],
      data: [],
      value:"",
      modifyUpdateHtml: null

    };
  }
  componentDidMount() {
		this.getQuestionTypeMsg();
  }
  componentWillUpdate(nextProps, nextState) {
    //更新组件
    if(nextState.reloadChecked !== this.state.reloadChecked) {
      this.setState({  loading: true });
      this.getQuestionTypeMsg();
    }
  }
  onChildChanged=(newState)=>{
    // 监听子组件的状态变化
    this.setState({ reloadChecked: newState });
  }
  getQuestionTypeMsg(){
    getQuestionType().then((res)=>{
      let datas= res.jsonResult.questionType;
      datas = _.sortBy(datas, [function(o)  { return o.id; }]);
      console.log(datas); 
      let tempArray = [];
			datas.map((item, key) => {
        let tempJson = {};
        tempJson.id=item.id
				tempJson.key = key+1;
				tempJson.name = item.name;
				tempJson.projectId = item.projectId;
				tempJson.projectName = item.projectName;
				tempArray.push(tempJson);
				return datas;
      })
      let projectId = Cookies.get("projectId");
      if( !tempArray[0].projectId  && projectId!==tempArray[0].projectId) return message.warning('请选择当前项目')
        this.setState({ dataSource: tempArray, loading: false });
       console.log(this.state.dataSource)
    })
  }
  handleDeleteQuestionType=(params)=> {
    searchQuestionItem(params.name).then((res)=>{
      let datas= res.jsonResult.question;
      datas = _.sortBy(datas, [function(o)  { return o.id; }]);
      console.log(datas); 
      let tempArray = [];
      datas.map((item, key) => {
        let tempJson = {};
        tempJson.name = item.title;
        tempArray.push(tempJson);
        return datas;
      })
      this.setState({ data: tempArray})
      if(_.size(tempArray)===0) {
        deleteQuestionType(params.id).then(res => {
          message.success("删除成功！");
         setTimeout(() => {
         window.location.reload();
         }, 100)})
      }else{
        Modal.warning({
          title: '当前类型下还有问题,无法删除！',
          content: '如需删除，请删除当前类型下所有问题！',
        });
      }
    })
  }
  handleSubmit=()=>{
    let projectId =   Cookies.get("projectId");
    let projectName = Cookies.get("projectName");
    this.props.form.validateFieldsAndScroll((errors, formDatas) => {
      if(!formDatas.types) return message.warning("请请填写文档类型")
      let datas = {
        projectId: projectId,
        projectName: projectName,
        name: formDatas.types,
      };
      createQuestionType(JSON.stringify(datas)).then(res => {
         setTimeout(() => {
          window.location.reload();
          message.success("问题类型添加成功！");
          this.getQuestionTypeMsg();
         }, 100);
    });
  })
 }
  render() {
    const { getFieldProps } = this.props.form;
		const formItemLayout = {
				labelCol: {
					xs: { span: 24 },
					sm: { span: 4 },
				},
				wrapperCol: {
					xs: { span: 24 },
					sm: { span: 20},
				}
		};
    const columns = [
      {
        title: "序号",
        width:"10%",
        dataIndex: "index",
        key: "index",
        render: (text, value, index) => {
          return index + 1;
        }
      },
      {
        title: "问题类型",
        width:"50%",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "操作",
        width:"40%",
        dataIndex: "option",
        key: "option",
        render: (text, value) => {
            return (
              <span>
                <Popconfirm 
                  placement="left"
                  title="确定要删除该信息吗？"
                  onConfirm={this.handleDeleteQuestionType.bind(null, value)}
                >
                  <Button type="danger" size="small">
                    删除
                  </Button>
                </Popconfirm>
              </span>
            )
          }
      }
    ];
    return (
      <div>
        <div style={{ paddingTop:30,marginBottom: 10}}>
          <Row>
            <Col span="2"/>
            <Col span="10"> 
              <Form horizontal="true" >
                <FormItem
                  {...formItemLayout}
                  label="问题类型"
                >
                  <Input
                    {...getFieldProps("types", {
                      initialValue: "",
                    })}
                    placeholder="请输入名称"
                  />
                </FormItem> 
              </Form>
           </Col>
           <Col span="1"/>
            <Col span="10"> <  Button type="primary" style={{marginTop:3}} onClick={this.handleSubmit}><Icon type="plus-circle-o" />增加问题类型</Button>
            </Col>
          <Col span="1"/>
          </Row>
        </div>
        <Table
          loading={this.state.loading}
          className="desp-table-container desp-table-center-container"
          dataSource={this.state.dataSource} 
          rowKey={record => Math.random()}
          columns={columns}
        /> 
        {this.state.modifyUpdateHtml}
      </div>
    );
  }
}

Manage = Form.create()(Manage);
export default Manage;

 //