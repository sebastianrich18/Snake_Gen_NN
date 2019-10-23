var snakeWidth = 40;

class Snake {
    constructor(xOff, yOff, scale, brain) {
        if (brain && brain instanceof NeuralNetwork) {
            this.brain = brain;
        } else {
            this.brain = new NeuralNetwork(12, 10, 4);
        }
        this.xOff = xOff;
        this.yOff = yOff;
        this.scale = scale;
        this.width = snakeWidth * scale;
        this.tail = [createVector(this.x, this.y), createVector(this.x, this.y), createVector(this.x, this.y)];
        this.apple = new Apple(xOff, yOff, scale, this.tail);
        this.x = width / 2;
        this.y = height / 2;
        this.xVel = -this.width;
        this.yVel = 0;
        this.fit = 0;
        this.movesLeft = 150;
        this.gen = 0;
    }

    setDir(dir) {
        switch (dir) {
            case 0:
                if (this.yVel != this.width) {
                    this.xVel = 0;
                    this.yVel = -this.width;
                }
                break;
            case 1:
                if (this.yVel != -this.width) {
                    this.xVel = 0;
                    this.yVel = this.width;
                }
                break;

            case 2:
                if (this.xVel != -this.width) {
                    this.xVel = this.width;
                    this.yVel = 0;
                }
                break;

            case 3:
                if (this.xVel != this.width) {
                    this.xVel = -this.width;
                    this.yVel = 0;
                }
                break;
        }
    }

    draw() {

        if (AI && this.movesLeft <= 0) {
            this.restart();
        }

        fill(color(0));
        stroke(255);
        rect(this.xOff, this.yOff, width * this.scale, this.xOff + height * this.scale);

        fill(color(255))
        stroke(0)
        rect((this.x * this.scale) + this.xOff, (this.y * this.scale) + this.yOff, this.width, this.width)

        if (this.x < 0 || this.x >= width || this.y < 0 || this.y >= height) {
            //console.log('off screen');
            this.restart();
        }


        this.tail.forEach(t => {
            rect((t.x * this.scale) + this.xOff, (t.y * this.scale) + this.yOff, this.width, this.width)
        })

        if (AI) {
            let aDists = this.getAppleDist();
            let sDists = this.getSnakeDist();
            let wDists = this.getWallDist();
            let guess = this.brain.predict(aDists.concat(wDists.concat(sDists)));
            //console.log(guess)

            let maxNum = guess.reduce(function (a, b) {
                return Math.max(a, b);
            });
            //console.log(maxNum)

            let maxIndex = guess.indexOf(maxNum);
            //console.log(maxIndex + '\n')

            this.setDir(maxIndex);
        }

        this.x += this.xVel / this.scale;
        this.y += this.yVel / this.scale;

        if (this.x == this.apple.x && this.y == this.apple.y) {
            this.apple.hit(this);
            this.movesLeft += 80;
            this.fit += 50;
        }

        this.apple.draw();

        this.tail.forEach(t => {
            if (this.x == t.x && this.y == t.y) {
                this.restart();
            }
        })
        this.tail.shift();
        this.tail.push(createVector(this.x, this.y));

        this.movesLeft--;
        this.fit++;

        //this.setDir(random(['u', 'd', 'l', 'r']))
    }

    getWallDist() {
        return [(width - this.x) / width, this.x / width, this.y / height, (height - this.y) / height];
    }

    getSnakeDist() {
        let north = -1;
        let south = -1;
        let east = -1;
        let west = -1;
        for (let i = this.tail.length - 2; i > 0; i--) {
            if (this.x == this.tail[i].x && this.tail[i].y > this.y) {
                south = this.tail[i].y - this.y;
                break;
            }
        }
        for (let i = this.tail.length - 2; i > 0; i--) {
            if (this.x == this.tail[i].x && this.tail[i].y < this.y) {
                north = this.y - this.tail[i].y;
                break;
            }
        }
        for (let i = this.tail.length - 2; i > 0; i--) {
            if (this.y == this.tail[i].y && this.tail[i].x > this.x) {
                east = this.tail[i].x - this.x;
                break;
            }
        }
        for (let i = this.tail.length - 2; i > 0; i--) {
            if (this.y == this.tail[i].y && this.tail[i].x < this.x) {
                west = this.x - this.tail[i].x;
                break;
            }
        }
        return [north / height, south / height, east / width, west / width]
    }

    getAppleDist() {
        //stroke(0, 0, 255);
        //strokeWeight(2);
        let east;
        let west;
        let south;
        let north;
        let ne;
        let se;
        let sw;
        let nw;
        if (this.y == this.apple.y) {
            if (this.x < this.apple.x) {
                east = (this.apple.x - this.x) / width;
                west = -1
            } else {
                east = - 1;
                west = (this.x - this.apple.x) / width;
            }
        } else {
            east = -1;
            west = -1;
        }
        if (this.apple.x == this.x) {
            if (this.y < this.apple.y) {
                south = (this.apple.y - this.y) / height;
                north = -1;
            } else {
                south = -1;
                north = (this.y - this.apple.y) / height;

            }
        } else {
            south = -1;
            north = -1;
        }
        return [north, south, east, west];
    }

    findMostFit() {
        let bestFit = -1;
        let mostFitSnake;
        for (let i = 0; i < allSnakes.length; i++) {
            if (allSnakes[i].fit > bestFit) {
                bestFit = allSnakes[i].fit;
                mostFitSnake = allSnakes[i];
            }
        }
        return mostFitSnake;


    }

    restart() {
        //console.log("fit = " + this.fit + '\n')

        prev[0].push(this.fit);
        prev[1].push(this.gen);
        this.movesLeft = 150;
        function mutate(x) {
            if (random(1) < 0.1) {
                let offset = randomGaussian() * 0.5;
                let newx = x + offset;
                return newx;
            } else {
                return x;
            }
        }
        this.brain = this.findMostFit().brain.copy();
        this.brain.mutate(mutate);

        this.gen++;
        this.fit = 0;
        this.x = width / 2;
        this.y = height / 2;
        this.tail = [createVector(this.x, this.y)]
        this.apple.placeApple()
    }

}