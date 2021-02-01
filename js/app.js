const WALL = 'WALL';
const FLOOR = 'FLOOR';
const BALL = 'BALL';
const GAMER = 'GAMER';
const GLUE = 'GLUE'

const GAMER_IMG = '<img src="img/gamer.png" />';
const BALL_IMG = '<img src="img/ball.png" />';
const GLUE_IMG = '<img src="img/glue.png" />';
const FROSEN_IMG = '<img src="img/gamer-purple.png" />';

var gBoard;
var gGamerPos;
var gScore;

var onKey = document.body.onkeyup;
console.log('onkey:', onKey)

function initGame() {
	var elBoard = document.querySelector('.board-holder'); 
	var elGameOver = document.querySelector('.game-over');
	elBoard.style.opacity = '1';
	elBoard.style.pointerEvents = 'auto';
	elGameOver.style.display = 'none';
	document.body.onkeyup = onKey;


	gScore = 0;
	gGamerPos = { i: 2, j: 9 };
	gBoard = buildBoard();
	console.log('gBoard:', gBoard)
	renderBoard(gBoard);
	getBall();
	getGlue();
}


function buildBoard() {
	// Create the Matrix
	var board = createMat(10, 12)

	// Put FLOOR everywhere and WALL at edges
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			// Put FLOOR in a regular cell
			var cell = { type: FLOOR, gameElement: null };
			// Place Walls at edges
			if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
				cell.type = WALL;
			}
			board[0][Math.floor(board[0].length / 2)].type = FLOOR;
			board[board.length - 1][Math.floor(board[0].length / 2)].type = FLOOR;
			board[Math.floor(board.length / 2)][0].type = FLOOR;
			board[Math.floor(board.length / 2)][board[0].length - 1].type = FLOOR;
			// Add created cell to The game board
			board[i][j] = cell;
		}
	}
	// Place the gamer at selected position
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
	// Place the Balls (currently randomly chosen positions)
	board[3][8].gameElement = BALL;
	board[7][4].gameElement = BALL;

	return board;
}

// Render the board to an HTML table
function renderBoard(board) {

	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({ i: i, j: j })

			// TODO - change to short if statement
			if (currCell.type === FLOOR) cellClass += ' floor';
			else if (currCell.type === WALL) cellClass += ' wall';

			//TODO - Change To template string
			strHTML += '\t<td class="cell ' + cellClass +
				'"  onclick="moveTo(' + i + ',' + j + ')" >\n';

			// TODO - change to switch case statement
			if (currCell.gameElement === GAMER) {
				strHTML += GAMER_IMG;
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG;
			}

			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}

	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;
}


// Move the player to a specific location

function moveTo(i, j) {
	var elScore = document.querySelector('.score span')
	var targetCell = gBoard[i][j];
	var img = GAMER_IMG;
	if (targetCell.type === WALL) return;
	// Calculate distance to make sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);
	// If the clicked Cell is one of the four allowed
	if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {

		if (targetCell.gameElement === BALL) {
			console.log('Collecting!');
			gScore++;
			elScore.innerText = gScore;
		}
		if (targetCell.gameElement === GLUE) {
			var elBoard = document.querySelector('.board-holder');
			elBoard.style.pointerEvents = 'none';
			document.body.onkeyup = '';
			img = FROSEN_IMG;

			var pos = {i: i, j: j}
			renderCell(pos, img)

			setTimeout(function () {
				elBoard.style.pointerEvents = 'auto';
				document.body.onkeyup = onKey;
				img = GAMER_IMG;
				renderCell (pos, img);
			}, 3000)
		}
		// MOVING from current position
		// Model:
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		// Dom:
		renderCell(gGamerPos, '');
		// MOVING to selected position
		// Model:
		if (i === 0) gGamerPos.i = gBoard.length - 2;
		else if (i === gBoard.length - 1) gGamerPos.i = 1;
		else if (j === 0) gGamerPos.j = gBoard[0].length - 2;
		else if (j === gBoard[0].length - 1) gGamerPos.j = 1;
		else {
			gGamerPos.i = i;
			gGamerPos.j = j;
		}
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		// DOM:
		renderCell(gGamerPos, img);
		console.log('gGamerPos:', gGamerPos)
	} // else console.log('TOO FAR', iAbsDiff, jAbsDiff);
}


// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {

	var i = gGamerPos.i;
	var j = gGamerPos.j;

	switch (event.key) {
		case 'ArrowLeft':
			moveTo(i, j - 1);
			break;
		case 'ArrowRight':
			moveTo(i, j + 1);
			break;
		case 'ArrowUp':
			moveTo(i - 1, j);
			break;
		case 'ArrowDown':
			moveTo(i + 1, j);
			break;
	}
}

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}


function getBall() {
	timer = setInterval(function () {
		var freeBoard = getFreeBoard();
		if (freeBoard.length === 0) {
			clearInterval(timer);
			gameOver();
			return;
		}
		freeBoard.sort(() => Math.random() - 0.5);
		var placeForBall = freeBoard[0];
		gBoard[placeForBall[0]][placeForBall[1]].gameElement = BALL;

		var pos = { i: placeForBall[0], j: placeForBall[1] }
		renderCell(pos, BALL_IMG);

	}, 1000);
}


function restart() {
	initGame()
	var elScore = document.querySelector('.score span')
	elScore.innerText = gScore;
}

function gameOver() {
	var elBoard = document.querySelector('.board-holder');
	var elGameOver = document.querySelector('.game-over');

	elBoard.style.opacity = '.3';
	elBoard.style.pointerEvents = 'none'
	elGameOver.style.display = 'block'
	document.body.onkeyup = ''
}


function getGlue() {
	timer = setInterval(function () {
		var freeBoard = getFreeBoard();
		freeBoard.sort(() => Math.random() - 0.5);
		var placeForGlue = freeBoard[0];
		gBoard[placeForGlue[0]][placeForGlue[1]].gameElement = GLUE;
		var pos = { i: placeForGlue[0], j: placeForGlue[1] }
		var cellSelector = '.' + getClassName(pos)
		var elCell = document.querySelector(cellSelector);
		
		renderCell(pos, GLUE_IMG);
		setTimeout(function () {
			var htmlBefore = elCell.innerHTML
			if (htmlBefore === '<img src="img/glue.png">') htmlBefore = ''
			var htmlBefore = (htmlBefore === '<img src="img/glue.png">') ? '' : htmlBefore;
			gBoard[placeForGlue[0]][placeForGlue[1]].gameElement = null;
			renderCell(pos, htmlBefore); 
		}, 3000)

	}, 5000);
}