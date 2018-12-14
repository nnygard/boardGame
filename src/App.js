import React, { Component } from 'react';
import './App.css';
import {generateBoard} from './BoardGenerator.js';
// import Icon from '@material-ui/core/Icon';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            board:[],
        }
    }

    componentDidMount(){
        this.setState({
            board:generateBoard(),
        });
    }

    renderBoard(board){
        if (board){
            let boardArray = board.map(
                function (value, index, object){

                    let className = 'Tile '+value.terrain;
                    if (value.hill)
                    className+=' hill'

                    let terrain;
                    if (value.terrain === 'water')
                    terrain = <i className="material-icons water">waves</i>;
                    else if (value.terrain==='mountain')
                    terrain = <i className="material-icons mountain">landscape</i>;
                    else
                    terrain = <p>{value.food} {value.production}</p>

                    return <div key={value.index} className={className} onClick={()=>console.log(value)}>{terrain}</div>
                })
                return boardArray;
            }
        }

        render() {
            // console.log(this.state)
            return (
                <div className="App">
                    <div className='Board'>
                        {this.renderBoard(this.state.board.tiles)}
                    </div>
                </div>
            );
        }
    }

    export default App;
