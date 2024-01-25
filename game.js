// Game settings
const SPAWN_RADIUS = 300;
// Game data
let gameScore = 0;

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
        gameScore += 1
        AddGameObject(new Point());
    }

    static get ref() {
        return FindGameObjectByType(Point);
    }
}

class Board extends GameObject {
    Draw() {
        const radius =  SPAWN_RADIUS + 10 + Math.abs(Math.sin(timestamp / 1000 / 3)) * 5;
        const radius_border = 10 //+ Math.sin(timestamp / 1000) * 5;
        const delay = 10000;
        const size = Clamp(timestamp, 0, delay) / delay;
        // Ring
        DrawCircle(StaticGameObject.ref.position, 50 * Math.abs(Math.sin(timestamp / 1000)) * size, {
            fill: true,
            color: "white",
            filter: 'blur(10px)',
            alpha: 1,
            border: false,
            shadow: {
                color: "pink",
                blur: 50
            }
        });
        DrawCircle(StaticGameObject.ref.position, 50 * size, {
            fill: true,
            color: "gray",
            alpha: 0.5,
            border: false,
            shadow: {
                color: "gray",
                blur: 50
            }
        });
        DrawCircle(StaticGameObject.ref.position, 45 * size, {
            fill: true,
            color: "black",
            alpha: 0.5,
            border: false,
            shadow: {
                color: "black",
                blur: 50
            }
        });
        
        DrawCircle(StaticGameObject.ref.position, 100, {
            fill: true,
            alpha: 0.1,
            border: true,
        });
        DrawCircle(StaticGameObject.ref.position, 150, {
            fill: true,
            alpha: 0.1,
            border: true,
        });
        DrawCircle(StaticGameObject.ref.position, 200, {
            fill: true,
            alpha: 0.1,
            border: true,
        });
        DrawCircle(StaticGameObject.ref.position, 250, {
            fill: true,
            alpha: 0.1,
            border: true,
        });
        DrawCircle(Vec2.center, radius, { 
            fill: false,
            border: true,
            borderSize: radius_border,
            borderColor: FloatToColor(1 * Math.abs(Math.sin(timestamp / 1000 / 5)) + 0.5, 1 * Math.abs(Math.sin(timestamp / 1000 / 5)) + 0.5, 1 * Math.abs(Math.sin(timestamp / 1000 / 5)) + 0.5),
            shadow: {
                color: "white",
                x: 5,
                y: 5,
                blur: 1
            }
        });
        // Shadows
        DrawCircle(Vec2.center, radius + radius_border - 10, { 
            fill: false,
            border: true,
            borderColor: "white",
            borderSize: 10,
            filter: 'blur(10px)',
        });
        DrawCircle(Vec2.center, radius + radius_border - 10, { 
            fill: false,
            border: true,
            borderColor: "white",
            borderSize: 5,
            filter: 'blur(5px)',
        });
    }
}

class StaticGameObject extends GameObject {
    properties = {};

    Draw() {
        DrawRect(this.position, 25, 25, this.properties);
    }

    static get ref() {
        return FindGameObjectByType(StaticGameObject);
    }
}

function onStart() {
    AddGameObject(new Board());
    
    AddGameObject(new Player());

    for (let i = 0; i < 15; i += 1) {
        setTimeout(() => {
            AddGameObject(new Point());
        }, Math.random() * 8000);
    }

    // Star
    let center = new StaticGameObject();
    center.properties.fill = false;
    center.mass = 300000;
    // center.mass = 200000;
    AddGameObject(center);

    // Gravity Physics
    setInterval(() => {
        for (const bodies of GetGameObjects()) {
            // calc acceleration
            let acceleration = Vec2.zero;
            for (const body of GetGameObjects()) {
                let diff = body.center.subtract(bodies.center);
                let magnitude = diff.magnitude;
                let direction = diff.normalized;
                let body_acceleration = direction.multiply(0.0001).multiply(body.mass).divide(magnitude);
                acceleration = acceleration.add(body_acceleration);
            }
            // set velocity
            bodies.velocity = bodies.velocity.add(acceleration.multiply(10/1000));
        }
        for (const gameObject of GetGameObjects()) {
            if (gameObject instanceof Player) continue;
            gameObject.translate(gameObject.velocity);
        }
    }, 10);
}