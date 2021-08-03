let chipCount = 5000;
let dealer = new Dealer();
let betAmount = document.querySelector(".bet-amount");
let chipCounter = document.querySelector(".chips");
let betButton = document.querySelector(".bet");
let hitButton = document.querySelector(".hit");
let splitButton = document.querySelector(".split");
let standButton = document.querySelector(".stand");
let dealerArea = document.querySelector(".dealer-area");
let playerArea = document.querySelector(".player-area");
let cardSum = document.querySelector(".card-sum");
let cardSumSplit = document.querySelector(".card-sum-split")
let insuranceButton = document.querySelector(".insurance");
let noInsuranceButton = document.querySelector(".no-insurance");
let resetChipsButton = document.querySelector(".reset-chips");
let doubleDownButton = document.querySelector(".double-down");
let betValueHolder = 0;
let gameResult = document.querySelector(".result");
let cardBackImg;
let insuranceBetMade = false;
let didSplitOccur = false;
let isSplitOne = true;
let splitOneFinished = false;
let splitOneCardSum = 0;
let splitTwoFinished = false;
let splitTwoCardSum = 0;
let topSplit = [];
let bottomSplit = [];


function turnOffStartingButtons() {
    hitButton.disabled = true;
    standButton.disabled = true;
    splitButton.disabled = true;
    insuranceButton.disabled = true;
    noInsuranceButton.disabled = true;
    resetChipsButton.disabled = true;
    doubleDownButton.disabled = true;
    gameResult.style.visibility = "hidden";
    
}


betButton.addEventListener("click", () => {
    if(betAmount.value.length === 0) {
        alert("Please enter a valid bet amount.");
    }
    else if(betAmount.value <= 0 || betAmount.value > chipCount) {
        alert("Please enter a valid bet amount.")
    }
    else {
        clearBoard(playerArea);
        clearBoard(dealerArea);
        cardSumSplit.innerHTML = "";
        gameResult.style.visibility = "hidden";
        betValueHolder = betAmount.value;
        chipCount -= betValueHolder;
        betButton.disabled = true;
        updateChipCount();
        checkForResetChips();
        startRound();
        checkForSplit();
        checkForDoubleDown();
        checkForInsurance();
        if(insuranceButton.disabled) {
            checkForBlackjack();
        }

        
    }
});

hitButton.addEventListener("click", () => {
    if(didSplitOccur && isSplitOne) {
        dealer.playerCards = topSplit;
    }
    else if(didSplitOccur && !isSplitOne) {

        dealer.playerCards = bottomSplit;
    }
    doubleDownButton.disabled = true;
    dealer.playerHits();
    splitButton.disabled = true;
    let currentCard = dealer.playerCards[dealer.playerCards.length -1];
    let cardName = currentCard.name;
    if(didSplitOccur && isSplitOne || !didSplitOccur) {
        createImageOfCard(cardName, "player", false);
    }
    else if(didSplitOccur) {
        createImageOfCard(cardName,"player-split", false);
    }
    if(!didSplitOccur) {
        let sum = dealer.checkForPlayerBust();
        cardSum.innerHTML = sum;
        if(sum > 21) {
            gameResult.innerHTML = "Bust! You Lose!";
            gameResult.style.visibility = "visible";
            hitButton.disabled = true;
            standButton.disabled = true;
            betButton.disabled = false;
            revealDealerCard();
            dealer.endRound(1, betValueHolder);

        }

        if(sum === 21) {
            revealDealerCard();
            let dealerSum = playDealersTurn();
            let winnings = dealer.endRound(checkWinner(sum, dealerSum), betValueHolder);
            chipCount += winnings;
            hitButton.disabled = true;
            standButton.disabled = true;
            betButton.disabled = false;
            updateChipCount();
        }
    }
    else {
        if(isSplitOne && !splitOneFinished) {
            dealer.playerCards = topSplit;
            splitOneCardSum = dealer.checkForPlayerBust();
            cardSum.innerHTML = splitOneCardSum;
            if (splitOneCardSum >= 21) {
                splitOneFinished = true;

            } 
            
            
            if(!splitTwoFinished) {
                isSplitOne = false;   
            }
            
        

        }
        else if(!isSplitOne && !splitTwoFinished) {
            dealer.playerCards = bottomSplit;
            splitTwoCardSum = dealer.checkForPlayerBust();
            cardSumSplit.innerHTML = splitTwoCardSum;
            if(splitTwoCardSum >=21) {
                splitTwoFinished = true;
            }
            if(!splitOneFinished) {
                isSplitOne = true;
            }
            
        } 
        checkForRoundEnd();
    }



});

resetChipsButton.addEventListener("click", ()=> {
    resetChipsButton.disabled = true;
    chipCount = 5000;
    updateChipCount();
});

