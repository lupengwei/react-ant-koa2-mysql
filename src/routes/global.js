
global.g_server_uri = "http://172.16.103.18:3002";
// global.g_server_uri = 'http://staging.des.56cto.net';
// global.g_server_uri = 'http://des.56cto.net';
/**
 * 处理url参数
 * @param	{[string]} val 路由参数字符串，如：?type=normal
 * @return {[object]}		 如：{ type: normal }
 * 未使用，替代方案：query-string
 */
global.G_HANDLE_URL_QUERY = val => {
	let urlJson = {};
	if (val) {
		let urlStr = val.substr(1, val.length);
		let urlArr = urlStr.split("&");
		urlArr.map(item => {
			let subArr = item.split("=");
			return (urlJson[subArr[0]] = subArr[1]);
		});
	}
	return urlJson;
};
