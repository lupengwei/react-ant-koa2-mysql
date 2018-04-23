/**
 * 罚则
 */

import React from 'react';
import { Link } from 'react-router';
import QueueAnim from 'rc-queue-anim';
import _ from 'lodash';
import moment from 'moment';
import Cookies from 'js-cookie';

import { Table, Form, Input, Icon, Modal, Spin, Tag, Popconfirm, Button, Select, message, Tooltip, Switch } from 'antd';
import styles from './Common.less';

import {
  getAllProjects,
  getPunishments
} from '../../../services/api';

//ant
const FormItem = Form.Item;
const Option   = Select.Option;

//main
let Punishments = React.createClass({
  getInitialState() {
    return {
      loading: true,
      reloadChecked: 0, //检查渲染条件
      dataSource: [],
      orginDataSource: [], // 备份
      projectArray: []
    };
  },
  componentDidMount() {
    this.showPunishments();
    this.showAllProjects();
  },
  showPunishments() {
    let _self = this;

    getPunishments().then((res) => {
      let datas = res.jsonResult.punishments;
      let tempArray = [];
      let moneySum = 0;

      datas.map((item, index) => {

        moneySum += item.money;

        let tempJson = {};

        tempJson.punishType = item.type;
        tempJson.termType = item.item;
        tempJson.punishContent = item.content;
        tempJson.punishWay = item.method;
        tempJson.effect = item.effect;
        tempJson.isHappened = item.happened;
        tempJson.money = item.money;
        tempJson.remarks = item.note;
        tempJson.item = item;
        tempJson.total = false;
        tempJson.ssxm = item.Project.name;
        tempJson.sszgs = item.Project.sszgs;

        tempArray.push(tempJson);
      })

      //合计
      let tempTotalJson = {};

      tempTotalJson.punishType = '';
      tempTotalJson.termType = '';
      tempTotalJson.punishContent = '';
      tempTotalJson.punishWay = '';
      tempTotalJson.effect = '';
      tempTotalJson.isHappened = '';
      tempTotalJson.money = moneySum;
      tempTotalJson.remarks = '';
      tempTotalJson.item = '';
      tempTotalJson.total = true;

      tempArray.push(tempTotalJson);

      _self.setState({
        dataSource: tempArray,
        orginDataSource: tempArray,
        loading: false
      })
    })
  },
  showAllProjects(){
    let _self = this;

    getAllProjects().then((res) => {
      let tempArray = [];
      _.map(res.jsonResult.projects, (item) => {
        tempArray.push({
          id: item.id,
          name: item.name
        });
      })
      _self.setState({ projectArray: tempArray });
    })
  },
  handleFilterSubmit(e) {
    e.preventDefault();
    let formDatas = this.props.form.getFieldsValue();
    let tempArrayOrigin = this.state.orginDataSource;
    let tempArrayFilter = [];

    this.setState({ loading: true });

    // 罚则类型
    if(formDatas.punishType){
      tempArrayFilter = [];
      tempArrayOrigin.map((item) => {
        if(item.punishType == formDatas.punishType) tempArrayFilter.push(item);
      })
      tempArrayOrigin = tempArrayFilter;
    }

    // 罚则条款类型
    if(formDatas.termType){
      tempArrayFilter = [];
      tempArrayOrigin.map((item) => {
        if(item.termType == formDatas.termType) tempArrayFilter.push(item);
      })
      tempArrayOrigin = tempArrayFilter;
    }

    // 所属子公司
    if(formDatas.sszgs){
      tempArrayFilter = [];
      tempArrayOrigin.map((item) => {
        if(item.sszgs == formDatas.sszgs) tempArrayFilter.push(item);
      })
      tempArrayOrigin = tempArrayFilter;
    }

    // 所属项目
    if(formDatas.ssxm){
      tempArrayFilter = [];
      tempArrayOrigin.map((item) => {
        if(item.ssxm == formDatas.ssxm) tempArrayFilter.push(item);
      })
      tempArrayOrigin = tempArrayFilter;
    }

    // 状态
    if(formDatas.status == '已发生'){
      tempArrayFilter = [];
      tempArrayOrigin.map((item) => {
        if(item.isHappened) tempArrayFilter.push(item);
      })
      tempArrayOrigin = tempArrayFilter;
    }

    // 合计
    let tempTotalNumber = 0;
    let tempTotalJson = {
      key: '-1',
      isHappened: '合计',
      total: true
    };

    _.map(tempArrayOrigin, (item) => {
      tempTotalNumber += item.money;
    })

    tempTotalJson.money = tempTotalNumber;
    tempArrayOrigin.push(tempTotalJson);

    this.setState({
      dataSource: tempArrayOrigin,
      loading: false
    });

    message.success("筛选成功");

  },
  render() {
    let state = this.state,
        props = this.props,
        _self = this;

    let columnDatas = [{
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        className: styles.textAlignCenter,
        render: (text, record, index) => {
          return record.total ? false : index+1;
        }
      }, {
        title: '罚则类型',
        dataIndex: 'punishType',
        key: 'punishType',
        className: styles.textAlignCenter
      }, {
        title: '条款类型',
        dataIndex: 'termType',
        key: 'termType',
        className: styles.textAlignCenter,
      }, {
        title: '罚则内容',
        dataIndex: 'punishContent',
        key: 'punishContent',
        render: (text, record) => {
          if(record.total) return false;
          return text ? text : '/';
        }
      }, {
        title: '处罚方式',
        dataIndex: 'punishWay',
        key: 'punishWay',
        className: styles.textAlignCenter,
        width: '30%',
        render: (text, record) => {
          if(record.total) return false;
          return text ? text : '/';
        }
      }, {
        title: '其他影响',
        dataIndex: 'effect',
        key: 'effect',
        render: (text, record) => {
          if(record.total) return false;
          return text ? text : '/';
        }
      }, {
        title: '是否发生',
        dataIndex: 'isHappened',
        key: 'isHappened',
        className: styles.textAlignCenter,
        render: (text, record) => {
          if(record.total) return <span style={{fontWeight:700}}>合计</span>;
          return text ? <span className="text-warning">已发生</span> : <span>未发生</span>;
        }
      }, {
        title: '罚款金额',
        dataIndex: 'money',
        key: 'money',
        className: styles.textAlignRight,
        render: (text, record) => {
          return text ? <b>￥{desp_toThousands(text)}</b> : '/';
        }
      }, {
        title: '备注',
        dataIndex: 'remarks',
        key: 'remarks',
        render: (text, record) => {
          if(record.total) return false;
          return text ? text : '/';
        }
      }, {
        title: '所属项目',
        dataIndex: 'ssxm',
        key: 'ssxm',
        render: (text, record) => {
          if(record.total) return false;
          return text ? text : '/'
        }
      }, {
        title: '所属子公司',
        dataIndex: 'sszgs',
        key: 'sszgs',
        render: (text, record) => {
          if(record.total) return false;
          return text ? text : '/'
        }
      }];

    const { getFieldProps } = this.props.form;

    return (
      <div style={{padding:5}}>
        <div style={{padding:'5px 5px 0 5px'}}>
          <Form inline onSubmit={this.handleFilterSubmit}>
            <FormItem
              label="罚则类型"
            >
              <Select
                size="small"
                style={{width:100}}
                placeholder="罚则类型"
                {...getFieldProps('punishType')}
              >
                <Option value="">[ 空 ]</Option>
                <Option value="系统功能">系统功能</Option>
                <Option value="硬件性能">硬件性能</Option>
                <Option value="项目管理">项目管理</Option>
                <Option value="技术服务">技术服务</Option>
                <Option value="工程设计">工程设计</Option>
                <Option value="其他">其他</Option>
              </Select>
            </FormItem>
            <FormItem
              label="条款类型"
            >
              <Select
                size="small"
                style={{width:100}}
                placeholder="条款类型"
                {...getFieldProps('termType')}
              >
                <Option value="">[ 空 ]</Option>
                <Option value="技术专用">技术专用</Option>
                <Option value="技术通用">技术通用</Option>
                <Option value="商务专用">商务专用</Option>
                <Option value="商务通用">商务通用</Option>
                <Option value="其他">其他</Option>
              </Select>
            </FormItem>
            <FormItem
              label="子公司"
            >
              <Select
                size="small"
                style={{width:100}}
                placeholder="选择子公司"
                {...getFieldProps('sszgs')}
              >
                <Option value="">[ 空 ]</Option>
                <Option value="重庆子公司">重庆子公司</Option>
                <Option value="天津子公司">天津子公司</Option>
                <Option value="深圳子公司">深圳子公司</Option>
                <Option value="成都子公司">成都子公司</Option>
                <Option value="其他">其他</Option>
              </Select>
            </FormItem>
            <FormItem
              label="项目"
            >
              <Select
                showSearch
                size="small"
                style={{width:200}}
                placeholder="选择项目"
                {...getFieldProps('ssxm')}
              >
                <Option key="-0" value="">[ 空 ]</Option>
                {
                  _.map(state.projectArray, (item, key) => {
                    return <Option key={key} value={item.name}>{item.name}</Option>
                  })
                }
              </Select>
            </FormItem>
            <FormItem
              label="状态"
            >
              <Select
                size="small"
                style={{width:100}}
                placeholder="状态"
                {...getFieldProps('status')}
              >
                <Option value="">[ 空 ]</Option>
                <Option value="未发生">未发生</Option>
                <Option value="已发生">已发生</Option>
              </Select>
            </FormItem>
            <Button type="primary" htmlType="submit" size="small">筛选</Button>
            <span> 当前共有记录 <span className="text-danger">{state.dataSource.length - 1}</span> 条</span>
          </Form>
        </div>

        <Table
          className="desp-table-container"
          dataSource={state.dataSource}
          columns={columnDatas}
          loading={state.loading}
          style={{marginTop:15}}
          pagination={{ pageSize: 50 }}
          bordered
        />

      </div>
    );
  }
});

Punishments = Form.create()(Punishments);

export default Punishments;