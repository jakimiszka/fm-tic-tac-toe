import { Game } from "./game.js";

// CACHE DOM ELEMENTS
const banner = document.querySelector('.banner');
const menu = document.querySelector('.menu');
const board = document.querySelector('.board');
const overlay = document.querySelector('#overlay');
// MENU - elements
const menuTurn = menu.querySelector('.menu--turn');
const xButton = menuTurn.querySelector('.menu--turn__mark--x');
const oButton = menuTurn.querySelector('.menu--turn__mark--o');
const oMark = './assets/icon-o.svg';
const xMark = './assets/icon-x.svg';
const oMarkOutline = './assets/icon-o-outline.svg';
const xMarkOutline = './assets/icon-x-outline.svg';
const newGameCPU = menu.querySelector('#newGameCPU');
const newGamePlayer = menu.querySelector('#newGamePlayer');
// BANNER - elements
const bannerDecision = banner.querySelector('.banner--decision');
const bannerInfo = banner.querySelector('.banner--info');
const bannerInfoImage = bannerInfo.querySelector('img');
const bannerRestart = banner.querySelector('.banner--restart');
const bannerH3 = banner.querySelector('h3');
const bannerH2 = banner.querySelector('h2');
const bannerImg = banner.querySelector('img');
const restartYesButton = bannerRestart.querySelector('.yes');
const restartNoButton = bannerRestart.querySelector('.no');
const quitButton = bannerDecision.querySelector('.banner_quit');
const nextRoundButton = bannerDecision.querySelector('.banner_next');
// BOARD - elements
const playerTurnImage = board.querySelector('.board--navigation__turn--image img');
const pannels = board.querySelectorAll('.board--panels .panel');
const restartButton = board.querySelector('#restartButton');
const boardResults = board.querySelector('.board--results');
const playerX = boardResults.querySelector('#playerX');
const playerO = boardResults.querySelector('#playerO');
const scoreDraw = boardResults.querySelector('#drwas');
const playerXLabel = playerX.querySelector('#playerX_label');
const playerOLabel = playerO.querySelector('#playerO_label');
const drawsScore = scoreDraw.querySelector('#draws_score');
const playerXScore = playerX.querySelector('#playerX_score');
const playerOScore = playerO.querySelector('#playerO_score');

const game = new Game();

xButton.addEventListener('click', () => selectMark('X'));
oButton.addEventListener('click', () => selectMark('O')); 

newGamePlayer.addEventListener('click', () => {
    menu.style.display = 'none';
    board.style.display = 'flex';

    setScoreLabels();
    setScores();
    game.isCPUPlaying = false;
});
newGameCPU.addEventListener('click', () => {
    menu.style.display = 'none';
    board.style.display = 'flex';
    game.isCPUPlaying = true;
    game.player = xButton.dataset.selected === 'true' ? 'X' : 'O';
    game.cpu = game.player === 'X' ? 'O' : 'X';
    setScoreLabels();
    cpuFirstMove();
});

quitButton.addEventListener('click', () => {
    window.location.reload();
});

restartButton.addEventListener('click', () => {
    decisionBanner('restart');
});

nextRoundButton.addEventListener('click', () => {
    restorePannels();
    restartGame();
    setScores();
    cpuFirstMove();
});

restartYesButton.addEventListener('click', () => {
    restorePannels();
    restartGame();
    cpuFirstMove();
    banner.style.display = 'none';
});

restartNoButton.addEventListener('click', () => {
    overlay.dataset.visible = 'false';
    banner.style.display = 'none';
});

pannels.forEach((panel, index) => {
    panel.addEventListener('click', () => handlePanelClick(panel, index));
});

function winBanner(result){
    overlay.dataset.visible = 'true';
    banner.style.display = 'flex';
    bannerDecision.style.display = 'flex';
    if(result === 'Draw'){
        bannerH3.textContent = "Round tied";
        bannerH2.textContent = "No one wins!";
        bannerImg.style.display = 'none';
    } else {
        bannerH3.textContent = `Player ${result} wins!`;
        bannerH2.textContent = "takes the round!";
        bannerImg.style.display = 'block';
        if(result === 'O'){
            bannerInfoImage.src = './assets/icon-o.svg';
        }else{
            bannerInfoImage.src  = './assets/icon-x.svg';        
        }
        
    }
}

