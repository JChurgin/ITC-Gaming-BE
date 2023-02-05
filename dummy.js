const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: '*' } });

app.use(express.json());

let game;

const printBoard = () => {
    console.log(game.board[0], game.board[1], game.board[2]);
    console.log(game.board[3], game.board[4], game.board[5]);
    console.log(game.board[6], game.board[7], game.board[8]);
    console.log(' ');
}

const resetGame = () => {
    game = {
        board: ["E", "E", "E", "E", "E", "E", "E", "E", "E"],
        turn: "X",
        gameStarted: false,
        gameover: false,
        winner: null,
    };
}

const checkWinner = (board) => {
  const winningComb = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
    [1, 4, 7],
    [2, 5, 8],
  ];

  let winner;
  winningComb.forEach(([a, b, c]) => {
    if (board[a] !== 'E' && board[a] === board[b] && board[b] === board[c]) {
        winner = board[a];
    }
  });

  return winner;
};

const checkDraw = (board) => {
    return !board.includes('E') && !checkWinner(board)
}

app.post('/move', (req, res) => {
    const pos = req.body.pos;

    if (game.gameover) {
        return res.status(400).json({ error: 'game is over' });
    }

    if (game.board[pos] !== 'E') {
        return res.status(400).json({ error: 'position is not empty' });
    }

    game.board[pos] = game.turn;
    printBoard();
    const winner = checkWinner(game.board);
    if (winner) {
        console.log('winner found', winner)
        game.gameover = true;
        game.winner = winner;
        return res.json({ game })
    } else if (checkDraw(game.board)) {
        console.log('no winner, game is draw')
        game.gameover = true;
        return res.json({ game })
    }

    game.turn = game.turn === 'X' ? 'O' : 'X';
    return res.json({ game });
});

app.post('/reset', (req, res) => {
    resetGame();
    res.json({ game });
})

app.get('/game', (req, res) => {
    res.json({ game });
})

const players = {
    X: false,
    O: false,
}

io.on('connection', async socket => {
    const connectedSockets = await io.fetchSockets();

    if (connectedSockets.length > 2) {
        socket.emit('error', { error: 'game is full, no more players can connect' });
        return socket.disconnect(true);
    }

    let symbol;
    for (let p in players) {
        if (!players[p]) {
            symbol = p;
            players[p] = true;
            break;
        }
    }
    socket.emit('symbol', symbol);

    socket.emit('gameState', game);

    if (connectedSockets.length === 2) {
        game.gameStarted = true;
        io.emit('gameStarted', game);
    }

    socket.on('disconnect', () => {
        resetGame();
        players[symbol] = false;
        io.emit('gameReset', game);
    })

    socket.on('move', (data) => {
        const pos = data.pos;

        if (game.gameover) {
            return socket.emit('error', { error: 'game is over' });
        }

        if (!game.gameStarted) {
            return socket.emit('error', { error: 'the game hasn\'t started yet' });
        }

        if (game.turn !== symbol) {
            return socket.emit('error', { error: 'this is not your turn' });
        }
    
        if (game.board[pos] !== 'E') {
            return socket.emit('error', { error: 'position is not empty' });
        }
    
        game.board[pos] = symbol;
        printBoard();
        const winner = checkWinner(game.board);
        if (winner) {
            console.log('winner found', winner)
            game.gameover = true;
            game.winner = winner;
            return io.emit('gameOver', game);
        } else if (checkDraw(game.board)) {
            console.log('no winner, game is draw')
            game.gameover = true;
            return io.emit('gameOver', game);
        }
    
        game.turn = game.turn === 'X' ? 'O' : 'X';
        return io.emit('gameState', game);
    })
})

server.listen(3000, () => {
    resetGame();
    console.log('listening on port 3000');
});
