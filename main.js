let grids = document.querySelectorAll(".grid")
let keysPressed = []
let word

function main() { // main function

    fetch("https://random-word-api.herokuapp.com/word?length=5") // fetch promise - gets word from api
        .then((response) => response.json())
        .then((data) => {word = data[0]; console.log(word)})

    document.addEventListener("keyup", handleKeys) // listens for key presses
}

function handleKeys(e) { // runs when key is pressed

    const isEnter = e.key == "Enter" // enter was pressed
    const isBackspace = e.key == "Backspace" // backspace was pressed
    const isLetter = e.key.length == 1 && e.key.match(/[a-z]/i) // letter was pressed
    const fullRow = keysPressed.length % 5 == 0 && keysPressed.length != 0 // row is full and needs to be checked

    if(isBackspace && grids[keysPressed.length - 1].getAttribute("checked") == "false"){ // if backspace and the last filled grid is unchecked, then...
        keysPressed.pop() // remove that letter from array
        updateBoxes(keysPressed) // update the grid
        return
    }

    if(fullRow && grids[keysPressed.length - 1].getAttribute("checked") == "false"){ // if the row is full and the last filled grid is unchecked, then...
        if(isEnter){check()} // check for win, if enter pressed
        return // or return the function
    }

    if(isLetter) { // if row isn't full and not backspace, then we can add letter
        keysPressed.push(e.key) // push letter to array
        updateBoxes(keysPressed) // update the grid
    }
}

function updateBoxes(keysPressed) { // function that updates grid based on changes to the keysPressed array

    grids.forEach(grid => { // for each grid...

        if(keysPressed[grid.id]) { // if there exists a keysPressed value at that grid's index...
            grid.innerHTML = keysPressed[grid.id].toUpperCase() // update that grid's html
        } else {
            grid.innerHTML = "" // if there isn't, then grid becomes blank
        }
    });
}

function check() { // function that runs to check for a win

    grids.forEach(grid => { // for each grid...

        const gridNumber = Number(grid.id) // get numerical index
        const gridLetter = grid.innerHTML.toLowerCase() // get grid's letter

        if(gridLetter == word[gridNumber % 5]) { // if grid's letter equals the word's letter for that column...
            grid.style.backgroundColor = "green" // grid turns green
        }

        else if(word.includes(gridLetter) && gridLetter != "") { // else if the grid's letter is in the word...
            grid.style.backgroundColor = "yellow" // grid turns yellow
        }

        if(grid.innerHTML != ""){ // confirm grid was checked
            grid.setAttribute("checked", "true")
        }
    })

    const submittedWord = keysPressed.slice(-5).join("") // get the user-submitted word
    if(submittedWord == word){ // checked if user-submitted word equals word
        document.removeEventListener("keyup", handleKeys) // game ended, so remove event listener
    }
}

main() // tada!