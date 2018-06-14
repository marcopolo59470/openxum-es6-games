"use strict";

import Direction from './direction.mjs';

class Conflict {
    constructor(x,y,Direction) {
        this._x = x;                        // coordonées du stack
        this._y = y;
        this._direction = Direction;        // direction de la case de l'objet qui entre en conflit
    }
}

export default Conflict;