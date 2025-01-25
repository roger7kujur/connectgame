class ConnectFour {
    constructor(rows = 6, cols = 7) {
        this.rows = rows;
        this.cols = cols;
        this.board = Array.from({ length: rows }, () => Array(cols).fill(null));
        this.currentPlayer = 'red';
        this.gameOver = false;
        this.initBoard();
        this.addEventListeners();
    }

    initBoard() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell', 'empty');
                cell.dataset.row = row;
                cell.dataset.col = col;
                gameBoard.appendChild(cell);
            }
        }
    }

    addEventListeners() {
        const gameBoard = document.getElementById('game-board');
        const resetBtn = document.getElementById('reset-btn');
        
        gameBoard.addEventListener('click', (e) => {
            if (this.gameOver) return;
            const col = parseInt(e.target.dataset.col);
            if (!isNaN(col)) this.dropPiece(col);
        });

        resetBtn.addEventListener('click', () => this.resetGame());
    }

    dropPiece(col) {
        for (let row = this.rows - 1; row >= 0; row--) {
            if (this.board[row][col] === null) {
                this.board[row][col] = this.currentPlayer;
                this.updateCell(row, col);
                
                if (this.checkWinner(row, col)) {
                    this.endGame(`Player ${this.currentPlayer.toUpperCase()} Wins!`);
                    return;
                }

                if (this.isBoardFull()) {
                    this.endGame("It's a Draw!");
                    return;
                }

                this.switchPlayer();
                break;
            }
        }
    }

    updateCell(row, col) {
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        cell.classList.remove('empty');
        cell.classList.add(this.currentPlayer);
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'red' ? 'yellow' : 'red';
        document.getElementById('status').textContent = `Player ${this.currentPlayer.toUpperCase()}'s Turn`;
    }

    checkWinner(row, col) {
        const player = this.board[row][col];
        const directions = [
            [[0, 1], [0, -1]], // Horizontal
            [[1, 0], [-1, 0]], // Vertical
            [[1, 1], [-1, -1]], // Diagonal top-left to bottom-right
            [[1, -1], [-1, 1]]  // Diagonal top-right to bottom-left
        ];

        for (const [dir1, dir2] of directions) {
            let count = 1;
            // Check in first direction
            count += this.countConsecutive(row, col, dir1[0], dir1[1], player);
            // Check in opposite direction
            count += this.countConsecutive(row, col, dir2[0], dir2[1], player);

            if (count >= 4) return true;
        }
        return false;
    }

    countConsecutive(row, col, rowDir, colDir, player) {
        let count = 0;
        let newRow = row + rowDir;
        let newCol = col + colDir;

        while (newRow >= 0 && newRow < this.rows && 
               newCol >= 0 && newCol < this.cols && 
               this.board[newRow][newCol] === player) {
            count++;
            newRow += rowDir;
            newCol += colDir;
        }
        return count;
    }

    isBoardFull() {
        return this.board[0].every(cell => cell !== null);
    }

    endGame(message) {
        this.gameOver = true;
        document.getElementById('status').textContent = message;
    }

    resetGame() {
        this.board = Array.from({ length: this.rows }, () => Array(this.cols).fill(null));
        this.currentPlayer = 'red';
        this.gameOver = false;
        this.initBoard();
        document.getElementById('status').textContent = 'Player Red\'s Turn';
    }
}

// Initialize the game
new ConnectFour();
