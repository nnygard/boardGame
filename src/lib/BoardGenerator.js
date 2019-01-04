export function generateBoard(dimension, terrainCompostion, hillChance, smoothThreshold, smoothIterations, terrainYields, opponents){
    var gameBoard = new board(dimension, terrainCompostion, hillChance, smoothThreshold, smoothIterations, terrainYields, opponents);
    // gameBoard.smoothTerrain(smoothThreshold, smoothIterations);
    return gameBoard;
}

class tile {
    constructor(index, dimension, terrain, hillpct) {
        this.index = index;
        this.x = index%dimension;
        this.y = Math.floor(index/dimension);
        this.terrain = terrain[Math.floor(Math.random() * terrain.length)];
        this.hill = this.terrain === 'grass' || this.terrain === 'plains' || this.terrain === 'desert' ? Math.random() < hillpct ? true : false : false;
        this.north = null;
        this.east = null;
        this.south = null;
        this.west = null;
        this.neighbourSame = 0;
        this.swapped = false;
        this.traversed = false;
        this.field = null;
        this.food = 0;
        this.production = 0;
    }
    mapNeighbours(north, east, south, west){
        this.north = north === null ? null : north.index;
        this.east = east === null ? null : east.index;
        this.south = south === null ? null : south.index;
        this.west = west === null ? null : west.index;
        this.neighbourSame = 0;
        this.neighbourSame += north === null ? 0 : this.terrain === north.terrain ? 1 : 0;
        this.neighbourSame += east === null ? 0 : this.terrain === east.terrain ? 1 : 0;
        this.neighbourSame += south === null ? 0 : this.terrain === south.terrain ? 1 : 0;
        this.neighbourSame += west === null ? 0 : this.terrain === west.terrain ? 1 : 0;
        return this.neighbourSame;
    }
    setTerrain(terrain, hill){
        this.terrain = terrain;
        this.hill = hill;
        this.swapped = true;
    }
    mapConnected(board, startingTile, currentField = 0){
        let directionArray = ['north','east','south','west'];
        if (startingTile){
            if (!this.traversed){
                this.traversed = true;
                if (this.terrain!=='mountain' && this.terrain!=='water'){
                    this.field = currentField;
                    for (let dir in directionArray){
                        let direction = directionArray[dir];
                        if (board.tiles[this[direction]]){
                            if (board.tiles[this[direction]].terrain!=='mountain' && board.tiles[this[direction]].terrain!=='water'){
                                board.tiles[this[direction]].mapConnected(board, false, this.field);
                            }
                        }
                    }
                }
            }
            // else {
            //     return;
            // }
        }
        else {
            this.traversed = true;
            this.field = currentField;
            for (let dir in directionArray){
                let direction = directionArray[dir];
                if (board.tiles[this[direction]] && !board.tiles[this[direction]].traversed){
                    if (board.tiles[this[direction]].terrain!=='mountain' && board.tiles[this[direction]].terrain!=='water'){
                        board.tiles[this[direction]].mapConnected(board, false, currentField);
                    }
                }
            }
        }
    }
    mapYield(yields, board){
        if (this.terrain!=='mountain' && this.terrain!=='water'){
        for (let type in yields.tile){
            if (type===this.terrain){
                let tileBase = yields.tile[type];
                for (let sort in tileBase){
                    this[sort]+=tileBase[sort];
                }
            }
        }
        let north = board[this.north] ? board[this.north].terrain : '';
        let east = board[this.east] ? board[this.east].terrain : '';
        let south = board[this.south] ? board[this.south].terrain : '';
        let west = board[this.west] ? board[this.west].terrain : '';
        let adjacent = [north, east, south, west];
        if (this.hill){
            for (let type in yields.hill){
                this[type]+=yields.hill[type];
            }
            for (let type in yields.bonusToHill){
                if (adjacent.indexOf(type)!==-1){
                    let tileBase = yields.bonusToHill[type];
                    for (let sort in tileBase){
                        this[sort]+=tileBase[sort];
                    }
                }
            }
        }
        if (!this.hill){
            for (let type in yields.bonusToFlat){
                if (adjacent.indexOf(type)!==-1){
                    let tileBase = yields.bonusToFlat[type];
                    for (let sort in tileBase){
                        this[sort]+=tileBase[sort];
                    }
                }
            }
        }
        }
    }
}

