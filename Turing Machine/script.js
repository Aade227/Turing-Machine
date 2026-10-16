// ============================================
// Caesar Cipher Turing Machine Simulator
// Part 1 - Initialization
// ============================================

// ------------ INPUTS ------------

const inputText = document.getElementById("inputText");
const shiftKey = document.getElementById("shiftKey");

// ------------ BUTTONS ------------

const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const autoBtn = document.getElementById("autoBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

// ------------ DISPLAY ------------

const tape = document.getElementById("tape");
const outputText = document.getElementById("outputText");
const logBox = document.getElementById("logBox");

// ------------ MACHINE INFO ------------

const currentState = document.getElementById("currentState");
const headPosition = document.getElementById("headPosition");
const currentSymbol = document.getElementById("currentSymbol");
const encryptedSymbol = document.getElementById("encryptedSymbol");
const transitionBox = document.getElementById("transitionBox");

// ------------ STATISTICS ------------

const charCount = document.getElementById("charCount");
const stepCount = document.getElementById("stepCount");
const moveCount = document.getElementById("moveCount");
const timeTaken = document.getElementById("timeTaken");

// ============================================
// GLOBAL VARIABLES
// ============================================

let tapeArray = [];
let encryptedArray = [];
let cells = [];

let head = 0;

let steps = 0;
let moves = 0;

let timer = null;

let running = false;

let startTime = 0;

// ============================================
// CAESAR CIPHER FUNCTION
// ============================================

function shiftCharacter(character, shift)
{

    const code = character.charCodeAt(0);

    // Uppercase

    if(code >= 65 && code <= 90)
    {
        return String.fromCharCode(
            ((code - 65 + shift) % 26) + 65
        );
    }

    // Lowercase

    if(code >= 97 && code <= 122)
    {
        return String.fromCharCode(
            ((code - 97 + shift) % 26) + 97
        );
    }

    // Space / Numbers / Symbols

    return character;

}

// ============================================
// RESET MACHINE
// ============================================

function resetMachine()
{

    clearInterval(timer);

    running = false;

    tape.innerHTML = "";

    outputText.innerHTML = "";

    logBox.innerHTML = "";

    currentState.innerHTML = "q0";

    headPosition.innerHTML = "0";

    currentSymbol.innerHTML = "-";

    encryptedSymbol.innerHTML = "-";

    transitionBox.innerHTML =
    "δ(q0, A) = (q0, D, R)";

    tapeArray = [];

    encryptedArray = [];

    cells = [];

    head = 0;

    steps = 0;

    moves = 0;

    charCount.innerHTML = 0;

    stepCount.innerHTML = 0;

    moveCount.innerHTML = 0;

    timeTaken.innerHTML = "0 sec";

}

// ============================================
// CREATE TAPE
// ============================================

function createTape()
{

    resetMachine();

    const text = inputText.value;

    if(text.length === 0)
    {

        alert("Enter some text.");

        return;

    }

    tapeArray = text.split("");

    encryptedArray = [...tapeArray];

    charCount.innerHTML = tapeArray.length;

    tapeArray.forEach(letter =>
    {

        const cell = document.createElement("div");

        cell.className = "cell";

        cell.innerHTML = letter;

        tape.appendChild(cell);

        cells.push(cell);

    });

    cells[0].classList.add("active");

    startTime = Date.now();

}

// ============================================
// PART 2
// Head Movement + Execution
// ============================================


// Update Statistics

function updateStatistics()
{

    stepCount.innerHTML = steps;

    moveCount.innerHTML = moves;

    if(startTime !== 0)
    {

        const seconds =
        ((Date.now() - startTime)/1000).toFixed(2);

        timeTaken.innerHTML = seconds + " sec";

    }

}



// Execution Log

function addLog(message)
{

    const div = document.createElement("div");

    div.className = "log-entry";

    div.innerHTML = message;

    logBox.appendChild(div);

    logBox.scrollTop = logBox.scrollHeight;

}



// Highlight Head

function highlightHead()
{

    cells.forEach(cell =>
    {

        cell.classList.remove("active");

    });


    if(head < cells.length)
    {

        cells[head].classList.add("active");

    }

}



// ============================================
// One TM Step
// ============================================

function executeStep()
{

    if(head >= tapeArray.length)
    {

        currentState.innerHTML = "qf";

        transitionBox.innerHTML =
        "δ(q0, □) = (qf, □, S)";

        addLog("<b>Machine Halted</b>");

        running = false;

        clearInterval(timer);

        updateStatistics();

        return;

    }


    const key = parseInt(shiftKey.value);

    const original = tapeArray[head];

    const encrypted =
    shiftCharacter(original,key);


    currentState.innerHTML = "q0";

    headPosition.innerHTML = head;

    currentSymbol.innerHTML = original;

    encryptedSymbol.innerHTML = encrypted;


    transitionBox.innerHTML =

    "δ(q0,"+

    original+

    ") = (q0,"+

    encrypted+

    ",R)";



    encryptedArray[head] = encrypted;


    cells[head].innerHTML = encrypted;

    cells[head].classList.add("updated");


    addLog(

        "<b>Step "

        +(steps+1)+

        "</b><br>Read : "

        +original+

        "<br>Write : "

        +encrypted+

        "<br>Move : Right"

    );


    outputText.innerHTML =
    encryptedArray.join("");


    steps++;

    moves++;

    head++;


    highlightHead();

    updateStatistics();

}


// ============================================
// PART 3
// Buttons and Simulation Controls
// ============================================


// ----------------------------
// START BUTTON
// ----------------------------

startBtn.addEventListener("click", function ()
{

    createTape();

});


// ----------------------------
// NEXT STEP BUTTON
// ----------------------------

nextBtn.addEventListener("click", function ()
{

    if(cells.length === 0)
    {

        createTape();

    }

    executeStep();

});


// ----------------------------
// AUTO RUN BUTTON
// ----------------------------

autoBtn.addEventListener("click", function ()
{

    if(running)
        return;

    if(cells.length === 0)
    {

        createTape();

    }

    running = true;

    timer = setInterval(function ()
    {

        executeStep();

    },800);

});


// ----------------------------
// PAUSE BUTTON
// ----------------------------

pauseBtn.addEventListener("click", function ()
{

    running = false;

    clearInterval(timer);

});


// ----------------------------
// RESET BUTTON
// ----------------------------

resetBtn.addEventListener("click", function ()
{

    resetMachine();

});


// ----------------------------
// ENTER KEY SUPPORT
// ----------------------------

inputText.addEventListener("keypress", function (e)
{

    if(e.key === "Enter")
    {

        createTape();

    }

});


// ----------------------------
// SHIFT KEY VALIDATION
// ----------------------------

shiftKey.addEventListener("input", function ()
{

    if(shiftKey.value < 1)
    {

        shiftKey.value = 1;

    }

    if(shiftKey.value > 25)
    {

        shiftKey.value = 25;

    }

});


// ============================================
// END OF PART 3
// ============================================



// ============================================
// PART 4
// Final Touches
// ============================================


// ------------------------------------------
// Welcome Message
// ------------------------------------------

window.addEventListener("load", function ()
{

    addLog("<b>Welcome!</b><br>Caesar Cipher Turing Machine Simulator Ready.");

});


// ------------------------------------------
// Finish Simulation
// ------------------------------------------

function finishSimulation()
{

    currentState.innerHTML = "qf";

    transitionBox.innerHTML =
    "δ(q0, □) = (qf, □, S)";

    addLog("<br><b>✔ Machine Halted Successfully</b>");

    addLog("<b>Encrypted Output :</b> " +
        encryptedArray.join(""));

    running = false;

    clearInterval(timer);

    updateStatistics();

}



// ------------------------------------------
// Prevent Multiple Auto Runs
// ------------------------------------------

autoBtn.addEventListener("click",function(){

    if(running)
    {

        alert("Simulation already running.");

    }

});



// ------------------------------------------
// Improve executeStep()
// ------------------------------------------

const oldExecuteStep = executeStep;

executeStep = function()
{

    oldExecuteStep();

    if(head >= tapeArray.length)
    {

        finishSimulation();

    }

}



// ------------------------------------------
// Reset Welcome Message
// ------------------------------------------

const oldReset = resetMachine;

resetMachine = function()
{

    oldReset();

    addLog("Machine Reset.");

}



// ------------------------------------------
// Clear Tape Before New Simulation
// ------------------------------------------

const oldCreateTape = createTape;

createTape = function()
{

    tape.innerHTML="";

    outputText.innerHTML="";

    logBox.innerHTML="";

    oldCreateTape();

    addLog("<b>Simulation Started</b>");

}



// ------------------------------------------
// Highlight Output
// ------------------------------------------

setInterval(function(){

    if(outputText.innerHTML.length>0)
    {

        outputText.style.boxShadow=
        "0px 0px 20px #22c55e";

    }

},500);



// ------------------------------------------
// End
// ------------------------------------------

console.log("Caesar Cipher TM Simulator Loaded Successfully.");