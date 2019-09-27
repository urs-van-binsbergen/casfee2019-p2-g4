export class Cache<T> {

    constructor(private key: string) {
    }

    public writeCache(value: T): boolean {
        const stringifiedValue = JSON.stringify(value);
        sessionStorage.setItem(this.key, stringifiedValue);
        return true;
    }

    public readCache(): T {
        return JSON.parse(sessionStorage.getItem(this.key));
    }

    public hasCache(): boolean {
        return !(sessionStorage.getItem(this.key) === null);
    }
}
