class Player extends GameObject {
    width = 25;
    height = 25;
    speed = 350;
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

        FindGameObjectsByType(Point).forEach((point) => {
            this.CheckPointCollect(point);
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

    static get ref() {
        return FindGameObjectByType(Player);
    }
}