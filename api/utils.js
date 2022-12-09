//Generate 2D array
const max = (a, b) => a > b ? a : b;
var timeout = false


function generateGrid(rows, columns) {
    var grid = [];
    for (let i = 0; i < rows; i++) {
        var currentRow = [];
        for (let j = 0; j < columns; j++) {
            currentRow.push(0);
        }
        grid.push(currentRow);
    }
    return grid;
}

function checkPiece(grid, piece, row, col) {
    if (piece && grid) {
        for (let i = 0; i < piece.height; i++) {
            for (let j = 0; j < piece.width; j++) {
                if ((i+row) >= grid.length || ((j+col) >= grid[0].length) || grid[i + row][j + col]) {
                    return false;
                }
            }
        }
        return true;
    }
    return false;
}
//check if grid is filled
function checkFilled(grid){
    if (grid) {
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[0].length; j++) {
                if (grid[i][j] === 0) {
                    return false;
                }
            }
        }
        return true;
    }
}

function nextSpot(grid, coordinates) {
    coordinates.col += 1;
    if (coordinates.col >= grid[0].length) {
        coordinates.row += 1;
        coordinates.col = 0;
        if (coordinates.row >= grid.length) {
            return false;
        }
        
    }
    return coordinates;
}

function recordPlace(grid, piece, row, col) {
    for (let i = 0; i < piece.height; i++) {
        for (let j = 0; j < piece.width; j++) {
            grid[i + row][j + col] = 1;
        }
    }
    return grid;
}

function copy2dArray(array) {
    let cpy = [];
    for (let i = 0; i < array.length; i++) {
        let row = [];
        for (let j = 0; j < array[i].length; j++) {
            row.push(array[i][j]);
        }
        cpy.push([...row]);
    }
    //console.log(cpy)
    return cpy;
}

//recursive algorithm for placing all pieces on the grid
function placePiece(grid, coordinates, pieces, placed, limit) {
    //console.log(grid)
    if (timeout) {
        throw(new Error("timeout"));
        document.location.reload();
        return "timeout"
    }
    if (!coordinates || placed.length > limit) {
        return false;
    }
    if (placed.length === limit && checkFilled(grid)) {
        return placed;
    } else {
        while (coordinates) {
    for (let i = 0; i < pieces.length; i++) {
        let { row, col } = coordinates;
        if (timeout) {
            throw(new Error("timeout"));
        document.location.reload();
        return "timeout"
        if (!coordinates || placed.length > limit) {
            return false;
        }
        }
        if (checkPiece(grid, pieces[i], row, col)) {
            console.log("placing piece", pieces[i], "at", row, col)
            console.log("placed", placed)
            let cpy = placed ? [...placed] : [];
            cpy.push({
                piece:pieces[i],
                row:row,
                col:col
            })
            //console.log(cpy)
            let cpyGrid = copy2dArray(grid);
            cpyGrid = recordPlace(cpyGrid, pieces[i], row, col);
            let future = placePiece(cpyGrid, {row:0, col:0}, pieces, cpy, limit);
            if (future) {
                return future;
            }
        }
    }
    coordinates = nextSpot(grid, coordinates);
            }
    return false;
}
}

pieces = [];

function generateRandomPieces(limit) {
    let generatedPieces = [];
    for (let i = 1; i <= limit; i++) {
        for (let j = 1; j <= limit; j++) {
            let piece = {width: i, height: j};
                generatedPieces.push(piece);
            }
        }

    return shuffle(generatedPieces);
}

function runGenerator(row, col, required) {
    console.log(row, col, required)
    let grid = generateGrid(row, col);
    let limit = max(row, col);
    let pieces = generateRandomPieces(limit).reverse();
    let coordinates = {row: 0, col: 0};
    let placed = [];
    return placePiece(grid, coordinates, pieces, placed, required);
}

//Fisher-Yates Shuffle from StackOverflow
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}


async function cycleGenerator(row, col, required) {
    let result = []
    while (!result.length || result === "timeout") {
        timeout = false;
        result = runGenerator(row, col, required);
        setTimeout(async () => {
            timeout = true
        }, 1000);
    }
    return result;
}

function drawPieces (gridRows, gridColumns, pieces) {
    var newGrid = generateGrid(gridRows, gridColumns);
    for (let i = 0; i < pieces.length; i++) {
        let {row, col, piece} = pieces[i];
        for (let j = 0; j < piece.height; j++) {
            for (let k = 0; k < piece.width; k++) {
                newGrid[row + j][col + k] = i + 1;
            }
        }
    }
    return newGrid;
}

async function convertToCSS (gridRows, gridColumns, pieces) {
    parentCss = `display:grid; grid-template-columns: repeat(${gridColumns}, 1fr); grid-template-rows: repeat(${gridRows}, 1fr);`;
    divsCss = [];
    pieces.forEach((piece, i) => {
        divsCss.push(`grid-column: ${piece.col + 1}; grid-row: ${piece.row + 1}; grid-column-end: span ${piece.piece.width}; grid-row-end: span ${piece.piece.height};`);
    })
    return {parentCss, divsCss};
}

module.exports = {
    convertToCSS: convertToCSS,
    drawPieces: drawPieces, 
    cycleGenerator: cycleGenerator,
    runGenerator: runGenerator
};