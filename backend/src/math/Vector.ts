import {Coordinate} from "@amongusxr/types/src/Game/DataTypes";

export default class Vector {

    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static create(x: number, y: number): Vector {
        return new Vector(x,y);
    }

    static fromCoordinate(coords: Coordinate): Vector {
        return new Vector(coords.latitude, coords.longitude);
    }

    static random(): Vector {
        return new Vector(Math.random(), Math.random());
    }

    static randomBetween(min: Vector, max: Vector): Vector {
        const diff = max.copy().sub(min);
        return Vector.random().mul(diff).add(min);
    }

    static fromAngle(angle: number): Vector {
        return Vector.create(1,0).rotate(angle);
    }

    toCoordinate(): Coordinate {
        return {latitude: this.x, longitude: this.y};
    }

    add(other: Vector): Vector {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    sub(other: Vector): Vector {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }

    mul(other: Vector): Vector {
        this.x *= other.x;
        this.y *= other.y;
        return this;
    }

    scale(scalar: number): Vector {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    from(other: Vector): Vector {
        this.x = other.x;
        this.y = other.y;
        return this;
    }

    set(x: number, y: number): Vector {
        this.x = x;
        this.y = y;
        return this;
    }

    div(other: Vector): Vector {
        this.x = other.x;
        this.y = other.y;
        return this;
    }

    copy(): Vector {
        return new Vector(this.x, this.y);
    }

    magSq(): number {
        return this.dot(this);
    }

    mag(): number {
        return Math.sqrt(this.magSq());
    }

    mod(m: Vector): Vector {
        if (this.x > 0) this.x %= m.x;
        else {
            this.x = (this.x + (Math.ceil(Math.abs(this.x / m.x)) * m.x)) % m.x;
        }

        if (this.y > 0) this.y %= m.y;
        else {
            this.y = (this.y + (Math.ceil(Math.abs(this.y / m.y)) * m.y)) % m.y;
        }

        return this;
    }

    dot(other: Vector): number {
        return (this.x*other.x) + (this.y*other.y)
    }

    distSqr(other: Vector): number {
        return Math.pow(this.x-other.x, 2) + Math.pow(this.y-other.y, 2);
    }

    dist(other: Vector): number {
        return Math.sqrt(this.distSqr(other));
    }

    normalize(): Vector {
        const total = Math.abs(this.x + this.y);
        if (total != 0) {
            this.scale(1/total);
        }
        return this;
    }

    limit(l: number): Vector {
        const total = this.mag();
        if (total > l) {
            this.scale(l/total);
        }
        return this;
    }

    setMag(m: number): Vector {
        const oldMag = this.mag();
        if (oldMag != 0) {
            this.scale(m/oldMag);
        }
        return this;
    }

    /**
     * linear interpolation between two points
     * @param target
     * @param t
     */
    lerp(target: Vector, t: number): Vector {
        const diff = this.copy().sub(target);
        return new Vector(
            this.x + (diff.x * t),
            this.y + (diff.y * t),
        );
    }

    equals(other: Vector): boolean {
        return (
            this.x === other.x &&
            this.y === other.y
        );
    }

    rotate(angle: number): Vector {
        const newX = (this.x * Math.cos(angle)) + (this.y * -Math.sin(angle));
        const newY = (this.x * Math.sin(angle)) + (this.y * -Math.cos(angle));
        return this.set(newX, newY);
    }

    setHeading(angle: number): Vector {
        const mag = this.mag();
        return this.set(1,0).rotate(angle).setMag(mag);
    }

    heading(): number {
        return this.angleBetween(Vector.create(1,0));
    }

    angleBetween(other: Vector): number {
        return Math.acos(this.dot(other));
    }

    isDifferent(other: Vector, accuracy: number = 0.0000001): boolean {
        return (
            Math.abs(this.x - other.x) > accuracy ||
            Math.abs(this.y - other.y) > accuracy
        );
    }

}