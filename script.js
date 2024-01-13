document.addEventListener('DOMContentLoaded', () => {

    const cells = document.querySelectorAll('.cell');
    let currentPlayer = 'X'; // Player is always 'X' and AI is 'O'
    let gameState = ['', '', '', '', '', '', '', '', ''];
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    const playerIndicator = document.getElementById('player-indicator');
    const resetButton = document.getElementById('reset-button');

    const initializeGame = () => {
        gameState.fill('');
        cells.forEach(cell => {
            cell.innerText = '';
            cell.classList.remove('used');
        });
        currentPlayer = 'X';
        playerIndicator.innerText = `Player's turn`;
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

    const aiMove = () => {
        let moveIndex = findBestMove();
        if (moveIndex !== -1) {
            gameState[moveIndex] = 'O';
            cells[moveIndex].innerText = 'O';
            cells[moveIndex].classList.add('used');
        }

        if (checkWinner() || checkTie()) {
            updateGameStatus();
            return;
        }

        currentPlayer = 'X'; // Switch back to the player
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
        } else if (checkTie()) {
            playerIndicator.innerText = `Game is a tie!`;
        }
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
