let grid_array
let all_keys_pressed = [];
let correct_word;
let game_running
let chances

const start_game = () => {
    fetch("https://random-word-api.herokuapp.com/word?length=5")
        .then((response) => response.json())
        .then((data) => {
            correct_word = data[0];
            console.log(correct_word);
        });
    grid_array = document.querySelectorAll(".grid")
    game_running = true
    chances = 6
    document.addEventListener("keyup", handle_key_presses);
}

const handle_key_presses = (e) => {

    if (!game_running) {return}

    if (e.key == "Backspace") {
        let number_of_keys = all_keys_pressed.length
        if (number_of_keys > 0) {
            let most_recent_grid = grid_array[all_keys_pressed.length - 1]
            let most_recent_grid_checked_status = most_recent_grid.getAttribute("checked")
            if (most_recent_grid_checked_status == "false") {
                all_keys_pressed.pop()
                update_html(all_keys_pressed)
            }
        }
        return
    }

    if (e.key == "Enter") {
        let number_of_keys = all_keys_pressed.length
        if (number_of_keys > 0) {
            let most_recent_grid = grid_array[number_of_keys - 1]
            let most_recent_grid_checked_status = most_recent_grid.getAttribute("checked")
            let row_full = number_of_keys % 5 == 0
            if (most_recent_grid_checked_status == "false" && row_full) {
                check_for_win()
            }
        }
        return
    }

    const letter_pressed = e.key.length == 1 && e.key.match(/[a-z]/i)
    if (letter_pressed) {
        let should_push_letter = false
        let number_of_keys = all_keys_pressed.length
        if (number_of_keys == 0) {
            should_push_letter = true
        } else {
            row_full = number_of_keys > 0 && number_of_keys % 5 == 0
            if (!row_full) {
                should_push_letter = true
            } else {
                let most_recent_grid = grid_array[number_of_keys - 1]
                let most_recent_grid_checked_status = most_recent_grid.getAttribute("checked")
                if (most_recent_grid_checked_status == "true") {
                    should_push_letter = true
                }
            }
        }
        if (should_push_letter) {
            all_keys_pressed.push(e.key)
            update_html(all_keys_pressed)
        }
    }
}

const update_html = (all_keys_pressed) => {
    grid_array.forEach((grid) => {
        if (all_keys_pressed[grid.id]) {
            new_grid_letter = all_keys_pressed[grid.id].toUpperCase()
            grid.innerHTML = new_grid_letter
        } else {
            grid.innerHTML = ""
        }
    });
}

const check_for_win = () => {
    grid_array.forEach((grid) => {
        const grid_letter = grid.innerHTML.toLowerCase();
        const correct_column_letter = correct_word[grid.id % 5]
        if (grid_letter.length == 0) {
            return
        } if (grid_letter == correct_column_letter) {
            grid.style.backgroundColor = "green";
        } else if (grid_letter.length > 0 && correct_word.includes(grid_letter)) {
            grid.style.backgroundColor = "yellow";
        }
        grid.setAttribute("checked", true)
    });

    chances -= 1
    end_message_element = document.getElementById("end-message")
    const submitted_word = all_keys_pressed.slice(-5).join(""); // get user word
    if (submitted_word == correct_word) {
        game_running = false
        end_message = `you won! the word was ${correct_word}`
        end_message_element.innerHTML = end_message
    } else if (chances == 0) {
        game_running = false
        end_message = `you lost! the word was ${correct_word}`
        end_message_element.innerHTML = end_message
    }
}

document.addEventListener("DOMContentLoaded", start_game)