function decisionBanner(decision){
    overlay.dataset.visible = 'true';
    banner.style.display = 'flex';
    bannerH2.textContent = "Start a new match?";
    bannerImg.style.display = 'none';
    if(decision === 'restart') {
        bannerH3.style.display = 'none';
        bannerDecision.style.display = 'none';
        bannerRestart.style.display = 'flex';
    } else {
        bannerH3.textContent = 'New Game';
        bannerDecision.style.display = 'flex';
        bannerRestart.style.display = 'none';
    }
}

function updateTurnInfo(){
    game.currentPlayer === 'O' ? playerTurnImage.src = oMarkOutline: playerTurnImage.src = xMarkOutline;
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

function setScores(){
    playerXScore.innerHTML = game.gameStats.XWins;
    playerOScore.innerHTML = game.gameStats.OWins;
    drawsScore.innerHTML = game.gameStats.Draws;
}

function setScoreLabels(){
    if(game.isCPUPlaying){
        playerXLabel.innerHTML = game.player === 'X' ? `${game.player} (YOU)` : `${game.cpu} (CPU)`;
        playerOLabel.innerHTML = game.player === 'O' ? `${game.player} (YOU)` : `${game.cpu} (CPU)`;
        return;
    }else{
        playerXLabel.innerHTML = game.player === 'X' ? `${game.player} (1st)` : `${game.player2} (2nd)`;
        playerOLabel.innerHTML = game.player2 === 'O' ? `${game.player2} (2nd)` : `${game.player} (1st)`;
        return;
    }
}

function restartGame(){
    game.sessionReset();
    pannels.forEach(panel => {
        panel.innerHTML = '';
    });
    banner.style.display = 'none';
    overlay.dataset.visible = 'false';
    bannerRestart.style.display = 'none';
    playerTurnImage.src = xMarkOutline;
}

function selectMark(mark) {
    if (mark === 'X') {
        xButton.dataset.selected = 'true';
        oButton.dataset.selected = 'false';
        game.selectPlayer('X');
        game.selectPlayer2('O');
    } else {
        xButton.dataset.selected = 'false';
        oButton.dataset.selected = 'true';
        game.selectPlayer('O');
        game.selectPlayer2('X');
    }
}

function restorePannels(){
    pannels.forEach(panel => {
        panel.classList.remove('winOPannel');
        panel.classList.remove('winXPannel');
        const img = panel.querySelector('img');
        if(img){
            img.style.filter = '';
        }
    });
}

function handlePanelClick(panel, index) {
    if (game.isGameOver || game.board[Math.floor(index / 3)][index % 3] !== '') {
        return;
    }
    if (game.isCPUPlaying && game.currentPlayer === game.cpu) {
        return;
    }

    // Place player's mark
    const currentPlayer = game.currentPlayer;
    panel.innerHTML = currentPlayer === 'O' ? `<img src="${oMark}" alt="O Mark">` : `<img src="${xMark}" alt="X Mark">`;
    game.board[Math.floor(index / 3)][index % 3] = currentPlayer;

    const result = game.checkWin();
    if (result && result.winner && result.winningPanels) {
        // Highlight winning panels
        result.winningPanels.forEach(p => {
            const panelElement = pannels[p.row * 3 + p.col];
            const img = panelElement.querySelector('img');
            if (result.winner === 'X') {
                panelElement.classList.add('winXPannel');
                console.log(img);
                if (img) img.style.filter = 'var(--mark-win)';
            } else if (result.winner === 'O') {
                panelElement.classList.add('winOPannel');
                if (img) img.style.filter = 'var(--mark-win)';
            }
        });
    }

    if (result && (result.winner || result === 'Draw')) {
        // Game over
        setTimeout(() => {
            winBanner(result.winner || 'Draw');
        }, 500);
        game.updateScore();
        setScores();
    } else {
        // Continue game
        game.togglePlayer();
        updateTurnInfo();

        if (game.isCPUPlaying && game.currentPlayer === game.cpu) {
            // CPU move
            setTimeout(() => {
                const cpu = game.cpuMove();
                updatePannelImage(cpu);
                game.togglePlayer();
                updateTurnInfo();

                const cpuResult = game.checkWin();
                if (cpuResult && (cpuResult.winner || cpuResult === 'Draw')) {
                    setTimeout(() => {
                        winBanner(cpuResult.winner || 'Draw');
                    }, 500);
                    game.updateScore();
                    setScores();
                }
            }, 500);
        }
    }
}