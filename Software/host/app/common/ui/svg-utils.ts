export const borderClass = "box";
export const frameClass = "frame";
export const lineClass = "grid";
export const markClass = "mark";
export const shapeClass = "shape";

/**
 * Point 2D (интерфейс SVGPoint не подходит из-за наличия метода matrixTransform)
 */
export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
