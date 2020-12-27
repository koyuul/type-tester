
let theme_select = document.getElementById('theme_select')
let submit_theme_select = document.getElementById('theme_select_save')
let theme_select_reset = document.getElementById('theme_select_reset')
let color_codes = []
let main_bg = '', main_fg = '', accent = ''
let color_scheme_library = {
  //bg, fg, accent, border acc, border inac, txt bg, corr txt, incorr txt, inp txt, quote txt
  "Default": ['#B7C68B', '#F4F0CB', '#685642', '#B3A580', '#DED29E', '#F5F4E9', '#00AA52', '#E10D3F', '#000000', '#685642'],
  "Dark Mode": ['#333333', '#444444', '#CCCFD1',  '#9C7FB4', '#8F6EAA', '#207E75', '#19B4A5', '#AC606E', '#CCCFD1', '#CCCFD1'],
  "ACHS": ['#022222', '#F6F1F4', '#BFA75D',  '#AF9545', '#BFA75D', '#F6F6F6', '#BFA75D', '#971C26', '#000000', '#022222'],
  
}
localStorage = window.localStorage;


/*
  chrome.storage.sync.get(['tt_colorScheme'], (result) => {
    if(Object.keys(result).length === 0 && result.constructor === Object){ //if nothing is there
      chrome.storage.sync.set({'tt_colorScheme': ['#B7C68B', '#F4F0CB', '#685642']})
    }
*/
result = JSON.parse(localStorage.getItem('tt_colorScheme'))
if (result === null){
  localStorage.set('tt_colorScheme', color_scheme_library['Default'])
  color_codes = color_scheme_library['Default']
}
else{
  color_codes = [result[0], result[1], result[2],
  result[3], result[4], result[5],
  result[6], result[7], result[8],
  result[9]]
}

window.onload = () => {
  let previewElement = document.getElementById('preview')
  let cont = previewElement.contentDocument;

  let create_button = function(index, id, name){
    let pair = document.createElement("div");
    pair.style.display = "flex"
    pair.style.flexDirection = "row"

    let button = document.createElement("input");
    button.type = "color"
    button.value = color_codes[index]
    button.className = "color_button"
    button.addEventListener('input', (value) => {
      cont.body.style.setProperty(id, value.target.value)
    })
    button.style.marginLeft = "auto"
    
    let label = document.createElement("p");
    label.style.textAlign = "center"
    label.textContent = name

    pair.append(label)
    pair.append(button)
    theme_select.append(pair)
  }

  create_button(0, '--main-bg', 'Main Background')
  create_button(1, '--main-fg', "Main Foreground")
  create_button(2, '--accent', "Accent")
  create_button(3, '--border-active', "Border Active")
  create_button(4, '--border-inactive', "Border Inactive")
  create_button(5, '--text-bg', "Text Background")
  create_button(6, '--correct-txt', "Correct Text")
  create_button(7, '--incorrect-txt', "Incorrect Text")
  create_button(8, '--main-txt', "Input Text")
  create_button(9, '--quote-txt', "Quote Text")
  
  // on present change:
  document.getElementById('theme_select_dropdown').addEventListener('change', (event) => {
    //   get value of dropdown
    color_codes = color_scheme_library[event.target.value]
    let i=0;
    for(button of document.getElementsByClassName("color_button")){
      button.value = color_codes[i]
      button.dispatchEvent(new Event("input", {'bubbles': false}))
      color_codes[i] = button.value
      i++;
    }
    color_codes_setter = JSON.stringify(color_codes)
    localStorage.setItem('tt_colorScheme', color_codes_setter)
  })
/////


  submit_theme_select.onclick = () => {
    let i = 0
    for(button of document.getElementsByClassName("color_button")){
      color_codes[i] = button.value
      i++;
    }
    color_codes_setter = JSON.stringify(color_codes)
    localStorage.setItem('tt_colorScheme', color_codes_setter)
  }

  theme_select_reset.onclick = () => {
    let conf = confirm("Are you sure you want to reset the palette to defaults?")
    
    if (conf === true){
      chrome.storage.sync.set({
        'tt_colorScheme': color_scheme_library['Default'] 
      })
      location.reload()
    }
  }
}



/*
upon return:
create submit button that reaffirms all colors
*/
