/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

const body = document.body;

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    for (let i = 0; i < games.length; i++){

        //create the div element
        const div = document.createElement("div");
        div.classList.add("game-card");
        div.id = `Game_${i+1}`;

        //fill game information
        div.innerHTML = `
            <h2>${games[i].name}</h2>
            <p>${games[i].description}</p>
            <p>Pledged: ${games[i].pledged}</p>
            <p>Goal: ${games[i].goal}</p>
            <p>Backers: ${games[i].backers}</p><br>
            <img class="game-img" src="${games[i].img}" alt="game image">
        `;

        // console.log(games[i].img);

        //render on page
        gamesContainer.append(div);
    }

}

addGamesToPage(GAMES_JSON);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
let backersSum = GAMES_JSON.reduce((accum, currentVal) => accum + currentVal.backers, 0);

// console.log(backersSum);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.append(`${ backersSum.toLocaleString(("en-US")) }`);

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
let raisedSum = GAMES_JSON.reduce((accum, currentVal) => accum + currentVal.pledged, 0);

// set inner HTML using template literal
raisedCard.append(`$${ raisedSum.toLocaleString(("en-US")) }`);

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");

let numOfGames = GAMES_JSON.length;
gamesCard.append(`${ numOfGames }`);

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);
    // console.log("ran func")

    // use filter() to get a list of games that have not yet met their goal

    let unfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal);

    // use the function we previously created to add the unfunded games to the DOM

    addGamesToPage(unfundedGames);
}

// filterUnfundedOnly();

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);
    
    // use filter() to get a list of games that have met or exceeded their goal

    let fundedGames = GAMES_JSON.filter(game => game.pledged >= game.goal);

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(fundedGames);

}

// filterFundedOnly();

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);
    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.onclick = filterUnfundedOnly;
fundedBtn.onclick = filterFundedOnly;
allBtn.onclick = showAllGames;


/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const numOfUnfunded = GAMES_JSON.filter(game => game.pledged < game.goal).length;
const numOfFunded = GAMES_JSON.filter(game => game.pledged >= game.goal).length;

// create a string that explains the number of unfunded games using the ternary operator
const displayStr = `A total of $${ raisedSum.toLocaleString(("en-US")) } has been raised for ${numOfGames} ${numOfFunded > 1 ? "games" : "game"}. Currently, ${numOfUnfunded} ${numOfUnfunded > 1 ? "games" : "game"} ${numOfUnfunded > 1 ? "remain" : "remain"} unfunded. We need your help to fund these amazing games!`;

// create a new DOM element containing the template string and append it to the description container
const summary = document.createElement("p");
summary.innerHTML = `${displayStr}`;
document.getElementById("description-container").append(summary);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
let [firstGame, secondGame, ...otherGames] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
let firstGameTag = document.createElement("p");
firstGameTag.innerHTML = `${firstGame.name}`;
document.getElementById("first-game").append(firstGameTag);

// do the same for the runner up item
let secondGameTag = document.createElement("p");
secondGameTag.innerHTML = `${secondGame.name}`;
document.getElementById("second-game").append(secondGameTag);

//search mechanism
const searchInput = document.getElementById("search");

searchInput.addEventListener("input", event => {

    console.log("event detected");
    deleteChildElements(gamesContainer);
    const value = event.target.value;
    console.log(value);
    
    let searchGames = GAMES_JSON.filter(game => {
        let match = true;
        for (let i = 0; i < value.length; i++){
            // console.log(`Scanning game letter ${i}`);
            if (game.name[i].toLowerCase() != value[i].toLowerCase()){
                match = false;
                console.log(`"${game.name}" does not match search input`);
            }
        }
        if (match === true){
            return true;
        } else {return false};
    });

    // console.log(searchGames.length);
    addGamesToPage(searchGames);
});

// console.log(GAMES_JSON);