insuranceButton.addEventListener("click", ()=> {
    let insuranceBet = Math.floor(betValueHolder/2);
    insuranceButton.disabled = true;
    noInsuranceButton.disabled = true;
    chipCount -= insuranceBet;
    insuranceBetMade = true;
    updateChipCount();
    checkForDealerBlackJack();
    
});

noInsuranceButton.addEventListener("click", ()=> {
    insuranceButton.disabled = true;
    noInsuranceButton.disabled = true;
    checkForDealerBlackJack();
});



standButton.addEventListener("click" , ()=> {
    if(!didSplitOccur) {
        doubleDownButton.disabled = true;
        let sum = dealer.checkForPlayerBust();
        revealDealerCard();
        let dealerSum = playDealersTurn();
        let winnings = dealer.endRound(checkWinner(sum, dealerSum), betValueHolder);
        chipCount += winnings;
        hitButton.disabled = true;
        standButton.disabled = true;
        betButton.disabled = false;
        splitButton.disabled = true;
        updateChipCount();
    }
    else {
        if(isSplitOne && !splitOneFinished) {
            splitOneFinished = true;
            isSplitOne = false;

        }
        else if(!isSplitOne && !splitTwoFinished) {
            splitTwoFinished = true;
            isSplitOne = true;
        }
        checkForRoundEnd();
    }
    
});


splitButton.addEventListener("click", ()=> {
    let cardName = dealer.playerCards[1].name;
    let cardElement = document.getElementById(cardName);
    console.log(cardElement)
    cardElement.classList.add("player-card-split");
    didSplitOccur = true;
    splitButton.disabled = true;
    doubleDownButton.disabled = true;
    cardSum.innerHTML = dealer.playerCards[0].value;
    chipCount -= betValueHolder;
    updateChipCount();
    topSplit.push(dealer.playerCards[0]);
    bottomSplit.push(dealer.playerCards[1]);


});

doubleDownButton.addEventListener("click" ,()=> {
    chipCount -= betValueHolder;
    betValueHolder *= 2;
    splitButton.disabled = true;
    
    updateChipCount();
    hitButton.click();
});

function checkForRoundEnd() {
    // let sum = dealer.checkForPlayerBust();
    if(splitOneFinished && splitTwoFinished) {
         revealDealerCard();
        let winnings;
        let dealerSum = playDealersTurn();
        console.log(dealerSum);
        // let winnings = dealer.endRound(checkWinner(sum, dealerSum), betValueHolder);
        // chipCount += winnings;
        hitButton.disabled = true;
        standButton.disabled = true;
        betButton.disabled = false;
        splitButton.disabled = true;
        gameResult.innerHTML = "";
        // updateChipCount();
        if(dealerSum > splitOneCardSum && dealerSum <= 21 || splitOneCardSum > 21) {
            winnings = dealer.endPlayerSplit(1, betValueHolder);
            gameResult.innerHTML += "Split 1 Loss, ";
        }
        else if(splitOneCardSum > dealerSum && splitOneCardSum <= 21 || dealerSum > 21) {
            winnings = dealer.endPlayerSplit(0, betValueHolder);
            gameResult.innerHTML += "Split 1 Win, ";
        }
        else {
            winnings = dealer.endPlayerSplit(2, betValueHolder);
            gameResult.innerHTML += "Split 1 Standoff, "

        }
        chipCount += winnings;

        if(dealerSum > splitTwoCardSum && dealerSum <= 21 || splitTwoCardSum > 21) {
            winnings = dealer.endRound(1, betValueHolder);
            gameResult.innerHTML += "Split 2 Loss!"
        }
        else if(splitTwoCardSum > dealerSum && splitTwoCardSum <=21 || dealerSum > 21) {
            winnings = dealer.endRound(0, betValueHolder);
            gameResult.innerHTML += "Split 2 Win!"
        }
        else {
            winnings = dealer.endRound(2, betValueHolder);
            gameResult.innerHTML += "Split 2 Standoff!"
        }
        gameResult.style.visibility = "visible";
        chipCount += winnings;
        didSplitOccur = false;
        isSplitOne = true;
        splitOneFinished = false;
        splitOneCardSum = 0;
        splitTwoFinished = false;
        splitTwoCardSum = 0;
        topSplit = [];
        bottomSplit = [];
    }
    
}

function startRound() {
    dealer.initializeDeck();
    dealer.dealInitalCards();
    //player cards
    for(let i = 0; i < dealer.playerCards.length; i++) {
        let card = dealer.playerCards[i]
        createImageOfCard(card.name, "player", false);
    }
    let sum = dealer.checkForPlayerBust();
    cardSum.innerHTML = sum;

    //dealer cards
    createImageOfCard("purple_back", "dealer", true);
    createImageOfCard((dealer.dealerCards[1]).name, "dealer", false);

    //enable buttons
    hitButton.disabled = false;
    standButton.disabled = false;

}

