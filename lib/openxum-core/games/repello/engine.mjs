"use strict";

import Board from './board.mjs';
import Color from './color.mjs';
import GameType from './game_type.mjs';
import Move from './move.mjs';
import Direction from './direction.mjs';
import TokenType from './token.mjs';
import OpenXum from '../../openxum/engine.mjs';


class Engine extends OpenXum.Engine {
  constructor(GameType, Color) {
    super();
    this._type = GameType;                                      // type de jeu (nombre de joueurs)
    this._color = Color;                                        // numéro du joueur
    this._stack_pill_1 = this.init_stack_pill(this._type);      // nombre de jetons dans le stack du joueur 1(depend du nombre de joueurs)
    this._stack_pill_2 = this.init_stack_pill(this._type);      // nombre de jetons dans le stack du joueur 2(depend du nombre de joueurs)
    this._stack_1_position = [-1, -1];                          // position du stack du joueur 1 [x, y]
    this._stack_2_position = [-1, -1];                          // position du stack du joueur 2 [x, y]
    this._token_board = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],                  // initialise le plateau servant à savoir la position des jetons et leur type
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 3, 0, 0, 0, 0, 5, 0, 0, 0, 0, 3, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    this._token_lose = false;                                   // sert à savoir si le joueur a déjà laché le jeton de son stack ce tour ci
    this._token_won = [];                                       // sert à stocker les jetons gagnés par le joueur
    this._possible_move = [];                                   // list des mouvements possibles
    this._is_finish = false;                                    // sert a savoir si la partie est finie
  }
  
  
  init_stack_pill() {                                            // initialise le stack du joueur et le nombre de tours
    if(this._type === 0) {
      return 15;                                                // 15 si 2 joueurs
    }
  }
  
  
  reset_stack_position(x, y) {
    if(this._color === -1) {                                     // joueur 1
      this._stack_1_position = [-1, -1];
      this._token_board[x][y] = 0;
    }
    else {                                                       // joueur 2
      this._stack_2_position = [-1, -1];
      this._token_board[x][y] = 0;
    }
  }
  
  
  clone() {
    let o = new Engine(this._type, this._color);
    o.set(this._stack_pill_1, this._stack_pill_2, this._stack_1_position, this._stack_2_position, this._token_board, this._token_lose, this._token_won, this._possible_move, this._is_finish);
    return o;
  }
  
  
  //get_phase() {
  // return this._phase;
  //}
  
  
  get_name() {                                                  // connaitre le nom du jeu
    return 'Repello';
  }
  
  
  get_token_won() {                                              // connaitre les jetons que le joueur a gagné
    let player_token = [];
    for(let i = 1; i < this._token_won.length; i++) {
      if(this._color === this._token_won[i]) {
        player_token.push(this._token_won[i-1]);
        player_token.push(this._token_won[i]);
      }
    }
    return player_token;
  }
  
  
  current_color() {
    return this._color;
  }
  
  
  change_color() {
    this._color = (this._color === -1) ? -2 : -1;
  }
  
  
  get_stack_position() {                                         // connaitre la position du stack
    if(this._color === -1) {                                     // joueur 1
      return this._stack_1_position;
    }
    else {                                                       // joueur 2
      return this._stack_2_position;
    }
  }
  
  
  get_board_object(x, y) {                                     // récupere l'element à la place x,y
    return this._token_board[x][y];
  }
  
  
  get_stack_pill_1() {
    return this._stack_pill_1;
  }
  
  
  get_stack_pill_2() {
    return this._stack_pill_2;
  }
  
  
  set_stack_position(x, y) {                                      // placer le stack du joueur
    if(this._color === -1) {                                     // joueur 1
      this._stack_1_position = [x, y];
      this._token_board[x][y] = this._color;
    }
    else {                                                       // joueur 2
      this._stack_2_position = [x, y];
      this._token_board[x][y] = this._color;
    }
  }
  
  
  set_token_position(x, y, TokenType) {                            // placer un jeton dans la grille
    this._token_board[x][y] = TokenType;
  }
  
  
  set_token_won(TokenType) {                                     // place le jeton dans la pile de jetons gagnés
    this._token_won.push(TokenType);
    this._token_won.push(this._color);
  }
  
  
  remove_token_won(i) {                                          // enlève un jeton au joueur (cas ou son stack est hors jeu)
    if(this._color === -1) {                                     // si joueur 1 éjecté
      this._token_won.splice(i, 1, -2);
      this._stack_pill_1--;
    }
    else {                                                       // si joueur 2 éjecté
      this._token_won.splice(i, 1, -1);
      this._stack_pill_2--;
    }
  }
  
  
  remove_stack_pill() {
    if(this._color === -1)
      this._stack_pill_1--;
    else
      this._stack_pill_2--;
  }
  
  
  is_there_token(x, y) {                                          // vérifie la présence d'un jeton
    if(x < 13 && x > -1 && y < 13 && y > -1) {
      return this._token_board[x][y] !== 0;
    }
    return false;
  }
  
  
  check_conflict(x, y) {                                                 // vérifie la présence d'une zone de conflit
    if(this.is_there_token(x-1, y) && this.is_there_token(x, y))     // jeton au nord?
      return true;
    if(this.is_there_token(x-1, y+1) && this.is_there_token(x, y))   // jeton au nord-est?
      return true;
    if(this.is_there_token(x, y+1) && this.is_there_token(x, y))     // jeton à l'est?
      return true;
    if(this.is_there_token(x+1, y+1) && this.is_there_token(x, y))   // jeton au sud-est?
      return true;
    if(this.is_there_token(x+1, y) && this.is_there_token(x, y))     // jeton au sud?
      return true;
    if(this.is_there_token(x+1, y-1) && this.is_there_token(x, y))   // jeton au sud-ouest?
      return true;
    if(this.is_there_token(x, y-1) && this.is_there_token(x, y))     // jeton à l'ouest?
      return true;
    if(this.is_there_token(x-1, y-1) && this.is_there_token(x, y))   // jeton au nord-ouest?
      return true;
    return false;
  }
  
  
  check_move_north(x, y, move_range) {
    if(move_range <= (x*2)-1) {                                        // si le mouvement est faisable sur le bord nord sans qu'il repasse par son x de depart (= mouvement impossible sinon)
      let j = x-1;
      while(j >= 0 && move_range > 0 && !this.is_there_token(j, y)) {        // tant qu'on trouve pas d'objet on avance vers le nord
        j--;
        move_range--;
      }
      if(move_range === 0 || j === -1)                                       // si on a été jusqu'au bout (= sans rencontrer d'obstacle)
        return true;
    }
    return false;
  }
  
  
  check_move_north_east(x, y, move_range) {
    let k = y+1;
    let j = x-1;
    let cpt = move_range;
    while(j >= 0 && k <= 12 && cpt > 0 && !this.is_there_token(j, k)) {   // tant qu'on trouve pas d'objet on avance vers le nord-est
      j--;
      k++;
      cpt--;
    }
    if(cpt === 0)                                                          // si on a fini les déplacements sans taper un bord
      return true;                                                          // alors on stock le mouvement possible
    else {
      if(j === -1 && k !== 13) {                                               // si on tape le bord nord
        j++;
        k--;
        cpt++;
        if(this.check_move_south_east(j, k, cpt))
          return true;                                                      // alors on stock le mouvement possible
      }
      else {
        if(k === 13 && j !== -1) {                                         // si on tape le bord est
          j++;
          k--;
          cpt++;
          if(this.check_move_north_west(j, k, cpt))
            return true;                                                    // alors on stock le mouvement possible
        }
        else                                                                // si on tape le coin nord-est
        if(j === -1 && k === 13)
          if(move_range <= (x*2)-1 && move_range <= ((12-y)*2)-1)           // si le jeton ne repasse pas par son point d'origine
            return true;                                                    // alors on stock le mouvement possible
      }
    }
    return false;
  }
  
  
  check_move_east(x, y, move_range) {
    if(move_range <= ((12-y)*2)-1) {                                        // si le mouvement est faisable sur le bord nord sans qu'il repasse par son x de depart (= mouvement impossible sinon)
      let k = y+1;
      while(k <= 12 && move_range > 0 && !this.is_there_token(x, k)) {      // tant qu'on trouve pas d'objet on avance
        k++;
        move_range--;
      }
      if(move_range === 0 || k === 13)                                      // si on a été jusqu'au bout (= on a pas rencontré d'obstacle)
        return true;                                                        // alors on stock le mouvement possible
    }
    return false;
  }
  
  
  check_move_south_east(x, y, move_range) {
    let j = x+1;
    let k = y+1;
    let cpt = move_range;
    while(j <= 12 && k <= 12 && cpt > 0 && !this.is_there_token(j, k)) {   // tant qu'on trouve pas d'objet on avance vers le sud-est
      j++;
      k++;
      cpt--;
    }
    if(cpt === 0)                                                          // si on a fini les déplacements sans taper un bord
      return true;                                                          // alors on stock le mouvement possible
    else {
      if(j === 13 && k !== 13) {                                           // si on tape le bord sud
        j--;
        k--;
        cpt++;
        if(this.check_move_north_east(j, k, cpt))
          return true;                                                      // alors on stock le mouvement possible
      }
      else {
        if(j !== 13 && k === 13) {                                              // si on tape le bord est
          j--;
          k--;
          cpt++;
          if(this.check_move_south_west(j, k, cpt))
            return true;                                                    // alors on stock le mouvement possible
        }
        else                                                                // si on tape le coin sud-est
        if(j === 13 && k === 13)
          if(move_range <= ((12-x)*2)-1 && move_range <= ((12-y)*2)-1)      // si le jeton ne repasse pas par son point d'origine
            return true;                                                    // alors on stock le mouvement possible
      }
    }
    return false;
  }
  
  
  check_move_south(x, y, move_range) {
    if(move_range <= ((12-x)*2)-1) {                                     // si le mouvement est faisable sur le bord nord sans qu'il repasse par son x de depart (= mouvement impossible sinon)
      let j = x+1;
      while(j <= 12 && move_range > 0 && !this.is_there_token(j, y)) {              // tant qu'on trouve pas d'objet on avance
        j++;
        move_range--;
      }
      if(move_range === 0 || j === 13)                                       // si on a été jusqu'au bout (= on a pas rencontré d'obstacle)
        return true;                                                        // alors on stock le mouvement possible
    }
    return false;
  }
  
  
  check_move_south_west(x, y, move_range) {
    let j = x+1;
    let k = y-1;
    let cpt = move_range;
    while(k >= 0 && j <= 12 && cpt > 0 && !this.is_there_token(j, k)) {    // tant qu'on trouve pas d'objet on avance vers le sud-ouest
      k--;
      j++;
      cpt--;
    }
    if(cpt === 0)                                                          // si on a fini les déplacements sans taper un bord
      return true;                                                          // alors on stock le mouvement possible
    else {
      if(k === -1 && j !== 13) {                                           // si on tape le bord ouest
        k++;
        j--;
        cpt++;
        if(this.check_move_south_east(j, k, cpt))
          return true;                                                      // alors on stock le mouvement possible
      }
      else {
        if(j === 13 && k !== -1) {                                          // si on tape le bord sud
          k++;
          j--;
          cpt++;
          if(this.check_move_north_west(j, k, cpt))
            return true;                                                    // alors on stock le mouvement possible
        }
        else                                                                // si on tape le coin sud-ouest
        if(j === 13 && k === -1)
          if(move_range <= (12-x)*2-1 && move_range <= (y*2)-1)             // si le jeton ne repasse pas par son point d'origine
            return true                                                     // alors on stock le mouvement possible
      }
    }
    return false;
  }
  
  
  check_move_west(x, y, move_range) {
    if(move_range <= (y*2)-1) {                                          // si le mouvement est faisable sur le bord nord sans qu'il repasse par son x de depart (= mouvement impossible sinon)
      let k = y-1;
      while(k >= 0 && move_range > 0 && !this.is_there_token(x, k)) {       // tant qu'on trouve pas d'objet on avance
        k--;
        move_range--;
      }
      if(move_range === 0 || k === -1)                                      // si on a été jusqu'au bout (= on a pas rencontré d'obstacle)
        return true;                                                        // alors on stock le mouvement possible
    }
    return false;
  }
  
  
  check_move_north_west(x, y, move_range) {
    let j = x-1;
    let k = y-1;
    let cpt = move_range;
    while(j >= 0 && k >= 0 && cpt > 0 && !this.is_there_token(j, k)) {     // tant qu'on trouve pas d'objet on avance vers le nord-ouest
      j--;
      k--;
      cpt--;
    }
    if(cpt === 0)                                                          // si on a fini les déplacements sans taper un bord
      return true;                                                          // alors on stock le mouvement possible
    else {
      if(j === -1 && k !== -1) {                                           // si on tape le bord nord
        j++;
        k++;
        cpt++;
        if(this.check_move_south_west(j, k, cpt))
          return true;                                                      // alors on stock le mouvement possible
      }
      else {
        if(k === -1 && j !== -1) {                                         // si on tape le bord ouest
          j++;
          k++;
          cpt++;
          if(this.check_move_north_east(j, k, cpt))
            return true;                                                    // alors on stock le mouvement possible
        }
        else                                                                // si on tape le coin nord-ouest
        if(j === -1 && k === -1)
          if(move_range <= (x*2)-1 && move_range <= (y*2)-1)                // si le jeton ne repasse pas par son point d'origine
            return true;                                                    // alors on stock le mouvement possible}
      }
    }
    return false;
  }
  
  
  get_possible_move_list(x, y) {
    let possible_move = [];                                     // liste qui stock les mouvements jouables
    let move_range;
    if(x > 0) {                                                 // si le stack n'est pas collé au bord nord
      move_range = Board[x-1][y];                               // stock le nombre de deplacement à faire au nord
      if(this.check_move_north(x, y, move_range))               // on check si on peut faire le mouvement
        possible_move.push(new Move(x, y, 0));                  // alors on stock le mouvement possible au nord
    }
    if(x > 0 && y < 12) {                                       // si le stack n'est pas sur le bord nord ou est
      move_range = Board[x-1][y+1];                             // nord-est
      if(this.check_move_north_east(x, y, move_range))
        possible_move.push(new Move(x, y, 1));
    }
    if(y < 12) {                                                // si le stack n'est pas collé au bord est
      move_range = Board[x][y+1];                               // est
      if(this.check_move_east(x, y, move_range))
        possible_move.push(new Move(x, y, 2));
    }
    if(x < 12 && y < 12) {                                      // si le stack n'est pas sur le bord sud ou est
      move_range = Board[x+1][y+1];                             // sud-est
      if(this.check_move_south_east(x, y, move_range))
        possible_move.push(new Move(x, y, 3));
    }
    if(x < 12) {                                                // si le stack n'est pas collé au bord sud
      move_range = Board[x+1][y];                               // sud
      if(this.check_move_south(x, y, move_range))
        possible_move.push(new Move(x, y, 4));
    }
    if(y > 0 && x < 12) {                                       // si le stack n'est pas sur le bord sud ou ouest
      move_range = Board[x+1][y-1];                             // sud-ouest
      if(this.check_move_south_west(x, y, move_range))
        possible_move.push(new Move(x, y, 5));
    }
    if(y > 0) {                                                 // si le stack n'est pas collé au bord ouest
      move_range = Board[x][y-1];                               // ouest
      if(this.check_move_west(x, y, move_range))
        possible_move.push(new Move(x, y, 6));
    }
    if(x > 0 && y > 0) {                                        // si le stack n'est pas sur le bord nord ou ouest
      move_range = Board[x-1][y-1];                             // nord-ouest
      if(this.check_move_north_west(x, y, move_range))
        possible_move.push(new Move(x, y, 7));
    }
    return possible_move;
  }
  
  
  apply_moves(moves) {
    for(let i = 0; i < moves.length; ++i) {
      this.move(new Move(moves[i].get_x(), moves[i].get_y(), moves[i].get_direction()));
    }
  }
  
  
  check_conflict_extended() {                             // verifie si il reste des conflits sur le plateau
    for(let x = 0; x < 13; x++) {
      for(let y = 0; y < 13; y++) {
        if(this.check_conflict(x, y)) {
          return true;
        }
      }
    }
    return false;
  }
  
  
  move_north(x, y) {
    this._token_board[Math.abs(x-(Board[x-1][y]))][y] = this._color;
    this.set_stack_position(Math.abs(x-(Board[x-1][y])), y);
  }
  
  
  move_north_east(x, y) {
    if(Board[x-1][y+1]+y > 12) {
      this._token_board[Math.abs(x-(Board[x-1][y+1]))][12-((y+Board[x-1][y+1])%12)] = this._color;
      this.set_stack_position(Math.abs(x-(Board[x-1][y+1])), 12-((y+Board[x-1][y+1])%12));
    }
    else {
      this._token_board[Math.abs(x-(Board[x-1][y+1]))][y+Board[x-1][y+1]] = this._color;
      this.set_stack_position(Math.abs(x-Board[x-1][y+1]), Board[x-1][y+1]+y);
    }
  }
  
  
  move_east(x, y) {
    if(y+Board[x][y+1] > 12) {
      this._token_board[x][12-((y+Board[x][y+1])%12)] = this._color;
      this.set_stack_position(x, 12-((y+Board[x][y+1])%12));
    }
    else {
      this._token_board[x][y+Board[x][y+1]] = this._color;
      this.set_stack_position(x, y+Board[x][y+1]);
    }
  }
  
  
  move_south_east(x, y) {
    if(Board[x+1][y+1]+x > 12) {
      if(Board[x+1][y+1]+y > 12) {
        this._token_board[12-((x+Board[x+1][y+1])%12)][12-((y+Board[x+1][y+1])%12)] = this._color;
        this.set_stack_position(12-((Board[x+1][y+1]+x)%12), 12-((Board[x+1][y+1]+y)%12));
      }
      else {
        this._token_board[12-((Board[x+1][y+1]+x)%12)][Board[x+1][y+1]+y] = this._color;
        this.set_stack_position(12-((Board[x+1][y+1]+x)%12), Board[x+1][y+1]+y);
      }
    }
    else {
      if(Board[x+1][y+1]+y > 12) {
        this._token_board[Board[x+1][y+1]+x][12-((y+Board[x+1][y+1])%12)] = this._color;
        this.set_stack_position(Board[x+1][y+1]+x, 12-((y+Board[x+1][y+1])%12));
      }
      else {
        this._token_board[Board[x+1][y+1]+x][Board[x+1][y+1]+y] = this._color;
        this.set_stack_position(Board[x+1][y+1]+x, Board[x+1][y+1]+y);
      }
    }
  }
  
  
  move_south(x, y) {
    if(x+Board[x+1][y] > 12) {
      this._token_board[12-((Board[x+1][y]+x)%12)][y] = this._color;
      this.set_stack_position(12-((Board[x+1][y]+x)%12), y);
    }
    else {
      this._token_board[Board[x+1][y]+x][y] = this._color;
      this.set_stack_position(Board[x+1][y]+x, y);
    }
  }
  
  
  move_south_west(x, y) {
    if(x+Board[x+1][y-1] > 12) {
      this._token_board[12-((Board[x+1][y-1]+x)%12)][Math.abs(y-(Board[x+1][y-1]))] = this._color;
      this.set_stack_position(12-((Board[x+1][y-1]+x)%12), Math.abs(y-(Board[x+1][y-1])));
    }
    else {
      this._token_board[(Board[x+1][y-1])+x][Math.abs(y-(Board[x+1][y-1]))] = this._color;
      this.set_stack_position(Board[x+1][y-1]+x, Math.abs(y-(Board[x+1][y-1])));
    }
  }
  
  
  move_west(x, y) {
    this._token_board[x][Math.abs((Board[x][y-1]-y))] = this._color;
    this.set_stack_position(x, Math.abs((Board[x][y-1]-y)));
  }
  
  
  move_north_west(x, y) {
    this._token_board[Math.abs(Board[x-1][y-1]-x)][Math.abs(Board[x-1][y-1]-y)] = this._color;
    this.set_stack_position(Math.abs(Board[x-1][y-1]-x), Math.abs(Board[x-1][y-1]-y));
  }
  
  
  play_move(x, y, direction) {
    switch(direction) {
      case 0:                                                                 // si deplacement au nord
        this.move_north(x, y);
        break;
      case 1:                                                                 // si deplacement au nord-est
        this.move_north_east(x, y);
        break;
      case 2:                                                                 // si deplacement à l'est
        this.move_east(x, y);
        break;
      case 3:                                                                 // si deplacement au sud-est
        this.move_south_east(x, y);
        break;
      case 4:                                                                 // si deplacement au sud
        this.move_south(x, y);
        break;
      case 5:                                                                 // si deplacement au sud-ouest
        this.move_south_west(x, y);
        break;
      case 6:                                                                 // si deplacement à l'ouest
        this.move_west(x, y);
        break;
      case 7:                                                                 //si deplacement au nord-ouest
        this.move_north_west(x, y);
        break;
    }
  }
  
  
  token_conflict(x, y) {                                                      // gère si l'objet sort du plateau
    if(this.get_board_object(x, y) > 0) {                                     // si l'objet pas un stack
      this.set_token_won(this.get_board_object(x, y));
      this.set_token_position(x, y, 0);
    }
    else {                                                                    // si l'objet est un stack
      this.change_color();
      let max_token = 0;
      let token_position = 1;
      let token_list = this.get_token_won();
      if(token_list.length > 0) {                                             // si l'adversaire à déjà gagné un jeton
        for(let i = 0; i < token_list.length; i++) {
          if(token_list[i] > max_token) {
            max_token = token_list[i];
            token_position = i+1;
          }
        }
        this.remove_token_won(token_position);                                // on enleve le jeton pris à l'adversaire
        this.set_token_position(x, y, 0);
        this.reset_stack_position(x, y);
        this.change_color();
        this.set_token_won(1);
      }
      else {
        this.set_token_position(x, y, 0);
        this.reset_stack_position(x, y);
        this.change_color();
        this.set_token_won(1);
      }
    }
    
    
  }
  
  
  stack_conflict(x, y) {                                                      // gestion vague des conflits
    let where = [];                                                           // on stock la position des jetons voisins
    if(this.is_there_token(x-1, y))
      where.push(0);
    if(this.is_there_token(x-1, y+1))
      where.push(1);
    if(this.is_there_token(x, y+1))
      where.push(2);
    if(this.is_there_token(x+1, y+1))
      where.push(3);
    if(this.is_there_token(x+1, y))
      where.push(4);
    if(this.is_there_token(x+1, y-1))
      where.push(5);
    if(this.is_there_token(x, y-1))
      where.push(6);
    if(this.is_there_token(x-1, y-1))
      where.push(7);
    if(where.length === 1) {
      switch(where[0]) {
        case 0:                                                               // pousser vers le sud
          if(!this.is_there_token(x+1, y) && x+1 < 13) {                      // si il n'y a pas d'objet qui bloque
            this.set_token_position(x, y, 0);
            this.set_token_position(x+1, y, this._color);
            this.set_stack_position(x+1, y);
          }
          break;
        case 1:                                                               // pousser vers le sud-ouest
          if(!this.is_there_token(x+1, y-1) && x+1 < 13 && y-1 > -1) {        // si il n'y a pas d'objet qui bloque
            this.set_token_position(x, y, 0);
            this.set_token_position(x+1, y-1, this._color);
            this.set_stack_position(x+1, y-1);
          }
          break;
        case 2:                                                               // pousser vers l'ouest
          if(!this.is_there_token(x, y-1) && y-1 > -1) {                      // si il n'y a pas d'objet qui bloque
            this.set_token_position(x, y, 0);
            this.set_token_position(x, y-1, this._color);
            this.set_stack_position(x, y-1);
          }
          break;
        case 3:                                                               // pousser vers le nord-ouest
          if(!this.is_there_token(x-1, y-1) && x-1 > -1 && y-1 > -1) {        // si il n'y a pas d'objet qui bloque
            this.set_token_position(x, y, 0);
            this.set_token_position(x-1, y-1, this._color);
            this.set_stack_position(x-1, y-1);
          }
          break;
        case 4:                                                               // pousser vers le nord
          if(!this.is_there_token(x-1, y) && x-1 > -1) {                      // si il n'y a pas d'objet qui bloque
            this.set_token_position(x, y, 0);
            this.set_token_position(x-1, y, this._color);
            this.set_stack_position(x-1, y);
          }
          break;
        case 5:                                                               // pousser vers le nord-est
          if(!this.is_there_token(x-1, y+1) && x-1 > -1 && y+1 < 13) {        // si il n'y a pas d'objet qui bloque
            this.set_token_position(x, y, 0);
            this.set_token_position(x-1, y+1, this._color);
            this.set_stack_position(x-1, y+1);
          }
          break;
        case 6:                                                               // pousser vers l'est
          if(!this.is_there_token(x, y+1) && y+1 < 13) {                      // si il n'y a pas d'objet qui bloque
            this.set_token_position(x, y, 0);
            this.set_token_position(x, y+1, this._color);
            this.set_stack_position(x, y+1);
          }
          break;
        case 7:                                                               // pousser vers le sud-est
          if(!this.is_there_token(x+1, y+1) && x < 13 && y < 13) {            // si il n'y a pas d'objet qui bloque
            this.set_token_position(x, y, 0);
            this.set_token_position(x+1, y+1, this._color);
            this.set_stack_position(x+1, y+1);
          }
          break;
      }
    }
  }
  
  
  manage_north(x, y) {
    if(x-1 >= 0) {                                                              // si l'objet ne sort pas du plateau
      if(!this.is_there_token(x-1, y)) {                                       // si aucun objet bloque le mouvement
        this.set_token_position(x-1, y, this.get_board_object(x, y));
        this.set_token_position(x, y, 0);
        if(this._token_board[x-1][y] < 0) {                                    // si l'objet est un stack
          this.change_color();
          this.set_stack_position(x-1, y);
          this.change_color();
        }
      }
    }
    else {                                                                      // si l'objet sort du plateau
      this.token_conflict(x, y);
    }
  }
  
  
  manage_north_east(x, y) {
    if(x-1 >= 0 && y+1 <= 12) {                                               // si l'objet ne sort pas du plateau
      if(!this.is_there_token(x-1, y+1)) {                                    // si aucun objet bloque le mouvement
        this.set_token_position(x-1, y+1, this.get_board_object(x, y));
        this.set_token_position(x, y, 0);
        if(this._token_board[x-1][y+1] < 0) {                                 // si l'objet est un stack
          this.change_color();
          this.set_stack_position(x-1, y+1);
          this.change_color();
        }
      }
    }
    else {                                                                      // si l'objet sort du plateau
      this.token_conflict(x, y);
    }
  }
  
  
  manage_east(x, y) {
    if(y+1 <= 12) {                                                             // si l'objet ne sort pas du plateau
      if(!this.is_there_token(x, y+1)) {                                      // si aucun objet bloque le mouvement
        this.set_token_position(x, y+1, this.get_board_object(x, y));
        this.set_token_position(x, y, 0);
        if(this._token_board[x][y+1] < 0) {                                   // si l'objet est un stack
          this.change_color();
          this.set_stack_position(x, y+1);
          this.change_color();
        }
      }
    }
    else {                                                                      // si l'objet sort du plateau
      this.token_conflict(x, y);
    }
  }
  
  
  manage_south_east(x, y) {
    if(x+1 <= 12 && y+1 <= 12) {                                                  // si l'objet ne sort pas du plateau
      if(!this.is_there_token(x+1, y+1)) {                                    // si aucun objet bloque le mouvement
        this.set_token_position(x+1, y+1, this.get_board_object(x, y));
        this.set_token_position(x, y, 0);
        if(this._token_board[x+1][y+1] < 0) {                                 // si l'objet est un stack
          this.change_color();
          this.set_stack_position(x+1, y+1);
          this.change_color();
        }
      }
    }
    else {                                                                      // si l'objet sort du plateau
      this.token_conflict(x, y);
    }
  }
  
  
  manage_south(x, y) {
    if(x+1 <= 12) {                                                             // si l'objet ne sort pas du plateau
      if(!this.is_there_token(x+1, y)) {                                      // si aucun objet bloque le mouvement
        this.set_token_position(x+1, y, this.get_board_object(x, y));
        this.set_token_position(x, y, 0);
        if(this._token_board[x+1][y] < 0) {                                   // si l'objet est un stack
          this.change_color();
          this.set_stack_position(x+1, y);
          this.change_color();
        }
      }
    }
    else {                                                                    // si l'objet sort du plateau
      this.token_conflict(x, y);
    }
  }
  
  
  manage_south_west(x, y) {
    if(x+1 <= 12 && y-1 >= 0) {                                                   // si l'objet ne sort pas du plateau
      if(!this.is_there_token(x+1, y-1)) {                                    // si aucun objet bloque le mouvement
        this.set_token_position(x+1, y-1, this.get_board_object(x, y));
        this.set_token_position(x, y, 0);
        if(this._token_board[x+1][y-1] < 0) {                                 // si l'objet est un stack
          this.change_color();
          this.set_stack_position(x+1, y-1);
          this.change_color();
        }
      }
    }
    else {                                                                      // si l'objet sort du plateau
      this.token_conflict(x, y);
    }
  }
  
  
  manage_west(x, y) {
    if(y-1 >= 0) {                                                              // si l'objet ne sort pas du plateau
      if(!this.is_there_token(x, y-1)) {                                      // si aucun objet bloque le mouvement
        this.set_token_position(x, y-1, this.get_board_object(x, y));
        this.set_token_position(x, y, 0);
        if(this._token_board[x][y-1] < 0) {                                   // si l'objet est un stack
          this.change_color();
          this.set_stack_position(x, y-1);
          this.change_color();
        }
      }
    }
    else {                                                                      // si l'objet sort du plateau
      this.token_conflict(x, y);
    }
  }
  
  
  manage_north_west(x, y) {
    if(x-1 >= 0 && y-1 >= 0) {                                                    // si l'objet ne sort pas du plateau
      if(!this.is_there_token(x-1, y-1)) {                                    // si aucun objet bloque le mouvement
        this.set_token_position(x-1, y-1, this.get_board_object(x, y));
        this.set_token_position(x, y, 0);
        if(this._token_board[x-1][y-1] < 0) {                                 // si l'objet est un stack
          this.change_color();
          this.set_stack_position(x-1, y-1);
          this.change_color();
        }
      }
    }
    else {                                                                      // si l'objet sort du plateau
      this.token_conflict(x, y);
    }
  }
  
  
  manage_conflict(move) {
    switch(move.get_direction()) {
      case 0:                                                                 // nord
        this.manage_north(move.get_x(), move.get_y());
        break;
      case 1:                                                                 // nord-est
        this.manage_north_east(move.get_x(), move.get_y());
        break;
      case 2:                                                                 // est
        this.manage_east(move.get_x(), move.get_y());
        break;
      case 3:                                                                 // sud-est
        this.manage_south_east(move.get_x(), move.get_y());
        break;
      case 4:                                                                 // sud
        this.manage_south(move.get_x(), move.get_y());
        break;
      case 5:                                                                 // sud-ouest
        this.manage_south_west(move.get_x(), move.get_y());
        break;
      case 6:                                                                 // ouest
        this.manage_west(move.get_x(), move.get_y());
        break;
      case 7:                                                                 // nord-ouest
        this.manage_north_west(move.get_x(), move.get_y());
        break;
      case 8:                                                                 // si on déplace le stack lui même
        this.stack_conflict(move.get_x(), move.get_y());
        break;
    }
    
  }
  
  
  manage_distant_conflict(x, y) {
    let where = [];                                                           // on stock la position des jetons voisins
    if(this.is_there_token(x-1, y))
      where.push(0);
    if(this.is_there_token(x-1, y+1))
      where.push(1);
    if(this.is_there_token(x, y+1))
      where.push(2);
    if(this.is_there_token(x+1, y+1))
      where.push(3);
    if(this.is_there_token(x+1, y))
      where.push(4);
    if(this.is_there_token(x+1, y-1))
      where.push(5);
    if(this.is_there_token(x, y-1))
      where.push(6);
    if(this.is_there_token(x-1, y-1))
      where.push(7);
    if(where.length === 1) {
      switch(where[0]) {
        case 0:                                                               // pousser au sud
          this.manage_south(x, y);
          break;
        case 1:                                                               // pousser au sud-ouest
          this.manage_south_west(x, y);
          break;
        case 2:                                                               // pousser à l'ouest
          this.manage_west(x, y);
          break;
        case 3:                                                               // pousser au nord-ouest
          this.manage_north_west(x, y);
          break;
        case 4:                                                               // pousser au nord
          this.manage_north(x, y);
          break;
        case 5:                                                               // pousser au nord-est
          this.manage_north_east(x, y);
          break;
        case 6:                                                               // pousser à l'est
          this.manage_east(x, y);
          break;
        case 7:                                                               // pousser au sud-est
          this.manage_south_east(x, y);
          break;
      }
    }
  }
  
  move(move) {                                                                // permet d'appliquer un coup et met à jour l'état du jeu.
    let temp_array = this.get_stack_position();
    let x = temp_array[0];
    let y = temp_array[1];
    if(!this.check_conflict_extended() && x !== -1) {                         // verifie s'il n'y a pas de conflits et que le stack est sur le plateau
      if(move.get_direction() !== -1) {                                       // si le move recupéré est correct
        if(this._token_lose) {                                                // si le stack a déjà été replacé
          this.play_move(x, y, move.get_direction());                         // deplacer le stack
        }
        else {
          this._token_board[x][y] = 1;                                        // placer le jeton a la place du stack
          this.remove_stack_pill();
          this._token_lose = true;
          this.play_move(x, y, move.get_direction());                         // deplacer le stack
        }
      }
    }
    else {                                                                    // si conflit ou stack hors plateau
      if(x === -1) {                                                          // si le stack est hors plateau
        if((move.get_x() <= 9 && move.get_x() >= 3) && (move.get_y() <= 9 && move.get_y() >= 3 ) && (move.get_x() === 3 || move.get_x() === 9 || move.get_y() === 3 || move.get_y() === 9)) {
          ////////////////////////// si x,y est dans la zone verte: ((3<=x<=9) et (3<=y<=9)) et ((x=3 ou 9) ou (y=3 ou 9)) et qu'il n'y a pas d'objet sur la case //////////////////////////
          if(!this.is_there_token(move.get_x(), move.get_y())) {              // si'il n'y a pas déjà un objet
            if(this._stack_pill_2 !== 15) {
              this.set_stack_position(move.get_x(), move.get_y());
            }
            else {
<<<<<<< HEAD
                if (j === 13 && k !== 13) {                                               // si on tape le bord sud
                    j--;
                    k--;
                    cpt++;






                }
                else {
                    if (k === 13 && j !== 13) {                                           // si on tape le bord est
                        j--;
                        k--;
                        cpt++;






                    }
                    else {
                        if (k === j) {                                                  // si on tape le coin sud-est
                            if(move_range<=((12-x)*2)-1 && move_range>=((12-y)*2)-1) {
                                
                            }





                        }
                    }
                }
=======
              this.set_stack_position(move.get_x(), move.get_y());
              if(this.check_conflict(move.get_x(), move.get_y())) {
                this.reset_stack_position(move.get_x(), move.get_y());
              }
              else {
                this.change_color();
              }
>>>>>>> engine
            }
          }
        }
      }
      else {
        if(this.is_there_token(move.get_x(), move.get_y())) {                   // si on doit gèrer un conflit
          if(move.get_direction() !== -1) {
            this.manage_conflict(move);
          }
          else {
            this.manage_distant_conflict(move.get_x(), move.get_y());
            
          }
        }
      }
    }
    if(!this.check_conflict_extended()) {                                     // si plus de conflit
      if(this._stack_pill_1 <= 0 && this._stack_pill_2 <= 0) {              // si le jeu est fini
        this._is_finish = true;
        this.winner_is();
      }
      else {
        if(x !== -1 && this._token_lose) {                                    // si le stack est placé et qu'il y a eu mouvement = changement de tour
          this._token_lose = false;
          this.change_color();
        }
        
      }
    }
  }
  
  
  parse(str) {
    let cpt = 0;
    this._board = new Array(13);                                // crée une colonne
    for(let y = 0; y < 13; y++) {
      this._board[y] = new Array(13);                           // crée une ligne dans la colonne
      for(let x = 0; x < 13; x++) {
        this._board[x][y] = parseInt(str.charAt(cpt));          // asigne les valeurs dans la ligne crée de gauche a droite
        cpt++;
      }
    }
  }
  
  
  to_string() {
    let str = '';
    for(let y = 0; y < 13; y++) {                                    // parcours les colonnes
      for(let x = 0; x < 13; x++) {                                 // parcours les lignes
        str = str+this._token_board[x][y];                    // on remplis la chaine de caractère ligne par ligne de gauche a droite
      }
    }
    return str;
  }
  
  
  is_finished() {
    return this._is_finish;
  }
  
  
  winner_is() {
    if(this.is_finished()) {
      let array = this._token_won;
      let count_1 = 0;
      let count_1_silver = 0;
      let count_1_gold = 0;
      let count_2 = 0;
      let count_2_silver = 0;
      let count_2_gold = 0;
      for(let i = 1; i < array.length; i += 2) {    // on compte les points et le nombre de jeton argenté et doré de chaque joueur
        if(array[i] === -1) {
          count_1 += array[i-1];
          if(array[i-1] > 1) {
            if(array[i-1] === 3) {
              count_1_silver++;
            }
            else
              count_1_gold = 1;
          }
        }
        else {
          count_2 += array[i-1];
          if(array[i-1] > 1) {
            if(array[i-1] === 3) {
              count_2_silver++;
            }
            else
              count_2_gold = 1;
          }
        }
      }
      if(count_1 > count_2) {
        return -1; // joueur 1 a gagné
        
      }
      else {
        if(count_2 > count_1) {
          return -2  // joueur 2 a gagné
        }
        else {    // même points
          if(count_1_gold === 1 || count_2_gold === 1)    // si un joueur a le jeton doré
            return (count_1_gold === 1) ? -1 : -2;         // le joueur qui a l'or a gagné
          if(count_1_silver > 0 || count_2_silver > 0) // si un joueur a au moins 1 jeton argenté
            if(count_1_silver !== count_2_silver)    // si ils n'ont pas le même nombre de jeton argenté
              return (count_1_silver > count_2_silver) ? -1 : -2;   // le joueur avec le plus de jeton argenté a gagné
          return -3;
        }
      }
    }
  }
}
export default Engine;