import Dictionary from "../Core/Variables/Dictionary";

export class PBPoolObj extends cc.Component {

    static readonly OnReuseObj = "OnReuseObj";
    static readonly OnUnuseObj = "OnUnuseObj";
    protected pool: PBPool = null as any;
    protected _isInitCalled = false;
    get isInitCalled() {
        return this._isInitCalled;
    }

    unuse() {
        this.pool = null as any;
        this.OnDespawn();
        this.node.emit(PBPoolObj.OnUnuseObj);
    }

    protected OnInit() { }

    protected OnDespawn() { }

    reuse(data: any) {
        if (!this._isInitCalled) {
            this.OnInit();
            this._isInitCalled = true;
        }
        this.pool = data.pool;
        this.node.parent = data.reuseData.parent;
        this.OnSpawn(data.reuseData);
        this.node.emit(PBPoolObj.OnReuseObj, data.reuseData);
    }

    protected OnSpawn(reuseData: any) { }

    /**回收 */
    Recycle() {
        if (!!this.pool) {
            this.pool.Put(this.node);
        }
    }

}
/**对象池 */
export class PBPool {
    original: cc.Prefab;
    pool: cc.NodePool;

    constructor(prefab: cc.Prefab, preInit: number) {
        this.original = prefab;
        this.pool = new cc.NodePool(PBPoolObj);
        for (let i = 0; i < preInit; i++) {
            let obj = cc.instantiate(this.original);
            this.pool.put(obj);
        }
    }

    Get(parent: cc.Node = null as any, reuseData: any = null): cc.Node {
        if (this.pool.size() == 0) {
            let obj = cc.instantiate(this.original);
            this.pool.put(obj);
        }
        if (!reuseData)
            reuseData = {};
        reuseData.parent = parent;
        let _obj = this.pool.get({ pool: this, reuseData: reuseData }) as cc.Node;
        // if (!!_obj)
        //     _obj.parent = parent;
        return _obj;
    }

    Put(obj: cc.Node) {
        this.pool.put(obj);
    }

    Clear() {
        this.pool.clear();
    }
}

/**对象池组 */
export class PBPools extends Dictionary<PBPool>{

    RegisterObj(key: string, prefab: cc.Prefab, preInit: number): boolean {
        if (this.Has(key)) {
            // console.warn("已经存在key:[" + key + "]的对象池");
            return false;
        }
        let pool = new PBPool(prefab, preInit);
        this.Set(key, pool);
        return true;
    }

    GetObj(key: string, parent: cc.Node | null = null, reuseData: any = null): cc.Node {
        if (!this.Has(key)) {
            console.warn("请先注册key:[" + key + "]的对象池");
            return null as any;
        }
        let _obj = this.Get(key).Get(parent as cc.Node, reuseData);
        return _obj;
    }

    PutObj(key: string, obj: cc.Node) {
        if (!this.Has(key)) {
            console.warn("请先注册key:[" + key + "]的对象池");
            return;
        }
        this.Get(key).Put(obj);
    }

    /**删除数据 */
    Delete(key: PropertyKey): boolean {
        if (this.Has(key)) {
            this.items[key].Clear();
            delete this.items[key];
        }
        return false;
    }

    Clear() {
        for (let k in this.items) {
            if (this.Has(k)) {
                this.Delete(k);
            }
        }
        this.items = {};
    }

}