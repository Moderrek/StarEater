class Point extends GameObject {
    width = 15;
    height = 15;
    color = "green";
    sortingOrder = 10;
    mass = 5;
    spawnTime = 0;

    Start() {
        this.spawnTime = timestamp;
        this.position = RandomInRadius(Vec2.center, SPAWN_RADIUS - this.width);
        this.velocity = Vec2.of(0, -0.5);
        this.mass = 2 + Math.floor(Math.random() * 6);
        this.UpdateSize();
    }

    UpdateSize() {
        let last_size = this.width;
        this.width = Math.floor(this.mass / 10 * 15);
        this.height = this.width;
        let delta = this.width - last_size;
        this.translate(-delta / 2, -delta / 2);
    }

    Update() {
        //if (Vec2.center.distance(this.position) > SPAWN_RADIUS) this.position = RandomInRadius(Vec2.center, SPAWN_RADIUS - this.width);
        // console.log(this.velocity);
        // this.translate(this.velocity);
    }

    FixedUpdate() {
        FindGameObjectsByType(Point).forEach((point) => {
            if (this == point) return;
            this.CheckPointCollect(point);
        });
    }

    Draw() {
        let spawnDeltaTime = this.spawnTime - timestamp;
        // let floats = [Math.sin(spawnDeltaTime / 2000), Math.cos(spawnDeltaTime / 2000), Math.sin(spawnDeltaTime / 2000)];
        let floats = [
            TimeParam(2, spawnDeltaTime),
            TimeParamInverted(2, spawnDeltaTime),
            TimeParam(2, spawnDeltaTime)
        ];
        let color = FloatToColor(floats[0], floats[1], floats[2]);
        let borderColor = FloatToColor(floats[0] - 0.1, floats[1] - 0.1, floats[2] - 0.1);
        DrawRect(this.position, this.width, this.height, {
            color: color,
            alpha: 1,
            border: true,
            borderColor: borderColor,
            borderSize: 5,
            shadow: {
                color: color,
                x: 0,
                y: 0,
                blur: 10
            }
        });
    }

    CheckPointCollect(p) {
        if (this.position.x < p.position.x + p.width &&
            this.position.x + this.width > p.position.x &&
            this.position.y < p.position.y + p.height &&
            this.position.y + this.height > p.position.y) {
            if (p.mass > this.mass) return;
            this.mass += p.mass;
            this.UpdateSize();
            DeleteGameObject(p);
        }
    }

    Delete() {
        AddGameObject(new Point());
    }

    static get ref() {
        return FindGameObjectByType(Point);
    }
}