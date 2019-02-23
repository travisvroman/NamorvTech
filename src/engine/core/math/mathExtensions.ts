interface Math {

    /**
     * Returns value within the range of min/max.
     * @param value The value to be clamped.
     * @param min The minimum value.
     * @param max The maximum value.
     */
    clamp( value: number, min: number, max: number ): number;

    /**
     * Returns the provided rotation in radians.
     * @param degrees The rotation in degrees.
     */
    degToRad( degrees: number ): number;

    /**
     * Returns the provided rotation in degrees.
     * @param degrees The rotation in radians.
     */
    radToDeg( radians: number ): number;
}

( Math as any ).clamp = ( value: number, min: number, max: number ): number => {
    if ( value < min ) {
        return min;
    }
    if ( value > max ) {
        return max;
    }
    return value;
}

( Math as any ).degToRad = ( degrees: number ): number => {
    return degrees * Math.PI / 180.0;
}

( Math as any ).radToDeg = ( radians: number ): number => {
    return radians * 180.0 / Math.PI;
}