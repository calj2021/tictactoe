
let gameOver = false;
let computerMoves = [];
let playerMoves = [];
let usedMoves = [];
let potenitalWinningList = [];
let memoryList = [];
const winningList = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

winningList.forEach((item) => {
  potenitalWinningList.push(twoItemsList(item));
})


// Create 9 buttons board
const gameBoard = document.getElementById('game-board');

for (let i=0; i<9; i++) {
  const button = document.createElement('button');
  const extraContent = document.createElement('span');
  extraContent.className = 'extraContent';
  button.appendChild(extraContent);
  button.className = "custom-button";
  button.addEventListener('click', function(){
    playerMoves.push(i);
    usedMoves.push(i);
    extraContent.textContent = "X";
    button.disabled = true;
    if (playerMoves.length>2) {
      let playerThreeMoves = threeItemsList(playerMoves);
      playerThreeMoves.forEach((item) => {if ((JSON.stringify(winningList).includes(JSON.stringify(item.sort())))){
        gameOver = true; 
        setTimeout(() => {alert("You win")}, 1000);
        for (let i=0; i<playButtons.length; i++) {
          playButtons[i].disabled = true;
        }
      }
      })
    } 
    playingGame();
    
  })
  gameBoard.appendChild(button);
}

// Get the container element where the buttons will be appended 
const playButtons = gameBoard.getElementsByClassName('custom-button');


playingGame();

function playingGame(){

  let moveOneTaken = false;
  let moveTwoTaken = false;
  let unusedMoves = checkUnusedMoves(usedMoves); 
  while (computerMoves.length === playerMoves.length  && gameOver === false) {
    // first, if the board is empty, randomly put the frist move
    if (computerMoves.length === 0) {
      const randomNumber = Math.floor(Math.random()*9);
      computerMove(randomNumber);
      computerMoves.push(randomNumber);
      usedMoves.push(randomNumber);
    } else { // if the board is not empty ...
      // put unused spaces in a list
      //let unusedMoves = checkUnusedMoves(usedMoves); 
      // find the best move from the unused spaces, need a function here
      // 1. to create a wining line
      // 2. to block the player to win
      // 3. to find the potenital winning move 

      // 1st situation: if any unused move + 2 of computer moves becoming winning line, then the unused move gets the top score and chosen
  

      // 2nd situation: if computer is not to win, check the player's moves. If any unused move + 2 of player's moves becoming winning line, then that unused move gets the top score and chosen. If it is more than 1, it will be randomly chosen from those
      //if (gameOver === false && playerMoves.length > 1) {
  
        checkComputerWin(computerMoves,unusedMoves);
        if (gameOver === false) {
        moveOneTaken = checkPlayerWin(playerMoves, unusedMoves, moveOneTaken);
        }

      if (moveOneTaken === false && gameOver === false) {
        let availWinList = availableWin(playerMoves);
        let nextMove = oneCompOneUnused(computerMoves,unusedMoves, availWinList);
        if (nextMove !== undefined) {
          console.log("Third Step");
          console.log(nextMove);
          computerMove(nextMove);
          computerMoves.push(nextMove);
          usedMoves.push(nextMove);
          moveTwoTaken = true; 
        }
      }
      
      console.log(moveOneTaken);
      console.log(moveTwoTaken);

      if (moveTwoTaken === false && moveOneTaken === false && gameOver === false) {
          console.log("this is the last step");
          console.log(unusedMoves);
          if (unusedMoves.length === 1) {
            console.log(unusedMoves);
            computerMove(unusedMoves[0]);
            computerMoves.push(unusedMoves[0]);
            usedMoves.push(unusedMoves[0]);
          } else {
          const randomNumber = Math.floor(Math.random()*(unusedMoves.length));
          setTimeout(() => {computerMove(unusedMoves[randomNumber])}, 100);
          computerMoves.push(unusedMoves[randomNumber]);
          usedMoves.push(unusedMoves[randomNumber]);
          }
          
        }
      


      // 3rd situation: if computer and player are not to win, check each unused move to see which one has a better chance to win.  

    }

    // Determine if computer will win
    if (computerMoves.length>2) {
      let computerThreeMoves = threeItemsList(computerMoves);
      computerThreeMoves.forEach((item) => {if ((JSON.stringify(winningList).includes(JSON.stringify(item.sort())))){
        gameOver = true; 
        setTimeout(() => {alert("You lost")}, 500);
        for (let i=0; i<playButtons.length; i++) {
          playButtons[i].disabled = true;
        }
      }
      })
    }
  }
  
} 


// all the functions below



// Check if computer will win
function checkComputerWin(computerMoves, unusedMoves) {
  let twoItemList = twoItemsList(computerMoves); 
  for (let i=0; i<twoItemList.length; i++) {
    let counter = 0;
    for (let j=0; j<unusedMoves.length; j++){
      let tempList= twoItemList[i].slice();
      tempList.push(unusedMoves[j]);
      if (JSON.stringify(winningList).includes(JSON.stringify(tempList.sort()))) {
        setTimeout(() => {computerMove(unusedMoves[j])}, 100);
        computerMoves.push(unusedMoves[j]);
        gameOver = true;
        counter ++;
        for (let i=0; i<playButtons.length; i++) {
          playButtons[i].disabled = true;
        }
        return(gameOver);       
      }
    }
  }
}

