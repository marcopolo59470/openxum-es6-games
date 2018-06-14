"use strict";

import Color from './color.mjs';
import Board from './board.mjs';

class Move {
    constructor(x,y, Direction) {
        this._x = x;                                       // position x du mouvement
        this._y = y;                                       // position y du mouvement
        this._direction = Direction;                       // direction du mouvement
    }


    parse(str) {
        this._y = parseInt(str.charAt(0));
        this._x = parseInt(str.charAt(1));
        this._direction = new Direction(str.charAt(2));
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


    to_object() {
        return {x: this._x, y: this._y, direction: this._direction};
    }


    to_string() {
        return 'move piece ' + this._x.to_string() + this._y.to_string() + ' to ' + this._direction;
    }

}

export default Move;