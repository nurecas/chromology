var pal0 = [ '#FFC300', '#920B3F', '#C8013A', '#DAf8A5', '#591846' ];
var pal1 = [ '#1464B0', '#FFC603', '#FB5002', '#CB0C04', '#222222' ];
var pal2 = [ '#F263CC', '#21038C', '#033E8C', '#049DBF', '#F2EA79' ];
var pal3 = [ '#00163D', '#17B900', '#DBDE00', '#000000', '#00A68D' ];
var pal4 = [ '#DD983F', '#D96704', '#8C2703', '#734440', '#400101' ];
var palette=[];
var currPal;
var blobs = [], collection = [];
var force1 = 11, force2 = 3;
var angle1 = -0.5, angle2 = 0.628;
var size1 = 20, size2 = 155;
var scaling = 0.97;
var particleCount = 1000;
var pLocX=0, pLocY=0;
var flip=true;
var mode=0;
var pLocDoOnce=true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  //Modes 0:Fountain, 1:Swirl, 2:Angles , 3:Blocks 
  let h=hour();
  h=6;
  if (h>=0&&h<6) {
    mode=3;
  } else  if (h>=6&&h<12) {
    mode=0;
  } else  if (h>=12&&h<18) {
    mode=1;
  } else {
    mode=2;
  }
  palette=[pal0, pal1, pal2, pal3, pal4];
  let d=day();
  d=7;
  if (d>=0&&d<7) {
    currPal=palette[0];
  } else  if (d>=7&&d<14) {
    currPal=palette[1];
  } else  if (d>=14&&d<21) {
    currPal=palette[2];
  } else  if (d>=21&&d<28) {
    currPal=palette[3];
  } else {
    currPal=palette[4];
  }
  background(255);
}

function draw() {
  update();
  for (var i = blobs.length - 1; i >= 0; i--) {
    blobs[i].show();
  }
}

class Blob {
  constructor(x, y, size) {
    this.active = true;
    this.size = size || 10;
    this.angle = random( TWO_PI );
    this.color = '#fff';
    this.pos = createVector(x || 0.0, y || 0.0);
    this.ppos = createVector(x || 0.0, y || 0.0);
    this.velocity = createVector(0.0, 0.0);
  }
  paint() {
    this.ppos=p5.Vector.sub(this.pos, this.velocity);
    this.pos.add(this.velocity);
    this.size *= scaling;
    if (mode==3) {
      this.angle += angle2 ;
      if (flip) {
        this.velocity.x +=  0.35;
      } else {
        this.velocity.x +=  -0.35;
      }
      this.active = this.size >60.5;
    } else if (mode==2) {
      this.velocity.mult(0.9);
      this.angle += random( angle1, angle2 )*0.15;
      this.velocity.x += sin( this.angle ) * 0.5;
      this.velocity.y += cos( this.angle ) * 0.5;
      this.active = this.size >25;
    } else if (mode==1) {
      this.velocity.mult(0.9);
      this.angle += angle2;
      this.velocity.x += sin( this.angle ) * 5.5;
      this.velocity.y += cos( this.angle ) * 5.5;
      this.active = this.size >15;
    } else {
      this.velocity.mult(0.9);
      this.angle += random( angle1, angle2 )*0.15;
      this.velocity.x =0;
      this.velocity.y += 0.5;
      this.active = this.size >5;
    }
  }
  show() {
    noFill();
    noStroke();
    if (mode==3) {
      fill( this.color );
      stroke(random(currPal));
      rectMode(CENTER);
      rect(this.pos.x, this.pos.y, 100, 100);
    } else if (mode==2) {
      stroke( this.color );
      strokeWeight(3);
      line(this.pos.x, this.pos.y, pLocX, pLocY);
    } else if (mode==1) {
      stroke( this.color );
      strokeWeight(this.size);
      line(this.pos.x, this.pos.y, this.ppos.x, this.ppos.y);
    } else {
      fill( this.color );
      ellipse(this.pos.x, this.pos.y, this.size, this.size);
    }
    pLocX=this.pos.x;
    pLocY=this.pos.y;
  }
}

function startDraw(x, y) {
  var blob, angle, force;
  if ( blobs.length >= particleCount ) {
    collection.push( particles.shift() );
  }
  blob = new Blob(mouseX, mouseY, random(size1, size2));
  blob.color = random( currPal );
  angle = random( TWO_PI );
  force = random( force1, force2 );
  blob.velocity.x = sin( angle ) * force;
  blob.velocity.y = cos( angle ) * force;
  blobs.push( blob );
}
function update() {
  var i, blob;
  for ( i = blobs.length - 1; i >= 0; i-- ) {
    blob = blobs[i];
    if ( blob.active ) {
      blob.paint();
    } else {
      collection.push( blobs.splice( i, 1 )[0] );
    }
  }
}

function painted() {
  var blob, max, i;
  max = random( 1, 4 );
  for ( i = 0; i < max; i++ ) {
    startDraw( mouseX, mouseY );
  }
}


function mouseClicked() {
  if (pLocDoOnce) {
    pLocX=mouseX;
    pLocY=mouseY;
    pLocDoOnce=false;
  }
  painted();
}

function mouseReleased() {
  flip=!flip;
  pLocDoOnce=true;
}

function touchMoved() {
  if (pLocDoOnce) {
    pLocX=mouseX;
    pLocY=mouseY;
    pLocDoOnce=false;
  }
  painted();
}

function saveFile() {
    save('Chromology.jpg');
}

function keyPressed() {
    if (keyCode === ENTER) {
        saveFile();
    }
}