import { Game } from "./game.js";

const xButton = document.querySelector('.menu--turn__mark--x');
const oButton = document.querySelector('.menu--turn__mark--o');
const oMark = './assets/icon-o.svg';
const xMark = './assets/icon-x.svg';
const playerTurnImage = document.querySelector('.board--navigation__turn--image img');
const newGameCPU = document.querySelector('#newGameCPU');
const newGamePlayer = document.querySelector('#newGamePlayer');
const menu = document.querySelector('.menu');
const board = document.querySelector('.board');
const pannels = document.querySelectorAll('.board--panels .panel');
const ovrerlay = document.querySelector('.overlay');
const banner = document.querySelector('.banner');
const bannerDecision = banner.querySelector('.banner--decision');
const bannerRestart = banner.querySelector('.banner--restart');

const quitButton = document.querySelector('.banner_quit');
const nextRoundButton = document.querySelector('.banner_next');
const restartButton = document.querySelector('.board--navigation__restart button');
// check
const boardResults = document.querySelector('.board--results');
const scoreX = boardResults.querySelector('.result--score.firstPlayer');
const scoreO = boardResults.querySelector('.result--score.secondPlayer');
const scoreDraw = boardResults.querySelector('.result--score.drawScore');

const game = new Game();

xButton.addEventListener('click', () => {
    xButton.dataset.selected ='true';
    oButton.dataset.selected ='false';
    game.selectPlayer('X');
});

oButton.addEventListener('click', () => {
    xButton.dataset.selected = 'false';
    oButton.dataset.selected = 'true';
    game.selectPlayer('O');
}); 

newGamePlayer.addEventListener('click', () => {
    menu.style.display = 'none';
    board.style.display = 'flex';
    game.isCPUPlaying = false;
});
newGameCPU.addEventListener('click', () => {
    menu.style.display = 'none';
    board.style.display = 'flex';
    game.isCPUPlaying = true;
    game.player = xButton.dataset.selected === 'true' ? 'X' : 'O';
    game.cpu = game.player === 'X' ? 'O' : 'X';
    cpuFirstMove();
});

quitButton.addEventListener('click', () => {
    window.location.reload();
});

restartButton.addEventListener('click', () => {
    decisionBanner('restart');
});

nextRoundButton.addEventListener('click', () => {
    game.board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    game.currentPlayer = 'X';
    game.isGameOver = false;

    pannels.forEach(panel => {
        panel.innerHTML = '';
    });

    ovrerlay.dataset.visible = 'false';
    banner.style.display = 'none';

    playerTurnImage.src = './assets/icon-x.svg';

    scoreX.innerHTML = game.gameStats.XWins;
    scoreO.innerHTML = game.gameStats.OWins;
    scoreDraw.innerHTML = game.gameStats.Draws;

    cpuFirstMove();
});

pannels.forEach((panel, index) => {
    panel.addEventListener('click', () => {
        if(game.isGameOver || game.board[Math.floor(index / 3)][index % 3] !== ''){
            return;
        }
        if(game.isCPUPlaying && game.currentPlayer === game.cpu){
            return;
        }
        const currentPlayer = game.currentPlayer;
        if(currentPlayer === 'O')
            panel.innerHTML = `<img src="${oMark}" alt="O Mark">`;
        if(currentPlayer === 'X')
            panel.innerHTML = `<img src="${xMark}" alt="X Mark">`;

        game.board[Math.floor(index / 3)][index % 3] = game.currentPlayer;
        const result = game.checkWin();
        console.log('Player result: ', result);

        if(result){
            setTimeout(() => {
                winBanner(result);
            }, 500);
            game.updateScore();
        } else {
            const player = game.togglePlayer();
            updateTurnInfo();

            if(game.isCPUPlaying && player === game.cpu){
                const cpu = game.cpuMove();
                setTimeout(() => {
                    updatePannelImage(cpu);
                    game.togglePlayer();
                    updateTurnInfo();
                }, 500);
                
                const cpuResult = game.checkWin();
                console.log('CPU result: ', cpuResult);
                if(cpuResult){
                    setTimeout(() => {
                        winBanner(cpuResult);
                    }, 500);
                    game.updateScore();
                }
            }
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
function decisionBanner(decision){
    ovrerlay.dataset.visible = 'true';
    banner.style.display = 'flex';
    if(decision === 'restart') {
        banner.querySelector('h3').style.display = 'none';
        banner.querySelector('h2').textContent = "Start a new match?";
        banner.querySelector('img').style.display = 'none';
        bannerDecision.style.display = 'none';
        bannerRestart.style.display = 'flex';
    }else{
        banner.querySelector('h3').textContent = `New Game`;
        banner.querySelector('h2').textContent = "Start a new match?";
        banner.querySelector('img').style.display = 'none';
        bannerDecision.style.display = 'flex';
        bannerRestart.style.display = 'none';
    }   
}

function updateTurnInfo(){
    game.currentPlayer === 'O' ? playerTurnImage.src = './assets/icon-o.svg' : playerTurnImage.src = './assets/icon-x.svg';
}
function updatePannelImage(cpu){
    pannels[cpu.row * 3 + cpu.col].innerHTML = cpu.mark === 'O' ? `<img src="${oMark}" alt="O Mark">` : `<img src="${xMark}" alt="X Mark">`;
}
function cpuFirstMove(){
    if(game.cpu === 'X'){
        const cpu = game.cpuMove();
        setTimeout(() => {
            updatePannelImage(cpu);
            game.togglePlayer();
            updateTurnInfo();
        }, 500);
    }
}