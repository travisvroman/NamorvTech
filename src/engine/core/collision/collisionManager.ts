namespace NT {

    export class CollisionData {
        public a: CollisionComponent;
        public b: CollisionComponent;
        public time: number;

        public constructor(time: number, a: CollisionComponent, b: CollisionComponent) {
            this.time = time;
            this.a = a;
            this.b = b;
        }
    }

    /** NOTE: This collision manager is likely going to be replaced, so not commenting it for now. */
    export class CollisionManager {

        private static _totalTime: number = 0;
        private static _components: CollisionComponent[] = [];

        private static _collisionData: CollisionData[] = [];

        private constructor() {
        }

        public static registerCollisionComponent(component: CollisionComponent): void {
            CollisionManager._components.push(component);
        }

        public static unRegisterCollisionComponent(component: CollisionComponent): void {
            let index = CollisionManager._components.indexOf(component);
            if (index !== -1) {
                CollisionManager._components.slice(index, 1);
            }
        }

        public static clear(): void {
            CollisionManager._components.length = 0;
        }

        public static update(time: number): void {
            CollisionManager._totalTime += time;

            for (let c = 0; c < CollisionManager._components.length; ++c) {

                let comp = CollisionManager._components[c];
                for (let o = 0; o < CollisionManager._components.length; ++o) {
                    let other = CollisionManager._components[o];

                    // Do not check against collisions with self.
                    if (comp === other) {
                        continue;
                    }

                    // If both shapes are static, stop detection.
                    if (comp.isStatic && other.isStatic) {
                        continue;
                    }

                    if (comp.shape.intersects(other.shape)) {

                        // We have a collision!
                        let exists: boolean = false;
                        for (let d = 0; d < CollisionManager._collisionData.length; ++d) {
                            let data = CollisionManager._collisionData[d];

                            if ((data.a === comp && data.b === other) || (data.a === other && data.b === comp)) {

                                // We have existing data. Update it.
                                comp.onCollisionUpdate(other);
                                other.onCollisionUpdate(comp);
                                data.time = CollisionManager._totalTime;
                                exists = true;
                                break;
                            }
                        }

                        if (!exists) {

                            // Create a new collision.
                            let col = new CollisionData(CollisionManager._totalTime, comp, other);
                            comp.onCollisionEntry(other);
                            other.onCollisionEntry(comp);
                            Message.sendPriority("COLLISION_ENTRY", undefined, col);
                            CollisionManager._collisionData.push(col);
                        }
                    }
                }
            }

            // Remove stale collision data.
            let removeData: CollisionData[] = [];
            for (let d = 0; d < CollisionManager._collisionData.length; ++d) {
                let data = CollisionManager._collisionData[d];
                if (data.time !== CollisionManager._totalTime) {

                    // Old collision data.
                    removeData.push(data);
                }
            }

            while (removeData.length !== 0) {

                let data = removeData.shift();
                let index = CollisionManager._collisionData.indexOf(data);
                CollisionManager._collisionData.splice(index, 1);

                data.a.onCollisionExit(data.b);
                data.b.onCollisionExit(data.a);
                Message.sendPriority("COLLISION_EXIT", undefined, data);
            }
        }
    }
}