// board
const boardHtml = document.querySelector('.board');
const cols = 15;
const rows = 20;
const map = {};
let prevx = [0, 0];
let prevo = [0, 0];
let gameOver = false;
let turn = document.querySelector('.turn')
map['<i class="fa-solid fa-xmark"></i>'] = 'x';
map['<i class="fa-solid fa-o"></i>'] = 'o';
map['x'] = '<i class="fa-solid fa-xmark"></i>';
map['o'] = '<i class="fa-solid fa-o"></i>';

// convert boardhtml to board

// play
const role = 'x';
const aiRole = 'o';

const boxs = Array.from(document.querySelectorAll('.box'));
boxs.forEach(box => {
  box.addEventListener('mouseenter', () => {
    if (!box.classList.contains('box--active')) {
      box.classList.add('box--hover');
      box.innerHTML = `<i class="fa-solid fa-xmark fa-fade"></i>`;
    }
  });
  box.addEventListener('mouseleave', () => {
    box.classList.remove('box--hover')
    if (!box.classList.contains('box--active')) {
      box.innerHTML = ' ';
    }
  });
})

let getBoard = function () {
  const board = [];
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < cols; j++) {
      board[i][j] = ' ';
    }
  }
  let cnt = 0;
  boxs.forEach(box => {
    if (box.classList.contains('box--active')) {
      board[Math.floor(cnt / cols)][cnt % cols] = map[box.innerHTML];
    }
    cnt++;
  })
  return board;
}

const updateBox = (box, currRole) => {
  if (!box.classList.contains('box--active')) {
    box.classList.add('box--active', 'box--active' + currRole);
    box.innerHTML = map[currRole];
  }
}

// utility funtion

const countRow = (board, pos, roleCheck) => {
  let bottomRow = 0;
  let topRow = 0;
  let i = pos[0] + 1;
  let j = pos[1];
  while (i < rows && board[i][j] === roleCheck) {
    bottomRow++;
    i++;
  }
  i = pos[0] - 1;
  while (i >= 0 && board[i][j] === roleCheck) {
    topRow++;
    i--;
  }
  return bottomRow + topRow + 1;
}

const countCol = (board, pos, roleCheck) => {
  let leftCol = 0;
  let rightCol = 0;
  let i = pos[0];
  let j = pos[1] + 1;
  while (j < cols && board[i][j] === roleCheck) {
    rightCol++;
    j++;
  }
  j = pos[1] - 1;
  while (j >= 0 && board[i][j] === roleCheck) {
    leftCol++;
    j--;
  }
  return leftCol + rightCol + 1;
}

const countDownDiag = (board, pos, roleCheck) => {
  let leftDiag = 0;
  let rightDiag = 0;
  let i = pos[0] + 1;
  let j = pos[1] + 1;
  while (i < rows && j < cols && board[i][j] === roleCheck) {
    rightDiag++;
    i++;
    j++;
  }
  i = pos[0] - 1;
  j = pos[1] - 1;
  while (i >= 0 && j >= 0 && board[i][j] === roleCheck) {
    leftDiag++;
    i--;
    j--;
  }
  return leftDiag + rightDiag + 1;
}

const countUpDiag = (board, pos, roleCheck) => {
  let leftDiag = 0;
  let rightDiag = 0;
  let i = pos[0] - 1;
  let j = pos[1] + 1;
  while (i >= 0 && j < cols && board[i][j] === roleCheck) {
    rightDiag++;
    i--;
    j++;
  }
  i = pos[0] + 1;
  j = pos[1] - 1;
  while (i < rows && j >= 0 && board[i][j] === roleCheck) {
    leftDiag++;
    i++;
    j--;
  }
  return leftDiag + rightDiag + 1;
}

const getPos = (box) => {
  return [parseInt(boxs.indexOf(box) / cols), boxs.indexOf(box) % cols];
}

const getBox = (pos) => {
  return boxs[pos[0] * cols + pos[1]];
}

const checkWin = (board, pos, roleCheck) => {
  return countRow(board, pos, roleCheck) >= 5 ||
         countCol(board, pos, roleCheck) >= 5 ||
         countDownDiag(board, pos, roleCheck) >= 5 ||
         countUpDiag(board, pos, roleCheck) >= 5;
}

