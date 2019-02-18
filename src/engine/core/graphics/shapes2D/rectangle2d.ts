namespace TSE {

    export class Rectangle2D implements IShape2D {

        public position: Vector2 = Vector2.zero;

        public origin: Vector2 = Vector2.zero;

        public width: number;

        public height: number;

        public constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
            this.position.x = x;
            this.position.y = y;
            this.width = width;
            this.height = height;
        }

        public get offset(): Vector2 {
            return new Vector2((this.width * this.origin.x), (this.height * this.origin.y));
        }

        public setFromJson(json: any): void {
            if (json.position !== undefined) {
                this.position.setFromJson(json.position);
            }

            if (json.origin !== undefined) {
                this.origin.setFromJson(json.origin);
            }

            if (json.width === undefined) {
                throw new Error("Rectangle2D requires width to be present.");
            }
            this.width = Number(json.width);

            if (json.height === undefined) {
                throw new Error("Rectangle2D requires height to be present.");
            }
            this.height = Number(json.height);
        }

        public intersects(other: IShape2D): boolean {
            if (other instanceof Rectangle2D) {
                let a = this.getExtents(this);
                let b = this.getExtents(other);

                return (a.position.x <= b.width && a.width >= b.position.x) && (a.position.y <= b.height && a.height >= b.position.y);
            }

            if (other instanceof Circle2D) {
                let deltaX = other.position.x - Math.max(this.position.x, Math.min(other.position.x, this.position.x + this.width));
                let deltaY = other.position.y - Math.max(this.position.y, Math.min(other.position.y, this.position.y + this.height));
                if ((deltaX * deltaX + deltaY * deltaY) < (other.radius * other.radius)) {
                    return true;
                }
            }

            return false;
        }

        public pointInShape(point: Vector2): boolean {

            let x = this.width < 0 ? this.position.x - this.width : this.position.x;
            let y = this.height < 0 ? this.position.y - this.height : this.position.y;

            let extentX = this.width < 0 ? this.position.x : this.position.x + this.width;
            let extentY = this.height < 0 ? this.position.y : this.position.y + this.height;

            if (point.x >= x && point.x <= extentX && point.y >= y && point.y <= extentY) {
                return true;
            }

            return false;
        }

        private getExtents(shape: Rectangle2D): Rectangle2D {
            let x = shape.width < 0 ? shape.position.x - shape.width : shape.position.x;
            let y = shape.height < 0 ? shape.position.y - shape.height : shape.position.y;

            let extentX = shape.width < 0 ? shape.position.x : shape.position.x + shape.width;
            let extentY = shape.height < 0 ? shape.position.y : shape.position.y + shape.height;

            return new Rectangle2D(x, y, extentX, extentY);
        }
    }
}