import React, { Component } from "react";
import _ from "lodash";
// import moment from "moment";
import Cookies from "js-cookie";
// import { Link } from "react-router-dom";
import {
  Input,
  // Button,
  Icon,
  Modal,
  Row,
  Col,
  message,
  Form,
  Select,
  Button,Tooltip
} from "antd";
import {
  createOnline,
  updateOnline,
  createOnlineType,
	deleteOnlineType,
	deleteOnline,
  searchOnlineType,
  searchOnline,
  searchOnlineItem
} from "../../services/api";
// const Search = Input.Search;
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;


class Manage extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      visible: false,
      visible1: false,
      dataSource: [],
      dateDocument:[],
      filedate:[],
      itemName:'',
      datas:[],
      visibleChange: false,
      dateChange:""
    };
  }
  componentDidMount() {
    this.searchOnlineTypeMsg();
    this.showPeresentOnline();
  }
  showPeresentOnline(){
    let projectId = Cookies.get("projectId");
    if (!projectId) return message.warning("请选择您要查询的项目");
    searchOnline(projectId).then((res)=>{
      let datas= res.jsonResult.online;
      datas = _.sortBy(datas, [function(o)  { return -o.id; }]);
      console.log(datas); 
      let tempArray = [];
      datas.map((item, key) => {
        let tempJson = {};
        tempJson.id=item.id
        tempJson.key = key+1;
        tempJson.name = item.name;
        tempJson.url = item.url;
        tempJson.type = item.type;
        tempJson.version = item.version;
        tempJson.documentId = item.documentId;
        tempJson.projectId = item.projectId;
        tempArray.push(tempJson);
        return datas;
      })
      this.setState({ filedate: tempArray, loading: false });
        console.log(this.state.filedate)
    })
  }
  delteitemOnline=(params)=> {
    confirm({
        title: '确定要删除这个文档吗？',
        content: '这是个危险的操作！！！',
        okText: '是的',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          deleteOnline(params).then(res => {});
          message.success("删除成功")   
        },
      onCancel() {
        console.log('Cancel');
      }, 
    });
    this.showPeresentOnline();
    }
    showModal=()=> {
      this.setState({ visible: true });
    }
    handleCancel=()=>	{
      this.setState({ visible: false });
    }
    showModalmsg=()=> {
      this.setState({ visible1: true });
    }
    handleCancelmsg=()=>	{
      this.setState({ visible1: false });
    }
    delteitemOnlineType =(params)=>{
      console.log(params);
       searchOnlineItem(params.name).then((res)=>{
        let datas= res.jsonResult.online;
        datas = _.sortBy(datas, [function(o)  { return o.id; }]);
        console.log(datas); 
        let tempArray = [];
        datas.map((item, key) => {
          let tempJson = {};
          tempJson.id=item.id
          tempJson.key = key+1;
          tempJson.name = item.name;
          tempJson.url = item.url;
          tempJson.type = item.type;
          tempJson.version = item.version;
          tempJson.documentId = item.documentId;
          tempJson.projectId = item.projectId;
            tempArray.push(tempJson);
          return datas;
        })
        this.setState({ data: tempArray})
      if(_.size(tempArray)===0) {
        deleteOnlineType(params.id).then(res => {
          message.success("删除成功！");
         setTimeout(() => {
         window.location.reload();
         }, 100)})
      }else{
        confirm({
          title: '当前类型下有文档,无法删除！',
          content: '如需删除，请删除当前类型下所有文档！',
          okText: 'ok',
          okType: 'danger',
          onOk() {
            deleteOnline(params).then(res => {});
            message.success("无法删除")   
          },
      });
      }
    })
  }
  searchOnlineTypeMsg(){
    let projectId = Cookies.get("projectId");
    if (!projectId) return message.warning("请选择您要查询的项目");
    searchOnlineType(projectId).then((res)=>{
      let datas= res.jsonResult.onlineType;
      datas = _.sortBy(datas, [function(o)  { return o.id; }]);
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
      this.setState({ dataSource: tempArray, loading: false });
        console.log(this.state.dataSource)
    })
  }

  onChangeUserName = (e) => {
    this.setState({itemName:e.target.value})
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
      createOnlineType(JSON.stringify(datas)).then(res => {
        setTimeout(()=>{
          window.location.reload();
          message.success("文档类型添加成功！");
          this.searchOnlineTypeMsg();
        })
      });
    })
  }
  handleList=()=>	{
    let _self = this;
    let projectId = Cookies.get("projectId");
    let projectName = Cookies.get("projectName");
     if (!projectId) return message.warning("获取项目信息失败，请刷新重试！");
    _self.props.form.validateFieldsAndScroll((errors, formDatas) => {
      if (!formDatas.url||!formDatas.title||!formDatas.type) return message.warning("填写内容有问题，请仔细一一检查！");
      let datas = {
        projectId: projectId,
        projectName: projectName,
        title: formDatas.title,
        url: formDatas.url,
        type: formDatas.type,
      };
      let newState = ++_self.state.reloadChecked;
      _self.setState({ reloadChecked: newState });
      createOnline(JSON.stringify(datas)).then(res => {
        message.success("文档添加成功！");
        this.showPeresentOnline();
        this.setState({ visible1: false });
      });
    });
  }
  handleListChange=()=>	{
    let _self = this;
    let projectId = Cookies.get("projectId");
    let projectName = Cookies.get("projectName");
     if (!projectId) return message.warning("获取项目信息失败，请刷新重试！");
     _self.props.form.validateFieldsAndScroll((errors, formDatas) => {
      if (!formDatas.urler||!formDatas.titleer||!formDatas.typeer) return message.warning("填写内容有问题，请仔细一一检查！");
      let datas = {
        projectId: projectId,
        projectName: projectName,
        name: formDatas.titleer,
        url: formDatas.urler,
        type: formDatas.typeer,
      };
      console.log(datas);
      updateOnline(this.state.dateChange.id,JSON.stringify(datas)).then(res => {
        message.success("文档修改成功！");
        this.showPeresentOnline()
      });
      this.setState({
        visibleChange:false
      })
    });
  }
  getDateItem=(value)=>{
   console.log(value);
     searchOnlineItem(value).then((res)=>{
      let datas= res.jsonResult.online;
      datas = _.sortBy(datas, [function(o)  { return o.id; }]);
      console.log(datas); 
      let tempArray = [];
			datas.map((item, key) => {
        let tempJson = {};
        tempJson.id=item.id
				tempJson.key = key+1;
				tempJson.name = item.name;
				tempJson.url = item.url;
				tempJson.type = item.type;
				tempJson.version = item.version;
				tempJson.documentId = item.documentId;
				tempJson.projectId = item.projectId;
					tempArray.push(tempJson);
				return datas;
      })
      this.setState({ filedate: tempArray, loading: false });
       console.log(this.state.filedate)
    })
  }
  changeDateItem=(item)=>{
    console.log(item)
    this.setState({
      visibleChange:true,
      dateChange:item
    })
  }
  handleCancel=()=>{
    this.setState({
      visibleChange:false
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
    return (
      <div >
         <Modal
              title="修改文档"
              visible={this.state.visibleChange}
              onCancel={this.handleCancel}
              footer=""
              width="555px"
            >
              <Form horizontal="true" >
                <FormItem
                  {...formItemLayout}
                  style={{ marginBottom: 10 }}
                  label="文档名称"
                >
                  <Input
                    {...getFieldProps("titleer", {
                      initialValue: this.state.dateChange.name,
                    })}
                    placeholder="请输入名称"
                  />
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  style={{ marginBottom: 10 }}
                  label="文件URL"
                >
                  <Input
                    {...getFieldProps("urler", {
                      initialValue: this.state.dateChange.url,
                    })}
                    placeholder="请输入URL地址"
                  />
                </FormItem>
                <FormItem
                  {...formItemLayout}	label="文档类型"
                  >
                    <Select 
                      {...getFieldProps('typeer', {
                          initialValue: this.state.dateChange.type,
                      })}	
                      >
                      {/* 全部为设置的类型 */
                    _.map(this.state.dataSource, (item, key) => {
                      return (
                        <Option key={key} value={item.name}> {item.name}</Option>
                      );
                    })
                  }
                  </Select>
                </FormItem>
                <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                  <Button type="primary" onClick={this.handleListChange} >提交信息</Button>
                  <Button type="dashed"  onClick={this.handleCancel}    style={{marginLeft:95}}>取消</Button>
                </FormItem> 
              </Form>
            </Modal>
        <Row gutter={22}>
          <Col  span={12}>
            <div className="bg-gray-box">文档类型列表 </div>
            <div className="online-box">
              <div style={{paddingBottom :20}}>
              <div className="online-button" onClick={this.showModal}> <Icon type="plus-circle-o" /> &nbsp;&nbsp;新增文档类型</div>
              <Modal
                title="新增文档类型"
                visible={this.state.visible}
                onCancel={this.handleCancel}
                footer=""
                width="555px"
              >
                <div>
                  <Form horizontal="true" >
                    <FormItem
                      {...formItemLayout}
                      style={{ marginBottom: 10 }}
                      label="文档类型"
                    >
                      <Input
                        {...getFieldProps("types", {
                          initialValue: "",
                        })}
                        placeholder="请输入名称"
                      />
                    </FormItem>
                    <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                      <Button type="primary" onClick={this.handleSubmit} >提交信息</Button>
                      <Button type="dashed" onClick={this.handleCancel} style={{marginLeft:95}}>取消</Button>
                    </FormItem> 
                  </Form>
                </div>
              </Modal>
            </div>
              <div className="task-lists">
                <ul className="task-lists">
                  {
                    _.map(this.state.dataSource, (item, key) => {
                      return  <li key={item.id} > 
                       <Tooltip placement="left" title="查看文档">
                          <div onClick={this.getDateItem.bind(null,item.name)}  >
                            <Col span={22}>
                              <span >{item.name}</span>
                            </Col>
                          </div>
                        </Tooltip>
                        <Col span={2} > 
                          <Tooltip placement="bottom" title="删除该文档类型">
                           <span><Icon  onClick={this.delteitemOnlineType.bind(null, item)}  className="deleteicon" type="close-circle-o" /></span> 
                          </Tooltip>
                        </Col>
                      </li> 
                    })
                  }
                </ul>
              </div>
              <div className="online-button" onClick={this.showModalmsg}> <Icon type="cloud-upload-o" /> &nbsp;&nbsp;录入文件</div>
            </div>
            <Modal
              title="新增文档"
              visible={this.state.visible1}
              onCancel={this.handleCancelmsg}
              footer=""
              width="555px"
            >
              <Form horizontal="true" >
                <FormItem
                  {...formItemLayout}
                  style={{ marginBottom: 10 }}
                  label="文档名称"
                >
                  <Input
                    {...getFieldProps("title", {
                      initialValue: "",
                    })}
                    placeholder="请输入名称"
                  />
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  style={{ marginBottom: 10 }}
                  label="文件URL"
                >
                  <Input
                    {...getFieldProps("url", {
                      initialValue: "",
                    })}
                    placeholder="请输入URL地址"
                  />
                </FormItem>
                <FormItem
                  {...formItemLayout}	label="文档类型"
                  >
                    <Select 
                      {...getFieldProps('type', {
                          initialValue: '',
                      })}	
                      >
                      {/* 全部为设置的类型 */
                    _.map(this.state.dataSource, (item, key) => {
                      return (
                        <Option key={key} value={item.name}> {item.name}</Option>
                      );
                    })
                  }
                  </Select>
                </FormItem>
                <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                  <Button type="primary" onClick={this.handleList} >提交信息</Button>
                  <Button type="dashed"  onClick={this.handleCancelmsg}    style={{marginLeft:95}}>取消</Button>
                </FormItem> 
              </Form>
            </Modal>
          </Col>
          <Col  span={12}>
            <div className="bg-gray-box">文档文件列表</div>
              <div className="online-box">
                <div className="task-lists">
                <ul className="task-lists">
                {
                  _.map(this.state.filedate, (item, key) => {
                    return   <li key={item.id} > 
                      <Tooltip placement="left" title="修改该文档">
                        <div onClick={this.changeDateItem.bind(null,item)}  >
                          <Col span={22}>
                            <span >{item.name}</span>
                          </Col>
                        </div>
                      </Tooltip>
                      <Col span={2} > 
                        <Tooltip placement="bottom" title="删除该文档">
                         <span><Icon  onClick={this.delteitemOnline.bind(null, item.id)}  className="deleteicon" type="close-circle-o" /></span> 
                        </Tooltip>
                      </Col>
                    </li> 
                  })
                }  
                </ul>
              </div>
            </div>           
          </Col>
        </Row>
      </div>
    );
  }
}
Manage = Form.create()(Manage);
export default Manage;
