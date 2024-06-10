const ENGINE_VERSION = "v0.1";
// Rendering data
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 600;

// Game core
var timestamp = 0;
let previousTimestamp = 0;
let deltaTime = 0;
let fixedTime = 0;
let fixedUpdate = 0;
gameObjects = [];
keys = [];
const BASIC_SHADOW = {
    color: "black",
    x: 5,
    y: 5,
    blur: 3
}

/*
time = 1000ms
TimeParam(1s) = 1
time = 2000ms
TimeParam(1s) = 1

time = 2000ms
TimeParam(2s) = 1
*/

/**
 * Time parameter
 * @param {number} seconds Amount of seconds to repeat value
 * @param {number} time Current time
 * @returns 0-1
 */
const TimeParam = (seconds = 1, time = timestamp) => {
    return Math.abs(Math.cos(time * Math.PI / 2 / 500 / seconds));
}

/*
czas = 1000ms
TimeParam(1s) = 0

czas = 2000ms
TimeParam(2s) = 0
*/

/**
 * Time parameter inverted
 * @param {number} seconds Amount of seconds to repeat value
 * @param {number} time Current time
 * @returns 0-1
 */
const TimeParamInverted = (seconds = 1, time = timestamp) => {
    return Math.abs(Math.sin(time * Math.PI / 2 / 500 / seconds));
}


/**
 * Parses Vec2 from 2 arguments.
 * @param {Vec2 | number} x The Vector2 or x.
 * @param {number?} y If given x parameter y is required.
 */
const parseVec = (x = 0, y = 0) => {
    if (x instanceof Vec2) return x;
    if (typeof(x) !== "number") throw new Error("Parameter `x` must be an number!");
    if (typeof(y) !== "number") throw new Error("Parameter `y` must be an number!");
    return new Vec2(x, y);
}

class GameObject {
    name = "Unknown";
    position = Vec2.center;
    width = 0;
    height = 0;
    sortingOrder = 0;
    mass = 0;
    velocity = Vec2.zero;

    /**
     * @returns {Vec2} The game object center position.
     */
    get center() {
        return this.position.add(Vec2.of(this.width / 2, this.height / 2));
    }

    /**
     * 
     * @param {Vec2 | number} x Vector2 or X-Coordinate.
     * @param {number?} y The Y-Coordinate Required if x is number.
     * @returns 
     */
    translate(x, y) {
        let vec = parseVec(x, y);
        if (vec.isValid) {
            this.position.x += vec.x;
            this.position.y += vec.y;
        } else {
            EngineWarn("Tried to translate with invalid vector.");
            EngineWarn(vec);
        }
        return this;
    }

    setSortingOrder(order) {
        this.sortingOrder = order;
        SortGameObjects();
        return this;
    }

    getSortingOrder() {
        return this.sortingOrder;
    }

    addVelocity(vec2) {
        if (isNaN(vec2.x) || isNaN(vec2.y)) return this;
        this.velocity = this.velocity.add(vec2);
        return this;
    }

    Start() {}
    Delete() {}
    Update() {}
    FixedUpdate() {}
    UpdateVelocity() {}
    Draw() {}
}

class Vec2 {
    /**
     * Constructs new Vector2.
     * @param {number} x The X-coordinate.
     * @param {number} y The Y-coordinate.
     */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * 
     * @param {Vec2 | number} x The vector or X-Coordinate.
     * @param {number?} y The optional Y-Coordinate.
     * @returns 
     */
    add(x, y) {
        const vec = parseVec(x, y);
        return new Vec2(this.x + vec.x, this.y + vec.y);
    }

    plus(x, y) {
        const vec = parseVec(x, y);
        return new Vec2(this.x + vec.x, this.y + vec.y);
    }

    subtract(x, y) {
        const vec = parseVec(x, y)
        return new Vec2(this.x - vec.x, this.y - vec.y);
    }

    minus(x, y) {
        const vec = parseVec(x, y);
        return new Vec2(this.x - vec.x, this.y - vec.y);
    }

