"use strict";

import OpenXum from '../../openxum/manager.mjs';
import Repello from '../../../openxum-core/games/repello/index.mjs';

class Manager extends OpenXum.Manager {
  constructor(e, g, o, s) {
    super(e, g, o, s);
    this.that(this);
  }

  build_move() {
    return new Repello.Move();
  }

  get_current_color() {
    return this.engine().current_color() === Repello.Color.PLAYER_1 ? -1 : -2;
  }

  static get_name() {
    return 'repello';
  }

  get_winner_color() {
    if(this._engine.winner_is() !==-3)
      return this._engine.winner_is() === Repello.Color.PLAYER_1 ? 'RED' : 'BLUE';
    return 'Eric Ramat';
  }

  process_move() { }
}

export default {
  Manager: Manager
};