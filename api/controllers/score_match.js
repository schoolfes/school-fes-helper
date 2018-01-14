'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
var util = require('util');
var playerFactory = require('../helpers/player_factory');
var eventHelper = require('../helpers/event_helper');
var eventEmulator = require('../helpers/simple_event_emulator');

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
module.exports = {
    score_match: calculate
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function calculate(req, res) {
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    var currentRank = req.swagger.params.current_rank.value;
    var currentExp = req.swagger.params.current_exp.value;
    var currentLp = req.swagger.params.current_lp.value;
    var currentPoint = req.swagger.params.current_point.value;
    var targetPoint = req.swagger.params.target_point.value;

    var expectedDifficulty = req.swagger.params.expected_difficulty.value;
    var expectedScore = req.swagger.params.expected_score.value;
    var expectedOrder = req.swagger.params.expected_order.value;

    var player = playerFactory.createPlayer(currentRank, currentExp, currentLp, currentPoint);

    eventHelper.getLatestEvent().then(
        function (event) {
            var result = eventEmulator.emulate(player, targetPoint, 0, event, livePoint(expectedDifficulty, expectedScore, expectedOrder), liveLp(expectedDifficulty));

            console.log(result);
            res.json(result);
        }
    );
}

function basePoint(difficulty) {
    const basePoint = [42, 100, 177, 357, 375];
    return basePoint[difficulty];
}

function rankBonus(rank) {
    const rankBonus = [1, 1.05, 1.1, 1.15, 1.2];
    return rankBonus[rank];
}

function orderBonus(order) {
    const scoreBonus = [1.1125, 1.25, 1.15, 1.05, 1, 1.2];
    return scoreBonus[order];
}

function livePoint(difficulty, rank, order) {
    return Math.round(basePoint(difficulty) * rankBonus(rank) * orderBonus(order));
}

function liveLp(difficulty) {
    const lp = [5, 10, 15, 25, 25];
    return lp[difficulty];
}

function liveExp(difficulty) {
    const exp = [12, 26, 46, 83];
    return exp[difficulty];
}