    /**
     * 
     * @param {Vec2 | number} x The Vec2 or X-Coordinate or scalar
     * @param {number?} y The Y-Coordinate
     * @returns 
     */
    multiply(x, y = null) {
        if (typeof(x) == "number" && y == null) {
            let scalar = x;
            if (scalar == 0) return Vec2.zero;
            return new Vec2(this.x * scalar, this.y * scalar);
        }
        let vec = parseVec(x, y);
        if (vec.isValid) {
            return new Vec2(this.x * vec.x, this.y * vec.y);
        }
        
    }

    divide(value) {
        if (typeof(value) == "number") {
            if (value == 0) {
                return Vec2.zero;
            }
            return new Vec2(this.x / value, this.y / value);
        }
        return new Vec2(this.x / value.x, this.y / value.y);
    }

    distance(x, y = 0) {
        let vec = parseVec(x, y);
        return Math.sqrt(Math.pow(Math.abs(this.x - vec.x), 2) + Math.pow(Math.abs(this.y - vec.y), 2));
    }

    get isValid() {
        if (this.x == undefined || this.x == null) return false;
        if (isNaN(this.x)) return false;
        if (typeof(this.x) !== "number") return false;
        if (this.y == undefined || this.y == null) return false;
        if (isNaN(this.y)) return false;
        if (typeof(this.y) !== "number") return false;
        return true;
    }

    get magnitude() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    /**
     * Normalizes the Vec2.
     * @returns {Vec2} The new normalized vector.
     */
    get normalized() {
        let vec = this.clone;
        let magnitude = vec.magnitude;
        if (magnitude == 0) return Vec2.zero;
        return vec.divide(vec.magnitude);
    }

    /**
     * Clones vector.
     * @returns {Vec2} The cloned vector.
     */
    get clone() {
        return new Vec2(this.x, this.y);
    }

    static get center() {
        return new Vec2(canvas.width / 2, canvas.height / 2);
    }

    static get up() {
        return new Vec2(0, -1);
    }

    static get down() {
        return new Vec2(0, 1);
    }

    static get left() {
        return new Vec2(-1, 0);
    }

    static get right() {
        return new Vec2(1, 0);
    }

    static get zero() {
        return new Vec2(0, 0);
    }

    static get one() {
        return new Vec2(1, 1);
    }

    static of(x, y) {
        return new Vec2(x, y);
    }
}

function vec2(params) {
    const arg = params[0].toLowerCase().replace("x=", "").replace("y=", "");
    if (arg == "" || arg == "0" || arg == "zero") return Vec2.zero;
    if (arg == "1" || arg == "one") return Vec2.one;
    if (arg == "top" || arg == "up" || arg == "n") return Vec2.up;
    if (arg == "bottom" || arg == "down" || arg == "s") return Vec2.down;
    if (arg == "left" || arg == "down" || arg == "w") return Vec2.left;
    if (arg == "right" || arg == "down" || arg == "e") return Vec2.right;
    const values = arg.split(' ');
    if (values.length != 2) throw new Error("Invalid Vector params");
    const x = parseFloat(values[0]);
    const y = parseFloat(values[1]);
    return new Vec2(x, y);
}

function v(params) {
    return vec2(params);
}

function vec(params) {
    return vec2(params);
}

//#region MECHANICS

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameObjects.forEach((obj) => {
        obj.Update();
    });
    gameObjects.forEach((obj) => {
        obj.Draw(); 
    });
}

function gameMain(ts) {
    // Calc time
    timestamp = ts;
    deltaTime = timestamp - previousTimestamp;
    previousTimestamp = timestamp;

    gameLoop();
    
    if (true)
        window.requestAnimationFrame(gameMain);
}

function msg(type, message, prefix = "") {
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milis = date.getMilliseconds().toString().padStart(3, '0');
    console.log(`[${hours}:${minutes}:${seconds}:${milis}]${prefix} [${type}]:`, message);
}

const Log = (message) => {
    msg("LOG", message);
}

const LogWarn = (message) => {
    msg("WARN", message);
}

