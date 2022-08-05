import IBaseUI from "./IBaseUI";
import UIManager from "./UIManager";

export interface IUIController{
    ui:IBaseUI;
    OnOpen(data?:any):void;
    OnClose():void;
    IsOpened():boolean;
    GetUIID():string;
    OnRegister():void;
    OnUnregister():void;
}

export default abstract class UIController<UI extends IBaseUI> implements IUIController{

    private _ui:UI;
    get ui(){
        return this._ui;
    }

    private _isOpened = false;

    constructor(ui:UI){
        this._ui = ui;
        UIManager.instance.RegisterUI(this);
    }
    
    IsOpened():boolean {
        return this._isOpened;    
    }

    GetUIID() {
        return this.ui.GetUIID();
    }

    OnUnregister() {
    }

    OnRegister(){
    }   

    OnOpen(data?:any){
    }

    OnClose(){
    }


}