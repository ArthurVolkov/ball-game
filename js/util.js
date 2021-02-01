function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


function getFreeBoard () {
	var freeBoard = []
	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard[0].length; j++) {
			var cell = gBoard[i][j];
			if (cell.type === FLOOR && cell.gameElement === null) {
				if (i !== 0 && i !== gBoard.length - 1 &&
					j !== 0 && j !== gBoard[0].length - 1) {
					freeBoard.push([i, j])
				}
			}
		}
	}
	return freeBoard;
}