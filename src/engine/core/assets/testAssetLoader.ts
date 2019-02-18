namespace TSE {


    export class TextAsset implements IAsset {

        public readonly name: string;

        public readonly data: string;

        public constructor(name: string, data: string) {
            this.name = name;
            this.data = data;
        }
    }

    export class TextAssetLoader implements IAssetLoader {

        public get supportedExtensions(): string[] {
            return ["txt"];
        }

        public loadAsset(assetName: string): void {
            let request = new XMLHttpRequest();
            request.open("GET", assetName);
            request.addEventListener("load", this.onTextLoaded.bind(this, assetName, request));
            request.send();
        }

        private onTextLoaded(assetName: string, request: XMLHttpRequest): void {
            console.debug("onTextLoaded: assetName/request", assetName, request);

            if (request.readyState === request.DONE) {
                let asset = new TextAsset(assetName, request.responseText);
                AssetManager.onAssetLoaded(asset);
            }
        }
    }
}