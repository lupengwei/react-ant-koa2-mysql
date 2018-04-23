import React, { Component } from "react";
import _ from "lodash";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // ES6
// import moment from "moment";
import Cookies from "js-cookie";
// import { Link } from "react-router-dom";
import {
  createQuestion,
	getQuestion,
	deleteQuestion,
	searchQuestionType,
	updateQuestion
} from "../../services/api";

import {
	Table,
	Form,
	Input,
	Button,
	Modal,
	Select,
	Spin,
	message,
	Popconfirm,
} from "antd";

import  "./Common.less";
const FormItem = Form.Item;
const Option = Select.Option;

class Manage extends Component {
	constructor(props) {
		super();
		this.state = {
			loading: true,
			visible:false,
			reloadChecked: 0, // 检查渲染条件
			isBelongOfProject: false,
			dataSource: [],
			modifyQuestionHtml: null,
			text:'',
			params:""
		};
	}
	componentDidMount() {
		this.getQuestionMsg();
		this.searchQuestionTypeMsg();
	}
	compoentWillUpdate(nextProps, nextState) {
    //更新组件
    if(nextState.reloadChecked !== this.state.reloadChecked) {
      this.setState({ modifyHonorHtml: null, loading: true });
      this.handleSearchHonors();
    }
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
      this.setState({ typeName: tempArray, loading: false });
    })
  }
  
  onChildChanged=(newState)=>{
    // 监听子组件的状态变化
    this.setState({ reloadChecked: newState });
  }
  getQuestionMsg(){
    getQuestion().then((res)=>{
      let datas= res.jsonResult.question;
      datas = _.sortBy(datas, [function(o)  { return -o.id; }]);
      // console.log(datas); 
      let tempArray = [];
			datas.map((item, key) => {
        let tempJson = {};
        tempJson.id=item.id
				tempJson.key = key+1;
				tempJson.title = item.title;
				tempJson.flag = item.flag;
				tempJson.content = item.content;
				tempJson.projectId = item.projectId;
				tempJson.projectName = item.projectName;
				tempJson.type = item.type;
				tempArray.push(tempJson);
				return datas;
			})
      this.setState({ dataSource: tempArray, loading: false });
    })
  }
  handleDeleteQuestion=(params)=> {
    console.log(params);
    var id=params.id;
    console.log(id);
    deleteQuestion(id).then(res => {
      message.success("删除成功！");
      setTimeout(() => {
        this.getQuestionMsg();
      }, 1000)
    });
  }
	handleModifyQuestion=(params)=> {
		this.setState({ params:params,
			visible:true,
		});
	}
	handleSubmitre=( ) =>	{
		let projectId = Cookies.get("projectId");
		let projectName = Cookies.get("projectName");
	 if (!projectId) return message.warning("获取项目信息失败，请刷新重试！");
	 this.props.form.validateFieldsAndScroll((errors, formDatas) => {
			if (errors) return message.warning("填写内容有问题，请仔细一一检查！");
			let datas = {
				projectId: projectId,
				projectName: projectName,
				title: formDatas.title,
				content:this.state.value,
				flag: formDatas.flag,
				type: formDatas.type,
			};
			updateQuestion(this.state.params.id,JSON.stringify(datas)).then(res => {
				message.success("问题修改成功！");
				this.handleCancelre();
				this.getQuestionMsg();
			});
	 });
 }
 handleChangere = (value) => {
	 console.log(value);
	 this.setState({value:value})
 };
 handleCancelre=(e)=> {
	this.setState({ visible: false});
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
	let props = this.props;
	const { getFieldProps } = props.form;
	const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 2 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 22 },
			}
	};
	const events = {
		'text-change': delta => {
			console.log(delta)
		}
	}
		let state = this.state;
		const columns = [
			{
				title: "序号",
				width:"10%",
				dataIndex: "key",
				key: "key",
			},
			{
				title: "问题名称",
				width:"40%",
				dataIndex: "title",
				key: "title"
			},
		
			{
				title: "问题类型",
				width:"20%",
				dataIndex: "type",
				key: "type"
			},
			{
				title: "操作",
				width:"30%",
				dataIndex: "option",
				key: "option",
				render: (text, value) => {
						return (
							<span>
								<Button style={{marginRight:20}}
									type="primary"
									size="small"
									onClick={this.handleModifyQuestion.bind(null, value)}
								>
									修改
								</Button>
								<Popconfirm 
									placement="left"
									title="确定要删除该信息吗？"
									onConfirm={this.handleDeleteQuestion.bind(null, value)}
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
					<div style={{ paddingTop:33,marginBottom: 15 }}>
						<CreateQuestionInfo
							callbackParent={this.onChildChanged}
							initialChecked={this.state.reloadChecked}
						/>
					</div>
					<div>
				<Modal
					title="新增问题信息"
					visible={state.visible}
					onCancel={this.handleCancelre}
					footer=""
					width="999px"
				>
					<div >
			  <Form horizontal="true" >
				<FormItem
					{...formItemLayout}
					style={{ marginBottom: 10 }}
					label="标题"
				><Input
						{...getFieldProps("title", {
							initialValue: this.state.params.title||"",
							rules: [{ required: true, message: "请输入标题" }]
						})}
						placeholder="请输入内容"
					/>
				</FormItem>
				<FormItem
					{...formItemLayout}
					style={{ marginBottom: 10 }}
					label="标签"
				>
					<Input
						{...getFieldProps("flag", {
							initialValue: this.state.params.flag||"",
							rules: [{ required: true, message: "请输入标签，多个标签，分隔开..." }]
						})}
						placeholder="请输入内容"
					/>
				</FormItem>
						<FormItem
							{...formItemLayout}	label="类型"
							>
									<Select 
									{...getFieldProps('type', {
											rules: [{ required: true, message: '必填项!' }],
											initialValue: this.state.params.type||"",
									})}	
									>
									{/* 全部为设置的类型 */
								_.map(this.state.typeName, (item, key) => {
									return (
										<Option key={key} value={item.name}> {item.name}</Option>
									);
								})
							}
									</Select>
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
								onChange={this.handleChangere}
								defaultValue={this.state.params.content||""}
								placeholder="请输入内容"
							>
							</ReactQuill>
						</FormItem>
						<FormItem wrapperCol={{ span: 14, offset: 6 }} style={{ marginTop: 24 }}>
							<Button type="primary" onClick={this.handleSubmitre.bind(null, 'onlyOne')}>提交信息</Button>
							<Button type="dashed"  onClick={this.handleCancelre} style={{marginLeft:95}}>放弃修改</Button>
						</FormItem> 
						</Form>
					</div>
				</Modal>
			</div>
				<Table
					loading={this.state.loading}
					className="desp-table-container desp-table-center-container"
					dataSource={this.state.dataSource} 
					rowKey={record => Math.random()}
					columns={columns}
				/>
				{state.modifyQuestionHtml}
			</div>
		);
	}
}
////、、、、、、增加
class CreateQuestionInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			uploadLoading: false,
			visible: false,
			reloadChecked:this.props.initialChecked || 0, //用于父组件更新this.props.initialChecked
			value:"",
			dataName:[],
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
			this.setState({ dataName: tempArray, loading: false });
      let newState = this.state.reloadChecked+1;
      this.setState({ reloadChecked: newState });
      this.props.callbackParent(newState);
    })
  }
	showModal=()=> {
		this.setState({ visible: true });
	}
	handleCancel=()=>	{
		this.setState({ visible: false });
	}
	handleSubmit=()=>	{
		 let projectId = Cookies.get("projectId");
		 let projectName = Cookies.get("projectName");
	  	if (!projectId) return message.warning("获取项目信息失败，请刷新重试！");
		this.props.form.validateFieldsAndScroll((errors, formDatas) => {
			 if (errors) return message.warning("填写内容有问题，请仔细一一检查！");
			 let datas = {
				 projectId: projectId,
				 projectName: projectName,
				 title: formDatas.title,
				 content:this.state.value,
				 flag: formDatas.flag,
				 type: formDatas.type,
			 };
			 let newState = this.state.reloadChecked+1;
			 this.setState({ reloadChecked: newState });
			 this.handleCancel();
			 createQuestion(JSON.stringify(datas)).then(res => {
				 message.success("问题添加成功！");
				 this.props.callbackParent(newState);
				 this.handleCancel();
			 });
		});
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
					sm: { span: 2 },
				},
				wrapperCol: {
					xs: { span: 24 },
					sm: { span: 22 },
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
				>
					新增问题
				</Button>
				<Modal
					title="新增问题信息"
					visible={state.visible}
					onCancel={this.handleCancel}
					footer=""
					width="999px"
				>
					<Spin spinning={state.loading || state.uploadLoading}>
						<Form horizontal="true" >
							<FormItem
								{...formItemLayout}
								style={{ marginBottom: 10 }}
								label="标题"
							>
								<Input
									{...getFieldProps("title", {
										initialValue: "",
										rules: [{ required: true, message: "请输入标题" }]
									})}
									placeholder="请输入内容"
								/>
							</FormItem>
							<FormItem
								{...formItemLayout}
								style={{ marginBottom: 10 }}
								label="标签"
							>
								<Input
									{...getFieldProps("flag", {
										initialValue: "",
										rules: [{ required: true, message: "请输入标签，多个标签，分隔开..." }]
									})}
									placeholder="请输入内容"
								/>
							</FormItem>
						 
							<FormItem
								{...formItemLayout}	label="类型"
								>
										<Select 
										{...getFieldProps('type', {
												rules: [{ required: true, message: '必填项!' }],
												initialValue: '',
										})}	
										>
										{/* 全部为设置的类型 */
                  _.map(this.state.dataName, (item, key) => {
                    return (
                      <Option key={key} value={item.name}> {item.name}</Option>
                    );
                  })
                }
										</Select>
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
                </ReactQuill>
							</FormItem>
							<FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
										<Popconfirm title="确定要提交该消息吗？" onConfirm={this.handleSubmit.bind(null, 'onlyOne')}>
												<Button type="primary">提交信息</Button>
										</Popconfirm>
										<Popconfirm title="确定要提交该消息并继续创建下一条吗？" onConfirm={this.handleSubmit.bind(null, 'more')}>
												<Button type="dashed" style={{marginLeft:95}}>保存并创建下一条</Button>
										</Popconfirm>
								</FormItem> 
						</Form>
					</Spin>
				</Modal>
			</span>
		);
	}
}
CreateQuestionInfo = Form.create()(CreateQuestionInfo);
Manage = Form.create()(Manage);

export default Manage;
