import QwixxController from '../public/js/QwixxController.js'

describe("QwixxController", () => {

    let model;
    let view;
    let controller;

    // Set up the test object and the mocks
    beforeEach(() => {
        model = {
        	checkIfGameOver: jest.fn(),
        	crossOutLockBox: jest.fn(),
        	crossOutNum: jest.fn(),
        	crossOutPenaltyBox: jest.fn(),
        	findTotals: jest.fn(),
        	gamePhase: undefined,
            rollDice: jest.fn()
        };

        view = {
    		changeButtons: jest.fn(),
    		disappearDie: jest.fn(),
        	gameEndedAlert: jest.fn(),
        	onRollButtonClicked: jest.fn(),
            onNumBoxClicked: jest.fn(),
            onPenaltyBoxClicked: jest.fn(),
            onPassPhase1Clicked: jest.fn(),
            updateDice: jest.fn(),
            strikeLockBox: jest.fn(),
            strikeNum: jest.fn(),
            strikePenalty: jest.fn(),
            writeTotals: jest.fn()
        };

        controller = new QwixxController(model, view);
    });
    
    describe("#gameOverCheck", () => {
    	
    	console.log(model);
    	
        it("Tells the tells the model to check if the game is over with true value", () => {
        	model.checkIfGameOver.mockReturnValueOnce(true);
        	controller.gameOverCheck();
            expect(model.checkIfGameOver).toHaveBeenCalledTimes(1);
            expect(view.gameEndedAlert).toHaveBeenCalledTimes(1);
            expect(model.findTotals).toHaveBeenCalledTimes(1);
            expect(view.writeTotals).toHaveBeenCalledTimes(1);
            expect(view.writeTotals).toHaveBeenCalledWith(model);
        });
        
        it("Tells the tells the model to check if the game is over with false value", () => {
        	model.checkIfGameOver.mockReturnValueOnce(false);
        	
        	controller.gameOverCheck();
            expect(model.checkIfGameOver).toHaveBeenCalledTimes(1);
            expect(view.gameEndedAlert).toHaveBeenCalledTimes(0);
            expect(model.findTotals).toHaveBeenCalledTimes(0);
            expect(view.writeTotals).toHaveBeenCalledTimes(0);
        });
    });
    
    describe("#numBoxClicked", () => {
        it("Tells the view to strike the numBox when the model says the number was crossed out.", () => {
        	model.crossOutNum.mockReturnValueOnce(true);
        	
        	controller.numBoxClicked(2, 3, 8);
        	expect(model.crossOutNum).toHaveBeenCalledTimes(1);
        	expect(model.crossOutNum).toHaveBeenCalledWith(2, 3, 8);
        	expect(view.strikeNum).toHaveBeenCalledTimes(1);
        	expect(view.strikeNum).toHaveBeenCalledWith(2, 3);
        });
        
        it("Tells the view to strike the lockBox when the model says the lockBox was crossed out " +
        		"and to make the corresponding die disappear.", () => {
        	model.crossOutNum.mockReturnValueOnce(true);
        	model.crossOutLockBox.mockReturnValueOnce(true);
        	
        	controller.numBoxClicked(4, 6, 11);
        	expect(model.crossOutLockBox).toHaveBeenCalledTimes(1);
        	expect(model.crossOutLockBox).toHaveBeenCalledWith(4, 6);
        	expect(view.strikeLockBox).toHaveBeenCalledTimes(1);
        	expect(view.strikeLockBox).toHaveBeenCalledWith(4);
        	expect(view.disappearDie).toHaveBeenCalledTimes(1);
        	expect(view.disappearDie).toHaveBeenCalledWith(4);
        });
        
        it("Tells the view to do nothing to the lockBox when the model says the lockBox was not crossed out " +
        		"and to do nothing to the corresponding die.", () => {
        	model.crossOutNum.mockReturnValueOnce(true);
        	model.crossOutLockBox.mockReturnValueOnce(false);
        	
        	controller.numBoxClicked(8, 9, 12);
        	expect(model.crossOutLockBox).toHaveBeenCalledTimes(1);
        	expect(model.crossOutLockBox).toHaveBeenCalledWith(8, 9);
        	expect(view.strikeLockBox).toHaveBeenCalledTimes(0);
        	expect(view.disappearDie).toHaveBeenCalledTimes(0);
        });
        
        it("Tells the view to change buttons according the model.gamePhase value " +
        		"and tells the controller to do a game over check.", () => {
        	model.crossOutNum.mockReturnValueOnce(true);
        	model.crossOutLockBox.mockReturnValueOnce(false);
        	controller.gameOverCheck = jest.fn();
        	model.gamePhase = 2;
        	
        	controller.numBoxClicked(1, 2, 3);
        	expect(view.changeButtons).toHaveBeenCalledTimes(1);
        	expect(view.changeButtons).toHaveBeenCalledWith(model.gamePhase);
        	expect(controller.gameOverCheck).toHaveBeenCalledTimes(1);
        });
        
        it("Tells the view to do nothing when the the model says the number was not crossed out.", () => {
        	model.crossOutNum.mockReturnValueOnce(false);
        	controller.gameOverCheck = jest.fn();
        	
        	controller.numBoxClicked(5, 6, 3);
        	expect(model.crossOutNum).toHaveBeenCalledTimes(1);
        	expect(view.strikeNum).toHaveBeenCalledTimes(0);
        	expect(model.crossOutLockBox).toHaveBeenCalledTimes(0);
        	expect(view.strikeLockBox).toHaveBeenCalledTimes(0);
        	expect(view.disappearDie).toHaveBeenCalledTimes(0);
        	expect(view.changeButtons).toHaveBeenCalledTimes(0);
        	expect(view.changeButtons).toHaveBeenCalledTimes(0);
        	expect(controller.gameOverCheck).toHaveBeenCalledTimes(0);
        });
    });
    
    describe("#passPhase1Clicked", () => {
        it("Sets the model's game phase to 2 and tells the view to change the " +
        		" buttons accordingly when the passPhase1 button was pressed", () => {
            controller.passPhase1Clicked();
            expect(model.gamePhase).toBe(2);
            
        });
        it("Tells the view to update", () => {
        	controller.passPhase1Clicked();
        	expect(view.changeButtons).toHaveBeenCalledTimes(1);
            expect(view.changeButtons).toHaveBeenCalledWith(model.gamePhase);
        });
    });

    describe("#rollButtonClicked", () => {
        it("Tells the model to roll the dice", () => {
            controller.rollButtonClicked();
            expect(model.rollDice).toHaveBeenCalledTimes(1);
        });
        it("Tells the view to update the dice", () => {
            controller.rollButtonClicked();
            expect(view.updateDice).toHaveBeenCalledTimes(1);
            expect(view.updateDice).toHaveBeenCalledWith(model);
        });
        it("Tells the view to change buttons depending on game phase", () => {
        	model.gamePhase = 1;
            controller.rollButtonClicked();
            expect(view.changeButtons).toHaveBeenCalledTimes(1);
            expect(view.changeButtons).toHaveBeenCalledWith(model.gamePhase);
        });
    });
});