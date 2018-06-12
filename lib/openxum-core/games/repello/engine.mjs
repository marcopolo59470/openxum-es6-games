"use strict";

import Color from './color.mjs';
import Move from './move.mjs';
import Token from './token.mjs';
import Direction from './direction.mjs';
import OpenXum from '../../openxum/engine.mjs';



class Engine extends OpenXum.Engine {
    constructor(type, color) {
        super();
        this._type= type;                                // type de jeu (nombre de joueurs)
        this._color= color;                              // couleur du joueur
        this._stack = this.init_stack(this._type);       // nombre de jetons dans le stack du joueur (depend du nombre de joueurs)
        this._timer = this.init_stack(this._type);       // temps de la partie en nombre de tours = max stack du joueur
        this._token_board = this.init_token_board();     // initialise le plateau servant à savoir la position des jetons et leur type
        this._token_lose = false;                        // sert à savoir si le joueur a déjà laché le jeton de son stack ce tour ci
        this._conflict = true;                           // sert à savoir si on doit règler un conflit de proximité
        this._is_winner = false;                         // sert à savoir si le joueur est gagnant
        this._token_won[] = 0;                           // sert à stocker les jetons gagnés par le joueur
    }


    init_stack(_type){
        if(this._type === 0){
            return 15;
        }
        else{
            if(this._type === 1){
                return 12;
            }
            else{
                return 10;
            }
        }
    }


    init_token_board(){
      let board [13][13];
      for (let x = 0; x < 12; x++) {
          for (let y = 0; y < 12; y++) {
              board [x][y]=0;                            // plateau vide
          }
      }
      board[1][1]=1;                                     // placement d'un jeton bronze en 1-1       1/4
      board[1][6]=3;                                     // placement d'un jeton argenté en 1-6      1/4
      board[1][11]=1;                                    // placement d'un jeton bronze en 1-11      2/4
      board[6][1]=3;                                     // placement d'un jeton argenté en 6-1      2/4
      board[6][6]=5;                                     // placement du jeton doré en 6-6           1/1
      board[6][11]=3;                                    // placement d'un jeton argenté en 6-11     3/4
      board[11][1]=1;                                    // placement d'un jeton bronze en 11-1      3/4
      board[11][6]=3;                                    // placement d'un jeton argenté en 11-6     4/4
      board[11][11]=1;                                   // placement d'un jeton bronze en 11-11     4/4
      return board;
    }


    check_conflict(){




    }


    get_name() {
        return 'Repello';
    }














}
export default Engine;