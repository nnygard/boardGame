import React, { Component } from 'react';
import './yields.css';
class Yields extends Component {
    render() {
        return (
            <div className='yields'>
            {this.props.food + this.props.production > 0 ?(
                <>
                <div className='yield'><div className='food'>{this.props.food}</div></div>
                <div className='yield'><div className='production'>{this.props.production}</div></div>
                </>
        ):null}
            </div>
        );
    }

}

export default Yields;
