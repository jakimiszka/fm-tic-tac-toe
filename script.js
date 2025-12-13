import { Game } from "./game.js";

const xButton = document.querySelector('.menu--turn__mark--x');
const oButton = document.querySelector('.menu--turn__mark--o');
const oMark = './assets/icon-o.svg';
const xMark = './assets/icon-x.svg';
const playerTurnImage = document.querySelector('.board--navigation__turn--image img');
const newGameCPU = document.querySelector('#newGameCPU');
const menu = document.querySelector('.menu');
const board = document.querySelector('.board');
const pannels = document.querySelectorAll('.board--panels .panel');
const ovrerlay = document.querySelector('.overlay');
const banner = document.querySelector('.banner');

const game = new Game();

xButton.addEventListener('click', () => {
    xButton.dataset.selected ='true';
    oButton.dataset.selected ='false';
    console.log(xButton.dataset.selected);
});

oButton.addEventListener('click', () => {
    xButton.dataset.selected = 'false';
    oButton.dataset.selected = 'true';
}); 

newGameCPU.addEventListener('click', () => {
    menu.style.display = 'none';
    board.style.display = 'flex';
});

pannels.forEach((panel, index) => {
    panel.addEventListener('click', () => {

        // Prevent further moves if game is over or panel is already marked
        if(game.isGameOver || game.board[Math.floor(index / 3)][index % 3] !== ''){
            return;
        }

        // fill the panel
        const currentPlayer = game.currentPlayer;
        if(currentPlayer === 'O')
            panel.innerHTML = `<img src="${oMark}" alt="O Mark">`;
        if(currentPlayer === 'X')
            panel.innerHTML = `<img src="${xMark}" alt="O Mark">`;

        // Update the game board
        game.board[Math.floor(index / 3)][index % 3] = game.currentPlayer;
        const result = game.checkWin();
        
        if(result){
            winBanner(result)
        } else {
            const player = game.togglePlayer();
            player === 'O' ? playerTurnImage.src = './assets/icon-o.svg' : playerTurnImage.src = './assets/icon-x.svg';               
        }
    });
});

function winBanner(result){
    ovrerlay.dataset.visible = 'true';
    banner.style.display = 'flex';
    if(result === 'Draw'){
        banner.querySelector('h3').textContent = "Round tied";
        banner.querySelector('h2').textContent = "No one wins!";
    } else {
        banner.querySelector('h3').textContent = `Player ${result} wins!`;
        banner.querySelector('h2').textContent = "takes the round!";
        if(result === 'O' && oButton.dataset.selected === 'true'){
            banner.querySelector('img').src = './assets/icon-o.svg';
        }else{
            banner.querySelector('img').src  = './assets/icon-x.svg';        
        }
    }
}

// TODO check this function
function decisionBanner(){
    ovrerlay.dataset.visible = 'true';
    banner.style.display = 'flex';
    banner.querySelector('h3').textContent = `New Game`;
    banner.querySelector('h2').textContent = "Start a new match?";
    banner.querySelector('img').style.display = 'none';
}