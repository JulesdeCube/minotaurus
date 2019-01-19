<!--
@file README.md
@author Jules Lefebvre <juleslefebvre.10@outlook.fr>
@date 2019/01/06
@project minotaurus (https://github.com/JulesdeCube/minotaurus).
@copyright Copyright (c) 2019 Jules Lefebvre.

@license GNU-GPL
 This file is part of minotaurus (https://github.com/JulesdeCube/minotaurus).
 Copyright (c) 2019 Jules Lefebvre.
 minotaurus is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
 
 You should have received a copy of the GNU General Public License
 along with minotaurus.  If not, see <https://www.gnu.org/licenses/>.
-->

# Minotaurus
developed for the ISN project of 2018/2019

Languages used :
- javascript
- HTML
- CSS
## The game
base on [LEGO®](https://shop.lego.com/fr-FR/Minotaurus-3841?p=384)'s eponime game.

Minotaurus is turn per turn board game. Wich is played with a die.dessing for 2 up to 4 players

Each player has 3 heroes. they have to bring their heroes to the center of the labyrinth, but beware the Monotaurus will do anything to stop them.

**[see the rule for more detail](doc/RULE.md)**
<p align="center">
  <img width="750" src="https://sh-s7-live-s.legocdn.com/is/image/LEGO/3841?fit=constrain,1&wid=1000&hei=2000&fmt=png">
</p>

## Getting Started

### Prerequisites
- server
  - [Node.js](https://nodejs.org/en/)
  - [NPM](https://www.npmjs.com/)
- client
  - recent internet browser

### Installing
**With git**
```
cd where/you/want/install/the/server
git clone git@github.com:JulesdeCube/minotaurus.git
npm install
```
**Without git**

1. download [this ZIP](https://github.com/JulesdeCube/minotaurus/archive/master.zip).
2. Unzip it, and move the folder where you want to install your server.
3. Open the terminal:
   - **Windows** press ``Windows + R`` , enter '``Cmd``' and press `Enter`
   - **MAC** press `` ⌘+Espace`` , enter '``terminal``' and press `Enter`
   - **Linux** press `` Ctrl+Alt+T``
4. type
```
cd path/where/you/have/unzip/the/ZIP
npm install
```

## guide line
### launch the server
1. Open the terminal:
    - **Windows** press ``Windows + R`` , enter '``Cmd``' and press `Enter`
    - **MAC** press `` ⌘+Espace`` , enter '``terminal``' and press `Enter`
    - **Linux** press `` Ctrl+Alt+T``
2. type
```
cd path/where/you/have/intall/the/server
node app.js
```

### conected to the server
**ONLINE**

in the config of your internet box redirect a port to your pc in the port 2000 get your ip with [mon-ip.com](http://www.mon-ip.com/adresse-ip-locale.php) and give it to your friend with adding '`:the port who have opened`'


**in LAN**

get your local ip with [mon-ip.com](http://www.mon-ip.com/adresse-ip-locale.php) and give it to your friends with add '`:2000`'

## contribution
Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

* **Jules Lefebvre** - *Initial work* - [JulesDeCube](https://github.com/JulesDeCube)

See also the list of [contributors](https://github.com/JulesDeCube/Minotaurus/contributors) who participated in this project.

## License

This project is licensed under the **GNU GENERAL PUBLIC LICENSE** - see the [LICENSE.md](LICENSE.md) file for details


## Version

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags) and see the [CHANGELOG.md](CHANGELOG.md)