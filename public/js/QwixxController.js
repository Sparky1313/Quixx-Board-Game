export default class QwixxController {
	
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.view.onRollButtonClicked(() => this.rollButtonClicked());
	    this.view.onNumBoxClicked((numBoxRow, numBoxCol, numBoxVal) => (
	    		this.numBoxClicked(numBoxRow, numBoxCol, numBoxVal)));
        this.view.onPenaltyBoxClicked((penaltyBoxId) => this.penaltyBoxClicked(penaltyBoxId));
        this.view.onPassPhase1Clicked(() => this.passPhase1Clicked());
    }
    
    // Asks model to check if game is over
    gameOverCheck() {
    	if (this.model.checkIfGameOver() === true) {
			this.view.gameEndedAlert();
			this.model.findTotals();
			this.view.writeTotals(this.model);
    	}
    }
    
    // Tells the model and view what to do when a numBox is clicked
    numBoxClicked(numBoxRow, numBoxCol, numBoxVal) {
    	if (this.model.crossOutNum(numBoxRow, numBoxCol, numBoxVal) === true) {
    		this.view.strikeNum(numBoxRow, numBoxCol);
    		
    		if (this.model.crossOutLockBox(numBoxRow, numBoxCol) === true) {
    			this.view.strikeLockBox(numBoxRow);
    			this.view.disappearDie(numBoxRow);
    		}
    		
    		this.view.changeButtons(this.model.gamePhase);
    		this.gameOverCheck();
    	}
    }
    
    // Tells the model and view what to do when the Pass On Phase 1 Button is clicked
    passPhase1Clicked() {
    	this.model.gamePhase = 2;
    	this.view.changeButtons(this.model.gamePhase);
    }
    
    // Tells the model and view what to do when a penalty box is clicked
    penaltyBoxClicked(penaltyBoxId) {
		if (this.model.crossOutPenaltyBox(penaltyBoxId) === true) {
			this.view.strikePenalty(penaltyBoxId);
			this.view.changeButtons(this.model.gamePhase);	
			this.gameOverCheck();
		}	
    }
    
    // Tells the model and view what to do when the Roll button is clicked
    rollButtonClicked() {
        this.model.rollDice();
        this.view.updateDice(this.model);
        this.view.changeButtons(this.model.gamePhase);
    }
}