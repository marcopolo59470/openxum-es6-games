"use strict";

import OpenXum from '../../openxum/gui.mjs';
import Repello from '../../../openxum-core/games/repello/index.mjs';
import Move from '../../../openxum-core/games/repello/move.mjs';
import Board from '../../../openxum-core/games/repello/board.mjs';
import Engine from '../../../openxum-core/games/repello/engine.mjs';

const coul = [
    ['b','b','b','b','b','b','b','b','b','b','b','b','b'],
    ['b','m','b','b','b','b','a','b','b','b','b','m','b'],
    ['b','b','b','b','b','b','b','b','b','b','b','b','b'],
    ['b','b','b','v','v','v','v','v','v','v','b','b','b'],
    ['b','b','b','v','b','b','b','b','b','v','b','b','b'],
    ['b','b','b','v','b','b','b','b','b','v','b','b','b'],
    ['b','a','b','v','b','b','o','b','b','v','b','a','b'],
    ['b','b','b','v','b','b','b','b','b','v','b','b','b'],
    ['b','b','b','v','b','b','b','b','b','v','b','b','b'],
    ['b','b','b','v','v','v','v','v','v','v','b','b','b'],
    ['b','b','b','b','b','b','b','b','b','b','b','b','b'],
    ['b','m','b','b','b','b','a','b','b','b','b','m','b'],
    ['b','b','b','b','b','b','b','b','b','b','b','b','b']
];

let nb = 2;let cpt=0;

let cpt_r = 15;let cpt_b = 18; //temp

class Gui extends OpenXum.Gui {
    constructor(c, e, l, g) {
        super(c, e, l, g);
        this._deltaX = 0;
        this._deltaY = 0;
        this._offsetX = 0;
        this._offsetY = 0;

        this._move = undefined;
        this._selected_piece = undefined;
    }

    // public methods
    draw() {
        this._context.lineWidth = 1;

        // background
        this._context.fillStyle = "#000000";
        this._round_rect(0, 0, this._canvas.width, this._canvas.height, 17, true, false);

        this._draw_grid();
        this._draw_state();


    }

    get_move() {
        return this._move;
    }

    is_animate() {
        return false;
    }

    is_remote() {
        return false;
    }

    move(move, color) {
        this._manager.play();
        // TODO !!!!!
    }

    unselect() {
        this._selected_piece = undefined;
        this.draw();
    }

    set_canvas(c) {
        super.set_canvas(c);
        this._canvas.addEventListener("click", (e) => { let pos = this._get_click_position(e); if(pos.x >= 0 && pos.x < 13 && pos.y >= 0 && pos.y < 13) this._on_click(pos.x, pos.y); });

        this._deltaX = (this._canvas.width * 0.95 - 40) / 13;
        this._deltaY = (this._canvas.height * 0.95 - 40) / 13;
        this._offsetX = this._canvas.width / 2 - this._deltaX * 6.5;
        this._offsetY = this._canvas.height / 2 - this._deltaY * 6.5;

        this.draw();
    }

    // private methods
    _on_click(x, y) {
     /*   if (!this._engine.is_finished()) {
            if (this._engine._board[x][y] !== undefined && this._engine._board[x][y].color() === this._engine.current_color()) {
                this._selected_piece = this._engine._board[x][y];
            }
            else {
                if (this._selected_piece !== undefined && this._engine._verify_moving(this._selected_piece, x, y)) {
                    this._move = new Move(this._selected_piece.clone(), new Coordinates(x, y));

                    this._animate_move();
                }

                this.unselect();
            }

            this.draw();
        }*/


        /* 1er tour : placer stack des joueurs */
    if (nb > 0){
        let pt = this._compute_coordinates(x, y);

        if (coul[x][y]==='v' && this._engine.check_conflict(x,y) == 0 && this._engine.get_board_position(x,y) != -2){ //changer -2 et -1 dans color
            this._draw_piece(pt[0], pt[1], 'noir');
            let Clr = this._manager.get_current_color();

            let Color = this._manager.get_color_name();


            this._engine.set_stack_position(y, x,Color);
            this._engine.change_color();

            this._draw_reserve(Color);

            nb--;
            console.log(y+" "+x);

   /*         let a = this._engine.get_possible_move_list(y ,x);


            for (let i =0;i<=a.length;i++) {
                console.log("ah " + a[i].get_direction());
                console.log(a[i].get_direction() == 0);


                switch (a[i].get_direction()){
                    case 0 :
                        this._draw_move(x,y-1);
                        break;
                    case 1 :
                        this._draw_move(x+1,y-1);
                        break;
                    case 2 :
                        this._draw_move(x+1,y);
                        break;
                    case 3 :
                        this._draw_move(x+1,y+1);
                        break;
                    case 4 :
                        this._draw_move(x,y+1);
                        break;
                    case 5 :
                        this._draw_move(x-1,y+1);
                        break;
                    case 6 :
                        this._draw_move(x-1,y);
                        break;
                    case 7 :
                        this._draw_move(x-1,y-1);
                        break;
                }
            }*/


            }



        }
        if (nb<=0 && cpt%2==1){
            this._draw_selected_piece();}
        cpt++;


    }

