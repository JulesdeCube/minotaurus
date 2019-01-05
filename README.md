<!---
This file is part of the minotaurus game (https://github.com/JulesdeCube/minotaurus).
Copyright (c) 2019 Jules Lefebvre.
 

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
--->
# Minotaurus
developed for the ISN project of 2018/2019

utilised Language:
- javascript
- HTML
- CSS
## The game
shoot from the eponime game of [LEGO®](https://shop.lego.com/fr-FR/Minotaurus-3841?p=384).

Minautorus is a board game turn per turn. Wich is played with a dice.

the aim of the game is to be the first th have take all is heros in the center of the bord inthis color case without be eated by the minotaurus . [see the rule](/RULE.md)
<p align="center">
  <img alt="VS Code in action" width="750" src="https://sh-s7-live-s.legocdn.com/is/image/LEGO/3841?fit=constrain,1&wid=1000&hei=2000&fmt=png">
</p>

## Getting Started

### Prerequisites
- server
  - [Node.js](https://nodejs.org/en/)
  - [NPM](https://www.npmjs.com/)
- client
  - recent internet broswer

### Installing
**With git**
```
cd where/you/want/install/the/server
git clone git@github.com:JulesdeCube/minotaurus.git
npm install
```
**With out git**

1. download [this ZIP](https://github.com/JulesdeCube/minotaurus/archive/master.zip).
2. Unzip it, and move the folder where you want to install your server.
3. Open the terminal:
   - **Windows** press ``Windows + R`` , enter '``Cmd``' and presse `Enter`
   - **MAC** press `` ⌘+Espace`` , enter '``terminal``' and presse `Enter`
   - **Linux** press `` Ctrl+Alt+T``
4. type
```
cd path/where/you/have/unzip/the/ZIP
npm install
```

## Usation
### lauch the server
1. Open the terminal:
    - **Windows** press ``Windows + R`` , enter '``Cmd``' and presse `Enter`
    - **MAC** press `` ⌘+Espace`` , enter '``terminal``' and presse `Enter`
    - **Linux** press `` Ctrl+Alt+T``
2. type
```
cd path/where/you/have/intall/the/server
node app.js
```

### conected to the server
**ONLINE**

in the config of your internet box redirecting a port to your pc in the port 2000
get your ip with [mon-ip.com](http://www.mon-ip.com/adresse-ip-locale.php) and give it to your fiend with adding ':'+the port who have open  


**in LAN**

get your local ip with [mon-ip.com](http://www.mon-ip.com/adresse-ip-locale.php) and give it to your friends with add '`:2000`'

## contribution
Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Jules Lefebvre** - *Initial work* - [JulesDeCube](https://github.com/JulesDeCube)

See also the list of [contributors](https://github.com/JulesDeCube/Minotaurus/contributors) who participated in this project.

## License

This project is licensed under the **GNU GENERAL PUBLIC LICENSE** - see the [LICENSE.md](LICENSE.md) file for details

## Version