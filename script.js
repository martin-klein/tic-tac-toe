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

    const makeMove = (cell, index) => {
        gameState[index] = currentPlayer;
        cell.innerText = currentPlayer;
        cell.classList.add('used');

        if (checkWinner(currentPlayer)) {
            if (currentPlayer === 'X') {
                playerWins++;
            } else {
                aiWins++;
            }
            updateWinCount();
            playerIndicator.innerText = `${currentPlayer} wins!`;
            setTimeout(initializeGame, 2000);
        } else if (checkTie()) {
            playerIndicator.innerText = 'Game is a tie!';
            setTimeout(initializeGame, 2000);
        } else {
            if (currentPlayer === 'X') {
                aiMove();
            }
        }
    };

    const aiMove = () => {
        let bestMove = findBestMove(gameState);
        gameState[bestMove] = 'O';
        cells[bestMove].innerText = 'O';
        cells[bestMove].classList.add('used');

        if (checkWinner('O')) {
            aiWins++;
            updateWinCount();
            playerIndicator.innerText = 'AI wins!';
            setTimeout(initializeGame, 2000);
            return;
        }

        if (checkTie()) {
            playerIndicator.innerText = 'Game is a tie!';
            setTimeout(initializeGame, 2000);
            return;
        }

        currentPlayer = 'X';
        playerIndicator.innerText = `Player's turn`;
    };

    const findBestMove = (board) => {
        let bestVal = -1000;
        let bestMove = -1;

        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let moveVal = minimax(board, 0, false);
                board[i] = '';

                if (moveVal > bestVal) {
                    bestMove = i;
                    bestVal = moveVal;
                }
            }
        }
        return bestMove;
    };

    const minimax = (newBoard, depth, isMaximizing) => {
        let score = evaluateBoard(newBoard);

        if (score === 10 || score === -10) return score;
        if (isMovesLeft(newBoard) === false) return 0;

        if (isMaximizing) {
            let best = -1000;
            for (let i = 0; i < newBoard.length; i++) {
                if (newBoard[i] === '') {
                    newBoard[i] = 'O';
                    best = Math.max(best, minimax(newBoard, depth + 1, !isMaximizing));
                    newBoard[i] = '';
                }
            }
            return best;
        } else {
            let best = 1000;
            for (let i = 0; i < newBoard.length; i++) {
                if (newBoard[i] === '') {
                    newBoard[i] = 'X';
                    best = Math.min(best, minimax(newBoard, depth + 1, !isMaximizing));
                    newBoard[i] = '';
                }
            }
            return best;
        }
    };

    const evaluateBoard = (board) => {
        for (let condition of winningConditions) {
            if (board[condition[0]] === board[condition[1]] && board[condition[1]] === board[condition[2]]) {
                if (board[condition[0]] === 'O') {
                    return 10;
                } else if (board[condition[0]] === 'X') {
                    return -10;
                }
            }
        }
        return 0;
    };

    const isMovesLeft = (board) => {
        return board.some(cell => cell === '');
    };

    const checkWinner = (player) => {
        return winningConditions.some(combination => {
            return combination.every(index => {
                return gameState[index] === player;
            });
        });
    };

    const checkTie = () => {
        return gameState.every(cell => cell !== '');
    };

    const updateWinCount = () => {
        playerWinCount.innerText = `Player Wins: ${playerWins}`;
        aiWinCount.innerText = `AI Wins: ${aiWins}`;
    };

    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => {
            if (currentPlayer === 'X' && gameState[index] === '') {
                makeMove(cell, index);
            }
        });
    });

    resetButton.addEventListener('click', initializeGame);

    initializeGame();
});
