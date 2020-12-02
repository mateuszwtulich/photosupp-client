export class SortUtil {
    static compare(a: number | string, b: number | string, isAsc: boolean) {
        if (a !== undefined && b !== undefined) {
            return ((a < b ? -1 : 1) * (isAsc ? 1 : -1));
        } else if (a === undefined) {
            return (-1 * (isAsc ? 1 : -1));
        } else if (b === undefined) {
            return (1 * (isAsc ? 1 : -1));
        }
    }
}