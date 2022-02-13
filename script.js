const RANDOM_QUOTE_API_URL = 'https://type.fit/api/quotes'; // api to grab random quotes
const quoteDisplayElement = document.getElementById('quoteDisplay'); // the name used to display quoteDisplay
const quoteInputElement = document.getElementById('quoteInput'); //name used to display quoteInput
const timerElement = document.getElementById('timer'); //name used to display timer
const wpmElement = document.getElementById('wpm');
const swpmElement = document.getElementById('swpm');
const settingsElement = document.getElementById('more');
const popUpElement = document.getElementById("popUp")
localStorage = window.localStorage;

/*
  checked for new users is: null
  checked for all users is: 0
*/
let checked = localStorage.getItem("tt_checked")
if (checked === null){
  localStorage.setItem("tt_checked", 0);
  quoteInputElement.blur();
  let counter = 5;

  popUpElement.style.visibility = "visible"
  popUpElement.innerHTML = 
  `There's been a new update! With it, comes the ability to choose themes, and a skip prompt shortcut! 
  Click on 'settings/more' on the bottom right to check it out! 
  <br><br>Press Enter ⏎ 5 times to continue`

  document.addEventListener("keydown", function(){
    counter--;
    popUpElement.innerHTML = 
    `There's been a new update! With it, comes the ability to choose themes, and a skip prompt shortcut! 
    Click on 'settings/more' on the bottom right to check it out! 
    <br><br>Press Enter ⏎ ${counter} times to continue`;

    if (counter === 0){
      popUpElement.style.visibility = "hidden"
      localStorage.setItem("tt_checked", 1)
      start();
    }
  })
} else{
  if (checked === 0){
    quoteInputElement.blur()
    let counter = 5;
    let handler = function(event){
      counter--;
      popUpElement.innerHTML = 
      `There's been a new update! With it, comes the ability to choose themes, and a skip prompt shortcut! 
      Click on 'settings/more' on the bottom right to check it out! 
      <br><br>Press Enter ⏎ ${counter} times to continue`
      if (counter === 0){
        popUpElement.style.visibility = "hidden"
        localStorage.setItem("tt_checked", 1)
        start();
      }
    }

    document.addEventListener("keydown", handler)
    
    popUpElement.style.visibility = "visible"
    popUpElement.innerHTML = 
    `There's been a new update! With it, comes the ability to choose themes, and a skip prompt shortcut! 
    Click on 'settings/more' on the bottom right to check it out! 
    <br><br>Press Enter ⏎ 5 times to continue`
  } 
  else { //start
    start();
  }
}



result = localStorage.getItem('tt_colorScheme')
color_scheme =  ['#B7C68B', '#F4F0CB', '#685642', '#B3A580',
'#DED29E', '#F5F4E9', '#00AA52', '#E10D3F', '#685642']

if (result === null){
  localStorage.setItem('tt_colorScheme', JSON.stringify(color_scheme))
  
  color_codes = ['#B7C68B', '#F4F0CB', '#685642', '#B3A580',
  '#DED29E', '#F5F4E9', '#00AA52', '#E10D3F', '#685642']
}
else {
  result = JSON.parse(result)
  color_codes = [result[0], result[1], result[2],
                  result[3], result[4], result[5],
                  result[6], result[7], result[8],
                  result[9] ]
}

document.body.style.setProperty('--main-bg', color_codes[0])
document.body.style.setProperty('--main-fg', color_codes[1])
document.body.style.setProperty('--accent', color_codes[2])
document.body.style.setProperty('--border-active', color_codes[3])
document.body.style.setProperty('--border-inactive', color_codes[4])
document.body.style.setProperty('--text-bg', color_codes[5])
document.body.style.setProperty('--correct-txt', color_codes[6])
document.body.style.setProperty('--incorrect-txt', color_codes[7])
document.body.style.setProperty('--main-txt', color_codes[8])
document.body.style.setProperty('--quote-txt', color_codes[9])

