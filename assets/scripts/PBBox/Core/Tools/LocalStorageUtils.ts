/**
 * LocalStorage的一些封装，可存取json，转number和bool类型
 */
export class LocalStorageUtils {

    private constructor() { };

    private static GetItem(key: string): any {
        try {
            if (window["wx"]) {
                return window["wx"].getStorageSync(key);
            }
            else {
                return localStorage.getItem(key);
            }
        }
        catch (e) {
            console.error(e);
        }
    }

    private static SetItem(key: string, value: any) {
        try {
            if (window["wx"]) {
                return window["wx"].setStorageSync(key, value);
            }
            else {
                return localStorage.setItem(key, value);
            }
        }
        catch (e) {
            console.error(e);
        }
    }

    static RemoveItem(key: string) {
        try {
            if (window["wx"]) {
                return window["wx"].removeStorageSync(key);
            }
            else {
                return localStorage.removeItem(key);
            }
        }
        catch (e) {
            console.error(e);
        }
    }

    static ClearItme() {
        try {
            if (window["wx"]) {
                return window["wx"].clearStorageSync();
            }
            else {
                return localStorage.clear();
            }
        }
        catch (e) {
            console.error(e);
        }
    }

    /**
     * 存放数据,value为object类型时会转为json存入
     * @param key 
     * @param value 
     */
    static SetValue(key: string, value: any) {
        if (value || value === 0) {
            if (typeof value == "object") {
                let str = JSON.stringify(value);
                this.SetItem(key, str);
            }
            else {
                this.SetItem(key, value);
            }
        }
    }

    /**
     * 通过jsonParse获得数据
     * @param key 
     * @param defaultJson localStorage没有该key时，按照defaultJson返回
     * @param onParseErr 解析失败时调用
     */
    static GetJson<T>(key: string, defaultJson?: T, onParseErr?: Function): T | undefined {
        let v = this.GetItem(key);
        if (!v)
            return defaultJson;
        let obj: any = undefined;
        try {
            obj = JSON.parse(v) as T;
        }
        catch {
            !!onParseErr && onParseErr();
        }
        return obj;
    }

    /**
     * 获取number类型
     * @param key 
     * @param toInt 是否解析成int类型
     * @param defaultNum localStorage没有该key时，按照defaultNum返回
     * @param onParseErr 解析失败时调用
     */
    static GetNumber(key: string, toInt: boolean = false, defaultNum?: number, onParseErr?: Function): number | undefined {
        let v = this.GetItem(key);
        if (!v)
            return defaultNum;
        let num: any = undefined;
        try {
            if (toInt)
                num = Number.parseInt(v);
            else
                num = Number.parseFloat(v);
            if (Number.isNaN(num)) {
                !!onParseErr && onParseErr();
            }
        }
        catch {
            !!onParseErr && onParseErr();
        }
        return num;
    }

    /**
     * 获取bool类型
     * @param key 
     * @param defaultBool localStorage没有该key时，按照defaultBool返回
     * @param onParseErr 解析失败时调用
     */
    static GetBool(key: string, defaultBool?: boolean, onParseErr?: Function): boolean | undefined {
        let v = this.GetItem(key);
        if (typeof v === "boolean")
            return v;
        if (typeof v === "number")
            return v != 0;
        if (!v)
            return defaultBool;
        if (v === "true")
            return true;
        else if (v === "false")
            return false;
        else {
            !!onParseErr && onParseErr();
            return undefined;
        }

    }

    /**
     * 获取string类型
     * @param key 
     * @param defaultStr 
     */
    static GetString(key: string, defaultStr?: string): string | undefined {
        let v = this.GetItem(key);
        if (!!!v)
            return defaultStr;
        return v;
    }

}