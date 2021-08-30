export default class QwixxModel {

    constructor(numRows, maxColumn, numWdice) {
        this.numRows = Number(numRows);
        this.maxColumn = Number(maxColumn);
        this.numWdice = Number(numWdice);
        this.gamePhase = 0;  // 0 means roll phase, 1 means phase 1, 2 means phase 2
        this.wdice = new Array(this.numWdice).fill(0);
        this.dice = new Array(this.numRows).fill(0);
        this.numBoxesCrossedOut = Array(this.numRows).fill(false).map(x => Array(this.maxColumn).fill(false));
        this.wDiceTotalAmt;
        this.penaltyBoxesCrossedOut = new Array(4).fill(false);
        this.amtOfPenalties = 0;
        this.rowsLocked = 0;
        this.colorRowTotals = new Array(this.numRows).fill(0);
        this.penaltyTotals = 0;
        this.finalTotal = 0;
    }
    
    // Checks if the game is over
    checkIfGameOver() {
    	if (this.amtOfPenalties >= 4 || this.rowsLocked >= 2) {
    		return true;
    	}
    	return false;
    }
    
    // A series of checks to see if numBox can be crossed out
    crossOutChecks(numBoxRow, numBoxCol, numBoxVal) {
    	// Checks to see if the game is in a phase where numBoxes cannot be clicked
    	if (this.gamePhase === 0) {
    		return false;	
    	}
    	// Checks to see if row has been locked
    	if (this.numBoxesCrossedOut[numBoxRow - 1][this.maxColumn - 1] === true) {
    		return false;
    	}
    	// Checks to see if numBox has already been crossed out
    	if (this.numBoxesCrossedOut[numBoxRow - 1][numBoxCol - 1] === true) {
    		return false;
    	}
    	// Checks to see if numBox is left of any crossed out numBox
    	for (let i = numBoxCol; i < this.maxColumn - 1; ++i) {
    		if (this.numBoxesCrossedOut[numBoxRow - 1][i] === true) {
    			return false;
    		}
    	}
    	// Checks to see if half of the numBoxes or more have already been crossed out for that row in order to lock the row
    	if (numBoxCol === this.maxColumn - 1) {
    		let totalRowNumsCrossedOut = 0
    		
    		// Finds total number of boxes crossed off in row
    		for (let i = 0; i < numBoxCol - 1; ++i) {
    			if (this.numBoxesCrossedOut[numBoxRow - 1][i] === true) {
    				++totalRowNumsCrossedOut;
    			}
    		}
    		
    		// Checks if there are half of the numBoxes or more crossed out in that row 
    		if (totalRowNumsCrossedOut < Math.floor((this.maxColumn - 1) / 2)) {
    			return false;
    		}
    	}
    	
    	// Converts numBoxVal to Number type
    	let numBoxNum = Number(numBoxVal);
    	
    	// Sees if numBox value matches the total of the white dice in Phase 1
    	if (this.gamePhase === 1 && numBoxNum === this.wDiceTotalAmt){
    		this.gamePhase = 2;
    		return true;
    	}
    	
    	if (this.gamePhase === 2) {
    		for (let i = 0; i < this.numRows; ++i) {
    			if (numBoxNum === this.wdice[i] + this.dice[numBoxRow - 1]) {
    				this.gamePhase = 0;
    				return true;
    			}
    		}
    	}
    	return false;
    }
    
    // Record if numBox was crossed out
    crossOutNum(numBoxRow, numBoxCol, numBoxVal) {
	  	if (this.crossOutChecks(numBoxRow, numBoxCol, numBoxVal) === true) {
	  		this.numBoxesCrossedOut[numBoxRow - 1][numBoxCol - 1] = true;  		
	  		return true;
  		}
		return false;
    }
    
    // Checks if penalty box can be crossed out and records the result if it is crossed out
    crossOutPenaltyBox(penaltyBoxId) {
    	if (this.gamePhase === 2 && 
    			this.penaltyBoxesCrossedOut[penaltyBoxId - 1] === false) {
    		this.penaltyBoxesCrossedOut[penaltyBoxId - 1] = true;
    		++this.amtOfPenalties;
    		this.gamePhase = 0;
    		return true;
    	}
    	return false;
    }
    
    // Checks if lockBox can be crossed out and records the result if it is crossed out
    crossOutLockBox(numBoxRow, numBoxCol) {
    	if(numBoxCol === this.maxColumn - 1) {
  			++this.rowsLocked;
  			this.numBoxesCrossedOut[numBoxRow - 1][this.maxColumn - 1] = true;
  			return true;
  		}
    	return false;
    }
    
    // Finds the totals of the rows, penalties, and final score
    findTotals() {
    	// Records how many boxes have been crossed out in each row
    	this.colorRowTotals.forEach((val, index, arr) => {
    		for (let col of this.numBoxesCrossedOut[index]) {
    			if(col === true) {
    				++arr[index];
    			}
    		}
    	});
    	
    	// Uses the records of how many boxes have been crossed out in each row
    	// to find the point total for each row
    	this.colorRowTotals.forEach((val, index, arr1) => {
    		let arr2 = new Array(val + 2);
    		arr2[0] = 0;
    		for (let i = 1; i <= val; ++i) {
    			arr2[i] = i + arr2[i - 1];
    		}
    		arr1[index] = arr2[val];
    	});
    	
    	this.penaltyTotals = this.amtOfPenalties * 5;
    	this.finalTotal = this.colorRowTotals.reduce((a, b) => a + b, 0) - this.penaltyTotals;
    }
    
 // return a random integer in the range [1, 6]
    static rollDie() {
        return Math.floor(Math.random() * 6 + 1);
    }

    rollDice() {
        this.wdice = this.wdice.map(() => QwixxModel.rollDie());
        this.dice = this.dice.map(() => QwixxModel.rollDie());
        this.wDiceTotalAmt = this.wdice.reduce((a, b) => a + b, 0);
        this.gamePhase = 1;
    }
}