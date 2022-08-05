import ShareVariables from "./ShareVariables";
import { Task } from "./Task";

/**
 * 可以设置获取默认值，
 * 或者获取owner中的shareVariable，
 * 或者获取GlobalShareVariable中的值
 */
export default class ShareValue {

    private _variableName: string = "";
    get variableName() { return this._variableName; }
    private _isGlobal: boolean = false;
    get isGlobal() { return this._isGlobal; }
    private _value: any = null;
    /**
     * 默认值
     */
    set value(_value: any) {
        this._value = _value;
    }

    protected constructor() { }

    /**
     * 获取值
     * @param task 传入task以便获取Onwer
     */
    GetValue<T>(task: Task): T {
        if (!!this.variableName) {
            if (this.isGlobal)
                //从全局变量中取值
                return ShareVariables.Get(this.variableName) as T;
            else
                //从Owner的Variables中取值
                return task.GetOwner().GetVariable().Get(this.variableName) as T;
        }
        else
            //返回自身的值
            return this._value as T;
    }

    /**
     * 新建一个默认值的ShareValue
     * @param value 
     */
    static Value(value: any): ShareValue {
        let v = new ShareValue();
        v._value = value;
        return v;
    }

    /**
     * 新建一个从外部获取值的ShareValue
     * @param variableName 值名称
     * @param isGlobal 是否从GlobalVariable中获取
     */
    static Share(variableName: string, isGlobal: boolean = false): ShareValue {
        let v = new ShareValue();
        v._variableName = variableName;
        v._isGlobal = isGlobal;
        return v;
    }
}