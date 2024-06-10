// Game settings
const SPAWN_RADIUS = 300;
// Game data
let gameScore = 0;

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
    // Instantiate basic game objects
    AddGameObject(Board);
    AddGameObject(Booster)
    AddGameObject(Player);

    // Instantiate points with randomly delay
    for (let i = 0; i < 15; i += 1) {
        setTimeout(() => {
            AddGameObject(Point);
        }, Math.random() * 8000);
    }

    // Center of the game
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
    }, 16);
}