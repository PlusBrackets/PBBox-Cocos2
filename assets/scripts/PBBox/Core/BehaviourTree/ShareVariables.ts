import Dictionary from "../Variables/Dictionary";

/**可分享数据 */
export default class ShareVariables extends Dictionary<any>{
    
    // protected _data: any;
    // protected get data() {
    //     if (!!!this._data)
    //         this._data = {};
    //     return this._data;
    // }

    // /**获取数据 */
    // Get(name: string): any {
    //     return this.data[name];
    // }

    // /**设置数据 */
    // Set(name: string, value: any) {
    //     this.data[name] = value;
    // }

    // /**删除数据 */
    // Delete(name: string) {
    //     delete this.data[name];
    // }
    // /**清除所有数据 */
    // Clear(){
    //     this._data = null;
    // }

    protected static _Global:ShareVariables = null as any;
    protected static get Global(){
        if(!!!this._Global){
            this._Global = new ShareVariables();
        }
        return this._Global;
    }

    /**获取全局数据 */
    static Get(name:PropertyKey):any{
        return this.Global.Get(name);
    }

    /**设置全局数据 */
    static Set(name:PropertyKey,value:any){
        this.Global.Set(name,value);
    }

    /**删除全局数据 */
    static Delete(name:PropertyKey){
        this.Global.Delete(name);
    }

    /**清理全局数据 */
    static Clear(){
        if(!!this._Global)
            this._Global.Clear();
        this._Global = null as any;
    }

}