import { LocalStorageUtils } from "../Tools/LocalStorageUtils";

export class LocalStorageData<T>{
    private _data: T;
    private _localStorageKey: string;
    private _defaultData: T;

    constructor(localStorageKey: string, defalutData: T = undefined) {
        this._localStorageKey = localStorageKey;
        this._defaultData = defalutData;
    }

    GetData(clone = false) {
        if (!this._data)
            this._data = LocalStorageUtils.GetJson(this._localStorageKey, this._defaultData);
        let d = this._data;
        if (clone) {
            d = JSON.parse(JSON.stringify(this._data));
        }
        return d;
    }

    SaveData() {
        if (!!this._data) {
            LocalStorageUtils.SetValue(this._localStorageKey, this._data);
        }
    }

    ClearCache() {
        this._data = null;
    }

    DeleteData() {
        this.ClearCache();
        LocalStorageUtils.RemoveItem(this._localStorageKey);
    }

}

abstract class LocalStorageValue<T> {
    protected _localStorageKey: string;
    //private _valueType: "string" | "int" | "number" | "boolean";
    protected _defaultValue: T;
    get value(): T {
        return this.OnGetValue();
    }

    set value(v: T) {
        LocalStorageUtils.SetValue(this._localStorageKey, v);
    }

    onParseErr() {
        console.error(this._localStorageKey + "的数据不能抓换为对应类型");
    }

    protected abstract OnGetValue(): T;

    constructor(localStorageKey: string, defaultValue: T = undefined) {
        this._localStorageKey = localStorageKey;
        this._defaultValue = defaultValue;
    }
}

export class LocalStorageNum extends LocalStorageValue<number> {

    private toInt: boolean = false;

    constructor(localStorageKey: string, defaultValue: number = undefined, toInt = false) {
        super(localStorageKey, defaultValue);
        this.toInt = toInt;
    }

    OnGetValue() {
        let self = this;
        return LocalStorageUtils.GetNumber(this._localStorageKey, this.toInt, this._defaultValue, ()=>{self.onParseErr()});
    }
}

export class LocalStorageStr extends LocalStorageValue<string>{
    OnGetValue() {
        return LocalStorageUtils.GetString(this._localStorageKey, this._defaultValue);
    }
}

export class LocalStorageBool extends LocalStorageValue<boolean>{
    OnGetValue() {
        let self = this;
        return LocalStorageUtils.GetBool(this._localStorageKey, this._defaultValue, ()=>{self.onParseErr()});
    }
}
