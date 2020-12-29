import React from 'react';
import { Main } from './components';
import { makeStyles } from '@material-ui/core/styles';
import {AppBar, Toolbar, Typography} from '@material-ui/core';

import './App.css';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
}));

function App() {

	const classes = useStyles();

	return (
		<div className="App">
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" className={classes.title}>
						LVMX Emulator
					</Typography>
				</Toolbar>
			</AppBar>
			<div id="wrap">
				<Main/>
			</div>
		</div>
	);
}

export default App;
