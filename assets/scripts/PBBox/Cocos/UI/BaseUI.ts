// import { Component, _decorator } from "cc";
import IBaseUI from "../../Core/UI/IBaseUI";
import { IUIController } from "../../Core/UI/UIController";
import UIManager from "../../Core/UI/UIManager";

const { ccclass, property } = cc._decorator

@ccclass
export default abstract class BaseUI<C extends IUIController> extends cc.Component implements IBaseUI {

    protected _controller!: C;
    get controller():C{
        return this._controller;
    }

    @property({ tooltip: "是否默认打开" })
    defaultOpen = false;

    onLoad() {
        this.Init();
    }

    start() {
        if (this.defaultOpen)
            UIManager.instance.OpenUI(this.GetUIID(), this.GetDefaultOpenData);
        else {
            this.node.active = false;
        }
    }

    /**如果defaultOpen==true，可以从这里获取默认打开的数据 */
    GetDefaultOpenData(): any { return null }

    abstract Init():void;

    OnRegister() {

    }

    OnUnregister() {

    }

    abstract GetUIID(): string;

    OnOpen(data?: any) {
        this.node.active = true;
    }
    OnClose() {
        this.node.active = false;
    }

    onDestroy() {
        UIManager.instance.UnRegisterUI(this._controller);
    }

}