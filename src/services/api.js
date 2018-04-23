
import request from "../utils/request";
// import _ from 'lodash';
let g_server_uri = "http://des.56cto.net/api";
//  let g_server_uri = "http://localhost:3002";


/**
 * create、delete、get(show)、update(modify,put)
 * HTTP动词：GET、POST、PUT、PATCH、DELETE
 * @params[isShieldDimissionUser] 是否屏蔽离职人员
 * 
 */

export async function getAuthConfig(){
	return request(g_server_uri + '/auth/login', {method: 'GET'});
};

export async function getJsapiTicketConfig(datas){
	return request(g_server_uri + '/auth/get-jsapi-ticket', {method: 'POST', body: datas});
};

export async function getUserInfo(){
	return request(g_server_uri + '/api/users/get-user-info', {method: 'GET'});
}


export async function getAllUsers(isShieldDimissionUser) {
	// return request(g_server_uri + '/api/users', {method: 'GET'});
	return request(g_server_uri + '/api/users', isShieldDimissionUser);
}

export async function getQiniuToken(params){
	return request(g_server_uri + '/api/qiniu/uptoken/' + params, {method: 'GET'});
}





export async function getUserRolesOfProject(projectId){ // 用户获取自己在本项目的角色
	return request(g_server_uri + '/api/projects/'+ projectId +'/my-role', {method: 'GET'});
}

export async function updateUserInfo(datas) { // 更新用户信息
	return request(g_server_uri + '/api/users/update', {method: 'PUT', body: datas});
}


// FeedBack

export async function createFeedBackOrder(datas) { // 创建反馈
	return request(g_server_uri + '/api/feedbacks', {method: 'POST', body: datas});
}
export async function createFeedBackMassage( id,datas) { // 反馈fankuai
	return request(g_server_uri + '/api/feedbacks/'+id, {method: 'PUT', body: datas});
}

export async function getFeedBackOrders() { // 获取反馈
	return request(g_server_uri + '/api/feedbacks', {method: 'GET'});
}

export async function getUpdate() { // 版本信息
	return request(g_server_uri + '/api/update', {method: 'GET'});
}
export async function createUpdate(datas) { // 创建版本信息
	return request(g_server_uri + '/api/update', {method: 'POST', body: datas});
}

export async function deleteUpdate(id) { // 删除版本信息
	return request(g_server_uri + '/api/update/'+ id, {method: 'DELETE'});
}

export async function updateUpdate(Id, datas) { // 修改版本信息
	return request(g_server_uri + '/api/update/'+ Id, {method: 'PUT', body: datas});
}

export async function searchUpdate(params) { // 查询版本信息
	let tempUrl = params ? ('/api/update/'+params) : '/api/update/filter';
	return request(g_server_uri + tempUrl, {method: 'GET'});
}
// export async function searchHonor(params) { 
//   let tempUrl = params ? ('/api/honors/filter?'+params) : '/api/honors/filter';
//   return xFetch(g_server_uri + tempUrl, {method: 'GET'});
// }


//问题模块

export async function getQuestion() { // 问题信息
	return request(g_server_uri + '/api/question', {method: 'GET'});
}
export async function createQuestion(datas) { // 创建问题信息
	return request(g_server_uri + '/api/question', {method: 'POST', body: datas});
}

export async function deleteQuestion(id) { // 删除问题信息
	return request(g_server_uri + '/api/question/'+ id, {method: 'DELETE'});
}
export async function getItemQuestion(id) { // ]\
	return request(g_server_uri + '/api/question/item/'+ id, {method: 'GET'});
}
export async function searchQuestion(id) { // ]S搜索问题
	return request(g_server_uri + '/api/question/title/'+ id, {method: 'GET'});
}

export async function updateQuestion(Id, datas) { // 修改问题信息
	return request(g_server_uri + '/api/question/'+ Id, {method: 'PUT', body: datas});
}

export async function searchProjectQuestion(params) { // 查询改项目所有问题信息
	let tempUrl = params ? ('/api/question/'+params) : '/api/question/filter';
	return request(g_server_uri + tempUrl, {method: 'GET'});
}
export async function searchQuestionItem(type) { // 查询问题详细信息
	let tempUrl = type ? ('/api/questions?type='+type) : '/api/question/filter';
	return request(g_server_uri + tempUrl, {method: 'GET'});
}
//问题类型

