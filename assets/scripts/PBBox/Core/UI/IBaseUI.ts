import { IUIController } from "./UIController";


export default interface IBaseUI{

    controller:IUIController;

    /**注册后调用 */
    OnRegister():void;
    /**注销后调用 */
    OnUnregister():void;
    /**获取UIID */
    GetUIID():string;
    /**打开UI */
    OnOpen(data?:any):void;
    /**关闭UI */
    OnClose():void;
}