//QUOTE STUFF **************************************************************************************************
let started = false;
let charsRight = 0;// (chars right for char count)
let characterSpan, character;
let characterCounted, ripQuote;


async function start(){//renders new quote
  await getRandomQuote();//load quote from API
  quoteInputElement.focus();
  characterCounted= new Array(quote.length).fill(false); //make an array, with default vals false (for checking)
  ripQuote = quote; //ripQuote for quote to be used outside  

  //reset vars for next run
  wpm=0;
  seconds=0;
  minutes=0;
  displaySeconds=0;
  totalTime=0;
  charsRight=0;

  wpmElement.innerHTML = '0 wpm'
  timerElement.innerHTML = '0:00'
  clearInterval(timer)

  quoteDisplayElement.innerHTML = ''//empties quote display
  quote.split('').forEach(character => { //apply this code to each char
    if (character === '’' || character === '‘'){ //filter out curly apostrophe
      character = "'";
    }
    characterSpan = document.createElement('span');//makes every letter its own span
    characterSpan.innerText = character; //assign letter to span
    quoteDisplayElement.appendChild(characterSpan); //make it child (prints)
  })
  quoteInputElement.value = null;//input value is null, so it starts new?;
  started=false;//before you type, you haven't started;
}

function getRandomQuote(){
  return fetch(RANDOM_QUOTE_API_URL)//get data from API
    .then(response => response.json())
    .then( function(data){
      let i = Math.floor(Math.random() * 1643)
      quote = data[i].text;
      author = data[i].author ? data[i].author : "an unknown human";
    })
    
}

//#region every input

// ctrl+enter shortcut
let currentCharacter, globalChar, checkChar;
quoteInputElement.addEventListener('keydown', (key) => { 
  if (key.ctrlKey && key.key == "Enter"){
    start();
  }
})

quoteInputElement.addEventListener('input', () => { //every time u type something, goes through this to check if right
  const arrayQuote = quoteDisplayElement.querySelectorAll('span') //all spans in one
  const arrayValue = quoteInputElement.value.split('') //splits input into arrays

  if (started != true) { //start if it already hasnt
    started = true;
    startRecording(); //starts timer and wpm
  }

  let correct = true; //start out with all values good
  arrayQuote.forEach((characterSpan, index) => { // CHECK all chars
    let character = arrayValue[index] // character is current input char
    currentCharacter=arrayValue.length-1 //last character in array, current character
    globalChar = arrayValue[currentCharacter] //character atm
    checkChar = ripQuote[currentCharacter] // character it should be

    if (character == null) {                               //section hasn't been touched
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
  
  if (globalChar === checkChar && characterCounted[currentCharacter]===false){ // chars match
    charsRight++;
    characterCounted[currentCharacter]=true;
  }


  if (correct){//if whole thing is right
    clearInterval(timer);
    started=false;
    document.getElementById("quoteInput").blur(); //deselect text
    completedPopUp();
    sessionWPM();
  }                          
})
//#endregion

//#region completed text prompt

function completedPopUp(){
  popUpElement.style.visibility = "visible"  
  
  popUpElement.innerHTML = 
  `Your typing speed is ${wpm} WPM!<br> 
  You just typed a quote by ${author}.<br>
  Press ⏎ to continue.`
  //reset values
  // use on blur to activate box 
  let handler = function(event) { //if enter key
    if (event.keyCode == 13) {
        popUpElement.style.visibility = "hidden"
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
function calculateWPM(){ //calculate wpm - dont calc errors because they cant anyway
  wpm=Math.round((charsRight/5)/totalTime);
  console.log(totalTime);
  wpmElement.innerHTML = wpm + " wpm";
}

let totalWords = swpm = 0, completions = 0;
function sessionWPM(){
  completions++;
  totalWords += wpm;
  swpm = Math.floor(totalWords/completions);
  swpmElement.innerHTML = swpm + " swpm";
}

//#endregion

