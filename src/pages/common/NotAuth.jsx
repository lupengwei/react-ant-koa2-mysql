import React from 'react';
import styles from './Common.less';

class  NotAuth extends React.Component{
  render(){
    return (
      <div className={styles["err-normal"]}>
        <div className={styles["err-container"]}>
          <h1 className={styles["err-title"]}>401</h1>
          <p className={styles["err-desc"]}>当前访问未授权，请登录！</p>
        </div>
      </div>
   );
  }
 
};

export default NotAuth;