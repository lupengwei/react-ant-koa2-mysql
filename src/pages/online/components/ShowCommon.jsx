import React from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import {  Button,  Spin,  Table, } from 'antd';
// import styles from './Common.less';
import {
  // getFileTaskById,
  searchOnlineItem
} from '../../../services/api';

class List extends React.Component {
 constructor(props, context) {     
    super(props, context);     
    this.state = {
      loading: false,
			dataSource: [],
			modifyUpdateHtml: null,
      reloadChecked: this.props.initialChecked, //用于父组件更新
      qiniuToken: '',
      datas:this.props.datas
    }
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.datas !== nextProps.datas) this.handleSource(nextProps.datas);
  };
  handleSource(datas) {
		console.log(datas);
    this.setState({ datas: datas });
     searchOnlineItem(datas).then((res)=>{
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
      this.setState({ dataSource: tempArray, loading: false });
       console.log(this.state.dataSource)
    })
  }
	handleModifyQuestion=(params)=> {
		this.setState({
			modifyQuestionHtml: (
        <ShowFilesTab datas={this.state.taskData} />
			)
    });
    alert(123)
	}
	render() {
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
				title: "文档名称",
				width:"40%",
				dataIndex: "name",
				key: "name"
			},
			{
				title: "文档类型",
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
                    type="danger"
                    size="small"
                  >
                  <a href={value.url}>下载</a>
                  </Button>
                <Link target="_blank" to={"/preview/file/"+ value.id}>
								<Button style={{marginRight:20}}
									type="primary"
									size="small"
								>
									查看
								</Button>
                </Link>
							</span>
						)
					}
			}
		];

		return (
			<Spin spinning={this.state.loading }>
					<div style={{ paddingTop:13,marginBottom: 15 }}>
							{/* <div className="bg-gray">文档列表 </div> */}
							<Table
							className="desp-table-container desp-table-center-container"
							dataSource={this.state.dataSource}	
							rowKey={record => Math.random()}
							columns={columns}
							/>
					</div>
			</Spin>
		);
	}
}

class ShowFilesTab extends React.Component{
  render() {
    var props = this.props;
    var stableFiles = []; //发布版本
    if(props.datas.Files.length !== 0){
      props.datas.Files.forEach(function(item){ stableFiles.push(item);
      });

    }
    return (
     <div>usjnfkw</div> 
    );
  }
};
export default List;