    _animate(val, deplacement) {
        let from = this._move.from();
        let to = this._move.to();

        let ptF = this._compute_coordinates(from.x(), from.y());
        let ptT = this._compute_coordinates(to.x(), to.y());

        let linearSpeed = 30;
        let newX = ptF[0];
        let newY = ptF[1];
        let continueAnimate = true;

        switch(deplacement) {
            case 0:
                newX = ptF[0] + val;
                continueAnimate = newX <= ptT[0];
                break;

            case 1:
                newX = ptF[0] - val;
                continueAnimate = newX >= ptT[0];
                break;

            case 2:
                newY = ptF[1] + val;
                continueAnimate = newY <= ptT[1];
                break;

            case 3:
                newY = ptF[1] - val;
                continueAnimate = newY >= ptT[1];
                break;
        }

        if (continueAnimate) {
            this.draw();
            this._draw_piece(newX, newY, this._move.piece());
            let that = this;
            setTimeout(function() {
                that._animate(val + 6, deplacement);
            }, 10);

        }
        else {
            this.draw();
            this._draw_piece(ptT[0], ptT[1], this._move.piece());
            let that = this;
            setTimeout(function() {
                that._manager.play();
            }, 50);

        }
    }

    _animate_move() {

        //Remove temporary the piece from the board to animate
        this._engine._board[this._selected_piece.coordinates().x()][this._selected_piece.coordinates().y()] = undefined;

        let that = this;
        let deplacement = -1;

        let from = this._move.from();
        let to = this._move.to();

        if (from.x() < to.x()) deplacement = 0;
        if (from.x() > to.x()) deplacement = 1;
        if (from.y() < to.y()) deplacement = 2;
        if (from.y() > to.y()) deplacement = 3;

        setTimeout(function() {
            that._animate(2, deplacement);
        }, 50);
    }

    _draw_state() {
        for (let y = 0; y < 13; y++) {
            for (let x = 0; x < 13; x++) {
                if (this._engine.get_board_position(x, y) === 1) {
                    let pt = this._compute_coordinates(x, y);
                    this._draw_piece(pt[0], pt[1], 'bronze');
                }
                if (this._engine.get_board_position(x, y) === 3) {
                    let pt = this._compute_coordinates(x, y);
                    this._draw_piece(pt[0], pt[1], 'argent');
                }
                if (this._engine.get_board_position(x, y) === 5) {
                    let pt = this._compute_coordinates(x, y);
                    this._draw_piece(pt[0], pt[1], 'or');
                }
            }
        }
    }

    _compute_coordinates(x, y) {
        return [this._offsetX + x * this._deltaX + (this._deltaX / 2) - 1, this._offsetY + y * this._deltaY + (this._deltaY / 2) - 1];
    }

