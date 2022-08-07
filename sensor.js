class Sensor {
    constructor(car) {
        this.car = car;
        this.rayCount = 11;
        this.rayLength = 150;
        this.raySpread = Math.PI/2;

        this.rays = [];
        this.readings = [];
    }

    update(roadBorders, traffic) {
        this.#castRays();
        this.readings = [];

        this.rays.forEach((ray, i) => {
            this.readings.push(
                this.#getReading(ray, roadBorders, traffic)
            );
        });
    }

    #getReading(ray, roadBorders, traffic) {
        let touches = [];
        roadBorders.forEach(roadBorder => {
            const touch = getIntersection(
                ray[0],
                ray[1],
                roadBorder[0],
                roadBorder[1],
            );
            if (touch) {
                touches.push(touch);
            }
        });

        for (let i = 0; i < traffic.length; i++) {
            const poly = traffic[i].polygon;
            for (let j = 0; j < poly.length; j++) {
                const value = getIntersection(
                    ray[0],
                    ray[1],
                    poly[j],
                    poly[(j + 1) % poly.length],
                );
                if (value) {
                    touches.push(value);
                }
            }
        }

        if (touches.length == 0) {
            return null;
        } else {
            const offsets = touches.map((e) => e.offset);
            const minOffset = Math.min(...offsets)
            return touches.find((e) => e.offset == minOffset);
        }
    }

    #castRays() {
        this.rays = [];
        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = lerp(
                -this.raySpread / 2,
                this.raySpread / 2,
                this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1),
            ) + this.car.angle;
            const start = { x: this.car.x, y: this.car.y };
            const end = {
                x: start.x - this.rayLength * Math.sin(rayAngle),
                y: start.y - this.rayLength * Math.cos(rayAngle),
            }
            this.rays.push([start, end]);
        }
    }

    draw(ctx) {
        this.rays.forEach((ray, i) => {
            let end = ray[1];
            if (this.readings[i]) {
                end = this.readings[i];
            }
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow";
            ctx.moveTo(
                ray[0].x,
                ray[0].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.moveTo(
                end.x,
                end.y,
            );
            ctx.lineTo(
                ray[1].x,
                ray[1].y,
            );
            ctx.stroke();
        });
    }
}