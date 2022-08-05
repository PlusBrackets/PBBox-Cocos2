import Dictionary from "../Variables/Dictionary";
import { PBData, PBDataOperator } from "./PBDataOperator";

/**根据key值通过PBDataOperater获得数据,需要预先new PBDataOperator()*/
export class PBDataManager {

    private static _instance: PBDataManager|null = null;
    static get instance() {
        if (!this._instance)
            this._instance = new PBDataManager();
        return this._instance;
    }

    private _operators: Dictionary<PBDataOperator>;
    get operators() {
        return this._operators;
    }

    private constructor() {
        this._operators = new Dictionary<PBDataOperator>();
    }

    /**获得数据 ,需要存在对应key值得PBDataOperator*/
    static GetData(key: string, params: any, callBack: (data: PBData) => void) {
        this.instance._GetData(key, params, callBack);
    }

    /**获得数据 */
    _GetData(key: string, params: any, callBack: (data: PBData) => void) {
        let operater = this.operators.Get(key);
        if (!operater) {
            console.error("Simulate Operater [" + key + "]未创建");
            callBack({ status: PBDataOperator.CODE_ERR, result: null });
        }
        operater.GetData(params, callBack);
    }

}