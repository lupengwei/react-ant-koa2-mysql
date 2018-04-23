import React, { Component } from "react";
import _ from "lodash";
//import moment from "moment";
import Cookies from "js-cookie";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // ES6
import {
  Table,
  Form,
  Input,
  Button,
  Icon,
  Modal,
  Spin,
  message,
  Popconfirm,
  DatePicker
} from "antd";

import {
  createUpdate,
  getUpdate,
  deleteUpdate,
} from "../../services/api";


import "./Common.less";
const FormItem = Form.Item;
class Manage extends Component {
  constructor(props) {
    super();
    this.state = {
      loading: false,
      reloadChecked: 0, // 检查渲染条件
      isBelongOfProject: false,
      taskDatas: [],
    };
    this.editor=null;
  }
  componentDidMount() {
		this.getUpdateMsg();
  }
  componentWillUpdate(nextProps, nextState) {
    //更新组件
    if(nextState.reloadChecked !== this.state.reloadChecked) {
      this.setState({  loading: true });
      this.getUpdateMsg();
    }
  }
  onChildChanged=(newState)=>{
    // 监听子组件的状态变化
    this.setState({ reloadChecked: newState });
  }
  getUpdateMsg(){
    getUpdate().then((res)=>{
      let datas= res.jsonResult.update;
      datas = _.sortBy(datas, [function(o)  { return -o.id; }]);
      console.log(datas); 
      let tempArray = [];
			datas.map((item, key) => {
        let tempJson = {};
        tempJson.id=item.id
        tempJson.projectName=item.projectName
				tempJson.key = key+1;
				tempJson.version = item.version;
				tempJson.people = item.people;
				tempJson.date = item.date;
				tempArray.push(tempJson);
				return datas;
			})
      this.setState({ taskDatas: tempArray, loading: false });
      // console.log(this.state.taskDatas)
    })
  }
  handleDeleteUpdate=(params)=> {
    console.log(params);
    var id=params.id;
    console.log(id);
    deleteUpdate(id).then(res => {
      message.success("删除成功！");
      setTimeout(() => {
        this.getUpdateMsg();
      }, 1000)
    
    });
   
  }
 


