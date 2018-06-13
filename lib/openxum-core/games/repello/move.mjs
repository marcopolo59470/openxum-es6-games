"use strict";

import Color from './color.mjs';
import Board from './board.mjs';

class Move {
    constructor(x,y, Direction) {
        this._x = x;                                              // position x avant mouvement
        this._y = y;                                              // position y avant mouvement
        this.direction= Direction;                                // direction du mouvement
    }
}

export default Move;