import React, { Component } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';
import './tile.css';
import Yields from './yields/yields.js';
class Tile extends Component {

    setTerrain(terrain, hill, spawn){
        if (spawn!==null)
        return hill ? 'Tile '+terrain +' hill spawn' : 'Tile '+terrain+' spawn';
        else
        return hill ? 'Tile '+terrain +' hill' : 'Tile '+terrain;
    }
    styleTerrain(terrain, hill){
        if (terrain === 'water')
        return <i className="material-icons">waves</i>;
            if (terrain==='mountain')
            return <i className="material-icons">landscape</i>;
                if (hill){
                    return <i className="material-icons">arrow_drop_up</i>
                }
    }
    tooltip(){
        let key = 2;
        let tooltip = [];
        tooltip.push(<p key={0} className='tileTooltip terrainName'>{this.props.tile.terrain}</p>)
        if (this.props.tile.hill)
            tooltip.push(<p key={1} className='tileTooltip'>Hill</p>)
        for (let i=0; i < this.props.tile.food; i++){
          tooltip.push(<Food key={key}/>)
          key+=1;
        }
        for (let i=0; i < this.props.tile.production; i++){
          tooltip.push(<Production key={key}/>)
          key+=1;
        }
        return tooltip;
    }

    render() {
        return (
            <Tooltip title={this.tooltip()} enterDelay={500} placement="bottom">
                <div
                    className={this.setTerrain(this.props.tile.terrain, this.props.tile.hill, this.props.tile.spawn)}
                    onClick={()=>console.log(this.props.tile)}>
                    {this.styleTerrain(this.props.tile.terrain, this.props.tile.hill)}
                    {this.props.showYieldsState ?
                        (
                            <Yields
                                food={this.props.tile.food}
                                production={this.props.tile.production}
                                />
                        ):null}
                </div>
            </Tooltip>
        );
    }
}

function Food() {
  return <Icon style={{color:'green'}}>restaurant</Icon>;
}

function Production(){
    return <Icon style={{color:'orange'}}>gavel</Icon>;
}

export default Tile;
