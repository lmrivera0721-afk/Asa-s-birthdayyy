// Quiz Questions
const quizQuestions = [
    "Are you handsome?",
    "Are you amazing?",
    "Do I love you?",
    "Are you my favorite person?",
    "Do you make me happy?",
    "Are you worth my time?",
    "Do you deserve all my love?",
    "Are you my soulmate?",
    "Will you be mine forever?",
    "Do you know how much I love you?"
];

let currentQuestionIndex = 0;
let quizCorrect = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    initializeCanvas();
    initializePuzzle();
});

// Screen Navigation
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function initializeEventListeners() {
    // Envelope
    const waxSeal = document.getElementById('waxSeal');
    const envelope = document.querySelector('.envelope');
    
    waxSeal.addEventListener('click', (e) => {
        e.stopPropagation();
        envelope.classList.add('open');
        setTimeout(() => {
            showScreen('letterScreen');
        }, 600);
    });

    // Letter
    document.getElementById('closeLetterBtn').addEventListener('click', () => {
        showScreen('menuScreen');
    });

    // Menu Items
    document.getElementById('treasureHuntBtn').addEventListener('click', () => {
        showScreen('treasureHuntScreen');
    });

    document.getElementById('quizBtn').addEventListener('click', () => {
        startQuiz();
        showScreen('quizScreen');
    });

    document.getElementById('galleryBtn').addEventListener('click', () => {
        showScreen('galleryScreen');
    });

    document.getElementById('artBtn').addEventListener('click', () => {
        showScreen('artScreen');
        resizeCanvas();
    });

    document.getElementById('messageBtn').addEventListener('click', () => {
        showScreen('messageScreen');
        loadMessages();
    });

    // Back Buttons
    document.getElementById('backFromTreasureBtn').addEventListener('click', () => {
        showScreen('menuScreen');
    });

    document.getElementById('backFromQuizBtn').addEventListener('click', () => {
        showScreen('menuScreen');
    });

    document.getElementById('backFromGalleryBtn').addEventListener('click', () => {
        showScreen('menuScreen');
    });

    document.getElementById('backFromArtBtn').addEventListener('click', () => {
        showScreen('menuScreen');
    });

    document.getElementById('backFromMessageBtn').addEventListener('click', () => {
        showScreen('menuScreen');
    });

    // Quiz Options
    document.querySelectorAll('.quiz-option').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const answer = e.target.getAttribute('data-answer');
            handleQuizAnswer(answer);
        });
    });

    // Message Submit
    document.getElementById('submitMessageBtn').addEventListener('click', submitMessage);

    // Art Tools
    document.getElementById('penTool').addEventListener('click', () => {
        setDrawingMode('pen');
    });

    document.getElementById('eraserTool').addEventListener('click', () => {
        setDrawingMode('eraser');
    });

    document.getElementById('clearCanvas').addEventListener('click', () => {
        clearCanvas();
    });
}

// Popup Function
function showPopup(message, type = 'normal') {
    const popup = document.getElementById('popup');
    popup.innerHTML = `<p>${message}<\/p>`;
    popup.className = `popup show ${type}`;
    
    setTimeout(() => {
        popup.classList.remove('show');
    }, 2000);
}

// Quiz Functions
function startQuiz() {
    currentQuestionIndex = 0;
    quizCorrect = 0;
    loadQuestion();
}

function loadQuestion() {
    const questionText = document.getElementById('questionText');
    questionText.textContent = quizQuestions[currentQuestionIndex];
    
    const counter = document.getElementById('currentQuestion');
    counter.textContent = currentQuestionIndex + 1;
    
    const progressBar = document.getElementById('progressBar');
    const progress = ((currentQuestionIndex) / quizQuestions.length) * 100;
    progressBar.style.width = progress + '%';
}

function handleQuizAnswer(answer) {
    if (answer === 'no') {
        showPopup("Incorrect, how dare you. we're gonna fight", 'error');
    } else {
        showPopup("Congratulations! you've earned a kiss!", 'success');
        quizCorrect++;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < quizQuestions.length) {
        setTimeout(() => {
            loadQuestion();
        }, 2000);
    } else {
        setTimeout(() => {
            showPopup(`Quiz Complete! You got ${quizCorrect}/10 correct! I love you! 💕`, 'success');
            setTimeout(() => {
                showScreen('menuScreen');
            }, 2000);
        }, 2000);
    }
}

// Treasure Hunt / Puzzle Functions
let puzzleState = [];
let correctPositions = [];

function initializePuzzle() {
    // Create a heart shape pattern (positions where pieces should be)
    // 4x4 grid with heart shape
    correctPositions = [
        false, true, true, false,
        true, true, true, true,
        true, true, true, true,
        true, false, false, true
    ];

    // Shuffle the puzzle pieces
    const pieceIndices = [];
    for (let i = 0; i < 16; i++) {
        pieceIndices.push(i);
    }

    // Fisher-Yates shuffle
    for (let i = pieceIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pieceIndices[i], pieceIndices[j]] = [pieceIndices[j], pieceIndices[i]];
    }

    createPuzzleGrid(pieceIndices);
}

