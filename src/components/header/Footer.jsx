import React from 'react';
import moment from 'moment';
import styles from './Common.less';
const Footer = ({ children }) => {
	var presentYear = moment().format("YYYY.MM");
	return (
		<div className={styles.foot}>
			@交控科技 All right reserved {presentYear}
		</div>
	);
};
export default Footer;

