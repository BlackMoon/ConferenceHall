export const borderClass = "box";
export const frameClass = "frame";
export const lineClass = "grid";
export const markClass = "mark";
export const shapeClass = "shape";

/**
 * Point 2D (SVGPoint не подходит из-за метода )
 */
export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
