export function sum(array: number[]): number{
    let s = 0;
    array.forEach( a => s += a);
    return s
}