    _draw_piece(x, y ,piece) {

        this._context.font = "16px sans-serif";
        this._context.textBaseline = "top";

        let radius = (this._deltaX / 2.3);
        let radius2 = (this._deltaX / 5);

        /* jeton bronze 1 point*/
        if (piece === 'bronze'){
            this._context.strokeStyle = "#bc3e00";
            this._context.fillStyle = "#bc3e00";
        }

        /* jeton argent 3 points */
        if (piece === 'argent'){
            this._context.strokeStyle = "#9c9594";
            this._context.fillStyle = "#9c9594";
        }

        /* jeton or 5 points */
        if (piece === 'or'){
            this._context.strokeStyle = "#f2ec06";
            this._context.fillStyle = "#F2EC06";
        }

        /* jeton des joueurs */
        if(piece === 'noir'){
            this._context.strokeStyle = "#000000";
            this._context.fillStyle = "#000000";


            if (this._manager.get_current_color() === 'BLUE') {

                this._context.strokeStyle = "#ff0300";
                this._context.fillStyle = "#FF0300";


            }else{
                this._context.strokeStyle = "#0023ff";
                this._context.fillStyle = "#0023FF";
            }
        }



        /* dessin du jeton) */
        this._context.lineWidth = 1;
        this._context.beginPath();
        this._context.arc(x, y, radius, 0.0, 2 * Math.PI);
        this._context.closePath();
        this._context.fill();
        this._context.stroke();

        /* le stack du joueur a un trou au milieu */
        if(piece === 'noir'){
            this._context.strokeStyle = "#F0F0F0";
            this._context.fillStyle = "#F0F0F0";

            this._context.lineWidth = 1;
            this._context.beginPath();
            this._context.arc(x, y, radius2, 0.0, 2 * Math.PI);
            this._context.closePath();
            this._context.fill();
            this._context.stroke();
        }
    }

    _draw_selected_piece() {

        if (this._manager.get_current_color() == "BLUE") {

            let b = this._engine.get_stack_position();
            console.log(b[0]);
            let y = b[0];let x = b [1];
            let a = this._engine.get_possible_move_list(y, x);
            for (let i = 0; i <= a.length; i++) {
                console.log("ah " + a[i].get_direction());
                console.log(a[i].get_direction() == 0);


                switch (a[i].get_direction()) {
                    case 0 :
                        this._draw_move(x, y - 1);

                        break;
                    case 1 :
                        this._draw_move(x + 1, y - 1);
                        break;
                    case 2 :
                        this._draw_move(x + 1, y);
                        break;
                    case 3 :
                        this._draw_move(x + 1, y + 1);
                        break;
                    case 4 :
                        this._draw_move(x, y + 1);
                        break;
                    case 5 :
                        this._draw_move(x - 1, y + 1);
                        break;
                    case 6 :
                        this._draw_move(x - 1, y);
                        break;
                    case 7 :
                        this._draw_move(x - 1, y - 1);
                        break;
                }

            }
        }
    }

/* TODO envoi position */

    _draw_move(x,y){

        if (this._manager.get_current_color() == 'RED') {
            this._context.fillStyle = "#0023FF";
        }
        else{
            this._context.fillStyle = "#FF0300";
        }
        this._context.font = "16px sans-serif";
        this._context.textBaseline = "top";

        let a = Board[y][x];
        this._context.fillText(a.toString(), this._offsetX + (x + 0.38) * this._deltaX, this._offsetY + (y + 0.25) * this._deltaY);

    }

    _draw_grid() {
        let i, j;
        this._context.lineWidth = 1;
        this._context.strokeStyle = "#000000";
        this._context.fillStyle = "#ffffff";
        this._context.font = "16px sans-serif";
        this._context.textBaseline = "top";

        /* background des cases (blanche neutre , zone verte , spawn des jetons marrons argents et or) */
        for (i = 0; i < 13; ++i) {
            for (j = 0; j < 13; ++j) {
                this._context.beginPath();
                this._context.moveTo(this._offsetX + i * this._deltaX, this._offsetY + j * this._deltaY);
                this._context.lineTo(this._offsetX + (i + 1) * this._deltaX - 2, this._offsetY + j * this._deltaY);
                this._context.lineTo(this._offsetX + (i + 1) * this._deltaX - 2, this._offsetY + (j + 1) * this._deltaY - 2);
                this._context.lineTo(this._offsetX + i * this._deltaX, this._offsetY + (j + 1) * this._deltaY - 2);
                this._context.moveTo(this._offsetX + i * this._deltaX, this._offsetY + j * this._deltaY);
                this._context.closePath();
                this._context.fill();

                if (coul[i][j + 1] !== 'b' && j !== 12) // zone de couleur (verte ou bronze ou argent ou or
                {
                    this._context.fillStyle = "#0AD03F"; // si zone verte
                    if (coul[i][j + 1] === 'm') {
                        this._context.fillStyle = "#704400";
                    } // bronze
                    if (coul[i][j + 1] === 'a') {
                        this._context.fillStyle = "#565655";
                    } // argent
                    if (coul[i][j + 1] === 'o') {
                        this._context.fillStyle = "#857b16";
                    } // or
                    this._context.beginPath();
                    this._context.closePath();
                    this._context.stroke();
                } else {
                    this._context.fillStyle = "#ffffff"; // sinon zone blanche
                }
            }
        }

        this._draw_number ();
        this._draw_reserve ();
    }

