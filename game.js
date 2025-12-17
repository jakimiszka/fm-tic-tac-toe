class Game{
    constructor(){ 
        this.board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        this.currentPlayer = 'X';
        this.player = 'X';
        this.player2 = 'O';
        this.cpu = '';
        this.isCPUPlaying = false;
        this.isGameOver = false;
        this.gameStats = {
            XWins: 0,
            OWins: 0,
            Draws: 0
        };
    }

    selectPlayer(symbol){this.player = symbol;}
    selectPlayer2(symbol){this.player2 = symbol;}

    updateScore(){
        const winner = this.checkWin();
        if(winner.winner === 'X'){
            this.gameStats.XWins += 1;
        } else if(winner.winner === 'O'){
            this.gameStats.OWins += 1;
        } else if(winner === 'Draw'){
            this.gameStats.Draws += 1;
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

    cpuMove(){
        if(this.isGameOver) return;

        let availableMoves = [];
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                if(this.board[i][j] === ''){
                    availableMoves.push([i, j]);
                }
            }
        }

        if(availableMoves.length === 0) return;

        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        const [row, col] = availableMoves[randomIndex];
        this.board[row][col] = this.currentPlayer;
        const result = this.checkWin();
        return {result, row, col, mark: this.currentPlayer};
    }

    checkWin(){
        // Check rows
        for(let row of this.board){
            if(row[0] !== '' && row[0] === row[1] && row[1] === row[2]){
                this.isGameOver = true;
                return {winner: row[0], winningPanels: [
                    {row: this.board.indexOf(row), col: 0},
                    {row: this.board.indexOf(row), col: 1},
                    {row: this.board.indexOf(row), col: 2}
                ]};
            }
        }

        // Check columns
        for(let col = 0; col < 3; col++){
            if(this.board[0][col] !== '' && this.board[0][col] === this.board[1][col] && this.board[1][col] === this.board[2][col]){
                this.isGameOver = true;
                return {winner: this.board[0][col], winningPanels: [
                    {row: 0, col},
                    {row: 1, col},
                    {row: 2, col}
                ]};
            }
        }

        // Check diagonals
        if(this.board[0][0] !== '' && this.board[0][0] === this.board[1][1] && this.board[1][1] === this.board[2][2]){
            this.isGameOver = true;
            return {winner: this.board[0][0], winningPanels: [
                {row: 0, col: 0},
                {row: 1, col: 1},
                {row: 2, col: 2}
            ]};
        }
        if(this.board[0][2] !== '' && this.board[0][2] === this.board[1][1] && this.board[1][1] === this.board[2][0]){
            this.isGameOver = true;
            return {winner: this.board[0][2], winningPanels: [
                {row: 0, col: 2},
                {row: 1, col: 1},
                {row: 2, col: 0}
            ]}; 
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