  render() {
    const columns = [
      {
        title: "序号",
        width:"10%",
        dataIndex: "key",
        key: "key",
      },
      {
        title: "版本信息",
        width:"20%",
        dataIndex: "version",
        key: "version"
      },
      {
        title: "所属项目",
        width:"20%",
        dataIndex: "projectName",
        key: "projectName"
      },
      {
        title: "发布时间",
        width:"20%",
        dataIndex: "date",
        key: "date"
      },
      {
        title: "发布人",
        width:"20%",
        dataIndex: "people",
        key: "people"
      },
      {
        title: "操作",
        width:"30%",
        dataIndex: "option",
        key: "option",
        render: (text, value) => {
            return (
              <span>
                <Popconfirm 
                  placement="left"
                  title="确定要删除该信息吗？"
                  onConfirm={this.handleDeleteUpdate.bind(null, value)}
                >
                  <Button type="danger"  size="small">
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
        <div ref="textarea"></div>
        <div style={{ paddingTop:33,marginBottom: 15 }}>
            <CreateUpdateInfo
            callbackParent={this.onChildChanged}
            initialChecked={this.state.reloadChecked}
            />
        </div>
        <Table
          loading={this.state.loading}
          className="desp-table-container desp-table-center-container"
          dataSource={this.state.taskDatas} 
          rowKey={record => Math.random()} 
          columns={columns}
        /> 
        {this.state.modifyUpdateHtml}
      </div>
    );
  }
}

class CreateUpdateInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value:'请选择序号列表分行填写，谢谢！',
      loading: false,
      uploadLoading: false,
      visible: false,
      reloadChecked: this.props.initialChecked || 0, //用于父组件更新
      // reloadChecked: 0, //用于父组件更新this.props.initialChecked
      fileUrl: null, // 文件链接地址
      qiniuToken: null // 七牛token
    };
  }
  componentWillReceiveProps(nextProps) {}
  showModal=()=> {
    this.setState({ visible: true });
  }
  handleCancel =()=>  {
    this.setState({ visible: false });
  }
  handleSubmit=()=>  {
    let _self = this;
    _self.props.form.validateFieldsAndScroll((errors, formDatas) => {
      if (errors) return message.warning("填写内容有问题，请仔细一一检查！");
      let projectId = Cookies.get("projectId");
      let projectName = Cookies.get("projectName");
      if(!projectId) return message.warning('请选择当前项目')
      let datas = {
        projectId:projectId,
        projectName:projectName,
        people: formDatas.people,
        content: this.state.value,
        date: formDatas.date,
        version: formDatas.version,
      };
      let newState = ++_self.state.reloadChecked;
      _self.setState({ reloadChecked: newState });
      createUpdate(JSON.stringify(datas)).then(res => {
        message.success("版本信息增加成功！");
        _self.handleCancel();
        _self.props.callbackParent(newState);
      });
    });
  }
  handleFileUrl(url) {
    this.setState({ fileUrl: url });
  }
  handleChange = (value) => {
    console.log(value);
    this.setState({value:value})
  };
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
    let props = this.props,
      state = this.state;
    const { getFieldProps } = props.form;
    const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4},
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 },
        }
    };
    const events = {
      'text-change': delta => {
        console.log(delta)
      }
    }
    return (
      <span>
        <Button
          type="primary"
          onClick={this.showModal}
          style={{ marginLeft: 15 }}
        ><Icon type="plus-circle-o" />
          发布新版本信息
        </Button>
        <Modal
          title="新增版本更新信息"
          visible={state.visible}
          onCancel={this.handleCancel}
          footer=""
          width="999px"
        >
          <Spin spinning={state.loading || state.uploadLoading}>
            <Form horizontal="true">
              <FormItem
                {...formItemLayout}
                style={{ marginBottom: 10 }}
                label="版本号"
              >
                <Input
                  {...getFieldProps("version", {
                    initialValue: "",
                    rules: [{ required: true, message: "请输入版本号 如：1.3.4" }]
                  })}
                  placeholder="请输入版本号 如：1.3.4"
                />
              </FormItem>
              <FormItem
                {...formItemLayout}
                style={{ marginBottom: 10 }}
                label="发布人"
              >
                <Input
                  {...getFieldProps("people", {
                    initialValue: "",
                    rules: [{ required: true, message: "请输入发布人" }]
                  })}
                  placeholder="请输入发布人"
                />
              </FormItem>
             
              <FormItem
                {...formItemLayout}
                style={{ marginBottom: 10 }}
                label="更新日期"
              >
                <DatePicker
                  {...getFieldProps("date", {
                    rules: [
                      {
                        required: true,
                        message: "请选择更新日期",
                        type: "object"
                      }
                    ]
                  })}
                  placeholder="请选择更新日期"
                />
              </FormItem>
              <FormItem
								{...formItemLayout}
								style={{ marginBottom: 10 }}
								label="内容："
							>
                <ReactQuill
                      theme="snow"
                      events={events}
                      modules={this.modules}
                      formats={this.formats}
                      onChange={this.handleChange}
                      defaultValue={this.state.value}
                      placeholder="请输入内容"
                    >
                    {/* <div className="my-editing-area"/> */}
                </ReactQuill>
							</FormItem>
              <FormItem
                wrapperCol={{ span: 16, offset: 6 }}
                style={{ marginTop: 24 }}
              >
                <Button
                  type="dashed"
                  style={{ marginRight: 335 }}
                  onClick={this.handleCancel}
                >
                  取消
                </Button>
                <Popconfirm
                  title="确定要提交该新增信息吗？"
                  onConfirm={this.handleSubmit}
                >
                  <Button type="primary">提交信息</Button>
                </Popconfirm>
              </FormItem>
            </Form>
          </Spin>
        </Modal>
      </span>
    );
  }
}

CreateUpdateInfo = Form.create()(CreateUpdateInfo);

export default Manage;

