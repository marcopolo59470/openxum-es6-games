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
        this._player = Color;                                        // numéro du joueur
        this._stack = this.init_stack(this._type);                   // nombre de jetons dans le stack du joueur (depend du nombre de joueurs)
        this._stack_position = [];                                   // position du stack du joueur [x,y]
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
    }


    init_stack(){                                                    // initialise le stack du joueur et le nombre de tours
        if(this._type === 0){
            return 15;                                               // 15 si 2 joueurs
        }
        else{
            if(this._type === 1){
                return 12;                                           // 12 si 3 joueurs
            }
            else{
                return 10;                                           // 10 si 4 joueurs
            }
        }
    }


 /*   devenue inutile à cause de la declaration directe dans le constructeur de engine, mais je garde au cas où
    init_token_board(){                                              // initialise le plateau
        let board= ;
        for (let x = 0; x < 12; x++) {
             for (let y = 0; y < 12; y++) {
                board [x][y]=0;                                      // plateau vide
            }
        }
        board[1] [1] =1;                                             // placement d'un jeton bronze en 1-1       1/4
        board[1] [6] =3;                                             // placement d'un jeton argenté en 1-6      1/4
        board[1] [11]=1;                                             // placement d'un jeton bronze en 1-11      2/4
        board[6] [1] =3;                                             // placement d'un jeton argenté en 6-1      2/4
        board[6] [6] =5;                                             // placement du jeton doré en 6-6           1/1
        board[6] [11]=3;                                             // placement d'un jeton argenté en 6-11     3/4
        board[11][1] =1;                                             // placement d'un jeton bronze en 11-1      3/4
        board[11][6] =3;                                             // placement d'un jeton argenté en 11-6     4/4
        board[11][11]=1;                                             // placement d'un jeton bronze en 11-11     4/4
        return board;
    }
*/

    clone() {
        let o = new Engine(this._type, this._player);
        o.set(this._stack, this._stack_position, this._timer, this._token_board, this._token_lose, this._conflict, this._token_won, this._possible_move);
        return o;
    }


    get_name() {                                                     // connaitre le nom du jeu
        return 'Repello';
    }


    get_token_won(){                                                 // connaitre les jetons que le joueur a gagné
        return this._token_won;
    }


    get_stack_position(){                                            // connaitre la position du stack
        return this._stack_position;
    }


    get_board_position(x,y) {                                        // récupere l'element à la place x,y
        return this._token_board[x][y];

    }


    set_token_won(TokenType){                                        // place le jeton dans la pile de jetons gagnés
        this._token_won.splice(1, 0, TokenType);
    }


    set_stack_position(x,y,Color){                                   // placer le stack du joueur
        this._token_board[x][y] = Color;
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


    check_conflict(x,y) {                                            // vérifie la présence d'une zone de conflit
        let conflict = [0];                                          // stock les conflits
        let i = 0;                                                   // sert à savoir la place dans le tableau
        if(x>0) {                                                    // ne pas verifier la case nord si elle est hors plateau
            if (this.is_there_token([x - 1], [y])) {                 // jeton au nord?
                conflict[i] = new Conflict(x, y, 0);
                i++;
            }
        }
        if(x>0 && y<12) {                                            // ne pas verifier la case nord-est si elle est hors plateau
            if (this.is_there_token([x - 1], [y + 1])) {             // jeton au nord-est?
                conflict[i] = new Conflict(x, y, 1);
                i++;
            }

        }
        if(y<12) {                                                   // ne pas verifier la case est si elle est hors plateau
            if (this.is_there_token([x], [y + 1])) {                 // jeton à l'est?
                conflict[i] = new Conflict(x, y, 2);
                i++;
            }
        }
        if(x<12 && y<12) {                                           // ne pas verifier la case sud-ouest si elle est hors plateau
            if (this.is_there_token([x + 1], [y + 1])) {             // jeton au sud-est?
                conflict[i] = new Conflict(x, y, 3);
                i++;
            }
        }
        if(x<12) {                                                   // ne pas verifier la case sud si elle est hors plateau
            if (this.is_there_token([x + 1], [y])) {                 // jeton au sud?
                conflict[i] = new Conflict(x, y, 4);
                i++;
            }
        }
        if(x<12 && y>0) {                                            // ne pas verifier la case sud-ouest si elle est hors plateau
            if (this.is_there_token([x + 1], [y - 1])) {             // jeton au sud-ouest?
                conflict[i] = new Conflict(x, y, 5);
                i++;
            }
        }
        if(y>0) {                                                    // ne pas verifier la case ouest si elle est hors plateau
            if (this.is_there_token([x], [y - 1])) {                 // jeton à l'ouest?
                conflict[i] = new Conflict(x, y, 6);
                i++;
            }
        }
        if(x>0 && y>0) {                                             // ne pas verifier la case nord-ouest si elle est hors plateau
            if (this.is_there_token([x - 1], [y - 1])) {             // jeton au nord-ouest?
                conflict[i] = new Conflict(x, y, 7);
            }
        }

        return conflict;
    }

//////////// liste tout les mouvements jouables ////////////
    get_possible_move_list(x,y) {
        let possible_move = [];                                      // liste qui stock les mouvements jouables
        let i = 0;                                                   // sert à savoir la place dans le tableau
        let move_range;                                              // stock le nombre de deplacement à faire
///////// objet bloque deplacement au nord? /////////
        if (x > 0) {                                                 // si le stack n'est pas collé au bord nord
            move_range = Board[x - 1][y];                            // récupere le chiffre du plateau qui indique le mouvement au nord
            if (move_range <= (x * 2) - 1) {                         // si le mouvement est faisable sur le bord nord sans qu'il repasse par son x de depart (= mouvement impossible sinon)
                let j = x - 1;
                while (!this.is_there_token([j], [y]) && j >= 0) {   // tant qu'on trouve pas d'objet on avance vers le nord
                    j--;
                }
                if (j === -1) {                                      // si on a été jusqu'au bout (= sans rencontrer d'obstacle)
                    possible_move [i] = new Move(x, y, 0);           // alors on stock le mouvement possible
                    i++;
                }
            }
        }
///////// objet bloque deplacement au nord-est? /////////
        if (x > 0 && y < 12) {                                                                    // si le stack n'est pas sur le bord nord ou est
            move_range = Board[x - 1][y + 1];                                                     // récupere le chiffre du plateau qui indique le mouvement au nord-est
            let j = x - 1;
            let k = y + 1;
            let cpt = move_range;
            while (!this.is_there_token([j], [k]) && j >= 0 && k <= 12 && cpt > 0) {              // tant qu'on trouve pas d'objet on avance vers le nord-est
                j--;
                k++;
                cpt--;
            }
            if (cpt === 0) {                                                                      // si on a fini les déplacements sans taper un bord
                possible_move [i] = new Move(x, y, 1);                                            // alors on stock le mouvement possible
                i++;
            }
            else {
                if (j === -1 && k !== 13) {                                                       // si on tape le bord nord
                    j++;
                    k--;
                    cpt++;
                    while (!this.is_there_token([j], [k]) && k <= 12 && cpt > 0) {                // tant qu'on trouve pas d'objet on avance vers le sud-est
                        j++;
                        k++;
                        cpt--;
                    }
                    if (cpt === 0) {                                                              // si on a fini les déplacements sans taper le bord est
                        possible_move [i] = new Move(x, y, 1);                                    // alors on stock le mouvement possible
                        i++;
                    }
                    else {
                        if (k === 13) {                                                           // si on tape aussi le bord est
                            j--;
                            k--;
                            cpt++;
                            while (!this.is_there_token([j], [k]) && cpt > 0) {                   // tant qu'on trouve pas d'objet on avance vers le sud-ouest
                                j++;
                                k--;
                                cpt--;
                            }
                            if (cpt === 0) {                                                      // si on a pas trouvé d'objet
                                possible_move [i] = new Move(x, y, 1);                            // alors on stock le mouvement possible
                                i++;
                            }
                        }
                    }
                }
                else {
                    if (k === 13 && j !== -1) {                                                   // si on tape le bord est
                        j++;
                        k--;
                        cpt++;
                        while (!this.is_there_token([j], [k]) && j >= 0 && cpt > 0) {             // tant qu'on trouve pas d'objet on avance vers le nord-ouest
                            j--;
                            k--;
                            cpt--;
                        }
                        if (cpt === 0) {                                                          // si on a fini les déplacements sans taper le bord nord
                            possible_move [i] = new Move(x, y, 1);                                // alors on stock le mouvement possible
                            i++;
                        }
                        else {
                            if (j === -1) {                                                       // si on tape aussi le bord nord
                                j++;
                                k++;
                                cpt++;
                                while (!this.is_there_token([j], [k]) && cpt > 0) {               // tant qu'on trouve pas d'objet on avance vers le sud-ouest
                                    j++;
                                    k--;
                                    cpt--;
                                }
                                if (cpt === 0) {                                                  // si on a pas trouvé d'objet
                                    possible_move [i] = new Move(x, y, 1);                        // alors on stock le mouvement possible
                                    i++;
                                }
                            }
                        }
                    }
                    else {                                                                        // si on tape le coin nord-est
                        if (move_range <= (x * 2) - 1 && move_range <= ((12 - y) * 2) - 1) {      // si le jeton ne repasse pas par son point d'origine
                            possible_move [i] = new Move(x, y, 1);                                // alors on stock le mouvement possible
                            i++;
                        }
                    }
                }
            }
        }
///////// objet bloque deplacement à l'est /////////
        if (y < 12) {                                                 // si le stack n'est pas collé au bord est
            move_range = Board[x][y + 1];                             // récupere le chiffre du plateau qui indique le mouvement à l'est
            if (move_range <= ((12 - y) * 2) - 1) {                   // si le mouvement est faisable sur le bord nord sans qu'il repasse par son x de depart (= mouvement impossible sinon)
                let k = y + 1;
                while (!this.is_there_token([x], [k]) && k <= 12) {   // tant qu'on trouve pas d'objet on avance
                    k++;
                }
                if (k === 13) {                                       // si on a été jusqu'au bout (= on a pas rencontré d'obstacle)
                    possible_move [i] = new Move(x, y, 2);            // alors on stock le mouvement possible
                    i++;
                }
            }
        }
///////// objet bloque deplacement au sud-est? /////////
        if (x < 12 && y < 12) {                                                                       // si le stack n'est pas sur le bord sud ou est
            move_range = Board[x + 1][y + 1];                                                         // récupere le chiffre du plateau qui indique le mouvement au sud-est
            let j = x + 1;
            let k = y + 1;
            let cpt = move_range;
            while (!this.is_there_token([j], [k]) && j <= 12 && k <= 12 && cpt > 0) {                 // tant qu'on trouve pas d'objet on avance vers le sud-est
                j++;
                k++;
                cpt--;
            }
            if (cpt === 0) {                                                                          // si on a fini les déplacements sans taper un bord
                possible_move [i] = new Move(x, y, 3);                                                // alors on stock le mouvement possible
                i++;
            }
            else {
                if (j === 13 && k !== 13) {                                                           // si on tape le bord sud
                    j--;
                    k--;
                    cpt++;
                    while (!this.is_there_token([j], [k]) && k <= 12 && cpt > 0) {                    // tant qu'on trouve pas d'objet on avance vers le nord-est
                        j--;
                        k++;
                        cpt--;
                    }
                    if (cpt === 0) {                                                                  // si on a fini les déplacements sans taper le bord est
                        possible_move [i] = new Move(x, y, 3);                                        // alors on stock le mouvement possible
                        i++;
                    }
                    else {
                        if (k === 13) {                                                               // si on tape aussi le bord est
                            j++;
                            k--;
                            cpt++;
                            while (!this.is_there_token([j], [k]) && cpt > 0) {                       // tant qu'on trouve pas d'objet on avance vers le nord-ouest
                                j--;
                                k--;
                                cpt--;
                            }
                            if (cpt === 0) {                                                          // si on a pas trouvé d'objet
                                possible_move [i] = new Move(x, y, 3);                                // alors on stock le mouvement possible
                                i++;
                            }
                        }
                    }
                }
                else {
                    if (k === 13 && j !== 13) {                                                       // si on tape le bord est
                        j--;
                        k--;
                        cpt++;
                        while (!this.is_there_token([j], [k]) && j <= 12 && cpt > 0) {                // tant qu'on trouve pas d'objet on avance vers le sud-ouest
                            j++;
                            k--;
                            cpt--;
                        }
                        if (cpt === 0) {                                                              // si on a fini les déplacements sans taper le bord sud
                            possible_move [i] = new Move(x, y, 3);                                    // alors on stock le mouvement possible
                            i++;
                        }
                        else {
                            if (j === 13) {                                                           // si on tape aussi le bord sud
                                j--;
                                k++;
                                cpt++;
                                while (!this.is_there_token([j], [k]) && cpt > 0) {                   // tant qu'on trouve pas d'objet on avance vers le nord-ouest
                                    j--;
                                    k--;
                                    cpt--;
                                }
                                if (cpt === 0) {                                                      // si on a pas trouvé d'objet
                                    possible_move [i] = new Move(x, y, 3);                            // alors on stock le mouvement possible
                                    i++;
                                }
                            }
                        }
                    }
                    else
                    {                                                                                 // si on tape le coin sud-est
                        if (move_range <= ((12 - x) * 2) - 1 && move_range <= ((12 - y) * 2) - 1) {   // si le jeton ne repasse pas par son point d'origine
                            possible_move [i] = new Move(x, y, 3);                                    // alors on stock le mouvement possible
                            i++;
                        }
                    }
                }
            }
        }
///////// objet bloque deplacement au sud? /////////
        if (x<12) {                                              // si le stack n'est pas collé au bord sud
            move_range = Board[x+1][y];                          // récupere le chiffre du plateau qui indique le mouvement au sud
            if (move_range <= ((12-x)*2) - 1) {                  // si le mouvement est faisable sur le bord nord sans qu'il repasse par son x de depart (= mouvement impossible sinon)
                let j =x+1;
                while(!this.is_there_token([j],[y]) && j<=12){   // tant qu'on trouve pas d'objet on avance
                    j++;
                }
                if(j===13){                                      // si on a été jusqu'au bout (= on a pas rencontré d'obstacle)
                    possible_move [i] = new Move(x,y,4);         // alors on stock le mouvement possible
                    i++;
                }
            }
        }
///////// objet bloque deplacement au sud-ouest? /////////
        if (y > 0 && x < 12) {                                                                    // si le stack n'est pas sur le bord sud ou ouest
            move_range = Board[x + 1][y - 1];                                                     // récupere le chiffre du plateau qui indique le mouvement au sud-ouest
            let j = x + 1;
            let k = y - 1;
            let cpt = move_range;
            while (!this.is_there_token([j], [k]) && k >= 0 && j <= 12 && cpt > 0) {              // tant qu'on trouve pas d'objet on avance vers le sud-ouest
                k--;
                j++;
                cpt--;
            }
            if (cpt === 0) {                                                                      // si on a fini les déplacements sans taper un bord
                possible_move [i] = new Move(x, y, 5);                                            // alors on stock le mouvement possible
                i++;
            }
            else {
                if (k === -1 && j !== 13) {                                                       // si on tape le bord ouest
                    k++;
                    j--;
                    cpt++;
                    while (!this.is_there_token([j], [k]) && j <= 12 && cpt > 0) {                // tant qu'on trouve pas d'objet on avance vers le sud-est
                        k++;
                        j++;
                        cpt--;
                    }
                    if (cpt === 0) {                                                              // si on a fini les déplacements sans taper le bord sud
                        possible_move [i] = new Move(x, y, 5);                                    // alors on stock le mouvement possible
                        i++;
                    }
                    else {
                        if (j === 13) {                                                           // si on tape aussi le bord sud
                            k--;
                            j--;
                            cpt++;
                            while (!this.is_there_token([j], [k]) && cpt > 0) {                   // tant qu'on trouve pas d'objet on avance vers le nord-est
                                k++;
                                j--;
                                cpt--;
                            }
                            if (cpt === 0) {                                                      // si on a pas trouvé d'objet
                                possible_move [i] = new Move(x, y, 5);                            // alors on stock le mouvement possible
                                i++;
                            }
                        }
                    }
                }
                else {
                    if (j === 13 && k !== -1) {                                                   // si on tape le bord sud
                        k++;
                        j--;
                        cpt++;
                        while (!this.is_there_token([j], [k]) && k >= 0 && cpt > 0) {             // tant qu'on trouve pas d'objet on avance vers le nord-ouest
                            k--;
                            j--;
                            cpt--;
                        }
                        if (cpt === 0) {                                                          // si on a fini les déplacements sans taper le bord ouest
                            possible_move [i] = new Move(x, y, 5);                                // alors on stock le mouvement possible
                            i++;
                        }
                        else {
                            if (k === -1) {                                                       // si on tape aussi le bord ouest
                                k++;
                                j++;
                                cpt++;
                                while (!this.is_there_token([j], [k]) && cpt > 0) {               // tant qu'on trouve pas d'objet on avance vers le nord-est
                                    k++;
                                    j--;
                                    cpt--;
                                }
                                if (cpt === 0) {                                                  // si on a pas trouvé d'objet
                                    possible_move [i] = new Move(x, y, 5);                        // alors on stock le mouvement possible
                                    i++;
                                }
                            }
                        }
                    }
                    else {                                                                        // si on tape le coin sud-ouest
                        if (move_range <= (12 - x) * 2 - 1 && move_range <= (y * 2) - 1) {        // si le jeton ne repasse pas par son point d'origine
                            possible_move [i] = new Move(x, y, 5);                                // alors on stock le mouvement possible
                            i++;
                        }
                    }
                }
            }
        }
///////// objet bloque deplacement à l'ouest? /////////
        if (y>0) {                                              // si le stack n'est pas collé au bord ouest
            move_range = Board[x][y-1];                         // récupere le chiffre du plateau qui indique le mouvement au ouest
            if (move_range <= (y*2) - 1) {                      // si le mouvement est faisable sur le bord nord sans qu'il repasse par son x de depart (= mouvement impossible sinon)
                let k =y-1;
                while(!this.is_there_token([x],[k]) && k>=0){   // tant qu'on trouve pas d'objet on avance
                    k--;
                }
                if(k===-1){                                     // si on a été jusqu'au bout (= on a pas rencontré d'obstacle)
                    possible_move [i] = new Move(x,y,6);        // alors on stock le mouvement possible
                    i++;
                }
            }
        }
///////// objet bloque deplacement au nord-ouest? /////////
        if (x > 0 && y > 0) {                                                           // si le stack n'est pas sur le bord nord ou ouest
            move_range = Board[x - 1][y - 1];                                           // récupere le chiffre du plateau qui indique le mouvement au nord-ouest
            let j = x - 1;
            let k = y - 1;
            let cpt = move_range;
            while (!this.is_there_token([j], [k]) && j >= 0 && k >= 0 && cpt > 0) {     // tant qu'on trouve pas d'objet on avance vers le nord-ouest
                j--;
                k--;
                cpt--;
            }
            if (cpt === 0) {                                                            // si on a fini les déplacements sans taper un bord
                possible_move [i] = new Move(x, y, 7);                                  // alors on stock le mouvement possible
            }
            else {
                if (j === -1 && k !== -1) {                                             // si on tape le bord nord
                    j++;
                    k++;
                    cpt++;
                    while (!this.is_there_token([j], [k]) && k >= 0 && cpt > 0) {       // tant qu'on trouve pas d'objet on avance vers le sud-ouest
                        j++;
                        k--;
                        cpt--;
                    }
                    if (cpt === 0) {                                                    // si on a fini les déplacements sans taper le bord ouest
                        possible_move [i] = new Move(x, y, 7);                          // alors on stock le mouvement possible
                    }
                    else {
                        if (k === -1) {                                                 // si on tape aussi le bord ouest
                            j--;
                            k++;
                            cpt++;
                            while (!this.is_there_token([j], [k]) && cpt > 0) {         // tant qu'on trouve pas d'objet on avance vers le sud-est
                                j++;
                                k++;
                                cpt--;
                            }
                            if (cpt === 0) {                                            // si on a pas trouvé d'objet
                                possible_move [i] = new Move(x, y, 7);                  // alors on stock le mouvement possible
                            }
                        }
                    }
                }
                else {
                    if (k === -1 && j !== -1) {                                         // si on tape le bord ouest
                        j++;
                        k++;
                        cpt++;
                        while (!this.is_there_token([j], [k]) && j >= 0 && cpt > 0) {   // tant qu'on trouve pas d'objet on avance vers le nord-est
                            j--;
                            k++;
                            cpt--;
                        }
                        if (cpt === 0) {                                                // si on a fini les déplacements sans taper le bord nord
                            possible_move [i] = new Move(x, y, 7);                      // alors on stock le mouvement possible
                        }
                        else {
                            if (j === 13) {                                             // si on tape aussi le bord nord
                                j++;
                                k--;
                                cpt++;
                                while (!this.is_there_token([j], [k]) && cpt > 0) {     // tant qu'on trouve pas d'objet on avance vers le sud-est
                                    j++;
                                    k++;
                                    cpt--;
                                }
                                if (cpt === 0) {                                        // si on a pas trouvé d'objet
                                    possible_move [i] = new Move(x, y, 7);              // alors on stock le mouvement possible
                                }
                            }
                        }
                    }
                    else {                                                              // si on tape le coin nord-ouest
                        if (move_range <= (x * 2) - 1 && move_range <= (y * 2) - 1) {   // si le jeton ne repasse pas par son point d'origine
                            possible_move [i] = new Move(x, y, 7);                      // alors on stock le mouvement possible
                        }
                    }
                }
            }
        }
        return possible_move;
    }

    apply_moves(moves) {
        // TODO
        // Permet d'appliquer une liste de coups.
        // Le paramètre moves contient un tableau d'objets Move.
    }


    current_color() {
        return this._color;
    }


    is_finished() {
        if(this._timer === -1){                                      // si on a dépassé le nombre de tour max
            let total_point = 0;
            for(let cpt=this._token_won.length -1; cpt>=0; cpt--){
                total_point+=this._token_won [cpt];
            }
        }
    }

// TODO
    move(move) {// Permet d'appliquer un coup et met à jour l'état du jeu.
        let possible_move = this._get_possible_move_list(move.get_x(), move.get_y(), move.get_direction());
        for(let i=0; i<possible_move.length; i++){
            if(possible_move[i]===move){
                this._token_board[move.get_x()][move.get_y()] = 1;
                let cpt = 0;
                let x = move.get_x();
                let y = move.get_y();
                switch(move.get_direction()){
                    case 0:                                                                                                 // si deplacement au nord
                        this._token_board[Math.abs((Board[x-1][y])-x)][y]= this._color;
                        break;
                    case 1:                                                                                                 // si deplacement au nord-est
                        if(y+(Board[x-1][y+1])<=12) {
                            this._token_board[Math.abs((Board[x - 1][y]) - x)][y+(Board[x-1][y+1])] = this._color;
                            break;
                        }
                        else{
                         //   this._token_board[Math.abs((Board[x - 1][y]) - x)][] = this._color;
                            break;
                        }
                    case 2:                                                                                                     // si deplacement à l'est
                        if(y+(Board[x][y+1])<=12) {
                            this._token_board[Math.abs((Board[x - 1][y]) - x)][y+(Board[x][y+1])] = this._color;
                            break;
                        }
                        else{
                          //  this._token_board[Math.abs((Board[x - 1][y]) - x)][] = this._color;
                            break;
                        }
                    case 3:                                                                                                   // si deplacement au sud-est
                        if(y+(Board[x+1][y+1])<=12 && x+(Board[x+1][y+1])<=12) {

                   //         this._token_board[Math.abs((Board[x - 1][y]) - x)][y+(Board[x-1][y+1])] = this._color;
                            break;
                        }
                        else {
                            if (x + (Board[x + 1][y + 1]) <= 12) {
                   //             this._token_board[Math.abs((Board[x - 1][y]) - x)][] = this._color;
                                break;
                            }
                            else {
                                if (y + (Board[x + 1][y + 1]) <= 12) {
                    //                this._token_board[Math.abs((Board[x - 1][y]) - x)][y+(Board[x-1][y+1])] = this._color;
                                    break;
                                }
                                else{
                                    this._token_board[(Board[x + 1][y+1] + x)][y+(Board[x+1][y+1])] = this._color;
                                }
                            }
                        }
                    case 4:                                                                                                      // si deplacement au sud
                        if(y+(Board[x-1][y+1])<=12) {
                            this._token_board[(Board[x + 1][y]) + x][y] = this._color;
                            break;
                        }
                        else{
                       //     this._token_board[Math.abs((Board[x - 1][y]) - x)][] = this._color;
                            break;
                        }
                    case 5:                                                                                                         // si deplacement au sud-ouest
                       // TODO
                    case 6:                                                                                                     // si deplacement à l'ouest
                        this._token_board[x][Math.abs((Board[x][y-1]-y))]= this._color;
                        break;
                    case 7:                                                                                                      //si deplacement au nord-ouest
                        this._token_board[Math.abs(Board[x-1][y-1]-x)][Math.abs(Board[x-1][y-1]-y)] = this._color;
                        break;








                }







                break;
            }
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
/*  TODO
        if() {
            return this._color;
        }*/
    }
 }
export default Engine;