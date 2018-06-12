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
        this._type = GameType;                               // type de jeu (nombre de joueurs)
        this._player = Color;                                // numero du joueur
        this._stack = this.init_stack(this._type);           // nombre de jetons dans le stack du joueur (depend du nombre de joueurs)
        this._stack_position = [];                           // position du stack du joueur [x,y]
        this._timer = this._stack;                           // temps de la partie en nombre de tours = max stack du joueur
        this._token_board = this.init_token_board();         // initialise le plateau servant à savoir la position des jetons et leur type
        this._token_lose = false;                            // sert à savoir si le joueur a déjà laché le jeton de son stack ce tour ci
        this._conflict = [];                                 // sert à stocker tout les conflits
        this._token_won = [];                                // sert à stocker les jetons gagnés par le joueur
        this._possible_move = [];                            // list des mouvements possibles
    }


    init_stack(){                                            // initialise le stack du joueur et le nombre de tours
        if(this._type === 0){
            return 15;                                       // 15 si 2 joueurs
        }
        else{
            if(this._type === 1){
                return 12;                                   // 12 si 3 joueurs
            }
            else{
                return 10;                                   // 10 si 4 joueurs
            }
        }
    }


    init_token_board(){                                      // initialise le plateau
        let board = [13][13];
        for (let x = 0; x < 12; x++) {
             for (let y = 0; y < 12; y++) {
                board [x][y]=0;                              // plateau vide
            }
        }
        board[1] [1] =1;                                     // placement d'un jeton bronze en 1-1       1/4
        board[1] [6] =3;                                     // placement d'un jeton argenté en 1-6      1/4
        board[1] [11]=1;                                     // placement d'un jeton bronze en 1-11      2/4
        board[6] [1] =3;                                     // placement d'un jeton argenté en 6-1      2/4
        board[6] [6] =5;                                     // placement du jeton doré en 6-6           1/1
        board[6] [11]=3;                                     // placement d'un jeton argenté en 6-11     3/4
        board[11][1] =1;                                     // placement d'un jeton bronze en 11-1      3/4
        board[11][6] =3;                                     // placement d'un jeton argenté en 11-6     4/4
        board[11][11]=1;                                     // placement d'un jeton bronze en 11-11     4/4
        return board;
    }


    clone() {
        let o = new Engine(this._type, this._player);
        o.set(this._stack, this._timer, this._token_board, this._token_lose, this._conflict, this._token_won);
        return o;
    }


    get_name() {
        return 'Repello';
    }


    get_token_won(){                                         // connaitre les jetons que le joueur a gagné
        return this._token_won;
    }


    get_stack_position(){
        return this._stack_position;
    }


    set_token_won(TokenType){                                // place le jeton dans la pile de jetons gagnés
        this._token_won.splice(1, 0, TokenType);
    }


    set_stack_position(x,y){                                 // placer le stack du joueur
        this._token_won.splice(0, 2, [x][y]);
    }


    remove_token_won(i){                                     // enleve un jeton au joueur (cas ou son stack est hors jeu)
        this._token_won.splice(i, 1);
    }


    is_there_token(x,y){                                     // verifie la présence d'un jeton
        return this._token_board[x][y] !== 0;
    }


    check_conflict(x,y) {                                    // verifie la présence d'une zone de conflit
        let conflict = [];
        let i = 0;
        if(this.is_there_token[x-1][y]) {                    // jeton au nord?
            conflict[i] = new Conflict(x, y, 0);
            i++;
        }
        if(this.is_there_token[x-1][y+1]) {                  // jeton au nord-est?
            conflict[i] = new Conflict(x, y, 1);
            i++;
        }
        if(this.is_there_token[x][y+1]) {                    // jeton à l'est?
            conflict[i] = new Conflict(x, y, 2);
            i++;
        }
        if(this.is_there_token[x+1][y+1]) {                  // jeton au sud-est?
            conflict[i] = new Conflict(x, y, 3);
            i++;
        }
        if(this.is_there_token[x+1][y]) {                    // jeton au sud?
            conflict[i] = new Conflict(x, y, 4);
            i++;
        }
        if(this.is_there_token[x+1][y-1]) {                  // jeton au sud-ouest?
            conflict[i] = new Conflict(x, y, 5);
            i++;
        }
        if(this.is_there_token[x][y-1]) {                    // jeton à l'ouest?
            conflict[i] = new Conflict(x, y, 6);
            i++;
        }
        if(this.is_there_token[x-1][y-1])                    // jeton au nord-ouest?
            conflict[i] = new Conflict(x,y, 7);
        return conflict;
    }


    get_possible_move_list() {
        //TODO
    }



}
export default Engine;