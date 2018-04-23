// import React from 'react';
// import { Link } from 'react-router-dom';
// import _ from 'lodash';
// import moment from 'moment';

// import { Form,  Button, Icon,Input, message, Spin, Row, Col, Steps, Tabs, Popover, Modal, Timeline,  Upload, } from 'antd';
// import styles from './Common.less';

// import {
//   getFileTaskById,
//   // uploadFileOfFileTask,
//   // activeFileTask,
//   // getAllUsers
// } from '../../services/api';


// //ant组件
// const Step     = Steps.Step;
// const TabPane  = Tabs.TabPane;

// //子组件-显示通用任务

// class ShowFileTask extends React.Component{
//   constructor(props, context) {     
//     super(props, context);     
//     this.state = {
//       loading: false,
//       reloadChecked: this.props.initialChecked, //用于父组件更新
//       qiniuToken: '',
//       checkProcessComponents: '', //审批进度组件
//       taskData: {
//         id: '',
//         name: '',
//         description: '',
//         Owner: {
//           name: ''
//         },
//         Approver: {
//           name: ''
//         },
//         Auditor: {
//           name: ''
//         },
//         Files: [],
//         Comments: [],
//         LevelFourStages: [],
//       },
//       userChildren: [], //修改用
//       ownerId: '',
//       approverId: '',
//       auditorId: '',
//     };
//   }
//   componentDidMount() {
//     this.getFileTask(539);
//   }
//   componentWillReceiveProps(nextProps) {
//     if(nextProps.taskid !== this.props.taskid) return this.getFileTask(nextProps.taskid);
//   }
//   componentWillUpdate(nextProps, nextState) {
//     //更新组件
//     if(nextState.reloadChecked !== this.state.reloadChecked) return this.getFileTask(this.props.taskid);
//   }
//   onChildChanged(newState) {
//     //监听子组件的状态变化
//     this.setState({ reloadChecked: newState });
//   }
//   getFileTask(taskid){
//     var _self = this;

//     _self.setState({ loading: true });

//     getFileTaskById(taskid).then((res) => {
//       let datas = res.jsonResult.fileTask;
//        console.log(datas);
//       _self.setState({
//         taskData: datas,
      
//         loading: false
//       });
//     });
//   }
//   render() {
//     const props = {
//       name: 'file',
//       action: '//jsonplaceholder.typicode.com/posts/',
//       headers: {
//         authorization: 'authorization-text',
//       },
//       onChange(info) {
//         if (info.file.status !== 'uploading') {
//           console.log(info.file, info.fileList);
//         }
//         if (info.file.status === 'done') {
//           message.success(`${info.file.name} file uploaded successfully`);
//         } else if (info.file.status === 'error') {
//           message.error(`${info.file.name} file upload failed.`);
//         }
//       },
//     };
//     return (
//       <div >
//         <Row gutter={22}>
//           <Col  span={12}>
//             <div className="bg-gray-box">文档列表 </div>
//             <div className="online-box">
//               <div className="bg-search">
//                 <Input
//                   placeholder="请输入文档类型"
              
//                 />
//               </div>
//               <div className="task-lists">
//                 <ul className="task-lists">
//                   <li>需求方案 <span className="delete-icon"><Icon  type="close-circle-o" /></span></li>
//                   <li>解决方案 <span className="delete-icon"><Icon  type="close-circle-o" /></span></li>
//                   <li>使用说明书 <span className="delete-icon"><Icon  type="close-circle-o" /></span></li>
//                   <li>测试报告 <span className="delete-icon"><Icon  type="close-circle-o" /></span></li>
//                   <li>验收报告 <span className="delete-icon"><Icon  type="close-circle-o" /></span></li>
//                 </ul>
//               </div>
//               <div className="online-button"> <Icon type="plus-circle-o" />新增文档类型</div>
//             </div>
//           </Col>
//           <Col  span={12}>
//             <div className="bg-gray-box">上传文件</div>
//             <div className="online-box">
  
//               <div className="task-lists">
//                 <ul className="task-lists">
//                   <li>回款计划管理需求说明文件v1.1.0.docx <span className="delete-icon"><Icon  type="close-circle-o" /></span></li>
//                   <li>回款计划管理需求说明文件v1.1.0.docx <span className="delete-icon"><Icon  type="close-circle-o" /></span></li>
//                   <li>回款计划管理需求说明文件v1.1.0.docx <span className="delete-icon"><Icon  type="close-circle-o" /></span></li>
//                   <li>回款计划管理需求说明文件v1.1.0.docx <span className="delete-icon"><Icon  type="close-circle-o" /></span></li>
//                   <li>回款计划管理需求说明文件v1.1.0.docx <span className="delete-icon"><Icon  type="close-circle-o" /></span></li>
//                   <li>回款计划管理需求说明文件v1.1.0.docx <span className="delete-icon"><Icon  type="close-circle-o" /></span></li>
//                   <li>回款计划管理需求说明文件v1.1.0.docx <span className="delete-icon"><Icon  type="close-circle-o" /></span></li>
//                   <li>回款计划管理需求说明文件v1.1.0.docx <span className="delete-icon"><Icon  type="close-circle-o" /></span></li>
//                </ul>
//                <ShowFilesTab datas={this.state.taskData} />
//               </div>
//               <Upload {...props} >
//                 <div className="online-button"> <Icon type="cloud-upload-o" />上传文件</div>
//               </Upload>
//             </div>
            
//           </Col>
//         </Row>
//       </div>
//     );
//   }
// }
// class ShowFilesTab extends React.Component{
//   render() {
//     var props = this.props;
//     var isStableVersion = false,
//         isOldVersion    = false,
//         oldFiles        = [], //过程版本
//         stableFiles     = []; //发布版本
//     if(props.datas.Files.length !== 0){

//       //分离发布版本和过程版本
//       props.datas.Files.forEach(function(item){
//         item.status === 'accepted' ? isStableVersion = true : isOldVersion = true;
//         item.status === 'accepted' ? stableFiles.push(item) : oldFiles.push(item);
//       });

//     }

//     return (
//       <ul>
//         <li>
//           <Row style={{textAlign: 'center', fontWeight: 600}}>
//             <Col span={11}>文件名</Col>
//             <Col span={3}>版本</Col>
//             <Col span={3}>操作</Col>
//           </Row>
//         </li>
//         {
//           _.map(stableFiles, (item, key) => {
//             var temp = item.version,
//                 year = temp.substr(0,4),
//                 month = temp.substr(4,2),
//                 day = temp.substr(6,2),
//                 hour = temp.substr(8,2),
//                 min = temp.substr(10,2),
//                 uptime = year+'-'+month+'-'+day+' '+hour+':'+min;
//             return (
//               <li className="desp-hover" key={key} style={{margin: '5px auto'}}>
//                 <Row>
//                   <Col span={11} className="desp-nowrap" style={{paddingLeft:5}}><Icon type="tags-o" style={{color: '#CECECE'}}/> <Link target="_blank" to={"/preview/file/"+ item.id}>{item.name}</Link></Col>
//                   <Col span={3} style={{textAlign: 'center'}}>{item.customVersion || '-'}</Col>
//                   <Col span={3} style={{textAlign: 'center'}}><a target="_blank" href={item.url}>下载</a></Col>
//                 </Row>
//               </li>
//             )
//           })
//         }
//       </ul>   
//     );
//   }
// };
// export default ShowFileTask;