    _draw_number(){
        /* remplir les cases avec les chiffres */
        for (let i = 0; i < 13; ++i) {
            for (let j = 0; j < 13; ++j) {
                this._context.fillStyle = "#000000";
                let a = Board[j][i];
                this._context.fillText(a.toString(), this._offsetX + (i + 0.38) * this._deltaX, this._offsetY + (j + 0.25) * this._deltaY);
            }
        }
    }

    _draw_reserve (Color){
        // barre rouge et nb tour rouge restant
        this._context.fillStyle = "#FF0300";
        let i = 0;let j = -0.9;let k = 13;
        this._context.beginPath();
        this._context.moveTo(this._offsetX + i * this._deltaX, this._offsetY + j * this._deltaY);
        this._context.lineTo(this._offsetX + k * this._deltaX - 2, this._offsetY + j * this._deltaY);
        this._context.lineTo(this._offsetX + k * this._deltaX - 2, this._offsetY + (j + 0.92) * this._deltaY - 2);
        this._context.lineTo(this._offsetX + i * this._deltaX, this._offsetY + (j + 0.92) * this._deltaY - 2);
        this._context.moveTo(this._offsetX + i * this._deltaX, this._offsetY + j * this._deltaY);
        this._context.closePath();
        this._context.fill();

        // barre bleue
        this._context.fillStyle = "#0023ff";
        i = 0; j = 13; k = 13;
        this._context.beginPath();
        this._context.moveTo(this._offsetX + i * this._deltaX, this._offsetY + j * this._deltaY);
        this._context.lineTo(this._offsetX + k * this._deltaX - 2, this._offsetY + j * this._deltaY);
        this._context.lineTo(this._offsetX + k * this._deltaX - 2, this._offsetY + (j + 0.92) * this._deltaY - 2);
        this._context.lineTo(this._offsetX + i * this._deltaX, this._offsetY + (j + 0.92) * this._deltaY - 2);
        this._context.moveTo(this._offsetX + i * this._deltaX, this._offsetY + j * this._deltaY);
        this._context.closePath();
        this._context.fill();

        this._context.fillStyle = "#00ff25";

        if (cpt_b <17 ) {
            switch (Color) {
                case -1 :
                    cpt_r--;
                    break;
                case -2 :
                    cpt_b--;
                    break;
                default :

            }

            this._context.fillStyle = "#000000";
            for (let i = 0; i < cpt_r; ++i) {
                this._context.beginPath();
                this._context.rect(60 + i * 10, 10, 5, 15);
                this._context.closePath();
                this._context.stroke();
                this._context.fill();
            }
            for (let i = 0; i < cpt_b; ++i) {
                this._context.beginPath();
                this._context.rect(60 + i * 10, this._offsetX + 13.2 * this._deltaX, 5, 15);
                this._context.closePath();
                this._context.stroke();
                this._context.fill();
            }
        }else{
            this._context.fillText('attente de placement', this._offsetX + 0.20 * this._deltaX, this._offsetY + (-0.75) * this._deltaY);
            this._context.fillText('attente de placement', this._offsetX + 0.20 * this._deltaX, this._offsetY + (13.15) * this._deltaY);
            cpt_b--;
        }
    }



    _round_rect(x, y, width, height, radius, fill, stroke) {

        this._context.clearRect(x,y, width, height);

        this._context.beginPath();
        this._context.moveTo(x + radius, y);
        this._context.lineTo(x + width - radius, y);
        this._context.quadraticCurveTo(x + width, y, x + width, y + radius);
        this._context.lineTo(x + width, y + height - radius);
        this._context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this._context.lineTo(x + radius, y + height);
        this._context.quadraticCurveTo(x, y + height, x, y + height - radius);
        this._context.lineTo(x, y + radius);
        this._context.quadraticCurveTo(x, y, x + radius, y);
        this._context.closePath();

        if (fill) {
            this._context.fill();
        }
    }

    _get_click_position(e) {
        let rect = this._canvas.getBoundingClientRect();
        let x = (e.clientX - rect.left) * this._scaleX - this._offsetX;
        let y = (e.clientY - rect.top) * this._scaleY - this._offsetY;
        return { x: Math.floor(x / this._deltaX), y: Math.floor(y / this._deltaX) };
    }
}

export default {
    Gui: Gui
};

