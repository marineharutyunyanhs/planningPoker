export const FIBONACCI_NUMBERS  = ['1','2','3','5','8','13','20','40','100','?'];
export const ENDPOINT = 'localhost:5000';
export const DEFAULT_USER_TYPE = "player";
export const ADMIN_USER_TYPE = "admin";
export const DEFAULT_POINT = "?";
export const NO_POINT = "noPoint";
export const BrowserTitle = "PP Project";

export function isEmptyObject (object) {
    return !Array.isArray(object) && Object.keys(object).length === 0;
}

export function getUnicID () {
    return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}

export function getEstimatorsCount (users) {
    return users.filter((user) => user.type === DEFAULT_USER_TYPE).length;
}

export function getAveragePoint (points) {

    if(isEmptyObject(points)){
        return {average: 0, averageConvertedToFib: 0};
    } else {
        const validPoints = Object.keys(points).reduce((prev, curr)=> {
            points[curr] !== "?" && prev.push( parseInt(points[curr]));
            return prev;
        }, []);

        const average = validPoints.length && validPoints.reduce((prev, curr) => prev + curr) / validPoints.length;
        const fib = [...FIBONACCI_NUMBERS];
        fib.pop();
        const averageConvertedToFib = fib.find(num => parseInt(num) >= average);
        return average === 0 ? {average, averageConvertedToFib: 0} : {average, averageConvertedToFib};
    }
}
