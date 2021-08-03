let cardNames = ["2C","2D","2H","2S","3C","3D",
"3H","3S","4C","4D","4H","4S","5C","5D",
"5H","5S","6C","6D","6H","6S","7C","7D","7H",
"7S","8C","8D","8H","8S","9C","9D","9H","9S","10C","10D",
"10H","10S","AC","AD","AH","AS","JC","JD","JH",
"JS","KC","KD","KH","KS","QC","QD","QH","QS"];

let deck = [];




class Card {

    constructor(name, value, isAce, isFaceCard) {
        this.name = name;
        this.value = value;
        this.isAce = isAce;
        this.isFaceCard = isFaceCard;
    }

    get name() {
        return this._name;
    }

    set name(name) {
        this._name = name;
    }

    set value(value) {
        this._value = value;
    }

    get value() {
        return this._value
    }

    set isAce(isAce) {
        this._isAce = isAce;
    }


    get isAce() {
        return this._isAce;
    }
    
    set isFaceCard(isFaceCard) {
        this._isFaceCard = isFaceCard;
    }

    get isFaceCard() {
        return this._isFaceCard;
    }
}




class Dealer {
    constructor() {
        this.dealerCards = [];
        this.playerCards = [];
    }

    get dealerCards() {
        return this._dealerCards;
    }
    set dealerCards(dealerCards) {
        this._dealerCards = dealerCards;
    }

    set playerCards(playerCards) {
        this._playerCards = playerCards;
    }
   

    get playerCards() {
        return this._playerCards;
    }

    initializeDeck() {
        let value = 1;
        for(let i = 0; i < cardNames.length; i++) {
            let isAce = false;
            let isFaceCard = false;
            if(i%4 === 0) {
                value++;
            }

            if(cardNames[i].charAt(0) === "A" || cardNames[i].charAt(0) === "K" || cardNames[i].charAt(0) === "Q" || cardNames[i].charAt(0) === "J") {
                isFaceCard = true;   
                value = 10;
            }
            
            if(cardNames[i].charAt(0) === "A") {
                isAce = true;  
                value = 11; 
            }

            

            let card = new Card(cardNames[i],value, isAce, isFaceCard);
            deck.push(card);

            
        }
    }

    dealInitalCards() {
        this.dealerCards.push(this.pickRandomCard());
        this.dealerCards.push(this.pickRandomCard());
        this.playerCards.push(this.pickRandomCard());
        this.playerCards.push(this.pickRandomCard());

    }

    pickRandomCard() {
        let num = Math.floor(Math.random() * (deck.length));
        let card = deck[num];
        deck.splice(num, 1);
        return card;
    }


    playerHits() {
        this.playerCards.push(this.pickRandomCard());
    }

    dealerHits() {
        this.dealerCards.push(this.pickRandomCard());
    }

    checkForPlayerBust() {
        let sum = 0;
        let aceCount = 0;
        for(let i = 0; i < this.playerCards.length; i++) {
            sum += this.playerCards[i].value;
            if(this.playerCards[i].isAce) {
                aceCount++;
            }
        }
        if(sum > 21) {
            while(aceCount > 0 && sum > 21 || aceCount !== 0) {
                sum -=10;
                aceCount--;
            }
        }
        return sum;
    }
    //didPlayerWin is an integer that is 0 on win, 1 on loss, 2 on draw
    endRound(didPlayerWin, originalBet) {
        this.playerCards = [];
        this.dealerCards = [];
        deck = [];

        if(didPlayerWin === 0) {
            return Math.round(originalBet*1.5);
        }
        if(didPlayerWin === 1) {
            return 0;
        }
        if(didPlayerWin === 2) {
            return originalBet*1;
        }


    }

    endPlayerSplit(didPlayerWin, originalBet) {
        if(didPlayerWin === 0) {
            return Math.round(originalBet*1.5);
        }
        if(didPlayerWin === 1) {
            return 0;
        }
        if(didPlayerWin === 2) {
            return originalBet*1;
        }
    }

   

    checkForDealerBust() { 
        let aceCount = 0;
        let dealerSum = 0;
        for(let i = 0; i < this.dealerCards.length;i++) {
            if(this.dealerCards[i].isAce) {
                aceCount++;
            }
            dealerSum += this.dealerCards[i].value

        }
        while(dealerSum > 21 && aceCount > 0) {
            dealerSum -= 10;
            aceCount--
        }
        return dealerSum;

    }
}