const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random?minLength=40' // api to grab random quotes
const quoteDisplayElement = document.getElementById('quoteDisplay') // the name used to display quoteDisplay
const quoteInputElement = document.getElementById('quoteInput') //name used to display quoteInput
const timerElement = document.getElementById('timer') //name used to display timer
const wpmElement = document.getElementById('wpm');

start();


//QUOTE STUFF
let started = false;
let charsRight = 0;// (chars right for char count)
let characterSpan, character;



let characterCounted, ripQuote;
async function start(){//renders new quote
  await getRandomQuote();//load quote from API
  quoteInputElement.focus();
  characterCounted= new Array(quote.length).fill(false); //make an array, with defalt vals false (for checking)
  ripQuote = quote; //ripQuote for quote to be used outside 
  popUpElement.style.visibility = "hidden"
  //reset vars for next run
  wpm=0;
  seconds=0;
  minutes=0;
  displaySeconds=0;
  totalTime=0;
  charsRight=0;

  wpmElement.innerHTML = '0 WPM'
  timerElement.innerHTML = '0:00'

  quoteDisplayElement.innerHTML = ''//empties quote display
  quote.split('').forEach(character => { //apply this code to eachchar
    characterSpan = document.createElement('span')//makes every letter its own span
    characterSpan.innerText = character //assign letter to span
    quoteDisplayElement.appendChild(characterSpan) //make it child (prints)
  })
  quoteInputElement.value = null;//input value is null, so it starts new?
  started=false;//before you type, you havent started
}

function getRandomQuote(){
  return fetch(RANDOM_QUOTE_API_URL)//get data from API
    .then(response => response.json())
    .then( function(data){
      quote = data.content; //self explanatory
      author = data.author;
    })
    
}

//#region every input
let currentCharacter, globalChar, checkChar;
quoteInputElement.addEventListener('input', () => { //every time u type something, goes through this to check if right
  const arrayQuote = quoteDisplayElement.querySelectorAll('span') //all spans in one
  const arrayValue = quoteInputElement.value.split('') //splits input into arrays
  
  if (started != true) { //start if it already hasnt
    started = true;
    startRecording(); //starts timer and wpm, should probs be named startRecording but whatever
  }

  let correct = true; //start out with all values good
  arrayQuote.forEach((characterSpan, index) => { // CHECK all chars
    character = arrayValue[index] // character is current input char
    currentCharacter=arrayValue.length-1 //last character in array, current character
    globalChar = arrayValue[currentCharacter] //character atm
    checkChar = ripQuote[currentCharacter] // character it should be
    
    if (character == null) {                               //section hasnt been touched
      characterSpan.classList.remove('correct')
      characterSpan.classList.remove('incorrect')
      correct = false // if not done, cant all be done
    }
    else if (character === characterSpan.innerText) {      //char is right
      characterSpan.classList.add('correct')
      characterSpan.classList.remove('incorrect')
    }
    else {                                                  //char wrong
      characterSpan.classList.add('incorrect')
      characterSpan.classList.remove('correct')
      correct = false //if you mess up, make it so you cant pass
    }
  })
  
  if (globalChar===checkChar&&characterCounted[currentCharacter]===false){ // chars match
    charsRight++;
    characterCounted[currentCharacter]=true;
  }

  if (correct){//if whole thing is right
    clearInterval(timer);
    started=false;
    document.getElementById("quoteInput").blur(); //deselect text
    completedPopUp();
  }                          
})
//#endregion

//#region completed text prompt
const popUpElement = document.getElementById("popUp")
function completedPopUp(){
  popUpElement.style.visibility = "visible"  
  popUpElement.innerHTML = 
  `Your typing speed is ${wpm} WPM!<br> 
  You just typed a quote by ${author}.<br>
  Press ⏎ to continue.`
  //reset values
  // use on blur to actiavet box lololoo
  let handler = function(event) { //if enter key
    if (event.keyCode == 13) {
        console.log('L')
        start();
        document.body.removeEventListener("keydown", handler)
    }
}
  document.body.addEventListener("keydown", handler);

}
//#endregion

//#region my timer stuff
let timer, seconds=0, minutes=0, displaySeconds=0, displayMinutes=0, totalTime;

function startRecording(){ //every seconds run stopwatch n update wpm
    //reset stuff
  if (started===true) timer = setInterval(function(){
    stopWatch(),
    calculateWPM()
  }, 1000);
}

function stopWatch(){ //display time in min:sec
    if (started){
      seconds++;
      if (seconds>59) {
        minutes++;
        seconds = 0;
      }
      if (seconds>=10) displaySeconds = seconds;
      else if (seconds<10) displaySeconds = '0' + seconds.toString();
      timerElement.innerHTML = minutes + ":" + displaySeconds;
      totalTime = minutes+(seconds/60)
    }
}
//#endregion

//#region wpm
let wpm;
function calculateWPM(){ //calculate wpm - dont calc errors bcuz they cant anyway
  wpm=Math.round((charsRight/5)/totalTime);
  wpmElement.innerHTML = wpm + " wpm";
}
//#endregion