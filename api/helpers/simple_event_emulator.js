'use strict';

var moment = require('moment');

function emulate(player, targetPoint, loveca, event, livePoint, liveLp) {
    const currentTime = moment();
    const liveTime = moment.duration(3, 'm');
    const lpTime = moment.duration(6, 'm');
    var reminingTime = moment.duration(event.end - currentTime);

    var live = 0;

    while (player.point < targetPoint) {
        // wait for LP recover
        if (player.lp < liveLp) {
            if (loveca > 0) {
                loveca -= 1;
                player.lp += player.getMaxLp();
            } else {
                var lpDiff = liveLp - player.lp;
                reminingTime -= lpDiff * lpTime;
                player.lp += lpDiff;
            }
        }

        // break if not enough time to live
        if (reminingTime < liveTime) {
            break;
        }

        // perform a live
        reminingTime -= liveTime;
        player.point += livePoint;
        player.lp -= liveLp;
        live += 1;
    }

    return {
        player: player,
        event: event,
        loveca: loveca,
        live: live
    };
}

module.exports = {
    emulate
};
