import React from 'react';
import _ from 'lodash';
// import moment from 'moment'; 
import Cookies from 'js-cookie';
import { DatePicker,Button, message, Select, Form ,Input,Modal, Radio, Table } from 'antd';

import { createFeedBackOrder, getFeedBackOrders ,createFeedBackMassage} from '../../services/api';

// import styles from './Common.less';

//ant初始组件
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
// const { MonthPicker, RangePicker} = DatePicker;

//main
class CreateFeedBackOrder extends React.Component{
	constructor() {			 
		super();			 
		this.state = {
				visible: false,
				visible1: false,
				loading: true,
				taskDatas: [],
				id:'',
				visibleAccept:false,
				date:'',
				datas:"",
		}
	}
	componentDidMount() {
		this.showFeedBack();
	}
	showModal = () => {
		this.setState({ visible: true });
	}
	handleCancel = () => {
	 this.setState({ visible: false });
	}
	showModalOpen=(value)=> {
		this.setState({ 
			visible1: true ,
			id:value.id,
			datas:value,
		});
	}
	handleCancel1 = () => {
		this.setState({ visible1: false });
	}
		
	showFeedBack() {
		let _self = this;
		getFeedBackOrders().then((res) => {
			let datas = res.jsonResult.feedback.date;
			console.log(datas);
			
			datas = _.sortBy(datas, [function(o) { return -o.id; }]);
			let tempArray = [];
			console.log(datas);
			datas.map((item, key) => {
				let tempJson = {};
				tempJson.id=item.id;
				tempJson.key = key+1;
				tempJson.content = item.content;
				tempJson.reply = item.reply;
				tempJson.name = item.User;
				tempJson.modal =  item.modal;
				tempJson.accept =  item.accept;
				tempJson.people = '';
				tempJson.status =  item.status;
				tempJson.date = item.date;
				tempArray.push(tempJson);
				return datas;
			})
			console.log(tempArray);
			_self.setState({ taskDatas: tempArray, loading: false });
						 
		})
	}
	handleSubmit=(params)=> {
		let formData	= this.props.form.getFieldsValue();
		if(!formData.opinion) return message.warning('请输入必要的反馈信息，谢谢!');
		let _self = this;
		this.props.form.validateFieldsAndScroll((errors, formDatas) => {
			let projectId = Cookies.get("projectId");
      let projectName = Cookies.get("projectName");
      if(!projectId) return message.warning('请选择当前项目')
      let datas = {
        projectId:projectId,
        projectName:projectName,
				content: formDatas.opinion,
				modal: formDatas.modal
				}
				_self.setState({ loading: true });
				console.log(datas);
				createFeedBackOrder(JSON.stringify(datas)).then((res) => {
						message.success("反馈意见提交成功，感谢您的参与！");
						_self.setState({ loading: false });
						setTimeout(() => {
								_self.showFeedBack();
								_self.props.form.resetFields();
								if(params !== 'more') _self.setState({ visible: false }); //无更多的时候
						}, 1000)
				})
		})
	}
	handleSubmitOpention=()=> {
		let formDatas	= this.props.form.getFieldsValue();
			console.log(formDatas);
			if(formDatas.accept === '不接受'){
				formDatas.status=null;
				formDatas.time=null
			}
      let datas = {
				date:formDatas.time,// moment(formDatas.time).format('YYYY-MM-DD'),
				reply: formDatas.reply,
				status: formDatas.status,
				accept: formDatas.accept,
				};
				console.log(datas)
				var	_self = this;
			_self.setState({ loading: true });
			var id= this.state.id;
			createFeedBackMassage(id,JSON.stringify(datas)).then((res) => {
				message.success("反馈意见提交成功，感谢您的参与！");
				_self.setState({ loading: false });
				setTimeout(() => {
					_self.showFeedBack();
					_self.props.form.resetFields();
					_self.setState({ visible1: false })
				}, 1000)
			})
		;
	}
	onSelect (e) {
		let formData	= this.props.form.getFieldsValue();
		setTimeout(() => {
			if(formData.accept ==="接受") {
				this.setState({visibleAccept:false})
			}else{
				this.setState({visibleAccept:true})
			}
		}, 10)
		
	}
	render() {
		const { getFieldProps } = this.props.form;
		const columns = [{
			title: '序号',
			dataIndex: 'key',
			width: '100px'
		}, {
			title: '留言者',
			dataIndex: 'name',
			width: '120px'
		}, {
		}, {
			title: '所属模块',
			dataIndex: 'modal',
			width: '160px'
		}, {
		}, {
			title: '反馈意见',
			dataIndex: 'content',
			width: '5000px'
					},{
		}, {
			title: '是否接受',
			dataIndex: 'accept',
			width: '100px'
		},	{
		}, {
			title: '处理意见',
			dataIndex: 'reply',
			width: '500px'
		},	{
		}, {
			title: '状态',
			dataIndex: 'status',
			width: '120px'
		},
		{
			title: '完成时间',
			dataIndex: 'date',
			width: '190px'
		}, 
		{
			title: '处理人',
			dataIndex: 'people',
			width: '120px'
		},
		{
			title: '操作',
			dataIndex: 'operation',
			width: '50px',
			render: (text, value) => {
				return (
					this.state.taskDatas.length > 1 ?
							<Button onClick={this.showModalOpen.bind(null,value)} size="small"type="primary">反馈</Button>
						: null
				);
			},
		}
		];
		const formItemLayout = {
				labelCol: {
					xs: { span: 24 },
					sm: { span: 5 },
				},
				wrapperCol: {
					xs: { span: 24 },
					sm: { span: 19 },
				}
		};
		return (
			<div className="des-body-container">
				<div className="creat-op"> <Button type="primary" onClick={this.showModal}>反馈意见</Button>
			</div>
			<Modal
				visible={this.state.visible}
				title="反馈意见"
				width="666px"
				onCancel={this.handleCancel}
				footer=" "
				>
				<Form horizontal="true">
						<FormItem	{...formItemLayout} label="所属模块：" >
								<Input	type="textarea" placeholder="请输您要反馈的模块..." {...getFieldProps('modal',{
										rules: [{ required: true, message: '请输入处理意见!' }],
								})}/>
						</FormItem>
								<FormItem {...formItemLayout}	label="意见内容：">
								<TextArea type="textarea"	rows={4} placeholder="请输入您的意见反馈信息" 
								{...getFieldProps('opinion',{
										rules: [{ required: true, message: '请输入处理意见!' }],
								})} />
						</FormItem>
						<FormItem	{...formItemLayout} label="注 ：" >
								<div className="login-form-forgot" >为提高处理的效率和效果，请按照所属模块逐条填写,谢谢！</div>
						</FormItem>
						
				</Form>
				<FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
					<Button onClick={this.handleSubmit.bind(null, 'onlyOne')} type="primary">保存</Button>
					<Button type="dashed" onClick={this.handleSubmit.bind(null, 'more')} style={{marginLeft:55}}>保存并创建下一条</Button>
				</FormItem> 
			</Modal>
			
			<Modal
				title="反馈处理"
				okText="提交"
				cancelText="取消"
				onCancel={this.handleCancel1}
				onOk={this.handleSubmitOpention.bind(this)}
				width="666px"
				visible={this.state.visible1}
				>
				<Form	horizontal="true" >
						<div >
								<FormItem
								{...formItemLayout}	label="是否接受："
								>
										<Select  onSelect={this.onSelect.bind(this)}
										{...getFieldProps('accept', {
												rules: [{ required: true, message: '必填项!' }],
											  initialValue: this.state.datas.accept||"",
										})}	
										>
										<Option	value="接受">接受</Option>
										<Option value="不接受">不接受</Option>
										</Select>
								</FormItem>
						</div>
						{this.state.visibleAccept?
								( <div>
										<FormItem {...formItemLayout}	className="collection-create-form_last-form-item" label="状态：" >
										<Radio.Group {...getFieldProps('status', {
										rules: [{	 message:	'请先选择是否接受!' }],
									  initialValue: this.state.datas.status||" ",
										})}	>
										<Radio value="进行中">进行中</Radio>
										<Radio value="待开发">待开发</Radio>
										<Radio value="已完成">已完成</Radio>
										</Radio.Group>
										</FormItem>
										<FormItem
											{...formItemLayout}
											label="预计完成时间"
										>
											<DatePicker
												{...getFieldProps("time", { type: 'object',
												message: "请选择时间!",
												// state.honorDatas.date ? state.honorDatas.sjrq : moment().format('YYYY-MM-DD')
												// initialValue: this.state.datas.time ? this.state.datas.time : moment().format('YYYY-MM-DD')||"",
												})}
												placeholder="请选择预计完成日期"
											/>
										</FormItem>
								  </div>	) 
								: null}
								<FormItem	{...formItemLayout} label="处理意见">
									   <TextArea type="textarea"	rows={5} placeholder="请输入您的处理意见信息" {...getFieldProps('reply',{
											rules: [{ required: true, message: '请输入处理意见!' }],
											initialValue: this.state.datas.reply||"",
									})}/>
								</FormItem>
						</Form>
					</Modal>
					<Table  style={{paddingTop:18}}
						columns={columns}
						dataSource={ this.state.taskDatas}
						className="desp-table-container desp-table-center-container"
						pagination={{ pageSize: 20 }}
						rowKey={record => Math.random()} 
					/>
			</div>
		)
	}
};
CreateFeedBackOrder = Form.create()(CreateFeedBackOrder);
export default CreateFeedBackOrder;
