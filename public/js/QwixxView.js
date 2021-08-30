export default class QwixxView {

    constructor() {
    	this.numRows = window.getComputedStyle(document.body).getPropertyValue('--amount-of-color-rows');
    	this.numCols = window.getComputedStyle(document.body).getPropertyValue('--amount-of-number-boxes-in-row');
    	this.numWDice = window.getComputedStyle(document.body).getPropertyValue('--white-dice-amt');
    }
    
    // Changes the buttons displayed depending on the game phase
    changeButtons(gamePhase) {
    	switch (gamePhase) {
			case 0:
				document.getElementById('roll').style.display = "initial";
				break;
			case 1:
				document.getElementById('roll').style.display = "none";
				document.getElementById('passPhase1').style.display = "initial";
				break;
			case 2:
				document.getElementById('passPhase1').style.display = "none";
		}
    }
    
    // Makes dice disappear from the board
    disappearDie(rowNum) {
    	document.getElementById(`die-${rowNum - 1}`).style.display = "none";
    }
    
    // Displays an alert box telling the player that the game is over
    gameEndedAlert() {
    	alert("The game is over!!!\n\nView your total!");
    	document.getElementById('roll').style.display = "none";
    }
    
    // Creates event listeners on the numBoxes
    onNumBoxClicked(callback) {
		for (let i = 1; i <= this.numRows; ++i) {
			for(let j = 1; j <= this.numCols - 1; ++j) {
				document.getElementById(`row${i}-col${j}`).addEventListener('click', () => {
			    	let numBoxVal = document.getElementById(`row${i}-col${j}`).innerText;
					callback(i, j, numBoxVal);
				});	
			}
		}
	}
    
    // Creates an event listener on the Pass On Phase 1 button
    onPassPhase1Clicked(callback) {
    	document.getElementById('passPhase1').addEventListener('click', callback);
    }
    
    // Creates event listeners on the penalty boxes
    onPenaltyBoxClicked(callback) {
    	for (let i = 1; i <= 4; ++i) {
    		document.getElementById(`penaltyBox${i}`).addEventListener('click', () => callback(i));			
    	}
    }

    // Ideally, this view class should be the only class interacting with the DOM.
    // However, it is the controller that responds to the click.
    // One solution is for the controller to call a View method that adds
    // a callback of the Controller's choosing.
    onRollButtonClicked(callback) {
        document.getElementById('roll').addEventListener('click', callback);
    }
    
    // Crosses out the passed row's lock box on the board
    strikeLockBox(numBoxRow) {
    	document.getElementById(`row${numBoxRow}-lockBox`).innerHTML = '';
    	document.getElementById(`row${numBoxRow}-lockBox`).classList.add('strike');
    }
    
    // Crosses out the corresponding numBox on the board based on the information passed
    strikeNum(numBoxRow, numBoxCol) {
    	document.getElementById(`row${numBoxRow}-col${numBoxCol}`).classList.add('strike');
    }
    
    // Crosses out the corresponding penalty box on the board based on the penalty box id passed
    strikePenalty(penaltyBoxId) {
    	document.getElementById(`penaltyBox${penaltyBoxId}`).classList.add('strike');
    }
    
    // Update the board according to the current state of the model.
    // IMPORTANT:  The View should not modify the model.  All accesses
    // to the model should be read only.
    updateDice(model) {
	    model.wdice.forEach((die, index) => {
	        document.getElementById(`die-w${index}`).innerHTML = die;
	    })
	
	    model.dice.forEach((die, index) => {
	        document.getElementById(`die-${index}`).innerHTML = die;
	    });
    } // end update
    
    // Writes the totals on the board that were calculated in the model
    writeTotals(model) {
    	model.colorRowTotals.forEach((val, index) => {
    		document.getElementById(`totalBox${index + 1}`).innerHTML = val;
    	});
    	document.getElementById('penaltyTotalBox').innerHTML = model.penaltyTotals;
    	document.getElementById('finalTotalBox').innerHTML = model.finalTotal;
    }
} // end QwixxView