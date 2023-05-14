const ai = {
  role: 'o',
  ene: 'x',
  board: [],
  scoreBoard: [],
  cntMove: 0,
  maxMove: 30,
  minMove: 10,
  maxRandom: 2,
  
  checkWin: function (board, pos, roleCheck) {
    if (countRow(board, pos, roleCheck) >= 5 ||
        countCol(board, pos, roleCheck) >= 5 ||
        countDownDiag(board, pos, roleCheck) >= 5 ||
        countUpDiag(board, pos, roleCheck) >= 5) {
      return 1;
    }
    return 0;
  },

  checkLost: function (board, pos, roleCheck) {
    if (countRow(board, pos, roleCheck) >= 5 ||
      countCol(board, pos, roleCheck) >= 5 ||
      countDownDiag(board, pos, roleCheck) >= 5 ||
      countUpDiag(board, pos, roleCheck) >= 5) {
      return 1;
    }
    return 0;
  },

  setScoreBoard: function () {
    // init score board
    for (let i = 0; i < this.board.length; i++) {
      this.scoreBoard[i] = [];
      for (let j = 0; j < this.board[0].length; j++) {
        if (this.board[i][j] === ' ') {
          this.scoreBoard[i][j] = 0;
        } else {
          this.scoreBoard[i][j] = -1;
        }
      }
    }
    // set score board
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[0].length; j++) {
        if (this.board[i][j] === ' ') {
          this.board[i][j] = this.role;
          this.scoreBoard[i][j] = Math.max(countRow(this.board, [i, j], this.role),
                                      countCol(this.board, [i, j], this.role),
                                      countDownDiag(this.board, [i, j], this.role),
                                      countUpDiag(this.board, [i, j], this.role));
          this.board[i][j] = this.ene;
          this.scoreBoard[i][j] = Math.max(this.scoreBoard[i][j],
                                      countRow(this.board, [i, j], this.ene),
                                      countCol(this.board, [i, j], this.ene),
                                      countDownDiag(this.board, [i, j], this.ene),
                                      countUpDiag(this.board, [i, j], this.ene));
          this.board[i][j] = ' ';
        }
      }
    }
  },

  getChildNodes: function () {
    this.setScoreBoard();
    let availableNodes = [];
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[0].length; j++) {
        if (this.board[i][j] === ' ') {
          availableNodes.push([i, j]);
        }
      }
    }
    availableNodes.sort((a, b) => {
      return this.scoreBoard[b[0]][b[1]] - this.scoreBoard[a[0]][a[1]]; 
    });
    let childNodes = [];
    for (let i = 0; i < this.maxMove; i++) {
      if (availableNodes[i] !== undefined && this.scoreBoard[availableNodes[i][0]][availableNodes[i][1]] === 0) {
        break;
      }
      childNodes.push(availableNodes[i]);
    }
    if (childNodes.length === 0) {
      for (let i = 0; i < this.minMove; i++) {
        if (availableNodes[i] === undefined) {
          break;
        }
        childNodes.push(availableNodes[i]);
      }
    }
    return childNodes;
  },


  evaluate: function (pos, board, alpha, beta, depth, roleCheck) {
    if (pos[0] == 0 && pos[0] == board.length - 1 && pos[1] == 0 && pos[1] == board[0].length - 1 ) {
      if (this.checkWin(board, pos, this.role)) {
        return 5 - depth;
      } else {
        return -100;
      }
    }
    if (depth == 5) {
      if (this.checkWin(board, pos, this.role)) {
        return 1;
      } else if (this.checkLost(board, pos, this.ene)) {
        return -1;
      }
      return 0;
    }
    let childNodes = this.getChildNodes();
    if (roleCheck === this.role) {
      let maxScore = -Infinity;
      for (let i = 0; i < childNodes.length; i++) {
        board[childNodes[i][0]][childNodes[i][1]] = this.role;
        if (this.checkWin(board, childNodes[i], this.role)) {
          board[childNodes[i][0]][childNodes[i][1]] = ' ';
          return 5 - depth;
        }
        let score = this.evaluate(childNodes[i], board, alpha, beta, depth + 1, this.ene);
        board[childNodes[i][0]][childNodes[i][1]] = ' ';
        maxScore = Math.max(maxScore, score);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) {
          break;
        }
      }
      return maxScore;
    }
    if (roleCheck === this.ene) {
      let minScore = Infinity;
      for (let i = 0; i < childNodes.length; i++) {
        board[childNodes[i][0]][childNodes[i][1]] = this.ene;
        if (this.checkLost(board, childNodes[i], this.ene)) {
          board[childNodes[i][0]][childNodes[i][1]] = ' ';
          return depth - 5;
        }
        let score = this.evaluate(childNodes[i], board, alpha, beta, depth + 1, this.role);
        board[childNodes[i][0]][childNodes[i][1]] = ' ';
        minScore = Math.min(minScore, score);
        beta = Math.min(beta, score);
        if (beta <= alpha) {
          break;
        }
      }
      return minScore;
    }
  },


  random: function () {
    let randoms = [];
    for (let i = parseInt(this.board.length / 2) - 1; i <= parseInt(this.board.length / 2) + 1; i++) {
      for (let j = parseInt(this.board[0].length / 2) - 1; j <= parseInt(this.board[0].length / 2) + 1; j++) {
        if (this.board[i][j] === ' ') {
          randoms.push([i, j]);
        }
        console.log(i, j)
      }
    }
    return randoms[Math.floor(Math.random() * randoms.length)];
  },

  findFinalMove: function () {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[0].length; j++) {
        if (this.board[i][j] === ' ') {
          this.board[i][j] = this.role;
          if (this.checkWin(this.board, [i, j], this.role)) {
            return [i, j];
          }
          this.board[i][j] = ' ';
        }
      }
    }
    return false;
  },

  findEnemyFinalMove: function () {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[0].length; j++) {
        if (this.board[i][j] === ' ') {
          this.board[i][j] = this.ene;
          if (this.checkLost(this.board, [i, j], this.ene)) {
            return [i, j];
          }
          this.board[i][j] = ' ';
        }
      }
    }
    return false;
  },

  move: function (board, role) {
    this.cntMove++;
    this.board = board;
    this.role = role;
    this.ene = role === 'x' ? 'o' : 'x';

    if (this.cntMove < this.maxRandom) {
      return this.random();
    }
    
    let finalMove = this.findFinalMove();
    let enemyFinalMove = this.findEnemyFinalMove();
    if (finalMove) {
      return finalMove;
    } else if (enemyFinalMove) {
      return enemyFinalMove;
    }

    let childNodes = this.getChildNodes();
    console.log("childNodes", childNodes);
    let bestScore = -Infinity;
    let bestMove = [];

    for (let i = 0; i < childNodes.length; i++) {
      this.board[childNodes[i][0]][childNodes[i][1]] = this.role;
      let score = this.evaluate(childNodes[i], this.board, -Infinity, Infinity, 0, this.ene);
      this.board[childNodes[i][0]][childNodes[i][1]] = ' ';
      if (score > bestScore) {
        bestScore = score;
        bestMove.push([childNodes[i], score]);
      }
    }
    // sort bestMove
    bestMove = bestMove.filter((move) => {
      return move[1] === bestScore;
    });
    return bestMove[Math.floor(Math.random() * bestMove.length)][0];
  }
}