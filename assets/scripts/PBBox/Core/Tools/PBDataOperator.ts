import { PBDataManager } from "./PBDataManager";

export type PBData = Required<{ status: number, result: any }>;

export type PBOperatorFunc = (key: string, param: any, callBack: (data: PBData) => void) => void;

/**
 * PBDataManager的数据操作类,对使用PBDataManager.GetData传入的参数进行操作，并返回结果
 */
export class PBDataOperator {

    static readonly CODE_ERR = 404;
    static readonly CODE_SUCCESS = 200;

    private _key: string;
    get key() {
        return this._key;
    }

    /**
     * PBDataManager的数据操作类,对使用PBDataManager.GetData传入的参数进行操作，并返回结果
     * @param key 唯一标识
     * @param OnGetData 对参数进行处理操作的方法
     */
    constructor(key: string, OnGetData?: PBOperatorFunc) {
        this._key = key;
        !!OnGetData && (this.OnGetData = OnGetData);
        this.SetToManager();
    }

    private SetToManager() {
        let sd = PBDataManager.instance.operators;
        if (sd.Has(this._key)) {
            console.error("Simulate Data Manager 已经有key值为[" + this._key + "]的数据了");
            return;
        }
        sd.Set(this._key, this);
    }

    OnGetData: PBOperatorFunc = (key, param, callBack) => {
        !!callBack && callBack({ status: PBDataOperator.CODE_ERR, result: null });
    }

    GetData(param: any, callBack: (data: PBData) => void) {
        return this.OnGetData(this._key, param, !!callBack ? callBack : () => { });
    }

}