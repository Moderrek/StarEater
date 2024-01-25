class Booster extends GameObject {
    width = 20;
    height = 20;
    color = "red";
    sortingOrder = 10;
    mass = 5;
    spawnTime = 0;

    Start() {
        this.spawnTime = timestamp;
        this.position = RandomInRadius(Vec2.center, SPAWN_RADIUS - this.width);
        this.velocity = Vec2.of(0, -0.5);
    }



    FixedUpdate() {
        FindGameObjectsByType(Booster).forEach((Bst) => {
            if (this == Bst) return;
            this.CheckboosterCollect(Bst);
        });
    }

    Draw() {
        let spawnDeltaTime = this.spawnTime - timestamp;
        // let floats = [Math.sin(spawnDeltaTime / 2000), Math.cos(spawnDeltaTime / 2000), Math.sin(spawnDeltaTime / 2000)];
        let floats = [
            TimeParam(2, spawnDeltaTime),
            TimeParamInverted(5, spawnDeltaTime) / 2,
            0
        ];
         let color = FloatToColor(floats[0], floats[1], floats[2]);
        let borderColor = FloatToColor(floats[0] - 0.1, floats[1] - 0.1, floats[2] - 0.1);
        DrawRect(this.position, this.width, this.height, {
            color: color,
            alpha: 1,
            border: false,
            borderSize: 5,
            shadow: {
                color: color,
                x: 0,
                y: 0,
                blur: 10
            }
        });
    }

    CheckboosterCollect(p) {
        if (this.position.x < p.position.x + p.width &&
            this.position.x + this.width > p.position.x &&
            this.position.y < p.position.y + p.height &&
            this.position.y + this.height > p.position.y) {
            
            DeleteGameObject(p);
        }
    }

    Delete() {
        gameScore += 1
        AddGameObject(new Booster());
    }

    static get ref() {
        return FindGameObjectByType(Booster);
    }
}