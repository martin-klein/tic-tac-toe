document.addEventListener('DOMContentLoaded', () => {

    const cells = document.querySelectorAll('.cell');
    let currentPlayer;
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let playerWins = 0;
    let aiWins = 0;
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    const playerIndicator = document.getElementById('player-indicator');
    const resetButton = document.getElementById('reset-button');
    const playerWinCount = document.getElementById('player-win-count');
    const aiWinCount = document.getElementById('ai-win-count');

    const initializeGame = () => {
        gameState.fill('');
        cells.forEach(cell => {
            cell.innerText = '';
            cell.classList.remove('used');
        });
        currentPlayer = Math.random() < 0.5 ? 'X' : 'O';
        playerIndicator.innerText = currentPlayer === 'X' ? `Player's turn` : `AI's turn`;

        if (currentPlayer === 'O') {
            aiMove();
        }
    };

    const handleCellClick = (clickedCell, clickedCellIndex) => {
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.innerText = currentPlayer;
        clickedCell.classList.add('used');

        if (checkWinner() || checkTie()) {
            updateGameStatus();
            return;
        }

        aiMove();
    };

    function minimax(newBoard, player) {
        const availSpots = newBoard.filter(s => s != "O" && s != "X");
    
        if (checkWin(newBoard, 'X')) {
            return {score: -10};
        } else if (checkWin(newBoard, 'O')) {
            return {score: 10};
        } else if (availSpots.length === 0) {
            return {score: 0};
        }
    
        let moves = [];
        for (let i = 0; i < availSpots.length; i++) {
            let move = {};
            move.index = newBoard[availSpots[i]];
            newBoard[availSpots[i]] = player;
    
            if (player == 'O') {
                let result = minimax(newBoard, 'X');
                move.score = result.score;
            } else {
                let result = minimax(newBoard, 'O');
                move.score = result.score;
            }
    
            newBoard[availSpots[i]] = move.index;
            moves.push(move);
        }
    
        let bestMove;
        if (player === 'O') {
            let bestScore = -10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
    
        return moves[bestMove];
    }
    
    function checkWin(board, player) {
        return winningConditions.some(combination => {
            return combination.every(index => {
                return board[index] === player;
            });
        });
    }

    const aiMove = () => {
        currentPlayer = 'O';
        let bestMove = minimax(gameState, currentPlayer).index;
        gameState[bestMove] = 'O';
        cells[bestMove].innerText = 'O';
        cells[bestMove].classList.add('used');
    
        if (checkWinner() || checkTie()) {
            updateGameStatus();
            return;
        }
    
        currentPlayer = 'X';
        playerIndicator.innerText = `Player's turn`;
    };

    const findBestMove = () => {
        // AI tries to win or block player's win
        for (let condition of winningConditions) {
            const [a, b, c] = condition;
            if (gameState[a] === gameState[b] && gameState[a] !== '' && gameState[c] === '') {
                return c;
            }
            if (gameState[a] === gameState[c] && gameState[a] !== '' && gameState[b] === '') {
                return b;
            }
            if (gameState[b] === gameState[c] && gameState[b] !== '' && gameState[a] === '') {
                return a;
            }
        }

        // If no win/block move, pick random empty cell
        const emptyCells = gameState.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
        if (emptyCells.length > 0) {
            return emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }

        return -1; // No available moves
    };

    const checkWinner = () => {
        return winningConditions.some(combination => {
            return combination.every(index => {
                return gameState[index] === currentPlayer;
            });
        });
    };

    const checkTie = () => {
        return gameState.every(cell => cell !== '');
    };

    const updateGameStatus = () => {
        if (checkWinner()) {
            playerIndicator.innerText = `${currentPlayer === 'X' ? 'Player' : 'AI'} wins!`;
            if (currentPlayer === 'X') {
                playerWins++;
            } else {
                aiWins++;
            }
            updateWinCount();
        } else if (checkTie()) {
            playerIndicator.innerText = `Game is a tie!`;
        }
    };

    const updateWinCount = () => {
        playerWinCount.innerText = `Player Wins: ${playerWins}`;
        aiWinCount.innerText = `AI Wins: ${aiWins}`;
    };

    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => {
            if (currentPlayer === 'X' && gameState[index] === '') {
                handleCellClick(cell, index);
            }
        });
    });

    resetButton.addEventListener('click', initializeGame);

    initializeGame();
});
