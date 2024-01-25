class Player extends GameObject {
    width = 25;
    height = 25;
    speed = 100;
    boostSpeed = 250;
    color = 'lightblue';
    mass = 0;
    direction = Vec2.zero;
    boostTimer = 0;

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
        let speed = this.boostTimer > 0 ? this.boostSpeed : this.speed;

        // Move player in direction
        this.translate(this.direction.normalized.multiply(speed * fixedTime));

        this.CheckBorderCollision();
        //sprawdzanie kolizji
        ForEachColliedGameObjectByType(this, Point, (collided) => {
            DeleteGameObject(collided);
            gameScore += 1;
        });
        ForEachColliedGameObjectByType(this, Booster, (collided) => {
            DeleteGameObject(collided);
            this.boostTimer = 3;
        });
        this.boostTimer -= fixedTime;
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

  
    static get ref() {
        return FindGameObjectByType(Player);
    }
}