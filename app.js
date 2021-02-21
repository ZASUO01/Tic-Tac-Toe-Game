

const GameBoard = (() => {

    const domGameBoard = document.querySelector('#game-board');
    let board_array = Array(9).fill('');

    const renderBoard = () => {
        const cells = document.querySelectorAll('.cell');
        for(let i = 0; i < cells.length; i++){
            cells[i].textContent = board_array[i];
        }
    }
    
    const markBoard = (index, marker) => {
        if(canMark(index)){
            board_array[index] = marker;
        }
    }

    const canMark = (index) => {
        if(board_array[index] != 'O' && board_array[index] != 'X') return true;
        return false;
    }
    

    const resetBoard = () => {
        board_array = Array(9).fill('');
    }

    const getBoard = () => {
        return board_array;
    }

    return{
        renderBoard,
        markBoard,
        resetBoard,
        getBoard
    }
})();


const Controlers = (() => {
    const cells = document.querySelectorAll('.cell');

    const setWindow = document.querySelector('#set-window');
    const gameType = document.querySelector('#game-type');
    const startBtn = document.querySelector('#start');
    const resetBtn = document.querySelector('#reset');

    const getMode = () => {
        const mode = gameType.value;
        if(mode == 1) return 'stupid';
        else if(mode == 2) return 'smart';
        return 'normal'; 
    }

    startBtn.addEventListener('click', (ev) => {
        ev.preventDefault();
        setWindow.style.display = 'none';
    });

    cells.forEach(cell => {
        cell.addEventListener('click', (event) => {
            if(event.target.textContent !== '' || Game.getGameOver() == true) return; 
            const index = Array.prototype.indexOf.call(cells, cell);
            Game.playRound(index);
            if(getMode() == 'stupid') Game.playRound(Computer.randomIndex(GameBoard.getBoard()));
            GameBoard.renderBoard();
        });
    });

    resetBtn.addEventListener('click', () => {
        Game.resetGame();
        GameBoard.resetBoard();
        GameBoard.renderBoard();
        resetBtn.style.display = 'none';
        setWindow.style.display = 'flex';
    });

    return{
        resetBtn
    }
})();


const Game = (() => {
    let actRound = 1;
    let gameOver = false;

    const gameDisplayH1 = document.querySelector('.game-display h1');
    const gameDisplayP = document.querySelector('.game-display p');

    const winningConditions = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];

    const playRound = (index) => {
        gameDisplayH1.textContent = `Turn: ${actRound+1}`;
        GameBoard.markBoard(index, actMarker());
        if(checkWin()){
            gameDisplayP.textContent = `Player ${actMarker()} won this match!`;
            Controlers.resetBtn.style.display = 'block';
            gameOver = true;
            return;
        }
        
        else if(checkTie()){
            gameDisplayP.textContent = 'This is a tie!';
            Controlers.resetBtn.style.display = 'block';
            gameOver = true;
            return;
        }
        actRound++;
        gameDisplayP.textContent = `Player ${actMarker()} turn`
    }


    const checkWin = () => {
        let isWin = false;
        winningConditions.forEach(condition => {
            const a = condition[0];
            const b = condition[1];
            const c = condition[2];
            if(GameBoard.getBoard()[a] != '' && GameBoard.getBoard()[a] == GameBoard.getBoard()[b] && GameBoard.getBoard()[a] == GameBoard.getBoard()[c]) isWin = true;     
        });
        return isWin;
    }

    const checkTie = () => {
        if(actRound == 9) return true;
        else return false;
    }

    const actMarker = () => {
        return actRound % 2 == 0 ? 'O' : 'X';
    }

    const resetGame = () => {
        gameOver = false;
        actRound = 1
        gameDisplayH1.textContent = 'Turn: 1';
        gameDisplayP.textContent = 'Player 0 turn'
    }

    const getGameOver = () => {
        return gameOver;
    }

    return{
        playRound,
        resetGame,
        getGameOver
    }
})();

const Computer = (() => {
    const getFreePositions = (board) => {
        let arr = [];
        board.forEach((value, index) => {
            if(value == '' && !Game.getGameOver()) arr.push(index);
        });
        return arr;
    }

    const randomIndex = (board) => {
        const posArray = getFreePositions(board);
        const size = posArray.length;
        const val = Math.floor(Math.random() * size);
        return posArray[val];
    }

    
    return{randomIndex}
    
})();



