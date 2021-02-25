const GameBoard = (() => {
    
    let board_array = Array(9).fill('');

    const renderBoard = () => {
        const cells = document.querySelectorAll('.cell');
        board_array.forEach((value, index) => {
            const actCell = cells.item(index);
            actCell.textContent = value;
        });
    }


    const markBoard = (index, marker) => {
        if(board_array[index] != 'O' && board_array[index] != 'X') board_array[index] = marker;
    }

    

    const  unmarkBoard = (index) => {
        if(board_array[index] && board_array[index] != '') board_array[index] = '';
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
        unmarkBoard,
        resetBoard,
        getBoard
    }

})();


const Controllers = (() => {
    const setWindow = document.querySelector('#set-window');
    const startBtn = document.querySelector('#start');
    const gameTypes = document.querySelector('#game-type');
    const cells = document.querySelectorAll('.cell');
    const resetBtn = document.querySelector('#reset');
    let selectedType = null;

    startBtn.addEventListener('click',  (ev) => {
        ev.preventDefault();
        setWindow.style.display = 'none';
        selectedType = gameTypes.value;
    });

    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            if(Game.getGameOver() == true) return;
            cell.classList.add('fade-in');
            const index = Array.prototype.indexOf.call(cells, cell);
            Game.playRound(index);
            if(selectedType == 1 && !Game.getGameOver()){
                const randomIndex = Computer.randomChoice();
                cells.item(randomIndex).classList.add('fade-in');
                Game.playRound(randomIndex);
            }
            else if(selectedType == 2 && !Game.getGameOver()){
                const smartIndex = Computer.smartChoice();
                cells.item(smartIndex).classList.add('fade-in');
                Game.playRound(smartIndex);
               
            }
            GameBoard.renderBoard();
        });
    })

    resetBtn.addEventListener('click', () => {
        Game.resetGame();
        GameBoard.resetBoard();
        GameBoard.renderBoard();
        cells.forEach(cell => {
            cell.classList.remove('fade-in');
        });
        setWindow.style.display = 'flex';
    });

    return{resetBtn};

})();


const Game = (() => {
    const displayH1 = document.querySelector('#game-display h1');
    const displayP = document.querySelector('#game-display p');
    
    let gameOver = false;
    let actTurn = 1;

    const winningConditions = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [2,4,6],
        [0,4,8]
    ]

    const playRound = (index) => {
        displayH1.textContent = 'Turn: '+actTurn;
        GameBoard.markBoard(index, getMarker());
        if(checkWin(GameBoard.getBoard())){
            gameOver = true;
            displayP.textContent = `Player ${getMarker()} has won!`;
            return;
        }
        if(checkTie(actTurn)){
            gameOver = true;
            displayP.textContent = 'It\s a tie!';
            return;
        }
        actTurn++;
    }

    const checkWin = (board) => {
        let isWin = false;
        winningConditions.forEach(condition => {
            const a = condition[0];
            const b = condition[1];
            const c = condition[2];
            if(board[a] != '' && board[a] == board[b] && board[a] == board[c]) isWin = true;     
        });
        return isWin;
    }

    const checkTie = (turn) => {
        if(turn == 9) return true;
        return false;
    }

    const getMarker = () => {
        return actTurn%2 == 0? 'O' : 'X';
    }

    const getGameOver = () => {
        return gameOver;
    }

    const resetGame = () => {
        gameOver = false;
        actTurn = 1
        displayH1.textContent = 'Turn: 1';
        displayP.textContent = 'Player X turn'
    }

    return{
        playRound,
        getGameOver,
        resetGame,
        getMarker,
        checkWin,
        checkTie,
        actTurn
    }
})();


const Computer = (() => {
    const getFreePositions = () => {
        let freePositions = [];
        GameBoard.getBoard().forEach((value, index) => {
            if(value == '') freePositions.push(index);
        })
        return freePositions;
    }

    const randomChoice = () => {
        const choices = getFreePositions();
        const size = choices.length;
        const index = Math.floor(Math.random() * size);
        return choices[index];
    }

    const miniMax = (board, marker) => {
        if(Game.checkWin(board)){
            if(marker == 'X') return 1;
            else if(marker == 'O') return -1;
        }
        if(Game.checkTie(Game.actTurn)) return 0;
        const newMarker = marker == 'O' ? 'X' : 'O';
    
        const possibilities = getFreePositions();
        let bestValue = null;
        possibilities.forEach(pos => {
            GameBoard.markBoard(pos, newMarker);
            Game.actTurn++;
            const value = miniMax(GameBoard.getBoard(),newMarker);
            Game.actTurn--;
            GameBoard.unmarkBoard(pos);
        

            if(bestValue == null){
                bestValue = value;
            }
            else if(newMarker == 'X'){
                if(value > bestValue){
                    bestValue = value;
                }
            }
            else if(newMarker == 'O'){
                if(value < bestValue){
                    bestValue = value;
                }
            }
        });
        return bestValue;
    }
    
    const smartChoice = () => {
        const possibilities = getFreePositions();
        let bestMovement = null;
        let bestValue = null;
        possibilities.forEach(pos => {
            GameBoard.markBoard(pos, Game.getMarker());
            Game.actTurn++;
            const value = miniMax(GameBoard.getBoard(), Game.getMarker());
            Game.actTurn--;
            GameBoard.unmarkBoard(pos);
        

            if(bestValue == null){
                bestValue = value;
                bestMovement = pos;
            }
            else if(Game.getMarker() == 'X'){
                if(value > bestValue){
                    bestValue = value;
                    bestMovement = pos;
                }
            }
            else if(Game.getMarker() == 'O'){
                if(value < bestValue){
                    bestValue = value;
                    bestMovement = pos;
                }
            }
        });
        return bestMovement;
    }

   

    return{
        randomChoice,
        smartChoice
    }

})();