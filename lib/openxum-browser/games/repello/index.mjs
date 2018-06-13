"use strict";


let Repello = {};

import Gui from './gui.mjs';
import Manager from './manager.mjs';

Repello = Object.assign(Repello, Gui);
Repello = Object.assign(Repello, Manager);

export default Repello;