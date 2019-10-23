class Apple {
    constructor(xOff, yOff, scale, tail) {
        this.xOff = xOff;
        this.yOff = yOff;
        this.scale = scale;
        this.width = snakeWidth * scale;
        this.tail = tail;
        this.placeApple();
    }

    draw() {
        stroke(0);
        fill(color(255, 0, 0));
        rect((this.x * this.scale) + this.xOff, (this.y * this.scale) + this.yOff, this.width, this.width);
    }

    placeApple() {
        let row = floor(width / snakeWidth);
        let col = floor(height / snakeWidth);
        while (true) {
            this.x = floor(random(row)) * snakeWidth; //TODO move away from edges??
            this.y = floor(random(col)) * snakeWidth;
            let notColiding = this.tail.every(t => { return this.x != t.x && this.y != t.y })
            if (notColiding) {
                break;
            }

            //console.log('Apple placed at ' + this.x + ', ' + this.y)
        }
    }

    hit(s) {
        //console.log('got apple')
        this.placeApple();
        for (let i = 0; i < 3; i++) {
            s.tail.unshift(createVector(s.tail[s.tail.length - 1].x, s.tail[s.tail.length - 1].y)); // adds 3 vectors of last element in tail to start of tail
        }
    }
}