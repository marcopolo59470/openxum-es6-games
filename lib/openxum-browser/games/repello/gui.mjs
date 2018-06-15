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

let nb = 2;

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
        this._context.fillStyle = "#4C3629";
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
        console.log('----------------------');console.log('-- x:'+x+' --');console.log('-- y:'+y+' --');

    if (nb > 0){
        let pt = this._compute_coordinates(x, y);
        console.log(this._engine.check_conflict(x,y)); //log conflits ?

        if (coul[x][y]==='v' && this._engine.check_conflict(x,y) == 0){
            this._draw_piece(pt[0], pt[1], 'noir');
            let Clr = this._manager.get_current_color();
            console.log("nouveau joueur :"+Clr);
            let Color = this._manager.get_color_name();
            console.log("nom joueur :"+Color);
            this._engine._change_color();
            this._engine.set_stack_position(x, y,Color);
            //this._draw_piece(pt[0], pt[1], Clr);
            nb--;

            console.log('joueur restant: '+nb);
        }

    }


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
            /*    if (coul[x][y] !== 'b' && coul[x][y] !== 'v' ) {
                    let pt = this._compute_coordinates(x, y);
                    this._draw_piece(pt[0], pt[1], coul[x][y]);*/
                if ( this._engine.get_board_position(x,y) === 1 ){
                    let pt = this._compute_coordinates(x, y);
                    this._draw_piece(pt[0], pt[1], 'bronze');
                }
                if ( this._engine.get_board_position(x,y) === 3 ){
                    let pt = this._compute_coordinates(x, y);
                    this._draw_piece(pt[0], pt[1], 'argent');
                }
                if ( this._engine.get_board_position(x,y) === 5 ){
                    let pt = this._compute_coordinates(x, y);
                    this._draw_piece(pt[0], pt[1], 'or');
                }

/*
                if (coul[x][y] === 'v' ) {
                    let pt = this._compute_coordinates(x, y);
                    this._draw_piece(pt[0], pt[1], coul[x][y]);
                }*/
            }
        }
/*
        if (this._selected_piece !== undefined) {
            this._draw_selected_piece();
        }*/
    }

    _compute_coordinates(x, y) {
        return [this._offsetX + x * this._deltaX + (this._deltaX / 2) - 1, this._offsetY + y * this._deltaY + (this._deltaY / 2) - 1];
    }

    _draw_piece(x, y ,piece) {

        let radius = (this._deltaX / 2.3);
        let radius2 = (this._deltaX / 6.9);

        if (piece === 'bronze'){
            this._context.strokeStyle = "#bc3e00";
            this._context.fillStyle = "#bc3e00";
        }

        if (piece === 'argent'){
            this._context.strokeStyle = "#9c9594";
            this._context.fillStyle = "#9c9594";
        }

        if (piece === 'or'){
            this._context.strokeStyle = "#f2ec06";
            this._context.fillStyle = "#F2EC06";
        }
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
        /*
        if (token.color() === Repello.Color.PLAYER_1) {
            this._context.strokeStyle = "#303030";
            this._context.fillStyle = "#303030";
        }
        else {
            this._context.strokeStyle = "#F0F0F0";
            this._context.fillStyle = "#F0F0F0";
        }*/

        this._context.lineWidth = 1;
        this._context.beginPath();
        this._context.arc(x, y, radius, 0.0, 2 * Math.PI);
        this._context.closePath();
        this._context.fill();
        this._context.stroke();
/*
        switch (couleur){
            case 'm':
                this._context.strokeStyle = "#ff7d00";
                this._context.fillStyle = "#fe7400";
                break;
            case 'a':
                this._context.strokeStyle = "#cabcb8";
                this._context.fillStyle = "#cabcb8";
                break;
            case 'o':
                this._context.strokeStyle = "#ffe000";
                this._context.fillStyle = "#ffe000";
                break;
        }
*/

        this._context.lineWidth = 1;
        this._context.beginPath();
        this._context.arc(x, y, radius, 0.0, 2 * Math.PI);
        this._context.closePath();
        this._context.fill();
        this._context.stroke();

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
        let x = this._selected_piece.coordinates().x();
        let y = this._selected_piece.coordinates().y();
        let possible_moves = this._engine._get_possible_move_list(this._selected_piece);
        let pt = this._compute_coordinates(x, y);
        let radius = (this._deltaX / 2.3);

        this._context.lineWidth = 4;
        this._context.strokeStyle = "#d8370f";
        this._context.beginPath();
        this._context.arc(pt[0], pt[1], radius, 0.0, 2 * Math.PI);
        this._context.closePath();
        this._context.stroke();

        this._context.fillStyle = "#d8370f";
        radius = (this._deltaX / 10);

        for(let i = 0; i < possible_moves.length; i++) {
            let move = possible_moves[i];
            pt = this._compute_coordinates(move.to().x(), move.to().y());

            this._context.beginPath();
            this._context.arc(pt[0], pt[1], radius, 0.0, 2 * Math.PI);
            this._context.closePath();
            this._context.fill();
        }
    }

    _draw_grid() {
        let i, j;
        this._context.lineWidth = 1;
        this._context.strokeStyle = "#000000";
        this._context.fillStyle = "#ffffff";
        this._context.font = "16px sans-serif";
        this._context.textBaseline = "top";
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


                if (coul[i][j+1] !== 'b' && j !==12) // zone de couleur (verte ou bronze ou argent ou or
                 {
                    this._context.fillStyle = "#0AD03F"; // si zone verte
                    if (coul[i][j+1] === 'm') {this._context.fillStyle = "#704400";} // bronze
                    if (coul[i][j+1] === 'a') {this._context.fillStyle = "#565655";} // argent
                    if (coul[i][j+1] === 'o') {this._context.fillStyle = "#857b16";} // or
                    this._context.beginPath();
                    this._context.closePath();
                    this._context.stroke();
                } else {
                    this._context.fillStyle = "#ffffff"; // sinon zone blanche
                }







            }
        }

        for (i = 0; i < 13; ++i) {
            for (j = 0; j < 13; ++j) {
                this._context.fillStyle = "#000000";
                let a=Board[j][i];
                this._context.fillText(a.toString(), this._offsetX + (i+0.38) * this._deltaX, this._offsetY + (j+0.25) * this._deltaY);
            }
        }
    }




    _round_rect(x, y, width, height, radius, fill, stroke) {
        this._context.clearRect(x,y, width, height);
       /* if (typeof stroke === "undefined") {
            stroke = true;
        }
        if (typeof radius === "undefined") {
            radius = 5;
        }*/
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
        /*if (stroke) {
            this._context.stroke();
        }*/
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

