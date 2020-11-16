import Home from "./home.js";
import End from "./end.js";
import Board from "./board.js";
import { sound } from "./../data/sound.js";


const Game = (_ => {
    const letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    const words = ['apple','ball','cat','dog','elephant'];
    let chosenWord;
    let guessingWord;
    let lives;
    let guesses;

    //Cache the DOM
    const $hangman = document.querySelector('.hangman');


    const init = _ => {
        //1. choose the word
        chosenWord = chooseWord();
        //2. build our guessing word to render
        guessingWord = Array(chosenWord.length).fill("_");
        guesses = [];
        lives = 7;
        //3. show initial screen or page
        showInitPage();
        listeners();
        Board.init();

    }

    const listeners = _ => {
        $hangman.addEventListener("click",event => {
            if(event.target.matches(".hangman__letter")) {
                sound.click.play();
                check(event.target.innerHTML);
            }
            if(event.target.matches(".hangman__trigger")) {
                sound.click.play();
                Home.init();
            }
        })
    }

    const chooseWord = _ => {
        let randNum = Math.floor(Math.random() * words.length);
        return words[randNum];
    }
    const createLetters = _ => {
        let markup = ``;
        //the array.forEah(currentValue) method
        letters.forEach(letter => {
            const letterSelected = isAlreadyTaken(letter)? 'hangman__letter--active' : '';
            markup += `
                <li class="hangman__letter ${letterSelected}">${letter}</li>
        `
        });
        return markup;

    }

    const updateGuessingWord = letter => {
        chosenWord.split("").forEach((elem, index) => {
            if(elem === letter) {
                guessingWord[index] = elem;
            }
        })
    }
    const isAlreadyTaken = letter => {
        return guesses.includes(letter);
    }

    const check = guess => {
        //check if the guess letter is already taken
        if (isAlreadyTaken(guess)) return;
        guesses.push(guess);

        //if the guess letter exists in chosenword
        if (chosenWord.includes(guess)) {
            //update the guessing word
            updateGuessingWord(guess);
            //console.log(guessingWord);
        } else {
            lives--;
            //render the board accordingly
            Board.setLives(lives);

        }

        render();
        //check if the game is over
        isGameOver();
    }

    const hasWon = _ => guessingWord.join("") === chosenWord;
    const hasLost = _ => lives <= 0;

    const isGameOver = _ => {
        //if won, the alert is ("win");
        if(hasWon()){
            sound.win.play();
            End.setState({
                chosenWord: chosenWord,
                result: "win 🙂"
            })
        }
        //if lost, the alert is ("lost");
        if(hasLost()){
            sound.lose.play();
            End.setState({
                chosenWord: chosenWord,
                result: "lose 🙁"
            })
        }
    }

    const render = _ => {
        document.querySelector(".hangman__lives").innerHTML = lives;
        document.querySelector(".hangman__word").innerHTML = guessingWord.join("");
        document.querySelector(".hangman__letters").innerHTML = createLetters();
    }


    const showInitPage = _ => {
        let markup = `
            <p class="hangman__stats">Lives:
                <span class="hangman__lives">${lives}</span>
            </p>
            <h1 class="hangman__title">Hangman</h1>
            <canvas class="hangman__board height="155"></canvas>
            <div class="hangman__word">${guessingWord.join("")}</div>
            <p class="hangman__instructions">Pick a letter below to guess the whole word.</p>
            <ul class="hangman__letters">
                ${createLetters()}
            </ul>
            <button class="button hangman__trigger">Main Menu</button>
        `
        $hangman.innerHTML = markup;
    }

    return {
        init
    }
})();

export default Game;