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
        // Time since spawn
        let spawnDeltaTime = this.spawnTime - timestamp;
        // Color changing over time
        let floats = [
            TimeParam(2, spawnDeltaTime),
            TimeParamInverted(5, spawnDeltaTime) / 2,
            0
        ];
        // Convert floats to color
        let color = FloatToColor(floats[0], floats[1], floats[2]);
        // Draw rectangle
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

    Delete() {
        // When booster is collected delete it and spawn new one after random time
        WaitFixed(RandomInt(3, 5), () => AddGameObject(new Booster()))
    }

    static get ref() {
        return FindGameObjectByType(Booster);
    }
}