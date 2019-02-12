/**
 * @file app.js
 * @author Jules Lefebvre <juleslefebvre.10@outlook.fr>
 * @date 2019/01/06
 * @project ninotaurus (https://github.com/JulesdeCube/ninotaurus).
 * @copyright Copyright (c) 2019 Jules Lefebvre.
 * 
 * @license GNU-GPL
 *  This file is part of ninotaurus (https://github.com/JulesdeCube/ninotaurus).
 *  Copyright (c) 2019 Jules Lefebvre.
 *  ninotaurus is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *  
 *  You should have received a copy of the GNU General Public License
 *  along with ninotaurus.  If not, see <https://www.gnu.org/licenses/>.
 */

const express = require('express');
const http = require('http');

const app = express();
const serv = http.Server(app);

const serverPort = 8080;

app.use('/', express.static(__dirname + '/client'));

serv.listen(serverPort, () => {
    console.log('Server started on port: ' + serverPort);
});
