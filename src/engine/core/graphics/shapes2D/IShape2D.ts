namespace TSE {

    export interface IShape2D {

        position: Vector2;

        origin: Vector2;

        readonly offset: Vector2;

        setFromJson( json: any ): void;

        intersects( other: IShape2D ): boolean;

        pointInShape( point: Vector2 ): boolean;
    }
}