'use strict';

var sifCalculator = require('sif-calculator');

var Player = function (rank, exp, lp, point) {
    this.rank = rank;
    this.exp = exp;
    this.lp = lp;
    this.point = point;
};

Player.prototype.getMaxLp = function () {
    return sifCalculator.getLpByRank(this.rank);
};

Player.prototype.getRankUpExp = function () {
    return sifCalculator.getExpByRank(this.rank);
};

function createPlayer(rank, exp, lp, point, token) {
    return new Player(rank, exp, lp, point, token);
}

module.exports = {
    createPlayer
};
