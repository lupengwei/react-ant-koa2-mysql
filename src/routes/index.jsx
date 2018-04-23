import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import './global';
// import Cookies from "js-cookie"

import NoMatch from "../pages/common/NoMatch";
import NotAuth from '../pages/common/NotAuth';
import LoginByWx from '../pages/common/LoginByWx';

import PreviewFiles from '../pages/common/PreviewFiles'; // 预览文件

import App from '../pages/App';
import Opinion from '../pages/opinion/Home';
import Update from '../pages/update/Home';
import Online from '../pages/online/Home';
import Qusetion from '../pages/qusetion/Home';
import ShowItem from '../pages/qusetion/components/ShowItem';

const Routes = () => (
	<BrowserRouter>
		<Switch>
			<Route exact path='/' component={ App }/>
			<Route path="/login/wx/:userId" component={ LoginByWx } />
			<Route path="/qusetion/:type" component={ Qusetion }/>
			<Route path="/qusetion/:type/:item" component={ Qusetion }/>
			{/* <Route path="/`{Cookies.get('projectId')}`/qusetion/:type/" component={ Qusetion }/> */}
			<Route path="/online/:type" component={ Online }/>
			<Route path="/update/:type" component={ Update }/>
			<Route path="/opinion/:type" component={ Opinion }/>

		 

      {/* <Route path="/show/fileTask/:taskid/file/:fileid/recordSheet" component={ RecordSheet } /> */}

			<Route exact path="/`{this.props.match.path}`/:type/:itemid"  component={ ShowItem } components={{header:2}} />
			<Route path="/preview/file/:fileid" component={ PreviewFiles } />
			<Route path="/#/unauthorized" component={ NotAuth }/>
			<Route component={ NoMatch }/>
		</Switch>
	</BrowserRouter>
)

Routes.propTypes = {
	text: PropTypes.any
};

export default Routes;
