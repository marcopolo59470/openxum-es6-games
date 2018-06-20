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

let movable = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
];

let nb = 2; //nb joueurs bientot useless
let cpt=0; //bientot useless

let cpt_r = 15;let cpt_b = 17; //nombre de coup des joueurs (15) , 17 pour le bleu car les 2 premiers coups ne comptes pas et servent a décrémenter cpt_b

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

    _on_click(x, y) {

        console.log(this._manager.get_current_color());

    if (nb > 0) {
        /*
         let pt = this._compute_coordinates(x, y);

         if (coul[x][y]==='v' && this._engine.check_conflict(y,x) == 0 && this._engine.get_board_object(y,x) != -1){
         console.log(this._manager.get_current_color());
         let clr = this._manager.get_current_color();
         this._draw_piece(pt[0], pt[1], clr);

         let Color = this._manager.get_color_name();
         this._engine.set_stack_position(y, x,Color);

         this._draw_reserve(Color);

         nb--;
         console.log(y+" "+x);
         }
         }


         if (nb<=0 && cpt==1) {
         cpt++;
         this._draw_selected_piece();

         */
        let clr = this._manager.get_current_color();
        let pt = this._compute_coordinates(x, y);
        this._draw_piece(pt[0], pt[1], clr);

        console.log(this._engine.get_stack_position());

        let a =this._engine.get_stack_position();

        if (a[1] === -1) {

            this._move=new Move(y, x, -1);
            this.move(this._move, this._manager.get_current_color());
            console.log(this._engine._token_board);

            this._draw_state();
        }

        if (cpt >=1){
            this._draw_selected_number();
        }

        nb--;
        cpt++;


    }
        /*if(nb<=0 ){
            switch (movable[x][y]) {
                case -1 :
                    cpt++;
                    this._engine.set_token_position(y+1,x,1);
                    this._engine.set_stack_position(y,x);

                    //console.log(this._engine._token_board);

                    this._refresh();
                    this.move(new Move(x,y,0),this._manager.get_current_color());
                    break;
                case 1 :
                    cpt++;
                    this._engine.set_token_position(y+1,x-1,1);
                    this._engine.set_stack_position(y,x);
                    this._refresh();
                    this.move(new Move(x,y,1),this._manager.get_current_color());
                    break;
                case 2 :
                    cpt++;
                    this._refresh();
                    this.move(new Move(x,y,2),this._manager.get_current_color());
                    break;
                case 3 :
                    cpt++;
                    this._refresh();
                    this.move(new Move(x,y,3),this._manager.get_current_color());
                    break;
                case 4 :
                    cpt++;
                    this._refresh();
                    this.move(new Move(x,y,4),this._manager.get_current_color());
                    break;
                case 5 :
                    cpt++;
                    this._refresh();
                    this.move(new Move(x,y,5),this._manager.get_current_color());
                    break;
                case 6 :
                    cpt++;
                    this._refresh();
                    this.move(new Move(x,y,6),this._manager.get_current_color());
                    break;
                case 7 :
                    cpt++;
                    this._refresh();
                    this.move(new Move(x,y,7),this._manager.get_current_color());
                    break;
                case 0:
                    cpt++;
                    this.move(new Move(x,y,-1),this._manager.get_current_color());
            }
        }*/

        console.log('nb: '+nb);
        if(nb<=0 ){
            switch (movable[x][y]) {
                case -1 :
                    cpt++;


                    //console.log(this._engine._token_board);

                    this._refresh();
                    this._move=new Move(y, x, 0);
                    this.move(this._move, this._manager.get_current_color());
                    break;
                case 1 :
                    cpt++;

                    this._refresh();
                    this._move=new Move(y, x, 1);
                    this.move(this._move, this._manager.get_current_color());
                    break;
                case 2 :
                    cpt++;
                    this._refresh();
                    this._move=new Move(y, x, 2);
                    this.move(this._move, this._manager.get_current_color());
                    break;
                case 3 :
                    cpt++;
                    this._refresh();
                    this._move=new Move(y, x, 3);
                    this.move(this._move, this._manager.get_current_color());
                    break;
                case 4 :
                    cpt++;
                    this._refresh();
                    this._move=new Move(y, x, 4);
                    this.move(this._move, this._manager.get_current_color());
                    break;
                case 5 :
                    cpt++;
                    this._refresh();
                    this._move=new Move(y, x, 5);
                    this.move(this._move, this._manager.get_current_color());
                    break;
                case 6 :
                    cpt++;
                    this._refresh();
                    this._move=new Move(y, x, 6);
                    this.move(this._move, this._manager.get_current_color());
                    break;
                case 7 :
                    cpt++;
                    this._refresh();
                    this._move=new Move(y, x, 7);
                    this.move(this._move, this._manager.get_current_color());
                    break;
                case 0:
                    cpt++;
                    this._move=new Move(y, x, -1);
                    this.move(this._move, this._manager.get_current_color());
            }
        }
        cpt++;
    }

    _refresh(){
        this._reset_movable();
        this.draw();
        this._draw_token();
        this._draw_reserve(this._manager.get_current_color());
        this._draw_selected_number();
    }

    _reset_movable(){
        for (let i=0;i<13;i++){
            for (let j=0;j<13;j++){
                movable[i][j]=0;
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
                if (this._engine.get_board_object(x, y) === 1) {
                    let pt = this._compute_coordinates(x, y);
                    this._draw_piece( pt[1],pt[0], 'bronze');
                }
                if (this._engine.get_board_object(x, y) === 3) {
                    let pt = this._compute_coordinates(x, y);
                    this._draw_piece( pt[1],pt[0], 'argent');
                }
                if (this._engine.get_board_object(x, y) === 5) {
                    let pt = this._compute_coordinates(x, y);
                    this._draw_piece( pt[1], pt[0],'or');
                }
                if (this._engine.get_board_object(x, y) === -1) {
                    let pt = this._compute_coordinates(x, y);
                    this._draw_piece( pt[1],pt[0], 'RED');
                }
                if (this._engine.get_board_object(x, y) === -2) {
                    let pt = this._compute_coordinates(x, y);
                    this._draw_piece( pt[1], pt[0],'BLUE');
                }
            }
        }
    }

    _compute_coordinates(x, y) {
        return [this._offsetX + x * this._deltaX + (this._deltaX / 2) - 1, this._offsetY + y * this._deltaY + (this._deltaY / 2) - 1];
    }

    _draw_token(){
        for (let i = 0; i < 13; ++i) {
            for (let j = 0; j < 13; ++j) {
                if (this._engine.get_board_object(j,i)==-1){
                    let pt = this._compute_coordinates(i, j);
                    this._draw_piece(pt[0],pt[1],'RED');
                }
                if (this._engine.get_board_object(j,i)==-2){
                    let pt = this._compute_coordinates(i, j);
                    this._draw_piece(pt[0],pt[1],'BLUE');
                }
            }
        }

    }

    _draw_piece(x, y ,piece) {
        this._context.font = "16px sans-serif";
        this._context.textBaseline = "top";
        let radius = (this._deltaX / 2.3);

        switch (piece){
            case 'bronze':
                this._context.strokeStyle = "#bc3e00";
                this._context.fillStyle = "#bc3e00";
                break;
            case 'argent':
                this._context.strokeStyle = "#9c9594";
                this._context.fillStyle = "#9c9594";
                break;
            case 'or':
                this._context.strokeStyle = "#f2ec06";
                this._context.fillStyle = "#F2EC06";
                break;
            case 'RED':
                this._context.strokeStyle = "#ff0300";
                this._context.fillStyle = "#FF0300";
                break;
            case 'BLUE':
                this._context.strokeStyle = "#0023ff";
                this._context.fillStyle = "#0023FF";
                break;
        }

        /* dessin du jeton) */
        this._context.lineWidth = 1;
        this._context.beginPath();
        this._context.arc(x, y, radius, 0.0, 2 * Math.PI);
        this._context.closePath();
        this._context.fill();
        this._context.stroke();

        /* le stack du joueur a un trou au milieu */
        if(piece == 'BLUE' || piece == 'RED'){
            this._context.strokeStyle = "#F0F0F0";
            this._context.fillStyle = "#F0F0F0";
            this._context.lineWidth = 1;
            this._context.beginPath();
            this._context.arc(x, y, radius/2.2, 0.0, 2 * Math.PI);
            this._context.closePath();
            this._context.fill();
            this._context.stroke();
        }
    }

    _draw_selected_number() {
        let b = this._engine.get_stack_position();
        //console.log(this._engine.get_stack_position());
        let y = b[0];let x = b [1];
        let a = this._engine.get_possible_move_list(y, x);
        //console.log(this._engine.get_possible_move_list(y, x));

        for (let i = 0; i < a.length; i++) {
            console.log("a de"+ i+ " "+a[i]);
            console.log("a de " + i +" get directon "+a[i].get_direction());
                switch (a[i].get_direction()) {

                    case 0 :
                        this._draw_move(x, y - 1);
                        movable[x][y-1]=-1;
                        console.log("a de"+ i+ " "+a[i]);
                        break;
                    case 1 :
                        this._draw_move(x + 1, y - 1);
                        movable[x+1][y-1]=1;
                        break;
                    case 2 :
                        this._draw_move(x + 1, y);
                        movable[x+1][y]=2;
                        break;
                    case 3 :
                        this._draw_move(x + 1, y + 1);
                        movable[x+1][y+1]=3;
                        break;
                    case 4 :
                        this._draw_move(x, y + 1);
                        movable[x][y+1]=4;
                        break;
                    case 5 :
                        this._draw_move(x - 1, y + 1);
                        movable[x-1][y+1]=5;
                        break;
                    case 6 :
                        this._draw_move(x - 1, y);
                        movable[x-1][y]=6;
                        break;
                    case 7 :
                        this._draw_move(x - 1, y - 1);
                        movable[x-1][y-1]=7;
                        break;

                }

        }//console.log(this._draw_move);

    }

    _draw_move(x,y){
        console.log("x: "+x+" y: "+y);
        if (this._manager.get_current_color() === -2) {
            this._context.fillStyle = "#0023FF";
        } else{
            this._context.fillStyle = "#FF0300";
        }
        this._context.font = "16px sans-serif";
        this._context.textBaseline = "top";
        let color_possible_move = Board[y][x];
        console.log(Board[y][x]);

        this._context.fillText(color_possible_move.toString(), this._offsetX + (x + 0.38) * this._deltaX, this._offsetY + (y + 0.25) * this._deltaY);

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
                    this._context.fillStyle = "#56ff60"; // si zone verte
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
        for (let i = 0; i < 13; ++i) {
            for (let j = 0; j < 13; ++j) {
                this._context.fillStyle = "#000000";
                let number = Board[j][i];
                this._context.fillText(number.toString(), this._offsetX + (i + 0.38) * this._deltaX, this._offsetY + (j + 0.25) * this._deltaY);
            }
        }
    }

    _draw_reserve (Color){
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

        if (cpt_b <16 ) {
            switch (Color) {
                case 'RED' :
                    cpt_r--;
                    break;
                case 'BLUE' :
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