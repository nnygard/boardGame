import React, { Component } from 'react';
import './App.css';
import {generateBoard} from './lib/BoardGenerator.js';
import Tile from './tile/tile.js';
import BoardOptions from './boardOptions/boardOptions.js';
import Peer from 'simple-peer';
import { useState } from 'react';


//Simple-Peer

//Default Terrain
let dimension = 20;
let terrainCompostion = {
    'grass':5,
    'plains':3,
    'desert':2,
    'mountain':2,
    'water':2,
}
let hillChance = 0.25;
let smoothThreshold = [4, 3, 2, 1];
let smoothIterations = 50;
let terrainYields = {
    tile : {
        'grass': {'food':2, 'production':0,},
        'plains':{'food':1, 'production':1,},
    },
    hill : {
        'production':1,
    },
    bonusToFlat: {
        water: {'food':1},
    },
    bonusToHill: {
        mountain: {'production':1},
    },
}
let players = 4;
let startRadius = 15;

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            board:false,
            dimension:dimension,
            terrainCompostion:terrainCompostion,
            hillChance:hillChance,
            smoothThreshold:smoothThreshold,
            smoothIterations:smoothIterations,
            terrainYields:terrainYields,
            players:players,
            startRadius:startRadius,
            showYields:false,
        }
    }

    componentDidMount(){
        this.newBoard();
    }

    newBoard(){
        this.setState({
            board:generateBoard(
                this.state.dimension,
                this.state.terrainCompostion,
                this.state.hillChance,
                this.state.smoothThreshold,
                this.state.smoothIterations,
                this.state.terrainYields,
                this.state.players,
                this.state.startRadius
            ),
        });
    }

    showYields(){
        this.setState({
            showYields: this.state.showYields ? false : true,
        });
    }

    renderBoard(board, showYields){
        if (board){
            let boardArray = board.map(
                function (value, index, object){
                    return <Tile key={value.index} tile={value} showYieldsState={showYields}/>
                })
                return boardArray;
            }
        }



        render() {
            return (
                <div className="App">
                    <div className='Board'>
                        {this.renderBoard(this.state.board.tiles, this.state.showYields)}
                    </div>
                    <BoardOptions
                        showYieldsState={this.state.showYields}
                        showYieldsToggle={()=>this.showYields()}
                        />
                    <Example />
                </div>
            );
        }
    }

    function Example() {
        // Declare a new state variable, which we'll call "count"
        const [count, setCount] = useState(0);

        function add(number){
            setCount(count + number)
        }

        return (
            <div>
                <p>You clicked {count} times</p>
                <button onClick={() => add(1)}>
                    Click me
                </button>
            </div>
        );
    }

    export default App;