const highlightWin = (board, pos, roleCheck) => {
  const winMap = {};
  winMap[role] = '<i class="fa-solid fa-xmark fa-bounce"></i>';
  winMap[aiRole] = '<i class="fa-solid fa-o fa-bounce"></i>';
  getBox(pos).classList.add('box--win');
  getBox(pos).innerHTML = winMap[roleCheck];
  getBox(pos).classList.remove('box--prev' + roleCheck);
  if (countRow(board, pos, roleCheck) >= 5) {
    for (let i = pos[0] - 1; i >= 0 && board[i][pos[1]] === roleCheck; i--) {
      getBox([i, pos[1]]).classList.add('box--win');
      getBox([i, pos[1]]).innerHTML = winMap[roleCheck];
    }
    for (let i = pos[0] + 1; i < rows && board[i][pos[1]] === roleCheck; i++) {
      getBox([i, pos[1]]).classList.add('box--win');
      getBox([i, pos[1]]).innerHTML = winMap[roleCheck];
    }
  }

  if (countCol(board, pos, roleCheck) >= 5) {
    for (let j = pos[1] - 1; j >= 0 && board[pos[0]][j] === roleCheck; j--) {
      getBox([pos[0], j]).classList.add('box--win');
      getBox([pos[0], j]).innerHTML = winMap[roleCheck];
    }
    for (let j = pos[1] + 1; j < cols && board[pos[0]][j] === roleCheck; j++) {
      getBox([pos[0], j]).classList.add('box--win');
      getBox([pos[0], j]).innerHTML = winMap[roleCheck];
    }
  }

  if (countDownDiag(board, pos, roleCheck) >= 5) {
    for (let i = pos[0] - 1, j = pos[1] - 1; i >= 0 && j >= 0 && board[i][j] === roleCheck; i--, j--) {
      getBox([i, j]).classList.add('box--win');
      getBox([i, j]).innerHTML = winMap[roleCheck];
    }
    for (let i = pos[0] + 1, j = pos[1] + 1; i < rows && j < cols && board[i][j] === roleCheck; i++, j++) {
      getBox([i, j]).classList.add('box--win');
      getBox([i, j]).innerHTML = winMap[roleCheck];
    }
  }

  if (countUpDiag(board, pos, roleCheck) >= 5) {
    for (let i = pos[0] - 1, j = pos[1] + 1; i >= 0 && j < cols && board[i][j] === roleCheck; i--, j++) {
      getBox([i, j]).classList.add('box--win');
      getBox([i, j]).innerHTML = winMap[roleCheck];
    }
    for (let i = pos[0] + 1, j = pos[1] - 1; i < rows && j >= 0 && board[i][j] === roleCheck; i++, j--) {
      getBox([i, j]).classList.add('box--win');
      getBox([i, j]).innerHTML = winMap[roleCheck];
    }
  }
}

// playing game

boxs.forEach(box => {
  box.addEventListener('click', () => {
    if (box.classList.contains('box--active') || gameOver) {
      return;
    }
    turn.innerHTML = 'Turn: ' + map['o'];
    updateBox(box, role);
    if (checkWin(getBoard(), getPos(box), role)) {
      document.querySelector('.winner').innerHTML = 'Winner: ' + map[role];
      gameOver = true;
      highlightWin(getBoard(), getPos(box), role);
      return;
    }
    setTimeout(() => {
      let move = ai.move(getBoard(), aiRole);
      if (prevo !== undefined && getBox(prevo).classList.contains('box--prevo')) {
        getBox(prevo).classList.remove('box--prevo');
      }
      prevo = move;
      getBox(move).classList.add('box--prevo');
      updateBox(boxs[move[0] * cols + move[1]], aiRole);
      if (checkWin(getBoard(), move, aiRole)) {
        document.querySelector('.winner').innerHTML = 'Winner: ' + map[aiRole];
        gameOver = true;
        highlightWin(getBoard(), move, aiRole);
        return;
      }
      document.querySelector('.turn').innerHTML = 'Turn: ' + map['x'];
    }, 10)
  });
})