export async function getQuestionType() { // 问题类型信息
	return request(g_server_uri + '/api/questionType', {method: 'GET'});
}
export async function createQuestionType(datas) { // 创建问题类型信息
	return request(g_server_uri + '/api/questionType', {method: 'POST', body: datas});
}

export async function deleteQuestionType(id) { // 删除问题类型信息
	return request(g_server_uri + '/api/questionType/'+ id, {method: 'DELETE'});
}

export async function updateQuestionType(Id, datas) { // 修改问题类型信息
	return request(g_server_uri + '/api/questionType/'+ Id, {method: 'PUT', body: datas});
}
export async function searchQuestionType(params) { // 查询信息
	let tempUrl = params ? ('/api/questionType/'+params) : '/api/questionType/filter';
	return request(g_server_uri + tempUrl, {method: 'GET'});
}



//在线文档模块

export async function getOnline() { // 在线文档信息
	return request(g_server_uri + '/api/online', {method: 'GET'});
}
export async function createOnline(datas) { // 创建在线文档信息
	return request(g_server_uri + '/api/online', {method: 'POST', body: datas});
}

export async function showFileOnline(id) { // 查看在线文档详细信息
	return request(g_server_uri + '/api/online/file/'+ id, {method: 'get'});
}

export async function deleteOnline(id) { // 删除文档
	return request(g_server_uri + '/api/online/'+ id, {method: 'DELETE'});
} 
export async function updateOnline(Id, datas) { // 修改在线文档信息
	return request(g_server_uri + '/api/online/'+ Id, {method: 'PUT', body: datas});
}

export async function searchOnline(params) { // 查询在线文档信息
	let tempUrl = params ? ('/api/online/'+params) : '/api/online/filter';
	return request(g_server_uri + tempUrl, {method: 'GET'});
}
export async function searchOnlineItem(type) { // 查询问题信息
	let tempUrl = type ? ('/api/onlines?type='+type) : '/api/onlines/filter';
	return request(g_server_uri + tempUrl, {method: 'GET'});
}
//文档在类型

export async function getOnlineType() { // 文档在线类型信息
	return request(g_server_uri + '/api/onlineType', {method: 'GET'});
}
export async function createOnlineType(datas) { // 创建文档在线类型信息
	return request(g_server_uri + '/api/onlineType', {method: 'POST', body: datas});
}

export async function deleteOnlineType(id) { // 删除文档在线类型信息
	return request(g_server_uri + '/api/onlineType/'+ id, {method: 'DELETE'});
}

export async function updateOnlineType(Id, datas) { // 修改文档在线类型信息
	return request(g_server_uri + '/api/onlineType/'+ Id, {method: 'PUT', body: datas});
}
export async function searchOnlineType(params) { // 查询信息
	let tempUrl = params ? ('/api/onlineType/'+params) : '/api/onlineType/filter';
	return request(g_server_uri + tempUrl, {method: 'GET'});
}


// export async function getFileAttr(fileId) { // 获取文件属性
//   return request(g_server_uri + '/api/files/' + fileId, {method: 'GET'});
// }

// export async function getAllFileAttr() { // 获取文件属性
//   return request(g_server_uri + '/api/files', {method: 'GET'});
// }

// 模块权限
export async function createModuleRole(datas) { // 设置模块权限
	return request(g_server_uri + '/api/roles', {method: 'POST', body: datas});
}

export async function getModuleRoles() { // 获取所有模块权限
	return request(g_server_uri + '/api/roles', {method: 'GET'});
}

export async function deleteModuleRole(roleId) { // 删除单个模块权限
	return request(g_server_uri + '/api/roles/'+ roleId, {method: 'DELETE'});
}

export async function getMineModuleRolesForProject(projectId) { // 获取自己在某项目中的角色
	return request(g_server_uri + '/api/projects/'+ projectId +'/my-role', {method: 'GET'});
}

export async function getMineModuleRoles(userId) { // 获取自己的所有角色
	return request(g_server_uri + '/api/users/'+ userId, {method: 'GET'});
}