//cardOwner is either a string for player or dealer 
function createImageOfCard(cardName, cardOwner, isCardBack) {
    let cardElement = document.createElement("img");
    cardElement.src = "../static/images/" + cardName + ".png";
    if(isCardBack) {
        cardBackImg = cardElement;
    }

    if(cardOwner === "player") {
        cardElement.classList.add("player-card");
        cardElement.id = cardName
        playerArea.appendChild(cardElement);
    }
    else if(cardOwner === "dealer") {
        cardElement.classList.add("dealer-card");
        cardElement.id = cardName;
        dealerArea.appendChild(cardElement);
    }
    else if(cardOwner === "player-split") {
        cardElement.classList.add("player-card-split");
        cardElement.id = cardName
        playerArea.appendChild(cardElement);
    }
}

function revealDealerCard() {
    let dealerCard = dealer.dealerCards[0];
    cardBackImg.src = "../static/images/" + dealerCard.name + ".png";
    
}

function checkWinner(sum, dealerSum) {
    if(sum > dealerSum || dealerSum > 21) {
        gameResult.innerHTML = "You Win!";
        gameResult.style.visibility = "visible";
        return 0;
    }
    else if(dealerSum === sum) {
        gameResult.innerHTML = "Standoff!";
        gameResult.style.visibility = "visible";
        return 2;
    }
    else {
        gameResult.innerHTML = "You Lose!";
        gameResult.style.visibility = "visible";
        return 1;
    }
}


function playDealersTurn() {
    let dealerSum = dealer.checkForDealerBust();
    let cardCounter = 2;
    while (dealerSum < 17) {
        dealer.dealerHits();
        createImageOfCard(dealer.dealerCards[cardCounter].name, "dealer");
        dealerSum = dealer.checkForDealerBust();
        cardCounter++;
    }

    return dealerSum;
}
turnOffStartingButtons();

//boardToClear should be which board to clear, the html element for it
function clearBoard(boardToClear) {
    let cards = boardToClear.querySelectorAll("img");
    for(let i = 0 ; i < cards.length ; i++) {
        boardToClear.removeChild(cards[i]);
    }
}



function updateChipCount() {
    chipCounter.innerHTML = "Chips: " + chipCount;
}

function checkForSplit() {
    let playerCards = dealer.playerCards;
    if(playerCards[0].name.charAt(0) === playerCards[1].name.charAt(0) && chipCount >= betValueHolder) {
        splitButton.disabled = false;
    }
}

function checkForInsurance() {
    if(dealer.dealerCards[1].value === 11) {
        insuranceButton.disabled = false;
        noInsuranceButton.disabled = false;
        splitButton.disabled = true;
        doubleDownButton.disabled = true;
        hitButton.disabled = true;
        betButton.disabled = true;
        standButton.disabled = true;
    }
}

function checkForDealerBlackJack() {
    let dealerSum = dealer.checkForDealerBust();
    if(dealerSum === 21 && insuranceBetMade) {
        revealDealerCard();
        chipCount += betValueHolder*2;
        dealer.endRound(0,betValueHolder);
        insuranceButton.disabled = true;
        noInsuranceButton.disabled = true;
        betButton.disabled = false;
        gameResult.innerHTML = "Dealer Blackjack! You win with insurance!";
        gameResult.style.visibility = "visible";
        updateChipCount();
        
        

    }
    else if(dealerSum === 21 && !insuranceBetMade) {
        chipCount += dealer.endRound(1, betValueHolder);
        revealDealerCard();
        insuranceButton.disabled = true;
        noInsuranceButton.disabled = true;
        betButton.disabled = false;
        gameResult.innerHTML = "Dealer Blackjack! you lose!"
        gameResult.style.visibility = "visible";
    }
    else {
        checkForSplit();
        //checkForDoubleDown()
        hitButton.disabled = false;
        standButton.disabled = false;
        checkForBlackjack();

    }
    insuranceBetMade = false;

   
}

function checkForBlackjack() {
    if(dealer.checkForPlayerBust() == 21) {
        chipCount += dealer.endRound(0,betValueHolder);
        gameResult.innerHTML = "Blackjack!";
        gameResult.style.visibility = "visible";
        betButton.disabled = false;
        standButton.disabled = true;
        hitButton.disabled = true;
        doubleDownButton.disabled = true;
        updateChipCount();
    }
}

function checkForDoubleDown() {
    let sum = dealer.checkForPlayerBust();
    if(sum >= 9 && sum <= 11 && chipCount >= betValueHolder) {
        doubleDownButton.disabled = false;
    }
}

function checkForResetChips() {
    if (chipCount === 0) {
        resetChipsButton.disabled = false;
    }
}


checkForResetChips();