class board {
    constructor(dimension = 20, compostion, hillpct, smoothThreshold, smoothIterations, terrainYields, opponents){
        this.dimension = dimension;
        this.compostion = compostion;
        this.terrainCompostion = this.mapComposition(compostion);
        this.tiles = this.generateTiles(hillpct);
        this.smoothTerrain(smoothThreshold, smoothIterations);
        this.mapYields(terrainYields);
        this.generateSpawns(opponents);
    }

    mapComposition(compostion){
        let terrainArray = [];
        for (let key in compostion){
            for (let i = 0; i < compostion[key]; i++){
                terrainArray.push(key);
            }
        }
        return terrainArray;
    }

    generateTiles(hillpct){
        var tilesArray = [];
        for (let i = 0; i < this.dimension*this.dimension; i++){
            tilesArray.push(new tile(i, this.dimension, this.terrainCompostion, hillpct))
        }
        return tilesArray;
    }

    smoothTerrain(threshold, iterations){
        for (let _threshold in threshold){
            for (let i=0; i<iterations; i++){
                this.mapCluster(threshold[_threshold]);
            }
        }
        this.connectTerrain(this.mapTerrain());
    }

    mapCluster(threshold){
        for (let key in this.compostion){
            let tiles = [];
            let _x = 0;
            let _y = 0;
            let amount = 0;
            for (let tile in this.tiles){
                if (this.tiles[tile].terrain===key){
                    this.tiles[tile].swapped = false;
                    let north = this.tiles[tile - this.dimension] === undefined ? null : this.tiles[tile - this.dimension];
                    let east = this.tiles[tile].x + 1 < this.dimension ? this.tiles[this.tiles[tile].index + 1] : null;
                    let south = this.tiles[this.tiles[tile].index + this.dimension] === undefined ? null : this.tiles[this.tiles[tile].index+this.dimension];
                    let west = this.tiles[tile].x - 1 > -1 ? this.tiles[tile-1] : null;
                    let multiplier = this.tiles[tile].mapNeighbours(north, east, south, west);
                    _x += this.tiles[tile].x*Math.pow(multiplier,multiplier);
                    _y += this.tiles[tile].y*Math.pow(multiplier,multiplier);
                    amount += Math.pow(multiplier,multiplier);
                    if (multiplier<threshold){
                        tiles.push(this.tiles[tile]);
                    }
                }
            }
            this.swapTiles(tiles, _x/amount, _y/amount)
        }
    }

    swapTiles(tilesArray, x, y){
        for (tile in tilesArray){
            if (!this.tiles[tilesArray[tile].index].swapped){
                //store current
                let currentTileTerrain = this.tiles[tilesArray[tile].index].terrain;
                let currentTileHill = this.tiles[tilesArray[tile].index].hill;
                if (Math.abs(tilesArray[tile].x - x) > Math.abs(tilesArray[tile].y - y)){
                    //Swap x Left
                    if (tilesArray[tile].x > x){
                        //store swapping
                        let swappingTileTerrain = this.tiles[tilesArray[tile].west].terrain;
                        let swappingTileHill = this.tiles[tilesArray[tile].west].hill;
                        //Set Current Tile
                        this.tiles[tilesArray[tile].index].setTerrain(swappingTileTerrain, swappingTileHill);
                        this.tiles[tilesArray[tile].west].setTerrain(currentTileTerrain, currentTileHill);
                    }
                    //Swap x Right
                    else {
                        let swappingTileTerrain = this.tiles[tilesArray[tile].east].terrain;
                        let swappingTileHill = this.tiles[tilesArray[tile].east].hill;
                        this.tiles[tilesArray[tile].index].setTerrain(swappingTileTerrain, swappingTileHill);
                        this.tiles[tilesArray[tile].east].setTerrain(currentTileTerrain, currentTileHill);
                    }
                }
                else {
                    //Swap y Up
                    if (tilesArray[tile].y > y){
                        let swappingTileTerrain = this.tiles[tilesArray[tile].north].terrain;
                        let swappingTileHill = this.tiles[tilesArray[tile].north].hill;
                        this.tiles[tilesArray[tile].index].setTerrain(swappingTileTerrain, swappingTileHill);
                        this.tiles[tilesArray[tile].north].setTerrain(currentTileTerrain, currentTileHill);
                    }
                    //Swap y down
                    else {
                        let swappingTileTerrain = this.tiles[tilesArray[tile].south].terrain;
                        let swappingTileHill = this.tiles[tilesArray[tile].south].hill;
                        this.tiles[tilesArray[tile].index].setTerrain(swappingTileTerrain, swappingTileHill);
                        this.tiles[tilesArray[tile].south].setTerrain(currentTileTerrain, currentTileHill);
                    }
                }
            }
        }
    }

