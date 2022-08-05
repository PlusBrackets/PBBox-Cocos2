import { EventManager } from "../Tools/EventManager";
import { LocalStorageData } from "./LocalStorageData";

export default class BindableData<T>{

    static OnChangedEvent: string = "OnChangedEvent";

    private _listener!: EventManager;
    get listener() {
        if (!this._listener)
            this._listener = new EventManager();
        return this._listener;
    }

    private _data: T;

    get data() {
        return this._data;
    }

    set data(value: T) {
        this._data = value;
        this.CallChanged();
    }

    constructor(defalutData?: T) {
        this._data = defalutData as T;
    }

    Bind(callBack: (data: T) => void, thisArg?: any, callNow: boolean = false) {
        this.listener.On(BindableData.OnChangedEvent, callBack, thisArg);
        if (callNow) {
            callBack.call(thisArg, this.data);
        }
    }

    UnBind(callBack: (data: T) => void, thisArg?: any) {
        this.listener.Off(BindableData.OnChangedEvent, callBack, thisArg);
    }

    BindOnce(callback: (data: T) => void, thisArg?: any) {
        this.listener.Once(BindableData.OnChangedEvent, callback, thisArg);
    }

    CallChanged() {
        this.listener.Emit(BindableData.OnChangedEvent, this.data);
    }

}
