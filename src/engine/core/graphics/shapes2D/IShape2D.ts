namespace NT {

    /** Represents a basic 2D shape. */
    export interface IShape2D {

        /** The position of this shape. */
        position: Vector2;

        /** The origin of this shape. */
        origin: Vector2;

        /** The offset of this shape. */
        readonly offset: Vector2;

        /**
         * Sets the properties of this shape from the provided json.
         * @param json The json to set from.
         */
        setFromJson( json: any ): void;

        /**
         * Indicates if this shape intersects the other shape.
         * @param other The other shape to check.
         */
        intersects( other: IShape2D ): boolean;

        /**
         * Indicates if the provided point is contained within this shape.
         * @param point The point to check.
         */
        pointInShape( point: Vector2 ): boolean;
    }
}