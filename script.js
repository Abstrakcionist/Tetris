//доступ к холсту
const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
//размер квадратика
const grid = 32;
//массив с последовательностью фигур, в начале пустой
let tetrominoSequence = [];
//размер поля — 10 на 20 + несколько строк ещё находится за видимой областью
let playfield = [];
for (let row = -2; row < 20; row++) {
    playfield[row] = [];

    for (let col = 0; col < 10; col++) {
        playfield[row][col] = 0
    }
}

//формы для каждой фигуры
const tetrominos = {
    'I': [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]
    ],
    'J': [
        [1,0,0],
        [1,1,1],
        [0,0,0],
    ],
    'L': [
        [0,0,1],
        [1,1,1],
        [0,0,0],
    ],
    'O': [
        [1,1],
        [1,1],
    ],
    'S': [
        [0,1,1],
        [1,1,0],
        [0,0,0],
    ],
    'Z': [
        [1,1,0],
        [0,1,1],
        [0,0,0],
    ],
    'T': [
        [0,1,0],
        [1,1,1],
        [0,0,0],
    ]
}

//цвет каждой фигуры
const colors = {
    'I': 'cyan',
    'O': 'yellow',
    'T': 'purple',
    'S': 'green',
    'Z': 'red',
    'J': 'blue',
    'L': 'orange'
};

//счётчик
let count = 0;
//текущая фигура в игре
let tetromino = getNextTetromino();
//следим за кадрами анимации, чтобы если что — остановить игру
let rAF = null;
//флаг конца игры, на старте — неактивный
let gameOver = false;
//возвращает случайное число в заданном диапазоне
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//последовательность фигур, которая появится в игре
function generateSequence() {
    const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    //получение случайной фигуры
    while (sequence.length){
        const rand = getRandomInt(0, sequence.length - 1);
        const name = sequence.splice(rand, 1)[0];
        //добавление фигуры в массив игры
        tetrominoSequence.push(name);
    }
}
//получение следующей фигуры
function getNextTetromino(){
    //если следующей нет - создать 
    if (tetrominoSequence.length === 0){
        generateSequence();
    }
    //берем фигуру из массива
    const name = tetrominoSequence.pop();
    //получаем матрицу с которой будет рисоваться фигура
    const matrix = tetrominos[name];
    //I и O стартуют с середины, остальные — чуть левее
    const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);
    //I начинает с 21 строки (смещение -1), а все остальные — со строки 22 (смещение -2)
    const row = name === 'I' ? -1 : -2;

    return {
        name: name,      //название фигуры (L, O, и т.д.)
        matrix: matrix,  //матрица с фигурой
        row: row,        //текущая строка (фигуры стартуют за видимой областью холста)
        col: col         //текущий столбец
    };
};
//поворот матрицы на 90 градусов
function rotate(matrix){
    const N = matrix.length - 1;
    const result = matrix.map((row, i) =>
      row.map((val, j) => matrix[N - j][i])
    );
    return result;
};
//cellRow - ряд куда сдвинется матрица, cellCol - колонка куда сдвинится матрица
function isValidMove(matrix, cellRow, cellCol){
    for (let row = 0; row < matrix.length; row++){
        for (let col = 0; col < matrix[row].length; col++){
            if (matrix[row][col] && (
                //если матрица выходит за границы поля
                cellCol + col < 0 ||
                cellCol + col >= playfield[0].length ||
                cellRow + row >= playfield.length ||
                //или там уже стоит фигура
                playfield[cellRow + row][cellCol + col])
            ){
                return false;
            }
        }
    }
    return true
}
//когда фигура приземлилась
function placeTetromino(){
    for (let row = 0; row < tetromino.matrix.length; row++){
        for (let col = 0; col < tetromino.matrix[row].length; col++){
            if (tetromino.matrix[row][col]){
                if (tetromino.row + row < 0){
                    return showGameOver();
                }
                playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
            }
        }
    }
    for (let row = playfield.length - 1; row >= 0; ){
        if (playfield[row].every(cell => !!cell)){
            for (let r = row; r >= 0; r--){
                for (let c = 0; c < playfield[r].lenght; c++){
                    playfield[r][c] = playfield[r - 1][c];
                }
            }
        }
        else{
            row--;
        }
    }
    tetromino = getNextTetromino();
}

function showGameOver() {
    //прекращаем всю анимацию игры
    cancelAnimationFrame(rAF);
    //флаг окончания
    gameOver = true;
    //чёрный прямоугольник посередине поля
    context.fillStyle = 'black';
    context.globalAlpha = 0.75;
    context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
    //надпись белым моноширинным шрифтом по центру
    context.globalAlpha = 1;
    context.fillStyle = 'white';
    context.font = '36px monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2);
}