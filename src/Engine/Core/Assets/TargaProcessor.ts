namespace NT {

    enum TargaType {
        NO_DATA = 0,
        INDEXED = 1,
        RGB = 2,
        GREY = 3,
        RLE_INDEXED = 9,
        RLE_RGB = 10,
        RLE_GREY = 11
    }

    enum TargaOrigin {
        BOTTOM_LEFT = 0x00,
        BOTTOM_RIGHT = 0x01,
        TOP_LEFT = 0x02,
        TOP_RIGHT = 0x03,
        SHIFT = 0x04,
        MASK = 0x30
    }

    class TargaHeader {

        /* 0x00  BYTE */
        public idLength: number;

        /* 0x01  BYTE */
        public colorMapType: number;

        /* 0x02  BYTE */
        public imageType: number;

        /* 0x03  WORD */
        public colorMapIndex: number;

        /* 0x05  WORD */
        public colorMapLength: number;

        /* 0x07  BYTE */
        public colorMapDepth: number;

        /* 0x08  WORD */
        public offsetX: number;

        /* 0x0a  WORD */
        public offsetY: number;

        /* 0x0c  WORD */
        public width: number;

        /* 0x0e  WORD */
        public height: number;

        /* 0x10  BYTE */
        public pixelDepth: number;

        /* 0x11  BYTE */
        public flags: number;

        public hasEncoding: boolean;

        public hasColorMap: boolean;

        public isGreyColor: boolean;

        public initialize() {
            this.hasEncoding = ( this.imageType === TargaType.RLE_INDEXED ||
                this.imageType === TargaType.RLE_RGB ||
                this.imageType === TargaType.RLE_INDEXED );

            this.hasColorMap = ( this.imageType === TargaType.RLE_INDEXED ||
                this.imageType === TargaType.INDEXED );

            this.isGreyColor = ( this.imageType === TargaType.RLE_GREY ||
                this.imageType === TargaType.GREY );
        }
    }

    export class TargaProcessor {

        public static loadToDataUrl( rawData: any ): string {
            let data = new Uint8Array( rawData );

            let offset = 0;
            if ( data.length < 0x12 ) {
                throw new Error( "Targa - Not enough data for a header." );
            }

            let header = new TargaHeader();
            header.idLength = data[offset++];
            header.colorMapType = data[offset++];
            header.imageType = data[offset++];
            header.colorMapIndex = data[offset++] | data[offset++] << 8;
            header.colorMapLength = data[offset++] | data[offset++] << 8;
            header.colorMapDepth = data[offset++];
            header.offsetX = data[offset++] | data[offset++] << 8;
            header.offsetY = data[offset++] | data[offset++] << 8;
            header.width = data[offset++] | data[offset++] << 8;
            header.height = data[offset++] | data[offset++] << 8;
            header.pixelDepth = data[offset++];
            header.flags = data[offset++];

            header.initialize();

            // Make sure the header is valid before attempting a load.
            TargaProcessor.checkHeader( header );

            // Move to data section
            offset += header.idLength;
            if ( offset >= data.length ) {
                throw new Error( "Targa - No data." );
            }

            let palette: Uint8Array;
            if ( header.hasColorMap ) {
                let colorMapSize = header.colorMapLength * ( header.colorMapDepth >> 3 );
                palette = data.subarray( offset, offset + colorMapSize );
                offset += colorMapSize;
            }

            let pixelSize = header.pixelDepth >> 3;
            let imageSize = header.width * header.height;
            let pixelTotal = imageSize * pixelSize;

            let imageDataArray: Uint8Array;
            if ( header.hasEncoding ) {
                imageDataArray = TargaProcessor.decodeRLE( data, offset, pixelSize, pixelTotal );
            } else {
                imageDataArray = data.subarray( offset, offset + ( header.hasColorMap ? imageSize : pixelTotal ) );
            }

            // Get image data
            let xStart: number, xStep: number, xEnd: number;
            let yStart: number, yStep: number, yEnd: number;
            let origin = ( header.flags & TargaOrigin.MASK ) >> TargaOrigin.SHIFT;

            let canvas = document.createElement( "canvas" );
            let context = canvas.getContext( "2d" );
            let imageData = context.createImageData( header.width, header.height );
            if ( origin === TargaOrigin.TOP_LEFT || TargaOrigin.TOP_RIGHT ) {
                yStart = 0;
                yStep = 1;
                yEnd = header.height;
            } else {
                yStart = header.height - 1;
                yStep = -1;
                yEnd = -1;
            }

            if ( origin === TargaOrigin.TOP_LEFT || TargaOrigin.BOTTOM_LEFT ) {
                xStart = 0;
                xStep = 1;
                xEnd = header.width;
            } else {
                xStart = header.width - 1;
                xStep = -1;
                xEnd = -1;
            }

            switch ( header.pixelDepth ) {
                case 8:
                    if ( header.isGreyColor ) {
                        TargaProcessor.getImageDataGrey8( imageData.data, imageDataArray, palette, header.width,
                            yStart, yStep, yEnd, xStart, xStep, xEnd );
                    } else {
                        TargaProcessor.getImageData8( imageData.data, imageDataArray, palette, header.width,
                            yStart, yStep, yEnd, xStart, xStep, xEnd );
                    }
                    break;
                case 16:
                    if ( header.isGreyColor ) {
                        TargaProcessor.getImageDataGrey16( imageData.data, imageDataArray, palette, header.width,
                            yStart, yStep, yEnd, xStart, xStep, xEnd );
                    } else {
                        TargaProcessor.getImageData16( imageData.data, imageDataArray, palette, header.width,
                            yStart, yStep, yEnd, xStart, xStep, xEnd );
                    }
                    break;
                case 24:
                    TargaProcessor.getImageData24( imageData.data, imageDataArray, palette, header.width,
                        yStart, yStep, yEnd, xStart, xStep, xEnd );
                    break;
                case 32:
                    TargaProcessor.getImageData32( imageData.data, imageDataArray, palette, header.width,
                        yStart, yStep, yEnd, xStart, xStep, xEnd );
                    break;
            }

            context.putImageData( imageData, 0, 0 );
            return canvas.toDataURL();
        }

        private static checkHeader( header: TargaHeader ): void {
            if ( header.imageType = TargaType.NO_DATA ) {
                throw new Error( "Targa - No data in targa file." );
            }

            if ( header.hasColorMap ) {
                if ( header.colorMapLength > 256 || header.colorMapLength !== 24 || header.colorMapType !== 1 ) {
                    throw new Error( "Targa - Invalid colormap for indexed type." );
                }
            } else {
                if ( header.colorMapType ) {
                    throw new Error( "Targa - Image contains color map for non-indexed type." );
                }
            }

            if ( header.width <= 0 || header.height <= 0 ) {
                throw new Error( "Targa - Invalid targa image size." );
            }

            if ( header.pixelDepth !== 8 &&
                header.pixelDepth !== 16 &&
                header.pixelDepth !== 24 &&
                header.pixelDepth !== 32 ) {
                throw new Error( "Targa - Invalid pixel depth:" + header.pixelDepth );
            }
        }

        private static decodeRLE( data: Uint8Array, offset: number, pixelSize: number, outputSize: number ): Uint8Array {
            let output = new Uint8Array( outputSize );
            let pixelData = new Uint8Array( pixelSize );
            let pos = 0;

            while ( pos < outputSize ) {
                let c = data[offset++];
                let count = ( c & 0x7f ) + 1;

                if ( c & 0x80 ) {
                    // RLE pixels

                    // Bind temporary array.
                    for ( let i = 0; i < pixelSize; ++i ) {
                        pixelData[i] = data[offset++];
                    }

                    // Copy to output
                    for ( let i = 0; i < count; ++i ) {
                        output.set( pixelData, pos );
                        pos += pixelSize;
                    }
                } else {
                    // Work with raw pixels
                    count *= pixelSize;
                    for ( let i = 0; i < count; ++i ) {
                        output[pos++] = data[offset++];
                    }
                }
            }

            return output;
        }

        private static getImageData8(
            imageData: Uint8ClampedArray,
            indexes: Uint8ClampedArray,
            colorMap: Uint8ClampedArray,
            width: number,
            yStart: number,
            yStep: number,
            yEnd: number,
            xStart: number,
            xStep: number,
            xEnd: number
        ): Uint8ClampedArray {
            let color: number;
            for ( let i = 0, y = yStart; y !== yEnd; y += yStep ) {
                for ( let x = xStart; x !== xEnd; x += xStep, ++i ) {
                    color = indexes[i];
                    imageData[( x + width * y ) * 4 + 3] = 255;
                    imageData[( x + width * y ) * 4 + 2] = colorMap[( color * 3 ) + 0];
                    imageData[( x + width * y ) * 4 + 1] = colorMap[( color * 3 ) + 1];
                    imageData[( x + width * y ) * 4 + 0] = colorMap[( color * 3 ) + 2];
                }
            }

            return imageData;
        }

        private static getImageData16(
            imageData: Uint8ClampedArray,
            pixels: Uint8ClampedArray,
            colorMap: Uint8ClampedArray,
            width: number,
            yStart: number,
            yStep: number,
            yEnd: number,
            xStart: number,
            xStep: number,
            xEnd: number
        ): Uint8ClampedArray {
            let color: number;
            for ( let i = 0, y = yStart; y !== yEnd; y += yStep ) {
                for ( let x = xStart; x !== xEnd; x += xStep, i += 2 ) {
                    color = pixels[i + 0] | ( pixels[i + 1] << 8 );
                    imageData[( x + width * y ) * 4 + 0] = ( color & 0x7C00 ) >> 7;
                    imageData[( x + width * y ) * 4 + 1] = ( color & 0x03E0 ) >> 2;
                    imageData[( x + width * y ) * 4 + 2] = ( color & 0x001F ) >> 3;
                    imageData[( x + width * y ) * 4 + 3] = ( color & 0x8000 ) ? 0 : 255;
                }
            }

            return imageData;
        }

        private static getImageData24(
            imageData: Uint8ClampedArray,
            pixels: Uint8ClampedArray,
            colorMap: Uint8ClampedArray,
            width: number,
            yStart: number,
            yStep: number,
            yEnd: number,
            xStart: number,
            xStep: number,
            xEnd: number
        ): Uint8ClampedArray {
            for ( let i = 0, y = yStart; y !== yEnd; y += yStep ) {
                for ( let x = xStart; x !== xEnd; x += xStep, i += 3 ) {
                    imageData[( x + width * y ) * 4 + 3] = 255;
                    imageData[( x + width * y ) * 4 + 2] = pixels[i + 0];
                    imageData[( x + width * y ) * 4 + 1] = pixels[i + 1];
                    imageData[( x + width * y ) * 4 + 0] = pixels[i + 2];
                }
            }

            return imageData;
        }

        private static getImageData32(
            imageData: Uint8ClampedArray,
            pixels: Uint8ClampedArray,
            colorMap: Uint8ClampedArray,
            width: number,
            yStart: number,
            yStep: number,
            yEnd: number,
            xStart: number,
            xStep: number,
            xEnd: number
        ): Uint8ClampedArray {
            for ( let i = 0, y = yStart; y !== yEnd; y += yStep ) {
                for ( let x = xStart; x !== xEnd; x += xStep, i += 4 ) {
                    imageData[( x + width * y ) * 4 + 2] = pixels[i + 0];
                    imageData[( x + width * y ) * 4 + 1] = pixels[i + 1];
                    imageData[( x + width * y ) * 4 + 0] = pixels[i + 2];
                    imageData[( x + width * y ) * 4 + 3] = pixels[i + 3];

                    if ( i > 1048576 ) {
                        throw new Error("too big!");
                    }
                }
            }

            return imageData;
        }

        private static getImageDataGrey8(
            imageData: Uint8ClampedArray,
            pixels: Uint8ClampedArray,
            colorMap: Uint8ClampedArray,
            width: number,
            yStart: number,
            yStep: number,
            yEnd: number,
            xStart: number,
            xStep: number,
            xEnd: number
        ): Uint8ClampedArray {
            let color: number;
            for ( let i = 0, y = yStart; y !== yEnd; y += yStep ) {
                for ( let x = xStart; x !== xEnd; x += xStep, ++i ) {
                    color = pixels[i];
                    imageData[( x + width * y ) * 4 + 0] = color;
                    imageData[( x + width * y ) * 4 + 1] = color;
                    imageData[( x + width * y ) * 4 + 2] = color;
                    imageData[( x + width * y ) * 4 + 3] = 255;
                }
            }

            return imageData;
        }

        private static getImageDataGrey16(
            imageData: Uint8ClampedArray,
            pixels: Uint8ClampedArray,
            colorMap: Uint8ClampedArray,
            width: number,
            yStart: number,
            yStep: number,
            yEnd: number,
            xStart: number,
            xStep: number,
            xEnd: number
        ): Uint8ClampedArray {
            for ( let i = 0, y = yStart; y !== yEnd; y += yStep ) {
                for ( let x = xStart; x !== xEnd; x += xStep, ++i ) {
                    imageData[( x + width * y ) * 4 + 0] = pixels[i + 0];
                    imageData[( x + width * y ) * 4 + 1] = pixels[i + 0];
                    imageData[( x + width * y ) * 4 + 2] = pixels[i + 0];
                    imageData[( x + width * y ) * 4 + 3] = pixels[i + 1];
                }
            }

            return imageData;
        }
    }
}