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