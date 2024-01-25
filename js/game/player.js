class Player extends GameObject {
    width = 25;
    height = 25;
    speed = 200;
    color = 'lightblue';
    mass = 0;
    direction = Vec2.zero;

    Update() {
        // TODO do poprawa movementu na skos
        this.direction = Vec2.zero;
        // top
        if (keys[87] || keys[38]) this.direction.y += -1;
        // down
        if (keys[83] || keys[40]) this.direction.y += 1;
        // left
        if (keys[65] || keys[37]) this.direction.x += -1;
        // right
        if (keys[68] || keys[39]) this.direction.x += 1;
    }

    FixedUpdate() {
        // Move player in direction
        this.translate(this.direction.normalized.multiply(this.speed * fixedTime));

        this.CheckBorderCollision();

        ForEachColliedGameObjectByType(this, Point, function callback(collided) {
            DeleteGameObject(collided);
            gameScore += 1;
        });
        ForEachColliedGameObjectByType(this, Booster, function callback(collided) {
            DeleteGameObject(collided);
        });
    }

    Draw() {
        DrawRect(this.position, this.width, this.height, { color: this.color, shadow: {
            color: "lightblue",
            x: 0,
            y: 0,
            blur: 10
        } });
    }
    
    CheckBorderCollision() {
        if (this.position.x < 0) this.position.x = 0;
        if (this.position.y < 0) this.position.y = 0;
        if (this.position.x + this.width > canvas.width) this.position.x = canvas.width - this.width
        if (this.position.y + this.height > canvas.height) this.position.y = canvas.height - this.height
        if (Vec2.center.distance(Player.ref.position) >= SPAWN_RADIUS - Math.sin(timestamp / 1000 / 3) * 10 - 25){
            Player.ref.position = Vec2.center;
            gameScore = 0;
        }
    }
    CheckPointCollect(p) {
        if (this.position.x < p.position.x + p.width &&
            this.position.x + this.width > p.position.x &&
            this.position.y < p.position.y + p.height &&
            this.position.y + this.height > p.position.y) {
            DeleteGameObject(p);
            document.getElementById("pkt").innerHTML = `${gameScore} pkt!`
            // AddGameObject(new Point());
            // AddGameObject(new Player());

            //this.position = Vec2.center
        }

    }
    CheckBoosterCollect(Booster) {
        if (this.position.x < Booster.position.x + Booster.width &&
            this.position.x + this.width > Booster.position.x &&
            this.position.y < Booster.position.y + Booster.height &&
            this.position.y + this.height > Booster.position.y) {
            DeleteGameObject(Booster);
            BoostSpeedUp()
            // AddGameObject(new Point());
            // AddGameObject(new Player());

            //this.position = Vec2.center
        }

    }
    BoostSpeedUp(){
        this.speed += 50;
    }
    static get ref() {
        return FindGameObjectByType(Player);
    }
}