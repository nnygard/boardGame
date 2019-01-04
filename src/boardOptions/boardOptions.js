import React, { Component } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';

import './boardOptions.css';
class boardOptions extends Component {
    render() {
        return (
            <div className='options'>
                <label className="gridItem">
                    <Paper className='paper' elevation={1}>
                        <Checkbox
                            checked={this.props.showYieldsState}
                            onChange={()=>this.props.showYieldsToggle()}
                            color='primary'
                            />
                        Show Yields
                    </Paper>
                </label>
            </div>
        );
    }

}

export default boardOptions;