const LogError = (message) => {
    msg("ERR", message);
}

const EngineDebug = (message) => {
    // TODO debug bool
    if (true) msg("DEBUG", message, " [ENGINE]");
}

const EngineWarn = (message) => {
    msg("WARN", message, " [ENGINE]");
}

const IsNameOccupied = (name) => {
    for (const gameObject of gameObjects) {
        if (gameObject.name == name) return true;
    }
    return false;
}

const CreateUniqueName = (name) => {
    if (IsNameOccupied(name)) {
        let counter = 1;
        while (IsNameOccupied(name + counter)) {
            counter += 1;
        }
        return name + counter;
    }
    return name;
}

const AddGameObject = (object) => {
    if (typeof(object) == "function") {
        // construct game object
        let name = CreateUniqueName(object.name || "Unknown");
        EngineDebug("Constructed new game object of type " + name);
        let gameObject = new object();
        gameObject.name = name;
        gameObjects.push(gameObject);
        gameObject.Start();
        EngineDebug(gameObject);
        SortGameObjects();
    }
    if (typeof(object) == "object") {
        gameObjects.push(object);
        object.Start();
        SortGameObjects();
    }
    
}

/**
 * 
 * @param {({GameObject})} callback 
 */
const ForEachGameObject = (callback) => {
    for (const gameObject of gameObjects) {
        callback(gameObject);
    }
}

/**
 * 
 * @param {GameObject} origin
 * @param {({GameObject})} callback 
 */
const ForEachColliedGameObject = (origin, callback) => {
    for (const gameObject of gameObject) {
        if (origin == gameObject) continue;
        if (IsCollied(origin, gameObject)) {
            callback(gameObject);
        }
    }
}

/**
 * 
 * @param {GameObject} origin
 * @param {*} type 
 * @param {({GameObject})} callback 
 */
const ForEachColliedGameObjectByType = (origin, type, callback) => {
    for (const gameObject of gameObjects) {
        if (origin == gameObject) continue;
        if (!(gameObject instanceof type)) continue;
        if (!IsCollied(origin, gameObject)) continue;
        callback(gameObject);
    }
}

/**
 * 
 * @param {*} type 
 * @param {({GameObject})} callback 
 */
const ForEachGameObjectByType = (type, callback) => {
    if (typeof(type) !== "function") throw new Error("Parameter 'type' is invalid type!");
    for (const gameObject of gameObjects) {
        if (gameObject instanceof type) {
            callback(gameObject);
        }
    }
}

/**
 * 
 * @param {GameObject} gameObj1 
 * @param {GameObject} gameObj2
 * @returns {boolean}
 */
const IsCollied = (gameObj1, gameObj2) => {
    return gameObj1.position.x < gameObj2.position.x + gameObj2.width &&
        gameObj1.position.x + gameObj1.width > gameObj2.position.x &&
        gameObj1.position.y < gameObj2.position.y + gameObj2.height &&
        gameObj1.position.y + gameObj1.height > gameObj2.position.y;
}

/**
 * Gets all game objects.
 * @returns {GameObject[]} The all game objects.
 */
const GetGameObjects = () => {
    return gameObjects;
}

const SortGameObjects = () => {
    gameObjects.sort((a, b) => a.sortingOrder - b.sortingOrder);
}

const FloatToColor = (f1, f2, f3) => {
    let r = Math.floor(Clamp01(Math.abs(f1)) * 255);
    let g = Math.floor(Clamp01(Math.abs(f2)) * 255);
    let b = Math.floor(Clamp01(Math.abs(f3)) * 255);
    return "#" + r.toString(16).padStart(2, "0") + g.toString(16).padStart(2, "0") + b.toString(16).padStart(2, "0");
}

const RandomColor = () => {
    return FloatToColor(Math.random(), Math.random(), Math.random());
}

const FindGameObjectByType = (type) => {
    return gameObjects.find((obj) => obj instanceof type);
}

