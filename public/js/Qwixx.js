import QwixxModel from './QwixxModel.js'
import QwixxView from './QwixxView.js'
import QwixxController from './QwixxController.js'

// Bonus is that the board is dynamic by changing number of rows and columns in ejs
// Game rules are modified depending on board size such as number of white dice and
// amount of numBoxes that need to be crossed out in order to lock the row

let view = new QwixxView();
let numRows = view.numRows;
let numCols = view.numCols;
let numWDice = view.numWDice;
let model = new QwixxModel(numRows, numCols, numWDice);
new QwixxController(model, view);