"use strict";

import Board from './board.mjs';
import Color from './color.mjs';
import GameType from './game_type.mjs';
import Move from './move.mjs';
import Direction from './direction.mjs';
import TokenType from './token.mjs';
import Conflict from './conflict.mjs';
import OpenXum from '../../openxum/engine.mjs';



class Engine extends OpenXum.Engine {
  constructor(GameType, Color) {
    super();
    this._type = GameType;                                       // type de jeu (nombre de joueurs)
    this._color = Color;                                         // numéro du joueur
    this._stack = this.init_stack(this._type);                   // nombre de jetons dans le stack du joueur (depend du nombre de joueurs)
    this._stack_1_position = [];                                 // position du stack du joueur 1 [x][y]
    this._stack_2_position = [];                                 // position du stack du joueur 2 [x][y]
    this._timer = this._stack-1;                                 // temps de la partie en nombre de tours = max stack du joueur
    this._token_board = [
      [0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,1,0,0,0,0,3,0,0,0,0,1,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0],                             // initialise le plateau servant à savoir la position des jetons et leur type
      [0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,3,0,0,0,0,5,0,0,0,0,3,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,1,0,0,0,0,3,0,0,0,0,1,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];
    this._token_lose = false;                                    // sert à savoir si le joueur a déjà laché le jeton de son stack ce tour ci
    this._conflict = [];                                         // sert à stocker tout les conflits
    this._token_won = [];                                        // sert à stocker les jetons gagnés par le joueur
    this._possible_move = [];                                    // list des mouvements possibles
    this._is_finish = false;                                     // sert a savoir si la partie est finie
  }


  init_stack(){                                                    // initialise le stack du joueur et le nombre de tours
    if(this._type === 0){
      return 15;                                               // 15 si 2 joueurs
    }
  }


  clone() {
    let o = new Engine(this._type, this._color);
    o.set(this._stack, this._stack_1_position, this._stack_2_position, this._timer, this._token_board, this._token_lose, this._conflict, this._token_won, this._possible_move, this._is_finish);
    return o;
  }

   
  get_name() {                                                     // connaitre le nom du jeu
    return 'Repello';
  }


  get_token_won(){                                                 // connaitre les jetons que le joueur a gagné
    let player_token = [];
    for(let i=1; i<this._token_won.length; i++){
      if(this._color === this._token_won[i]) {
        player_token.push(this._token_won[i-1]);
      }
    }
    return player_token;
  }


  current_color() {
    return this._color;
  }


  change_color(){
    this._color = (this._color ===-1) ? -2 : -1;
  }


  get_stack_position(){                                            // connaitre la position du stack
    if(this._color === -1){                                      // joueur 1
      return this._stack_1_position;
    }
    else{                                                        // joueur 2
      return this._stack_2_position;
    }
  }


  get_board_position(x,y) {                                        // récupere l'element à la place x,y
    return this._token_board[x][y];
  }


  set_token_won(TokenType){                                        // place le jeton dans la pile de jetons gagnés
    this._token_won.push(TokenType);
    this._token_won.push(this._color);
  }


  set_stack_position(x,y){                                         // placer le stack du joueur
    if(this._color === -1){                                      // joueur 1
      this._stack_1_position = [x, y];
      this._token_board[x][y] = this._color;
    }
    else{                                                        // joueur 2
      this._stack_2_position = [x, y];
      this._token_board[x][y] = this._color;
    }
  }


  set_token_position(x,y,TokenType){                               // placer un jeton dans la grille
    this._token_board[x][y] = TokenType;
  }


  remove_token_won(i){                                             // enlève un jeton au joueur (cas ou son stack est hors jeu)
    this._token_won.splice(i, 1);
  }


  is_there_token(x,y){                                             // vérifie la présence d'un jeton
    return this._token_board[x][y] !== 0;
  }


  check_conflict(x,y) {                                              // vérifie la présence d'une zone de conflit
    let conflict = [];                                               // stock les conflits
    if(x>0) {                                                        // ne pas verifier la case nord si elle est hors plateau
      if (this.is_there_token(x-1, y)) {                             // jeton au nord?
        conflict.push(new Conflict(x, y, x-1, y));
      }
    }
    if(x>0 && y<12) {                                                // ne pas verifier la case nord-est si elle est hors plateau
      if (this.is_there_token(x-1, y+1)) {                           // jeton au nord-est?
        conflict.push(new Conflict(x, y, x-1, y+1));
      }
    }
    if(y<12) {                                                       // ne pas verifier la case est si elle est hors plateau
      if (this.is_there_token(x, y+1)) {                             // jeton à l'est?
        conflict.push(new Conflict(x, y, x, y+1));
      }
    }
    if(x<12 && y<12) {                                               // ne pas verifier la case sud-ouest si elle est hors plateau
      if (this.is_there_token(x+1, y+1)) {                           // jeton au sud-est?
        conflict.push(new Conflict(x, y, x+1, y+1));
      }
    }
    if(x<12) {                                                       // ne pas verifier la case sud si elle est hors plateau
      if (this.is_there_token(x+1, y)) {                             // jeton au sud?
        conflict.push(new Conflict(x, y, x+1, y));
      }
    }
    if(x<12 && y>0) {                                                // ne pas verifier la case sud-ouest si elle est hors plateau
      if (this.is_there_token(x+1, y-1)) {                           // jeton au sud-ouest?
        conflict.push(new Conflict(x, y, x+1, y-1));
      }
    }
    if(y>0) {                                                        // ne pas verifier la case ouest si elle est hors plateau
      if (this.is_there_token(x, y-1)) {                             // jeton à l'ouest?
        conflict.push(new Conflict(x, y, x, y-1));
      }
    }
    if(x>0 && y>0) {                                                 // ne pas verifier la case nord-ouest si elle est hors plateau
      if (this.is_there_token(x-1, y-1)) {                           // jeton au nord-ouest?
        conflict.push(new Conflict(x, y, x-1, y-1));
      }
    }
    return conflict;
  }


  get_possible_move_list(x,y) {
    let possible_move= [];                                                                       // liste qui stock les mouvements jouables
    let move_range;                                                                               // stock le nombre de deplacement à faire
///////// objet bloque deplacement au nord? /////////
    if (x > 0) {                                                                                  // si le stack n'est pas collé au bord nord
      move_range = Board[x - 1][y];                                                             // récupere le chiffre du plateau qui indique le mouvement au nord
      if (move_range <= (x * 2) - 1) {                                                          // si le mouvement est faisable sur le bord nord sans qu'il repasse par son x de depart (= mouvement impossible sinon)
        let j = x - 1;
        while (j >=0  && move_range>0 && !this.is_there_token(j, y)) {                                    // tant qu'on trouve pas d'objet on avance vers le nord
          j--;
          move_range--;
        }
        if (move_range === 0 || j===-1) {                                                                       // si on a été jusqu'au bout (= sans rencontrer d'obstacle)
          possible_move.push(new Move(0));                                                    // alors on stock le mouvement possible
        }
      }
    }
///////// objet bloque deplacement au nord-est? /////////
    if (x > 0 && y < 12) {                                                                        // si le stack n'est pas sur le bord nord ou est
      move_range = Board[x - 1][y + 1];                                                         // récupere le chiffre du plateau qui indique le mouvement au nord-est
      let j = x - 1;
      let k = y + 1;
      let cpt = move_range;
      while ( j >= 0 && k <= 12 && cpt > 0&& !this.is_there_token(j, k) ) {                  // tant qu'on trouve pas d'objet on avance vers le nord-est
        j--;
        k++;
        cpt--;
      }
      if (cpt === 0) {                                                                          // si on a fini les déplacements sans taper un bord
        possible_move.push(new Move(1));                                                      // alors on stock le mouvement possible
      }
      else {
        if (j === -1 && k !== 13) {                                                           // si on tape le bord nord
          j++;
          k--;
          cpt++;
          while (  k <= 12 && cpt > 0&& !this.is_there_token(j, k) ) {                    // tant qu'on trouve pas d'objet on avance vers le sud-est
            j++;
            k++;
            cpt--;
          }
          if (cpt === 0) {                                                                  // si on a fini les déplacements sans taper le bord est
            possible_move.push(new Move(1));                                              // alors on stock le mouvement possible
          }
          else {
            if (k === 13) {                                                               // si on tape aussi le bord est
              j--;
              k--;
              cpt++;
              while ( cpt > 0&&!this.is_there_token(j, k)) {                       // tant qu'on trouve pas d'objet on avance vers le sud-ouest
                j++;
                k--;
                cpt--;
              }
              if (cpt === 0) {                                                          // si on a pas trouvé d'objet
                possible_move.push(new Move(1));                                      // alors on stock le mouvement possible
              }
            }
          }
        }
        else {
          if (k === 13 && j !== -1) {                                                       // si on tape le bord est
            j++;
            k--;
            cpt++;
            while (  j >= 0 && cpt > 0&&!this.is_there_token(j, k)) {                 // tant qu'on trouve pas d'objet on avance vers le nord-ouest
              j--;
              k--;
              cpt--;
            }
            if (cpt === 0) {                                                              // si on a fini les déplacements sans taper le bord nord
              possible_move.push(new Move(1));                                          // alors on stock le mouvement possible
            }
            else {
              if (j === -1) {                                                           // si on tape aussi le bord nord
                j++;
                k++;
                cpt++;
                while (cpt > 0 && !this.is_there_token(j, k)) {                   // tant qu'on trouve pas d'objet on avance vers le sud-ouest
                  j++;
                  k--;
                  cpt--;
                }
                if (cpt === 0) {                                                      // si on a pas trouvé d'objet
                  possible_move.push(new Move(1));                                  // alors on stock le mouvement possible
                }
              }
            }
          }
          else {                                                                            // si on tape le coin nord-est
            if ( j=== -1 && k===13) {
              if(move_range <= (x*2)-1 && move_range <= ((12-y)*2)-1) {          // si le jeton ne repasse pas par son point d'origine
                possible_move.push(new Move(1));                                          // alors on stock le mouvement possible
              }
            }
          }
        }
      }
    }
///////// objet bloque deplacement à l'est /////////
    if (y < 12) {                                                                                 // si le stack n'est pas collé au bord est
      move_range = Board[x][y + 1];                                                             // récupere le chiffre du plateau qui indique le mouvement à l'est
      if (move_range <= ((12 - y) * 2) - 1) {                                                   // si le mouvement est faisable sur le bord nord sans qu'il repasse par son x de depart (= mouvement impossible sinon)
        let k = y + 1;
        while (k <= 12&& move_range>0&& !this.is_there_token(x, k) ) {                                   // tant qu'on trouve pas d'objet on avance
          k++;
          move_range--;
        }
        if (move_range === 0 || k === 13) {                                                                       // si on a été jusqu'au bout (= on a pas rencontré d'obstacle)
          possible_move.push(new Move(2));                                                  // alors on stock le mouvement possible
        }
      }
    }
///////// objet bloque deplacement au sud-est? /////////
    if (x < 12 && y < 12) {                                                                       // si le stack n'est pas sur le bord sud ou est
      move_range = Board[x + 1][y + 1];                                                         // récupere le chiffre du plateau qui indique le mouvement au sud-est
      let j = x + 1;
      let k = y + 1;
      let cpt = move_range;
      while (j <= 12 && k <= 12 && cpt > 0&& !this.is_there_token(j, k) ) {                 // tant qu'on trouve pas d'objet on avance vers le sud-est
        j++;
        k++;
        cpt--;
      }
      if (cpt === 0) {                                                                          // si on a fini les déplacements sans taper un bord
        possible_move.push(new Move(3));                                                      // alors on stock le mouvement possible
      }
      else {
        if (j === 13 && k !== 13) {                                                           // si on tape le bord sud
          j--;
          k--;
          cpt++;
          while (k <= 12 && cpt > 0&& !this.is_there_token(j, k) ) {                    // tant qu'on trouve pas d'objet on avance vers le nord-est
            j--;
            k++;
            cpt--;
          }
          if (cpt === 0) {                                                                  // si on a fini les déplacements sans taper le bord est
            possible_move.push(new Move(3));                                               // alors on stock le mouvement possible
          }
          else {
            if (k === 13) {                                                               // si on tape aussi le bord est
              j++;
              k--;
              cpt++;
              while (cpt > 0&& !this.is_there_token(j, k) ) {                       // tant qu'on trouve pas d'objet on avance vers le nord-ouest
                j--;
                k--;
                cpt--;
              }
              if (cpt === 0) {                                                          // si on a pas trouvé d'objet
                possible_move.push(new Move(3));                                       // alors on stock le mouvement possible
              }
            }
          }
        }
        else {
          if (k === 13 && j !== 13) {                                                       // si on tape le bord est
            j--;
            k--;
            cpt++;
            while (j <= 12 && cpt > 0 && !this.is_there_token(j, k)) {                // tant qu'on trouve pas d'objet on avance vers le sud-ouest
              j++;
              k--;
              cpt--;
            }
            if (cpt === 0) {                                                              // si on a fini les déplacements sans taper le bord sud
              possible_move.push(new Move(3));                                           // alors on stock le mouvement possible
            }
            else {
              if (j === 13) {                                                           // si on tape aussi le bord sud
                j--;
                k++;
                cpt++;
                while (cpt > 0&& !this.is_there_token(j, k) ) {                   // tant qu'on trouve pas d'objet on avance vers le nord-ouest
                  j--;
                  k--;
                  cpt--;
                }
                if (cpt === 0) {                                                      // si on a pas trouvé d'objet
                  possible_move.push(new Move(3));                                   // alors on stock le mouvement possible
                }
              }
            }
          }
          else {                                                                                 // si on tape le coin sud-est
            if ( j=== 13 && k===13) {
              if(move_range <= ((12-x)*2)-1 && move_range <= ((12-y)*2)-1) {   // si le jeton ne repasse pas par son point d'origine
                possible_move.push(new Move(3));                                           // alors on stock le mouvement possible
              }
            }
          }
        }
      }
    }
///////// objet bloque deplacement au sud? /////////
    if (x<12) {                                                                                   // si le stack n'est pas collé au bord sud
      move_range = Board[x+1][y];                                                               // récupere le chiffre du plateau qui indique le mouvement au sud
      if (move_range <= ((12-x)*2) - 1) {                                                       // si le mouvement est faisable sur le bord nord sans qu'il repasse par son x de depart (= mouvement impossible sinon)
        let j =x+1;
        while(j<=12&& move_range>0&&!this.is_there_token(j,y) ){                                        // tant qu'on trouve pas d'objet on avance
          j++;
          move_range--;
        }
        if(move_range ===0 || j === 13){                                                                           // si on a été jusqu'au bout (= on a pas rencontré d'obstacle)
          possible_move.push(new Move(4));                                                   // alors on stock le mouvement possible
        }
      }
    }
///////// objet bloque deplacement au sud-ouest? /////////
    if (y > 0 && x < 12) {                                                                        // si le stack n'est pas sur le bord sud ou ouest
      move_range = Board[x + 1][y - 1];                                                         // récupere le chiffre du plateau qui indique le mouvement au sud-ouest
      let j = x + 1;
      let k = y - 1;
      let cpt = move_range;
      while (k >= 0 && j <= 12 && cpt > 0&& !this.is_there_token(j, k) ) {                  // tant qu'on trouve pas d'objet on avance vers le sud-ouest
        k--;
        j++;
        cpt--;
      }
      if (cpt === 0) {                                                                          // si on a fini les déplacements sans taper un bord
        possible_move.push(new Move(5));                                                       // alors on stock le mouvement possible
      }
      else {
        if (k === -1 && j !== 13) {                                                           // si on tape le bord ouest
          k++;
          j--;
          cpt++;
          while ( j <= 12 && cpt > 0&& !this.is_there_token(j, k)) {                    // tant qu'on trouve pas d'objet on avance vers le sud-est
            k++;
            j++;
            cpt--;
          }
          if (cpt === 0) {                                                                  // si on a fini les déplacements sans taper le bord sud
            possible_move.push(new Move(5));                                                 // alors on stock le mouvement possible
          }
          else {
            if (j === 13) {                                                               // si on tape aussi le bord sud
              k--;
              j--;
              cpt++;
              while (cpt > 0 && !this.is_there_token(j, k)) {                       // tant qu'on trouve pas d'objet on avance vers le nord-est
                k++;
                j--;
                cpt--;
              }
              if (cpt === 0) {                                                          // si on a pas trouvé d'objet
                possible_move.push(new Move(5));                                         // alors on stock le mouvement possible
              }
            }
          }
        }
        else {
          if (j === 13 && k !== -1) {                                                       // si on tape le bord sud
            k++;
            j--;
            cpt++;
            while (k >= 0 && cpt > 0 && !this.is_there_token(j, k)) {                 // tant qu'on trouve pas d'objet on avance vers le nord-ouest
              k--;
              j--;
              cpt--;
            }
            if (cpt === 0) {                                                              // si on a fini les déplacements sans taper le bord ouest
              possible_move.push(new Move(5));                                             // alors on stock le mouvement possible
            }
            else {
              if (k === -1) {                                                           // si on tape aussi le bord ouest
                k++;
                j++;
                cpt++;
                while (cpt > 0 && !this.is_there_token(j, k)) {                   // tant qu'on trouve pas d'objet on avance vers le nord-est
                  k++;
                  j--;
                  cpt--;
                }
                if (cpt === 0) {                                                      // si on a pas trouvé d'objet
                  possible_move.push(new Move(5));                                     // alors on stock le mouvement possible
                }
              }
            }
          }
          else {                                                                            // si on tape le coin sud-ouest
            if ( j=== 13 && k===-1) {
              if(move_range <= (12-x)*2-1 && move_range <= (y*2)-1) {            // si le jeton ne repasse pas par son point d'origine
                possible_move.push(new Move(5));                                             // alors on stock le mouvement possible
              }
            }
          }
        }
      }
    }
///////// objet bloque deplacement à l'ouest? /////////
    if (y>0) {                                                                                    // si le stack n'est pas collé au bord ouest
      move_range = Board[x][y-1];                                                               // récupere le chiffre du plateau qui indique le mouvement au ouest
      if (move_range <= (y*2) - 1) {                                                            // si le mouvement est faisable sur le bord nord sans qu'il repasse par son x de depart (= mouvement impossible sinon)
        let k =y-1;
        while(k>=0 && move_range>0&&!this.is_there_token(x,k)){                                         // tant qu'on trouve pas d'objet on avance
          k--;
          move_range--;
        }
        if(move_range ===0 || k===-1){                                                                           // si on a été jusqu'au bout (= on a pas rencontré d'obstacle)
          possible_move.push(new Move(6));                                                     // alors on stock le mouvement possible
        }
      }
    }
///////// objet bloque deplacement au nord-ouest? /////////
    if (x > 0 && y > 0) {                                                                         // si le stack n'est pas sur le bord nord ou ouest
      move_range = Board[x - 1][y - 1];                                                         // récupere le chiffre du plateau qui indique le mouvement au nord-ouest
      let j = x - 1;
      let k = y - 1;
      let cpt = move_range;
      while (j >= 0 && k >= 0 && cpt > 0 && !this.is_there_token(j, k)) {                   // tant qu'on trouve pas d'objet on avance vers le nord-ouest
        j--;
        k--;
        cpt--;
      }
      if (cpt === 0) {                                                                          // si on a fini les déplacements sans taper un bord
        possible_move.push(new Move(7));                                                         // alors on stock le mouvement possible
      }
      else {
        if (j === -1 && k !== -1) {                                                           // si on tape le bord nord
          j++;
          k++;
          cpt++;
          while (k >= 0 && cpt > 0&& !this.is_there_token(j, k) ) {                     // tant qu'on trouve pas d'objet on avance vers le sud-ouest
            j++;
            k--;
            cpt--;
          }
          if (cpt === 0) {                                                                  // si on a fini les déplacements sans taper le bord ouest
            possible_move.push(new Move(7));                                                // alors on stock le mouvement possible
          }
          else {
            if (k === -1) {                                                               // si on tape aussi le bord ouest
              j--;
              k++;
              cpt++;
              while (cpt > 0 && !this.is_there_token(j, k)) {                       // tant qu'on trouve pas d'objet on avance vers le sud-est
                j++;
                k++;
                cpt--;
              }
              if (cpt === 0) {                                                          // si on a pas trouvé d'objet
                possible_move.push(new Move(7));                                        // alors on stock le mouvement possible
              }
            }
          }
        }
        else {
          if (k === -1 && j !== -1) {                                                       // si on tape le bord ouest
            j++;
            k++;
            cpt++;
            while (j >= 0 && cpt > 0 && !this.is_there_token(j, k)) {                 // tant qu'on trouve pas d'objet on avance vers le nord-est
              j--;
              k++;
              cpt--;
            }
            if (cpt === 0) {                                                              // si on a fini les déplacements sans taper le bord nord
              possible_move.push(new Move(7));                                            // alors on stock le mouvement possible
            }
            else {
              if (j === 13) {                                                           // si on tape aussi le bord nord
                j++;
                k--;
                cpt++;
                while (cpt > 0 && !this.is_there_token(j, k)) {                   // tant qu'on trouve pas d'objet on avance vers le sud-est
                  j++;
                  k++;
                  cpt--;
                }
                if (cpt === 0) {                                                      // si on a pas trouvé d'objet
                  possible_move.push(new Move(7));                                    // alors on stock le mouvement possible
                }
              }
            }
          }
          else {                                                                            // si on tape le coin nord-ouest
            if ( j=== -1 && k===-1) {
              if(move_range <= (x*2)-1 && move_range <= (y*2)-1) {                 // si le jeton ne repasse pas par son point d'origine
                possible_move.push(new Move(7));                                            // alors on stock le mouvement possible
              }
            }
          }
        }
      }
    }
    return possible_move;
  }


  apply_moves(moves) {
    for (let i = 0; i < moves.length; ++i) {
      this.move(new Move(moves.get_direction()));
    }
  }


  is_finished() {
    return this._is_finish;
  }


// TODO
  manage_conflict(conflicts){
    while(conflicts){
      // boucle 1
      // boucle 2
      // select conflict 1
      // select conflict 2
      // chercher le conflict dans le tableau
      // fin boucle 2 si conflit trouvé
      // select l'objet à deplacer
      // verifier si il peut bouger
      // faire le deplacement
      // ajouter au jetons gagnés si ejecté
      conflicts.splice(i, 1);                                                     // supprimer le conflict du tableau array.splice(début, nbASupprimer[, élem1[, élem2[, ...]]])
      conflicts.push(this.check_conflict(new_x, new_y));                          // ajouter les nouveaux conflits possibles de l'objet qui a bougé
      // fin boucle 1
    }
  }

  
  play_move(x,y,direction){
    switch(direction) {
      case 0:                                                                                                                  // si deplacement au nord
        this._token_board[Math.abs(x-(Board[x-1][y]))][y] = this._color;
        this.set_stack_position(x, y);
        break;
      case 1:                                                                                                                  // si deplacement au nord-est
        this._token_board[Math.abs(x-(Board[x-1][y+1]))][(24-(Math.abs((Board[x-1][y+1])-y)))%12] = this._color;
        this.set_stack_position(x, y);
        break;
      case 2:                                                                                                                  // si deplacement à l'est
        this._token_board[x][(24-(Math.abs((Board[x][y+1])-y)))%12] = this._color;
        this.set_stack_position(x, y);
        break;
      case 3:                                                                                                                  // si deplacement au sud-est
        this._token_board[(24-(Math.abs((Board[x+1][y+1])-x)))%12][(24-(Math.abs((Board[x+1][y+1])-y)))%12] = this._color;
        this.set_stack_position(x, y);
        break;
      case 4:                                                                                                                  // si deplacement au sud
        this._token_board[(24-(Math.abs((Board[x+1][y])-x)))%12][y] = this._color;
        this.set_stack_position(x, y);
        break;
      case 5:                                                                                                                  // si deplacement au sud-ouest
        this._token_board[(24-(Math.abs((Board[x+1][y-1])-x)))%12][Math.abs(y-(Board[x+1][y-1]))] = this._color;
        this.set_stack_position(x, y);
        break;
      case 6:                                                                                                                  // si deplacement à l'ouest
        this._token_board[x][Math.abs((Board[x][y-1]-y))] = this._color;
        this.set_stack_position(x, y);
        break;
      case 7:                                                                                                                  //si deplacement au nord-ouest
        this._token_board[Math.abs(Board[x-1][y-1]-x)][Math.abs(Board[x-1][y-1]-y)] = this._color;
        this.set_stack_position(x, y);
        break;
    }
  }
  

// TODO
  move(move) {  // Permet d'appliquer un coup et met à jour l'état du jeu.
    let temp_array = this.get_stack_position();
    let x = temp_array[0];
    let y = temp_array[1];
    let possible_move = this._get_possible_move_list(temp_array[0],temp_array[1]);                                 // on recupère la liste des mouvements possibles
    if(possible_move) {
      for(let i = 0; i < possible_move.length; i++) {
        if(possible_move[i] === move) {
          this._token_board[x][y] = 1;
          this.play_move(x,y,move.get_direction());
          let conflict = this.check_conflict(x, y);
          this.manage_conflict(conflict);
          break;
        }
      }
      this.winner_is();                                                                                            // si fini et gagnant
      this.change_color();                                                                                         // prochain tour
    }
    else{
      this._token_board[x][y] = 1;
      // input
      this.set_stack_position();
    }
  }


  parse(str) {
    let cpt = 0;
    this._board = new Array(13);                                 // crée une colonne
    for (let y = 0; y < 13; y++) {
      this._board[y] = new Array(13);                          // crée une ligne dans la colonne
      for (let x = 0; x < 13; x++) {
        this._board[x][y] = parseInt(str.charAt(cpt));       // asigne les valeurs dans la ligne crée de gauche a droite
        cpt++;
      }
    }
  }


  to_string() {
    let str = '';
    for(let y=0; y<13; y++){                                     // parcours les colonnes
      for(let x= 0; x<13; x++){                                // parcours les lignes
        str = str + this._token_board[x][y];                 // on remplis la chaine de caractère ligne par ligne de gauche a droite
      }
    }
    return str;
  }


  winner_is() {
    if(this.is_finished()) {
      let array = this.get_token_won();
      let count_1 = 0;
      let count_1_silver = 0;
      let count_1_gold = 0;
      let count_2 = 0;
      let count_2_silver = 0;
      let count_2_gold = 0;
      for(let i=0; i<array.length; i++){
        count_1+=array[i];
        if(array[i]>1){
          if(array[i]===3){
            count_1_silver = 1;
          }
          else{
            count_1_gold = 1;
          }
        }
      }
      this.change_color();
      array = this.get_token_won();
      for(let i=0; i<array.length; i++){
        count_2+=array[i];
        if(array[i]>1){
          if(array[i]===3){
            count_2_silver = 1;
          }
          else{
            count_2_gold= 1;
          }
        }
      }
      if(count_1>count_2){
        this.change_color();
        return this._color;
      }
      else {
        if(count_1===count_2){
          if(count_1_gold===1){
            this.change_color();
            return this._color;
          }
          else{
            if(count_2_gold===1){
              return this._color;
            }
            else{
              if(count_1_silver>count_2_silver){
                this.change_color();
                return this._color;
              }
              else{
                if(count_2_silver>count_1_silver){
                  return this._color;
                }
                else{
                  return 'draw';
                }
              }
            }
          }
        }
        else {
          return this._color;
        }
      }
    }
  }
 }
export default Engine;