class LocalStorageAdapter {
    
    private constructor() {}

    private static instance: LocalStorageAdapter;

    static getInstance(): LocalStorageAdapter {
        if (!this.instance) {
            this.instance = new LocalStorageAdapter();
        }
        return this.instance;
    }

    getItem<T extends {}>(key: string): T|undefined {
        try {
            const storedData = window.localStorage.getItem(key);
            if (!storedData) {
                return undefined;
            }
            return JSON.parse(storedData) as T;
        }
        catch (error) {
            return undefined;
        }
    }

    setItem<T extends {}>(key: string, item: T): boolean {
        try {
            const storeData = JSON.stringify(item);
            window.localStorage.setItem(key, storeData);
            return true;
        }
        catch (error) {
            return false;
        }
    }


}

const localStorageAdapter = LocalStorageAdapter.getInstance();
export default localStorageAdapter;