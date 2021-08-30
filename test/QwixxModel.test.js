import QwixxModel from '../public/js/QwixxModel.js'

describe("QwixxModel", () => {
	
	// numRows, maxColumn, numWDice, and model declared in each different function test so that function
	// tests may better/easily be adjusted depending on desired model size
	
	describe("checkIfGameOver", () => {
		
		let numRows = 4;
		let maxColumn = 12;
		let numWDice = maxColumn / 6;
		let model = new QwixxModel(numRows, maxColumn, numWDice);

        it("Returns true when amount of penalties is 4 and rows locked are less than 2", () => {
        	model.amtOfPenalties = 4;
        	model.rowsLocked = 1;
        	
        	expect(model.checkIfGameOver()) === true;
        });

		it("Returns true when amount of penalties greater than 4 and rows locked are less than 2", () => {
	    	model.amtOfPenalties = 5;
	    	model.rowsLocked = 1;
	    	
	    	expect(model.checkIfGameOver()) === true;
	    });
		
		it("Returns true when amount of penalties is less than 4 and rows locked are 2", () => {
	    	model.amtOfPenalties = 3;
	    	model.rowsLocked = 2;
	    	
	    	expect(model.checkIfGameOver()) === true;
	    });
		
		it("Returns true when amount of penalties is less than 4 and rows locked are greater than 2", () => {
	    	model.amtOfPenalties = 3;
	    	model.rowsLocked = 2;
	    	
	    	expect(model.checkIfGameOver()) === true;
	    });
		
		it("Returns false when amount of penalties is less than 4 and rows locked are less than 2", () => {
	    	model.amtOfPenalties = 3;
	    	model.rowsLocked = 1;
	    	
	    	expect(model.checkIfGameOver()) === false;
	    });
	});
	
describe("crossOutChecks", () => {
		
		let numRows = 4;
		let maxColumn = 12;
		let numWDice = maxColumn / 6;
		let model = new QwixxModel(numRows, maxColumn, numWDice);
		
        it("Returns true when a numBox satisfies all conditions to be crossed out", () => {
        	model.gamePhase = 1;
        	
        	expect(model.crossOutChecks(1, 3, 4)) === true;
        });
        
        it("Returns true when a numBox satisfies all conditions to be crossed out", () => {
        	model.gamePhase = 2;
        	
        	expect(model.crossOutChecks(1, 3, 4)) === true;
        });
        
        it("Returns false when a numBox does not satisfy all conditions to be crossed out", () => {
        	model.gamePhase = 0;
        	
        	expect(model.crossOutChecks(1, 3, 4)) === false;
        });
    });
	
	describe("crossOutNum", () => {
		
		let numRows = 4;
		let maxColumn = 12;
		let numWDice = maxColumn / 6;
		let model = new QwixxModel(numRows, maxColumn, numWDice);
		model.crossOutChecks = jest.fn();
		
        it("Returns true when crossOutChecks returns true and crosses out the specified numBox", () => {
        	model.crossOutChecks.mockReturnValueOnce(true);
        	let numBoxRow = 3;
        	let numBoxCol = 9;
        	
        	expect(model.crossOutNum(numBoxRow, numBoxCol, 10)) === true;
        	expect(model.numBoxesCrossedOut[numBoxRow - 1][numBoxCol - 1]) === true;
        });
        
        it("Returns false when crossOutChecks returns false and doesn't crosse out the specified numBox", () => {
        	model.crossOutChecks.mockReturnValueOnce(false);
        	let numBoxRow = 3;
        	let numBoxCol = 9;
        	
        	expect(model.crossOutNum(numBoxRow, numBoxCol, 10)) === false;
        	expect(model.numBoxesCrossedOut[numBoxRow - 1][numBoxCol - 1]) === false;    	
        });
    });
	
	describe("crossPenaltyBox", () => {
			
			let numRows = 4;
			let maxColumn = 12;
			let numWDice = maxColumn / 6;
			let model = new QwixxModel(numRows, maxColumn, numWDice);
			
	        it("Returns true when game phase is 2 and the penalty box has not already been crossed out", () => {
	        	model.gamePhase = 2;
	        	let penaltyBoxId = 1;
	        	
	        	expect(model.crossOutPenaltyBox(1)) === true;
	        	expect(model.penaltyBoxesCrossedOut[penaltyBoxId - 1]) === true;
	        	
	        })
	        
	        it("Returns false when game phase is not 2 and the penalty box has not already been crossed out", () => {
	        	model.gamePhase = 1;
	        	let penaltyBoxId = 1;
	        	
	        	expect(model.crossOutPenaltyBox(1)) === false;
	        	expect(model.penaltyBoxesCrossedOut[penaltyBoxId - 1]) === false;
	        });
	        
	        it("Returns false when game phase is not 2 and the penalty box has not already been crossed out", () => {
	        	model.gamePhase = 0;
	        	let penaltyBoxId = 1;
	        	
	        	expect(model.crossOutPenaltyBox(1)) === false;
	        	expect(model.penaltyBoxesCrossedOut[penaltyBoxId - 1]) === false;	
	        });
	        
	        it("Returns false when game phase is 2 and the penalty box has already been crossed out", () => {
	        	model.gamePhase = 2;
	        	let penaltyBoxId = 4;
	        	
	        	model.penaltyBoxesCrossedOut[penaltyBoxId - 1] = true;
	        	expect(model.crossOutPenaltyBox(4)) === false;
	        	expect(model.penaltyBoxesCrossedOut[penaltyBoxId - 1]) === true;	
	        });
	        
	        it("Increase amount of penalties by 1 and change game phase to 0 when game " +
	        		"phase is 2 and the penalty box has not already been crossed out", () => {
	        	model.gamePhase = 2;
	        	let amtOfPenalties = model.amtOfPenalties;
	        	
	        	model.crossOutPenaltyBox(4);
	        	expect(model.amtOfPenalties - amtOfPenalties) === 1;
	        	expect(model.gamePhase) === 0;	
	        });
	        
	        it("Don't increase amount of penalties by 1 and change game phase to 0 when game " +
	        		"phase is not 2 or the penalty box has already been crossed out", () => {
	        	model.gamePhase = 2;
	        	let penaltyBoxId = 3;
	        	let amtOfPenalties = model.amtOfPenalties;
	        	model.penaltyBoxesCrossedOut[penaltyBoxId - 1] = true;
	        	
	        	model.crossOutPenaltyBox(penaltyBoxId);
	        	expect(model.amtOfPenalties - amtOfPenalties) === 0;
	        	expect(model.gamePhase) === 2;	
	        });
	    });
	
	describe("crossOutLockBox", () => {
		
		let numRows = 4;
		let maxColumn = 12;
		let numWDice = maxColumn / 6;
		let model = new QwixxModel(numRows, maxColumn, numWDice);
		
	    it("Returns true when numBox left of lockBox is passed in", () => {
	    	let numBoxRow = 3;
	    	
	    	expect(model.crossOutLockBox(numBoxRow, 11)) === true;
	    	expect(model.numBoxesCrossedOut[numBoxRow - 1][model.maxColumn - 1]) === true;
	    })
	    
	    it("Returns false when numBox left of lockBox is passed in", () => {
	    	let numBoxRow = 3;
	    	
	    	expect(model.crossOutLockBox(numBoxRow, 10)) === false;
	    	expect(model.numBoxesCrossedOut[numBoxRow - 1][model.maxColumn - 1]) === false;  	
	    });
	    
	    it("Increases locked row count when lockBox is crossed out", () => {
	    	let numBoxRow = 3;
	    	let rowsLocked = model.rowsLocked;
	    	
	    	model.crossOutLockBox(numBoxRow, 11);
	    	expect(model.rowsLocked - rowsLocked) === 1; 	
	    });
	    
	    it("Does not increase locked row count when lockBox is not crossed out", () => {
	    	let numBoxRow = 3;
	    	let rowsLocked = model.rowsLocked;
	    	
	    	model.crossOutLockBox(numBoxRow, 10);
	    	expect(model.rowsLocked - rowsLocked) === 0; 	
	    });
	});
	
	describe("findTotals", () => {
		
		let numRows = 4;
		let maxColumn = 12;
		let numWDice = maxColumn / 6;
		let model = new QwixxModel(numRows, maxColumn, numWDice);    
        
        it("Calculates the correct total values", () => {
        	model.numBoxesCrossedOut[0][3] = true;
        	model.numBoxesCrossedOut[0][11] = true;
        	model.numBoxesCrossedOut[1][2] = true;
        	model.numBoxesCrossedOut[1][4] = true;
        	model.numBoxesCrossedOut[1][6] = true;
        	model.numBoxesCrossedOut[1][8] = true;
        	model.numBoxesCrossedOut[3][0] = true;
        	model.amtOfPenalties = 2;
        	
        	model.findTotals();
        	expect(model.colorRowTotals[0]).toBe(3);
        	expect(model.colorRowTotals[1]).toBe(10);
        	expect(model.colorRowTotals[2]).toBe(0);
        	expect(model.colorRowTotals[3]).toBe(1);
        	expect(model.penaltyTotals).toBe(10);
        	expect(model.finalTotal).toBe(4);   	
        });
    });
	

    describe(".rollDie", () => {
    	
    	let numRows = 4;
		let maxColumn = 12;
		let numWDice = maxColumn / 6;
		let model = new QwixxModel(numRows, maxColumn, numWDice);
		
        it("Returns a value between 1 and 6", () => {

            // No, this is not a great test.  In general, a lot of thought needs 
            // to go into testing functions that use random numbers.
            // This should serve primarily as an example of  how to set up tests.          
            let result = QwixxModel.rollDie();
            expect(result).toBeGreaterThanOrEqual(1);
            expect(result).toBeLessThanOrEqual(6);
        })
    }); // end describe .rollDie

    describe("#rollDice", () => {
    	
    	let numRows = 4;
		let maxColumn = 12;
		let numWDice = maxColumn / 6;
		let model = new QwixxModel(numRows, maxColumn, numWDice);

//        let model;
        beforeEach(() => {

            // Mock rollDie so it will return a precise 
            // sequence of integers.
            QwixxModel.rollDie = jest.fn()
                .mockImplementationOnce(() => 8)
                .mockImplementationOnce(() => 6)
                .mockImplementationOnce(() => 7)
                .mockImplementationOnce(() => 5)
                .mockImplementationOnce(() => 3)
                .mockImplementationOnce(() => 0);

//            model = new QwixxModel(4, 12);
        });

        it("sets all the dice", () => {
            // Verify that the values returned by rollDie end up 
            // in the wdice and dice arrays
            model.rollDice();
            expect(model.wdice).toEqual([8, 6]);
            expect(model.dice).toEqual([7, 5, 3, 0]);
        });
    });
});