const FindGameObjectsByType = (type) => {
    const result = [];
    for (const gameObject of gameObjects) {
        if (gameObject instanceof type) result.push(gameObject);
    }
    return result;
}

const DeleteGameObjectByIndex = (index) => {
    const gameObject = gameObjects[index];
    gameObject.Delete();
    gameObjects.splice(index, 1);
    SortGameObjects();
}

const DeleteGameObject = (gameObject) => {
    gameObject.Delete();
    gameObjects.splice(gameObjects.indexOf(gameObject), 1);
    SortGameObjects();
}

const Clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
}

const Clamp01 = (value) => {
    return Math.min(Math.max(value, 0), 1);
}

addEventListener('keydown', e => {
    keys[e.which] = true;
})

addEventListener('keyup', e => {
    keys[e.which] = false;
})

/**
 * Gets random point in circle with given radius.
 * @param {Vec2} center The circle center point.
 * @param {number} radius The circle radius.
 * @returns {Vec2} Random point in circle.
 */
const RandomInRadius = (center, radius) => {
    const circle = Math.random() * 2 * Math.PI;
    const random_R = Math.sqrt(Math.random()) * radius;
    return new Vec2(center.x + Math.cos(circle) * random_R,
                    center.y + Math.sin(circle) * random_R);
}

const waits = [];
const WaitFixed = (secs, callback) => {
    waits.push({
        timer: secs,
        callback: callback,
    });
}
const FixedTimerUpdate = () => {
    for (const wait of waits) {
        wait.timer -= fixedTime;
        if (wait.timer <= 0) {
            wait.callback();
            waits.splice(waits.indexOf(wait), 1);
        }
    }
}

const Lerp = (x, y, alpha = 0.5) => x * (1 - alpha) + y * alpha;
const RandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

document.addEventListener('DOMContentLoaded', () => {
    EngineDebug(`Starting BencEngine ${ENGINE_VERSION}..`);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    // Fixed (time) update
    fixedUpdate = 16;
    EngineDebug("Waiting for benchmark..");
    new Promise(resolve => 
        requestAnimationFrame(time_start => 
            requestAnimationFrame(time_end => 
                resolve(time_end - time_start)))
    ).then((frameTime) => {
        EngineDebug("Benchmarked frame time: " + frameTime)
        fixedUpdate = Clamp(Math.floor(frameTime), 0, 16);
        EngineDebug("Fixed update interval: " + fixedUpdate);
        fixedTime = fixedUpdate / 1000;
        setInterval(() => {
            FixedTimerUpdate();
            for (const gameObject of gameObjects) {
                gameObject.FixedUpdate();
            }
        }, fixedUpdate);
        EngineDebug("Starting game..");
        onStart()
        window.requestAnimationFrame(gameMain); 
    });
    
});

const setContextProperties = (props) => {
    // Fill
    ctx.filter = props.filter || "blur(0px)";
    ctx.globalAlpha = props.alpha || 1;
    ctx.fillStyle = props.color || "black";
    // Border
    ctx.strokeStyle = props.borderColor || "black";
    ctx.lineWidth = props.borderSize || 1;

    ctx.shadowColor = props.shadow && props.shadow.color || undefined;
    ctx.shadowBlur = props.shadow && props.shadow.blur || 0;
    ctx.shadowOffsetX = props.shadow && props.shadow.x || 0;
    ctx.shadowOffsetY = props.shadow && props.shadow.y || 0;
}

const DrawCircle = (pos = Vec2.center, radius = 100, properties = {}) => {
    setContextProperties(properties);
    // circle path
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
    ctx.closePath();
    // draw
    if (properties.fill == undefined || properties.fill) ctx.fill();
    if (properties.border) ctx.stroke();
}

const DrawRect = (pos = Vec2.center, width = 100, height = 100, properties = {}) => {
    setContextProperties(properties);
    // draw
    if (properties.fill == undefined || properties.fill) ctx.fillRect(pos.x, pos.y, width, height);
    if (properties.border) ctx.strokeRect(pos.x, pos.y, width, height);
}

//#endregion