    mapTerrain(){
        for (let tile in this.tiles){
            let north = this.tiles[tile - this.dimension] === undefined ? null : this.tiles[tile - this.dimension];
            let east = this.tiles[tile].x + 1 < this.dimension ? this.tiles[this.tiles[tile].index + 1] : null;
            let south = this.tiles[this.tiles[tile].index + this.dimension] === undefined ? null : this.tiles[this.tiles[tile].index+this.dimension];
            let west = this.tiles[tile].x - 1 > -1 ? this.tiles[tile-1] : null;
            this.tiles[tile].mapNeighbours(north, east, south, west);
        }
        let currentField = 0;
        for (let tile in this.tiles){
            this.tiles[tile].mapConnected(this, true, currentField);
            currentField+=1;
        }
        let fieldsArray = [];
        let tileArray = [];
        for (let tile in this.tiles){
            if (this.tiles[tile].field!==null){
                let currentField = this.tiles[tile].field;
                if (fieldsArray.indexOf(currentField)===-1){
                    fieldsArray.push(currentField);
                    tileArray.push([this.tiles[tile]]);
                }
                else {
                    tileArray[fieldsArray.indexOf(currentField)].push(this.tiles[tile]);
                }
            }
        }
        return tileArray;
    }
    connectTerrain(fieldAreas){
        if (fieldAreas.length>1){
            let areaLengths = [];
            for (let field in fieldAreas){
                areaLengths.push(fieldAreas[field].length);
            }
            let mainArea = areaLengths.indexOf(Math.max(...areaLengths));
            for (let field in fieldAreas){
                let currentField = fieldAreas[field];
                let mainField = fieldAreas[mainArea];
                if (currentField!==mainField){
                    let closestTile = null;
                    let closestMain = null;
                    let distance = Math.sqrt(Math.pow(this.dimension,2)+Math.pow(this.dimension,2));
                    for (let tile in currentField){
                        for (let mainTile in mainField){
                            let _distance = Math.sqrt(Math.pow(Math.abs(currentField[tile].x - mainField[mainTile].x),2) + Math.pow(Math.abs(currentField[tile].y - mainField[mainTile].y),2));
                            if (_distance<distance){
                                distance = _distance;
                                closestTile = currentField[tile];
                                closestMain = mainField[mainTile];
                            }
                        }
                    }
                    let connectArray = [];
                    let startingTile = closestTile;
                    while (Math.abs(closestTile.x-closestMain.x) + Math.abs(closestTile.y-closestMain.y)>1){
                        if (closestTile.x - closestMain.x!==0){
                            if (closestTile.x - closestMain.x<0){
                                //Step Right
                                closestTile = this.tiles[closestTile.index+1];
                                connectArray.push(closestTile);
                            }
                            else {
                                //Step Left
                                closestTile = this.tiles[closestTile.index-1];
                                connectArray.push(closestTile);
                            }
                        }
                        else {
                            if (closestTile.y - closestMain.y<0){
                                //Step Down
                                closestTile = this.tiles[closestTile.index+this.dimension];
                                connectArray.push(closestTile);
                            }
                            else {
                                //Step Up
                                closestTile = this.tiles[closestTile.index-this.dimension];
                                connectArray.push(closestTile);
                            }
                        }
                    }
                    let terrain = startingTile.terrain;
                    for (let tile in connectArray){
                        connectArray[tile].hill = connectArray[tile].terrain === 'mountain' ? true : false;
                        connectArray[tile].terrain=terrain;
                    }
                }
            }
        }
    }
    mapYields(yields){
        for (let tile in this.tiles){
            this.tiles[tile].mapYield(yields, this.tiles);
        }
    }
    generateSpawns(opponents){
        console.log('Generate' ,opponents, 'opponents in this function')
    }
}
