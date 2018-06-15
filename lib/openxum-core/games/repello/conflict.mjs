"use strict";


class Conflict {
    constructor(x,y,_x,_y) {
        this._x = x;                        // coordonnées du stack
        this._y = y;
        this._token_x = _x;                 // coordonnées du jeton
        this._token_y = _y;
    }


    get_x(){
        return this._x;
    }


    get_y(){
        return this._y;
    }


    get_token_x(){
        return this._token_x;
    }


    get_token_y(){
        return this._token_y;
    }
}
export default Conflict;