export default class MathHelper {

    /**
     * Inclusive minimum, exclusive maximum.
     * If only one value is given, it will be used as the maximum with a minimum of zero
     * @param min
     * @param max
     */
    static randomInt(min: number = 0, max: number = null): number {
        if (min !== 0 && max === null) {
            max = min;
            min = 0;
        }
        return Math.floor(Math.random() * (max - min) + min);
    }

    static randomFromArray<T>(arr: T[]): T|undefined {
        if (arr.length === 0) {
            return undefined;
        }
        return arr[this.randomInt(arr.length)];
    }



}