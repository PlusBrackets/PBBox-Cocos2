/**
 * 字典类型
 */
export default class Dictionary<V> {
    items: any;
    constructor(data:{} = {}) {
        this.items = data;
    }

    /**是否有数据 */
    Has(key: PropertyKey): boolean {
        return this.items.hasOwnProperty(key);
    }

    /**设置数据 */
    Set(key: PropertyKey, val: V) {
        this.items[key] = val;
    }

    /**删除数据 */
    Delete(key: PropertyKey): boolean {
        if (this.Has(key)) {
            delete this.items[key];
        }
        return false;
    }

    /**获取数据 */
    Get(key: PropertyKey): V {
        return this.Has(key) ? this.items[key] : undefined;
    }

    /**清除所有数据 */
    Clear(){
        this.items = {};
    }

    Values(): V[] {
        let values: V[] = [];
        for (let k in this.items) {
            if (this.Has(k)) {
                values.push(this.items[k]);
            }
        }
        return values;
    }

    Keys():PropertyKey[]{
        let keys: PropertyKey[] = [];
        for (let k in this.items) {
            if (this.Has(k)) {
                keys.push(k);
            }
        }
        return keys;
    }
}