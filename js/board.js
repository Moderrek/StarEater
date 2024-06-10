class Board extends GameObject {
    Draw() {
        const radius =  SPAWN_RADIUS + 10 + Math.abs(Math.sin(timestamp / 1000 / 3)) * 5;
        const radius_border = 10
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