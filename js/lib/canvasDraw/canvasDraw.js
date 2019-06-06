/**
 * @file library to draw the game
 * @author Jules Lefebvre <juleslefebvre.10@outlook.fr>
 * @copyright Minotaurus Project 2019
 */

/**
 * @class
 * @author Jules Lefebvre <juleslefebvre.10@outlook.fr>
 * @classdesc create an canvas and draw
 */
class CanvasDraw {
  
  /**
   * @constructor
   * @author Jules Lefebvre <juleslefebvre.10@outlook.fr>
   * @param {HTMLElement} parent parrent of the canvas
   */
  constructor(parent) {
    this.canvas = document.createElement('canvas');
    if (parent !== undefined) {
      parent.appendChild(this.canvas);
    }

    this.canvas.addEventListener('mousemove',(evt) => {
      let rect = this.canvas.getBoundingClientRect();
      this.mouse.x = evt.clientX - rect.left
      this.mouse.y = evt.clientY - rect.top
    });

    this.canvas.addEventListener('mousedown',(evt) => {
      this.mouse.press = true;
    });
    this.canvas.addEventListener('mouseup',(evt) => {
      this.mouse.press = false;
    });
    
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas(0, 0);


    this.setup = () => {};
    this.draw = () => {};
    

    this.drawCaller = undefined;
    
    this.mouse = {
      x: 0,
      y: 0,
      press: false
    }
    
    this.config = {
      frameRate: 60,
      text: {
        style: 'normal',
        variant: 'normal',
        weight: 'normal',
        stretch: 'normal',
        size: 10,
        lineHeight: 1,
        family: 'sans-serif'
      }
    }
 
    
  }
  
  /**
   * @method
   * @author Jules Lefebvre <juleslefebvre.10@outlook.fr>
   * @description begin the draw
   * @emits setup() emit firt to setup it
   * @emits draws() emit every frame rate
   */
  start(){
    this.setup();
    this.frameRate(this.config.frameRate);
  }

  /**
   * @method
   * @author Jules Lefebvre <juleslefebvre.10@outlook.fr>
   * @description change the frame rate of the viewport
   * 
   * @param {number} fps the number of frame per second
   */
  frameRate(fps) {
    this.config.frameRate = fps;
    clearInterval(this.drawCaller);

    this.drawCaller = setInterval(() => {
      this.draw()
    }, 1000 / this.config.frameRate);
  }

  /**
   * @method
   * @author Lefebvre <juleslefebvre.10@outlook.fr>
   * @description change the dimension of the viewport
   * @param {number} width the width of the viewport
   * @param {number} height the height of the viewport
   */
  resizeCanvas(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }



  noFill() {
    this.ctx.fillStyle = '#0000';
  }
  
  fill(v1, v2, v3, v4) {
    this.ctx.fillStyle = this.colorToStr(v1, v2, v3, v4);
  }



  noStroke() {
    this.ctx.strokeStyle = '#0000';
  }
  
  stroke(v1, v2, v3, v4) {
    this.ctx.strokeStyle = this.colorToStr(v1, v2, v3, v4);
  }
  
  strokeWeight(w) {
    this.ctx.lineWidth = w;
  }

  strokeCap(cap) {
    this.ctx.lineCap = cap;
  }

  strokeJoin(join) {
    this.ctx.lineJoin = join;
  }



  noShadow(){
    this.ctx.shadowColor = '#0000';
  }

  shadow(x, y, blur, v1, v2, v3, v4){
    this.ctx.shadowOffsetX = x;
    this.ctx.shadowOffsetY = y;
    this.ctx.shadowBlur = blur;
    this.ctx.shadowColor = this.colorToStr(v1, v2, v3, v4);
  }

  

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  rect(x, y, w, h, radius) {
    
    if (typeof radius === 'number') {
      radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else if(typeof radius === 'object'){
      var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
      for (var side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side];
      }
    }
    
    if (typeof radius === 'object') {
      // draw with round
      this.ctx.beginPath();
      this.ctx.moveTo(x + radius.tl, y);
      this.ctx.lineTo(x + w - radius.tr, y);
      this.ctx.quadraticCurveTo(x + w, y, x + w, y + radius.tr);
      this.ctx.lineTo(x + w, y + h - radius.br);
      this.ctx.quadraticCurveTo(x + w, y + h, x + w - radius.br, y + h);
      this.ctx.lineTo(x + radius.bl, y + h);
      this.ctx.quadraticCurveTo(x, y + h, x, y + h - radius.bl);
      this.ctx.lineTo(x, y + radius.tl);
      this.ctx.quadraticCurveTo(x, y, x + radius.tl, y);
      this.ctx.closePath();
      
      // fill and stroke
      this.ctx.fill();
      this.ctx.stroke();
    } else {
      // draw without round
      this.ctx.fillRect(x, y, w, h);
      this.ctx.strokeRect(x, y, w, h);
    }
    
  }

  circle(x, y, d) {
    // draw
    this.ctx.beginPath();
    this.ctx.arc(x, y, d, 0, Math.PI * 2, true);
    
    // fill and stroke
    this.ctx.fill();
    this.ctx.stroke();
  }



  textAlign(align){
    this.ctx.textAlign = align;
  }
  
  textStyle(style) {
    this.config.text.style = style;
    this.updateFont();
  }

  textVariant(variant) {
    this.config.text.variant = variant;
    this.updateFont();
  }

  textWeight(weight) {
    this.config.text.weight = weight;
    this.updateFont();
  }

  textStretch(stretch) {
    this.config.text.stretch = stretch;
    this.updateFont();
  }

  textSize(size) {
    this.config.text.size = size;
    this.updateFont();
  }

  textlineHeight(lineHeight) {
    this.config.text.lineHeight = lineHeight;
    this.updateFont();
  }

  textFamily(family) {
    this.config.text.family = family;
    this.updateFont();
  }

  textWidth(text) {
    return this.ctx.measureText(text).width;
  }

  text(text, x, y) {
    // draw
    this.ctx.fillText(text, x, y);
    this.ctx.strokeText(text, x, y);
  }

  updateFont(){
    let textConf = this.config.text;
    this.ctx.font = textConf.style + ' ' + textConf.variant + ' ' + textConf.weight + ' ' + textConf.stretch + ' ' + textConf.size + 'px/' + textConf.lineHeight + ' ' + textConf.family;
  }



  colorToStr(v1, v2, v3, v4) {
    let r = 0;
    let g = 0;
    let b = 0;
    let a = 255;
    
    if (       typeof v1 === 'string') {// stroke(value)
      return v1;
    } else if (typeof v1 === 'object') {// TODO stroke({r, v, b , [a]})
      
    } else {// stroke(v1, v2, v3, [alpha]), stroke(gray, [alpha]), stroke(values)
      if (     typeof v1 === 'number') {// stroke(v1, v2, v3, [alpha]), stroke(gray, [alpha])
        if (typeof v3 === 'number') {// stroke(v1, v2, v3, [alpha]),
          r = v1;
          g = v2;
          b = v3;
          a = v4/100;
        } else {// stroke(gray, [alpha])
          r = v1;
          g = v1;
          b = v1;
          a = v2/100;
        }
      } else if (   Array.isArray(v1)) {// stroke(values)
        r = v1[0];
        g = v1[1];
        b = v1[2];
        a = v1[3]/100;
      }
      if (typeof a === 'number') {// alpha
        return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
      } else {// no alpha
        return 'rgb(' + r + ',' + g + ',' + b + ')';
      }
    }
  }

}