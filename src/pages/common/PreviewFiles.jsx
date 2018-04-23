import React from 'react';
import { Spin,  Icon, Tooltip } from 'antd';
import './Common.less';
import { showFileOnline } from '../../services/api';

//main
class PreviewFiles extends React.Component {
  constructor(props) {     
    super(props);
    this.state = {
      loading: false,
      fileId: this.props.match.params.fileid,
      fileDatas: {
        name: '',
        url: '',
        customVersion: '',
        project: {
          fullname: '',
          number: ''
        },
        fileTask: {
          id: '',
          level: ''
        },
      },
      fileUrl: '',
      fileName: '',
      downloadUrl: '',
      isAccepted: false,
      pageHeight: (document.body.clientHeight - 55) + 'px',
     
    };
    this.changeWindowSize=this.changeWindowSize.bind(this);
  }
  componentDidMount() {
    this.showFileOnlines()
    console.log()
  }
  showFileOnlines() {
      showFileOnline(this.state.fileId).then((res)=>{
      let datas = res.jsonResult.online;
      console.log(datas);
      this.setState({
        fileDatas: datas,
        fileUrl: 'http://ow365.cn/?i=10207&furl=' + datas.url,
        downloadUrl: datas.url,
        loading: false
      });
    });
  }
  changeWindowSize() {
    this.setState({ pageHeight: (document.body.clientHeight - 55) + 'px' });
  }
  render() {
    window.onresize = this.changeWindowSize;

    return (
      <Spin spinning={this.state.loading}>
        <div style={{position:'fixed',left:3,top:4}}>
          <div style={{paddingTop:8,paddingLeft:15}}>
            <Tooltip placement="bottom" title="下载文件">
              <a style={{color:'#FFF'}} target="_blank" href={this.state.downloadUrl}><Icon type="cloud-download" style={{fontSize:24}} /></a>
            </Tooltip>
          </div>
        </div>
        <div style={{height:50,padding:'10px 0 5px 0',background:'#828282'}}>
          <center style={{fontSize:22}}>{this.state.fileDatas.name }</center>
        </div>
        <iframe style={{ width: '100%', minHeight: this.state.pageHeight }} title="iframe example 1" frameBorder="0" src={this.state.fileUrl}></iframe>
      </Spin>
    );
  }
}

export default PreviewFiles;