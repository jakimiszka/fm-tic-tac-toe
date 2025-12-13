class Game{
    constructor(){ 
        this.board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        this.currentPlayer = 'X';
        this.isGameOver = false;
        this.gameStats = {
            XWins: 0,
            OWins: 0,
            Draws: 0
        };
    }

    preserveSession(){
        const savedStats = localStorage.getItem('gameStats');
        if(savedStats){
            this.gameStats = JSON.parse(savedStats);
        }
    }

    sessionReset(){
        this.board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        this.currentPlayer = 'X';
        this.isGameOver = false;
    }   

    togglePlayer(){
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        return this.currentPlayer;
    }

    checkWin(){
        // Check rows
        for(let row of this.board){
            if(row[0] !== '' && row[0] === row[1] && row[1] === row[2]){
                this.isGameOver = true;
                return row[0];
            }
        }

        // Check columns
        for(let col = 0; col < 3; col++){
            if(this.board[0][col] !== '' && this.board[0][col] === this.board[1][col] && this.board[1][col] === this.board[2][col]){
                this.isGameOver = true;
                return this.board[0][col];
            }
        }

        // Check diagonals
        if(this.board[0][0] !== '' && this.board[0][0] === this.board[1][1] && this.board[1][1] === this.board[2][2]){
            this.isGameOver = true;
            return this.board[0][0];
        }
        if(this.board[0][2] !== '' && this.board[0][2] === this.board[1][1] && this.board[1][1] === this.board[2][0]){
            this.isGameOver = true;
            return this.board[0][2];
        }

        // Check for draw
        let isDraw = true;
        for(let row of this.board){
            for(let cell of row){
                if(cell === ''){
                    isDraw = false;
                    break;
                }
            }
        }
        if(isDraw){
            this.isGameOver = true;
            return 'Draw';
        }

        return null;
    }
}

export { Game };