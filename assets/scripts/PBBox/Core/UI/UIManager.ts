import Dictionary from "../Variables/Dictionary";
import { IUIController } from "./UIController";

/**
 * ui管理器
 */
export default class UIManager {

    private static _instance: UIManager | null = null;
    static get instance() {
        if (!!!this._instance)
            this._instance = new UIManager();
        return this._instance;
    }

    private uiCtrls!: Dictionary<IUIController>;

    private constructor() {
        this.uiCtrls = new Dictionary<IUIController>();
    }

    /**注册UI */
    RegisterUI(uiC: IUIController): boolean {
        let _id = uiC.GetUIID();
        if (this.uiCtrls.Has(_id)) {
            console.warn(`UI:${_id}已经注册过了`);
            return false;
        }
        this.uiCtrls.Set(_id, uiC);
        uiC.OnRegister();
        uiC.ui.OnRegister();
        return true;

    }

    /**注销UI */
    UnRegisterUI(uiC: IUIController) {
        let _id = uiC.GetUIID();
        if (this.uiCtrls.Has(_id)) {
            this.uiCtrls.Delete(_id);
            uiC.OnUnregister();
            uiC.ui.OnUnregister();
        }
        else {
            console.warn(`UI:${_id}未被注册过`);
        }
    }

    /**打开UI */
    OpenUI<T extends IUIController>(uiid: string, data?: any): T | null {
        let _uiC = this.uiCtrls.Get(uiid);
        if (!!!_uiC) {
            console.warn(`UI:${uiid}未注册，无法打开`);
            return null;
        }
        if (_uiC.IsOpened()) {
            // console.warn("UI:[%s]正在Open状态，无法重复open");
            return null;
        }
        (_uiC as any)["_isOpened"] = true;
        _uiC.OnOpen(data);
        _uiC.ui.OnOpen(data);
        return (_uiC as T);
    }

    /**关闭ui */
    CloseUI<T extends IUIController>(uiid: string): T | null {
        let _uiC = this.uiCtrls.Get(uiid);
        if (!!!_uiC) {
            console.warn(`UI:${uiid}未注册，无法关闭`);
            return null;
        }
        if (!_uiC.IsOpened()) {
            // console.warn("UI:[%s]正在Close状态，无法重复Close");
            return null;
        }
        (_uiC as any)["_isOpened"] = false;
        _uiC.OnClose();
        _uiC.ui.OnClose();
        return (_uiC as T);
    }

    GetUI<T extends IUIController>(uiid: string): T | null {
        let _uiC = this.uiCtrls.Get(uiid);
        if (!!!_uiC) {
            console.warn(`UI:${uiid}未注册，无法获取`);
            return null;
        }
        return (_uiC as T);
    }

}