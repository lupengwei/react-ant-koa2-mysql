import React, { Component } from "react";
import { Icon } from "antd";
import "./Common.less";

class Welcome extends Component {
  render() {
    return (
      <div>
        <center style={{ height: "100%", paddingTop: "25%", fontSize: 20 }}>
          <div>
            <Icon type="enter" /> 请选择左侧管理配置项！
          </div>
        </center>
      </div>
    );
  }
}
export default Welcome;
