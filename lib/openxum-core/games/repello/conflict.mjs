"use strict";

import Direction from './direction.mjs';

class Conflict {
    constructor(x,y,Direction) {
        this._x = x;                        // coordonées du stack
        this._y = y;
        this._direction = Direction;        // direction de la case de l'objet qui entre en conflit
    }


    get_x(){
        return this._x;
    }


    get_y(){
        return this._y;
    }


    get_direction(){
        return this._direction;
    }
}
export default Conflict;