function createPuzzleGrid(order) {
    const grid = document.getElementById('puzzleGrid');
    grid.innerHTML = '';
    puzzleState = order.slice();

    order.forEach((index, position) => {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.textContent = position + 1;
        piece.draggable = true;
        piece.dataset.correctPosition = correctPositions[position] ? 'yes' : 'no';
        piece.dataset.currentPosition = index;
        piece.dataset.gridPosition = position;

        piece.addEventListener('dragstart', handleDragStart);
        piece.addEventListener('dragover', handleDragOver);
        piece.addEventListener('drop', handleDrop);
        piece.addEventListener('dragend', handleDragEnd);
        piece.addEventListener('click', () => handlePuzzleClick(position));

        grid.appendChild(piece);
    });
}

let draggedElement = null;
let moveCount = 0;

function handleDragStart(e) {
    draggedElement = this;
    this.style.opacity = '0.5';
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    if (draggedElement !== this) {
        swapPuzzlePieces(draggedElement, this);
    }
}

function handleDragEnd(e) {
    this.style.opacity = '1';
}

function handlePuzzleClick(position) {
    moveCount++;
    
    // Every other move (2nd, 4th, 6th, etc.)
    if (moveCount % 2 === 0) {
        const question = prompt("Answer this question:\n\nWhat's my favorite thing about you?");
        if (question !== null) {
            // For demo purposes, any answer works
            showPopup("Congratulations! you've earned a kiss!", 'success');
        }
    }

    checkPuzzleCompletion();
}

function swapPuzzlePieces(piece1, piece2) {
    const pos1 = piece1.dataset.gridPosition;
    const pos2 = piece2.dataset.gridPosition;

    [puzzleState[pos1], puzzleState[pos2]] = [puzzleState[pos2], puzzleState[pos1]];

    // Swap visual content
    const temp = piece1.textContent;
    piece1.textContent = piece2.textContent;
    piece2.textContent = temp;

    moveCount++;
    
    if (moveCount % 2 === 0) {
        const question = prompt("Answer this question:\n\nWhat's my favorite thing about you?");
        if (question !== null) {
            showPopup("Congratulations! you've earned a kiss!", 'success');
        }
    }

    checkPuzzleCompletion();
}

function checkPuzzleCompletion() {
    let isComplete = true;
    const pieces = document.querySelectorAll('.puzzle-piece');
    
    pieces.forEach((piece, index) => {
        const correctPos = correctPositions[index];
        if (correctPos) {
            piece.classList.add('correct');
            piece.draggable = false;
        } else {
            piece.classList.remove('correct');
            if (!piece.classList.contains('correct')) {
                isComplete = false;
            }
        }
    });

    // Check if arrangement is correct
    let allCorrect = true;
    pieces.forEach((piece, index) => {
        if (correctPositions[index] && !piece.classList.contains('correct')) {
            allCorrect = false;
        }
    });

    if (allCorrect && pieces.every(p => p.classList.contains('correct'))) {
        showPopup("Congratulations! you solved the puzzle! come find me for a clue on your treasure hunt!", 'success');
    }
}

// Canvas / Drawing Functions
let canvas, ctx;
let isDrawing = false;
let drawingMode = 'pen';

function initializeCanvas() {
    canvas = document.getElementById('artCanvas');
    ctx = canvas.getContext('2d');
}

function resizeCanvas() {
    const container = document.querySelector('.art-container');
    canvas.width = container.offsetWidth - 60;
    canvas.height = 400;
}

function setDrawingMode(mode) {
    drawingMode = mode;
    document.querySelectorAll('.art-tool').forEach(tool => {
        tool.classList.remove('active');
    });
    if (mode === 'pen') {
        document.getElementById('penTool').classList.add('active');
    } else {
        document.getElementById('eraserTool').classList.add('active');
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function draw(e) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (drawingMode === 'pen') {
        const colorPicker = document.getElementById('colorPicker');
        ctx.strokeStyle = colorPicker.value;
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    } else {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 15;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
}

function stopDrawing() {
    isDrawing = false;
}

// Message Functions
function submitMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();

    if (message === '') {
        showPopup('Please write a message, handsome! 💕', 'error');
        return;
    }

    const messages = JSON.parse(localStorage.getItem('birthdayMessages')) || [];
    messages.push({
        text: message,
        timestamp: new Date().toLocaleString()
    });

    localStorage.setItem('birthdayMessages', JSON.stringify(messages));
    input.value = '';
    
    showPopup('Message sent! I love you! 💕', 'success');
    loadMessages();
}

function loadMessages() {
    const messagesDisplay = document.getElementById('messagesDisplay');
    const messages = JSON.parse(localStorage.getItem('birthdayMessages')) || [];

    messagesDisplay.innerHTML = '';

    if (messages.length === 0) {
        messagesDisplay.innerHTML = '<p style="color: #999; text-align: center;">No messages yet. Be the first to write one! 💕<\/p>';
        return;
    }

    messages.forEach(msg => {
        const messageBox = document.createElement('div');
        messageBox.className = 'message-box';
        messageBox.innerHTML = `
            <p><strong>${msg.timestamp}<\/strong><\/p>
            <p>${msg.text}<\/p>
        `;
        messagesDisplay.appendChild(messageBox);
    });

    messagesDisplay.scrollTop = messagesDisplay.scrollHeight;
}

// Add touch support for mobile
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    const mouseEvent = new MouseEvent('mouseup', {});
    canvas.dispatchEvent(mouseEvent);
});