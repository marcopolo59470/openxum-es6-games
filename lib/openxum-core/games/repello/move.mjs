"use strict";


import Direction from './direction.mjs';

class Move {
  constructor(x, y, Direction) {
    this._x = x;
    this._y = y;
    this._direction = Direction;
  }


  parse(str) {
    this._direction = parseInt(str.charAt(0));
  }


  to_object() {
    return {Direction: this._direction};
  }


  get_direction(){
    return this._direction;
  }
  
  
  get() {
    return (this._x + this._y + this._direction );
  }
  
  
  get_x(){
    return this._x;
  }
  
  
  get_y(){
    return this._y;
  }


  get_direction_to_string() {
    switch(this._direction){
      case 0:
        return 'NORTH';
      case 1:
        return 'NORTH_EAST';
      case 2:
        return 'EAST';
      case 3:
        return 'SOUTH_EAST';
      case 4:
        return 'SOUTH';
      case 5:
        return 'SOUTH_WEST';
      case 6:
        return 'WEST';
      case 7:
        return 'NORTH_WEST';
    }
  }


  to_string() {
    return 'move piece to ' + this.get_direction_to_string();
  }
}

export default Move;