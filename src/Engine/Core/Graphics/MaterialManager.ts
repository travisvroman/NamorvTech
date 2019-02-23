namespace NT {

    /**
     * Holds reference information for a given material.
     */
    class MaterialReferenceNode {

        /** The referenced material. */
        public material: Material;

        /** The number of times the material is referenced. Default is 1 because this is only created when a material is needed. */
        public referenceCount: number = 1;

        /**
         * Creates a new MaterialReferenceNode.
         * @param material The material to be referenced.
         */
        public constructor( material: Material ) {
            this.material = material;
        }
    }

    /**
     * Manages materials in the engine. This is responsible for managing material references, and automatically
     * destroying unreferenced materials.
     */
    export class MaterialManager {

        private static _materials: { [name: string]: MaterialReferenceNode } = {};

        /** Private to enforce singleton pattern. */
        private constructor() {
        }

        /**
         * Registers the provided material with this manager.
         * @param material The material to be registered.
         */
        public static registerMaterial( material: Material ): void {
            if ( MaterialManager._materials[material.name] === undefined ) {
                MaterialManager._materials[material.name] = new MaterialReferenceNode( material );
            }
        }

        /**
         * Gets a material with the given name. This is case-sensitive. If no material is found, undefined is returned.
         * Also increments the reference count by 1.
         * @param materialName The name of the material to retrieve. Case sensitive.
         */
        public static getMaterial( materialName: string ): Material {
            if ( MaterialManager._materials[materialName] === undefined ) {
                return undefined;
            } else {
                MaterialManager._materials[materialName].referenceCount++;
                return MaterialManager._materials[materialName].material;
            }
        }

        /**
         * Releases a reference of a material with the provided name and decrements the reference count. 
         * If the material's reference count is 0, it is automatically released. 
         * @param materialName The name of the material to be released.
         */
        public static releaseMaterial( materialName: string ): void {
            if ( MaterialManager._materials[materialName] === undefined ) {
                console.warn( "Cannot release a material which has not been registered." );
            } else {
                MaterialManager._materials[materialName].referenceCount--;
                if ( MaterialManager._materials[materialName].referenceCount < 1 ) {
                    MaterialManager._materials[materialName].material.destroy();
                    MaterialManager._materials[materialName].material = undefined;
                    delete MaterialManager._materials[materialName];
                }
            }
        }
    }
}