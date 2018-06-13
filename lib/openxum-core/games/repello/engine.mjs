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
        this._player = Color;                                // numéro du joueur
        this._stack = this.init_stack(this._type);           // nombre de jetons dans le stack du joueur (depend du nombre de joueurs)
        this._stack_position = [];                           // position du stack du joueur [x,y]
        this._timer = this._stack;                           // temps de la partie en nombre de tours = max stack du joueur
        this._token_board = [
            [0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,1,0,0,0,0,3,0,0,0,0,1,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0],                     // initialise le plateau servant à savoir la position des jetons et leur type
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


 /*   init_token_board(){                                      // initialise le plateau
        let board= ;
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
*/

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


    remove_token_won(i){                                     // enlève un jeton au joueur (cas ou son stack est hors jeu)
        this._token_won.splice(i, 1);
    }


    is_there_token(x,y){                                     // vérifie la présence d'un jeton
        return this._token_board[x][y] !== 0;
    }


    check_conflict(x,y) {                                    // vérifie la présence d'une zone de conflit
        let conflict = [];                                   // stock les conflits
        let i = 0;                                           // sert à savoir la place dans le tableau
        if(this.is_there_token([x-1],[y])) {                    // jeton au nord?
            conflict[i] = new Conflict(x, y, 0);
            i++;
        }
        if(this.is_there_token([x-1],[y+1])) {               // jeton au nord-est?
            conflict[i] = new Conflict(x, y, 1);
            i++;
        }
        if(this.is_there_token([x],[y+1])) {                 // jeton à l'est?
            conflict[i] = new Conflict(x, y, 2);
            i++;
        }
        if(this.is_there_token([x+1],[y+1])) {               // jeton au sud-est?
            conflict[i] = new Conflict(x, y, 3);
            i++;
        }
        if(this.is_there_token([x+1],[y])) {                 // jeton au sud?
            conflict[i] = new Conflict(x, y, 4);
            i++;
        }
        if(this.is_there_token([x+1],[y-1])) {               // jeton au sud-ouest?
            conflict[i] = new Conflict(x, y, 5);
            i++;
        }
        if(this.is_there_token([x],[y-1])) {                 // jeton à l'ouest?
            conflict[i] = new Conflict(x, y, 6);
            i++;
        }
        if(this.is_there_token([x-1],[y-1])){                // jeton au nord-ouest?
            conflict[i] = new Conflict(x,y, 7);
        }
        return conflict;
    }


    get_possible_move_list(x,y) {                                                 // liste tout les mouvements jouables
        let possible_move = [];                                                   // liste qui stock les mouvements jouables
        let i = 0;                                                                // sert à savoir la place dans le tableau
        let move_range;                                                           // stock le nombre de deplacement à faire
        // objet bloque deplacement au nord?
        if (x>0) {                                                                // si le stack n'est pas collé au bord
            move_range = Board[x-1][y];                                           // récupere le chiffre du plateau qui indique le mouvement au nord
            if (move_range <= (x*2) - 1) {                                        // si le mouvement est faisable sur le bord nord sans qu'il repasse par son x de depart (= mouvement impossible sinon)
                let j =x-1;
                while(!this.is_there_token([j],[y]) && j>=0){                     // tant qu'on trouve pas d'objet on avance
                    j--;
                }
                if(j===-1){                                                       // si on a été jusqu'au bout (= on a pas rencontré d'obstacle)
                    possible_move [i] = new Move(x,y,0);                          // alors on stock le mouvement possible
                    i++;
                }
            }
        }
        // objet bloque deplacement au nord-est?
        if (x>0&&y<12) {                                                          // si le stack n'est pas sur le bord nord ou est
            move_range = Board[x-1][y+1];                                         // récupere le chiffre du plateau qui indique le mouvement au nord
            if (x-move_range >= 0 && y+move_range<=12 ) {                         // si le mouvement se fait sans rebond
                let j =x-1;
                let k = y+1;
                let cpt = move_range;
                while(!this.is_there_token([j],[k])&&cpt>0){                      // tant qu'on trouve pas d'objet on avance
                    j--;
                    k++;
                    cpt--;
                }
                if(cpt===0){                                                      // si on a été jusqu'au bout (= on a pas rencontré d'obstacle)
                    possible_move [i] = new Move(x,y,1);                          // alors on stock le mouvement possible
                    i++;
                }
            }
            else{                                                                 // si le stack doit rebondir sur le bord
                if(x<12-y){                                                       // cas où le rebond se fait sur le bord nord
//TODO






                }
                else{
                    if(12-y<x){                                                   // cas où le rebond se fait sur le bord est
                        if(x-move_range >= 0) {                                   // un seul rebond
                            let j =x-1;
                            let k = y+1;
                            let cpt = move_range;
                            for(k; k<=12; k++){                          // jusqu'au premier rebond
                                if(this.is_there_token([j],[k])){
                                   break;
                                }
                                j--;
                                cpt--;
                            }
                            if(k===13){                                         // si on a été taper le mur sans rien rencontrer

                            }





                        }
                        else{                                                     // cas de double rebond




                        }

//TODO et gerer double rebond


                    }
                    else{                                                         // cas où le rebond se fait dans le coin
                        if (move_range <= (x*2) - 1 && move_range >= (12-y)*2+1){ // si le mouvement est faisable sans que le stack repasse par son x,y de depart (= mouvement impossible sinon)
                            let j =x-1;
                            let k = y+1;
                            while(!this.is_there_token([j],[k]) && j>=0){         // tant qu'on trouve pas d'objet on avance
                                j--;
                                k++;
                                cpt--;
                            }
                            if(j===-1){                                           // si on a été jusqu'au bout (= on a pas rencontré d'obstacle)
                                possible_move [i] = new Move(x,y,1);              // alors on stock le mouvement possible
                                i++;
                            }
                        }
                    }
                }
                let j =x-1;
                let k = y+1;
                while(!this.is_there_token([j],[k])){                             // tant qu'on trouve pas d'objet on avance
                    j--;
                    k++;
                }
                if(j===-1){                                                       // si on a été jusqu'au bout (= on a pas rencontré d'obstacle)
                    possible_move [i] = new Move(x,y,1);                          // alors on stock le mouvement possible
                    i++;
                }
            }
            return possible_move;
        }





 /*       if(this.is_there_token([x-1],[y])) {
            conflict[i] = new Conflict(x, y, 0);
            i++;
        }
        if(this.is_there_token([x-1],[y+1])) {
            conflict[i] = new Conflict(x, y, 1);
            i++;
        }
        if(this.is_there_token([x],[y+1])) {                  // objet bloque deplacement à l'est?
            conflict[i] = new Conflict(x, y, 2);
            i++;
        }
        if(this.is_there_token([x+1],[y+1])) {                // objet bloque deplacement au sud-est?
            conflict[i] = new Conflict(x, y, 3);
            i++;
        }
        if(this.is_there_token([x+1],[y])) {                  // objet bloque deplacement au sud?
            conflict[i] = new Conflict(x, y, 4);
            i++;
        }
        if(this.is_there_token([x+1],[y-1])) {                // objet bloque deplacement au sud-ouest?
            conflict[i] = new Conflict(x, y, 5);
            i++;
        }
        if(this.is_there_token([x],[y-1])) {                  // objet bloque deplacement à l'ouest?
            conflict[i] = new Conflict(x, y, 6);
            i++;
        }
        if(this.is_there_token([x-1],[y-1])                   // objet bloque deplacement au nord-ouest?
            conflict[i] = new Conflict(x,y, 7);

        return possible_move;*/
    }


    apply_moves(moves) {
        // Permet d'appliquer une liste de coups.
        // Le paramètre moves contient un tableau d'objets Move.
    }


    current_color() {
        // Retourne le joueur en train de jouer.
    }


    is_finished() {
        // Retourne si la partie est terminée ou non.
    }


    move(move) {
        // Permet d'appliquer un coup et mets à jour l'état du jeu.
    }

    parse(str) {
        // Modifier l'état du jeu en fonction de l'état passé sous forme d'une
        // chaîne de caractères
    }

    to_string() {
        // Construit une représentation sous forme d'une chaîne de caractères
        // de l'état du jeu
    }

    winner_is() {
        // Indique le joueur qui a gagné.
    }
}
export default Engine;