// Check if player will win
function checkPlayerWin(playerMoves, unusedMoves,moveTaken){
  let twoItemList = twoItemsList(playerMoves);
  // created a list to remember that 2 numbers have been used last time.
 for (let i=0; i<twoItemList.length; i++) {
   let counter = 0;
   if (memoryList.includes(twoItemList[i]) === false) {
     for (let j=0; j<unusedMoves.length; j++){
       let tempList= twoItemList[i].slice();
       tempList.push(unusedMoves[j]);
       if (JSON.stringify(winningList).includes(JSON.stringify(tempList.sort()))) {
         setTimeout(() => {computerMove(unusedMoves[j])}, 100);
         computerMoves.push(unusedMoves[j]);
         usedMoves.push(unusedMoves[j]);
         memoryList.push(twoItemList[i]);
         moveTaken = true;
         counter ++; 
         break;
       }   
     }
   }
   if (counter === 1) {
     break;
   }
 }
 return(moveTaken);
}

// Check unused moves
function checkUnusedMoves(aList) {
  const totalMoves = [0,1,2,3,4,5,6,7,8];
  let unused = [];
  totalMoves.forEach((item) => {
    if (aList.includes(item) === false){
      unused.push(item);
    }
  });
  return(unused);
}

// Creating computer move
function computerMove(index){
  playButtons[index].querySelector('.extraContent').textContent = "O";
  playButtons[index].disabled = true; 
}

// Break a list into 2 elements list
function twoItemsList(aList){
  let newList = [];
  for (let i=0; i < aList.length; i++){
    for (let j=i+1; j<aList.length; j++){
      newList.push([aList[i],aList[j]]);
    }
  }
  return(newList);
}

// Break a list into 3 elements list
function threeItemsList(aList){
  let newList = [];
  for (let i=0; i< aList.length; i++) {
    for (let j=i+1; j<aList.length; j++) {
      for (let k=j+1; k<aList.length; k++) {
        newList.push([aList[i],aList[j],aList[k]]);
      }
    }
  }
  return(newList);
}

// Combine unused moves to 2 moves to see if 3 moves would be in a straight line
function listCombination(oneItemList, twoItemsList) {
  let combinedList = [];
  twoItemsList.forEach( (item) => {
    for (let i=0; i< oneItemList.length; i++) {
      let tempList = item.slice();
      item.push(oneItemList[i]); 
      combinedList.push(item);
      item = tempList.slice();
    }
  }); 
  return(combinedList);
}

// checking if the 3 numbers are in a straight line
function checkWinningList(aList){
  let winningTwoNum = [];
  aList.forEach((item) => {
    if ((JSON.stringify(winningList).includes(JSON.stringify(item)))){
      winningTwoNum.push(item);
    }
  });
  return(winningTwoNum);
}

//checkTwoItemsList()
//Check if 2 element list is in potential winning list
function checkTwoItemsList(aList){
  let arrayIndex
  potenitalWinningList.forEach((subList, index) => {
    if ((JSON.stringify(subList)).includes(JSON.stringify(aList.sort()))) {
      arrayIndex = index;
    }
  });
  return(arrayIndex);
}

//check the item missing in 3 item list by compare 2 item list to a 3 item list
function checkTwoLists(twoItmes, threeItems){
  let missingNum
  threeItems.forEach((item) => {
    if ((JSON.stringify(twoItmes).includes(JSON.stringify(item))) === false){
      missingNum = item;
    }
  })
  return(missingNum);
}

// Check available winning list after player moves

function availableWin(aList) {
  let newArray = winningList.filter(subArray => {
    for (let item of aList) {
      if (subArray.includes(item)){
        return false;
      }
    }
    return true;
  });
  return(newArray);
}

// Create a list of two items, one item from Computer moves and the other from unused moves, to see if the next move can lead to 2 winning chance
function oneCompOneUnused(computerMoves,unusedMoves, availWinList) {
  let newList = [];
  let availWinListTwo = [];
  let availWinListTwoOneDimension = [];

  if (computerMoves.length <2) {
    return(undefined);
  } else {
    availWinList.forEach((item) => {
    availWinListTwo.push(twoItemsList(item))
  });
  for (let i=0; i<availWinListTwo.length; i++){
    for (let j=0; j<availWinList[i].length; j++) {
      availWinListTwoOneDimension.push(availWinListTwo[i][j])
    }
  }
  for (let i=0; i<computerMoves.length; i++) {
    for (let j=0; j<unusedMoves.length; j++) {
      if (JSON.stringify(availWinListTwoOneDimension).includes(JSON.stringify([computerMoves[i],unusedMoves[j]].sort()))) {
        newList.push({"index": unusedMoves[j], "score": 1});
      }
    }
  }

  console.log(availWinListTwoOneDimension);
  console.log(newList);

  
  let combinedScoresArray = newList.reduce((acc, obj) => {
    let foundIndex = acc.findIndex(item => item.index === obj.index);
    if (foundIndex !== -1) {
      acc[foundIndex].score += obj.score;
    } else {
      acc.push({index: obj.index, score: obj.score });
    }
    return acc;
  }, []);
  combinedScoresArray.sort((a,b) => b.score - a.score);
  if (combinedScoresArray.length > 0) {
    return(combinedScoresArray[0].index);
  } else {
    return(undefined);
  }
}  
}
