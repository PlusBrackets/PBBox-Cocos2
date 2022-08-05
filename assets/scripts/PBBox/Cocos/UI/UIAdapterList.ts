import { PBPool, PBPoolObj } from "../PBPool";
import { PB2DUtils } from "../Utils/PB2DUtils";

const { property } = cc._decorator

/**适配数据item */
export class UIAdapterItem<Data> extends PBPoolObj {

    protected _data: Data = null;
    get data(): Data { return this._data; }
    protected _adapterList: UIAdapterList<Data> = null;
    get adapterList() {
        return this._adapterList;
    }
    protected _index = -1;
    get index() {
        return this._index;
    }

    protected _selected = false;
    get selected() {
        return this._selected;
    }

    CanSelect(): boolean {
        return true;
    }

    SetData(data: Data, adapterList: UIAdapterList<Data>, index: number) {
        this._data = data;
        this._adapterList = adapterList;
        this._index = index;
        this.OnDataChanged(data);
    }

    OnDataChanged(data: Data){};

    OnSelected() { };

    OnDeselected() { };

    OnInShowRect() {
        this.node.active = true;
    };
    OnOutShowRect() {
        this.node.active = false;
    };

}

/**自动适配数据的listUI */
export class UIAdapterList<Data> extends cc.Component {

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;
    @property(cc.Node)
    itemContain: cc.Node = null;
    protected datas: Data[] = [];
    protected items: UIAdapterItem<Data>[] = [];
    protected itemPool: PBPool;

    @property
    defaultSelected: number = -1
    @property(cc.Node)
    protected showItemRect: cc.Node = null;

    @property
    autoShowHideItem: boolean = true;

    private showItemMergin: PB2DUtils.UIAnchorMarginData = new PB2DUtils.UIAnchorMarginData();
    private _tempMergin = new PB2DUtils.UIAnchorMarginData();

    private _selected: number = -1;
    get selected() {
        return this._selected;
    }
    set selected(value) {
        if (this._selected != value) {
            let item = this.selectedItem;
            if (!!item) {
                item["_selected"] = false;
                item.OnDeselected();
            }
            this._selected = value;
            item = this.selectedItem;
            if (!!item && item.CanSelect()) {
                item["_selected"] = true;
                item.OnSelected();
            }
            else
                this._selected = -1;
        }
    }

    get selectedItem() {
        if (this.items.length > this._selected && this._selected >= 0) {
            return this.items[this._selected];
        }
    }

    onLoad() {
        this.itemPool = new PBPool(this.itemPrefab, 1);
    }

    onDestroy(){
        this.itemPool.Clear();
    }

    start() {
        this.SetData(this.datas);
        this.selected = this.defaultSelected;
    }

    SetData(datas: Data[]) {
        this.datas = datas;
        this.ResetItem();
    }

    GetData() { return this.datas; }

    GetItems() { return this.items; }

    protected ResetItem() {
        for (let i = 0; i < this.datas.length; i++) {
            let d = this.datas[i];
            if (i >= this.items.length) {
                let p = this.itemPool.Get(this.itemContain);
                this.items.push(p.getComponent(UIAdapterItem));
            }
            this.items[i].SetData(d, this, i);
        }
        for (let j = this.items.length - 1; j >= this.datas.length; j--) {
            if (this.selected == j)
                this.selected = -1;
            let item = this.items.pop();
            item.SetData(null, null, -1);
            this.itemPool.Put(item.node);
        }
    }

    lateUpdate() {
        this.autoShowHideItem && this.UpdateItemShowOrHide();
    }

    UpdateItemShowOrHide() {
        if(!this.showItemRect)
            return;
        PB2DUtils.GetUITransformMargin(this.showItemRect, this.showItemMergin);
        this.showItemMergin.x = 0;
        this.showItemMergin.y = 0;
        this.items.forEach(item => {
            PB2DUtils.GetUITransformMargin(item.node, this._tempMergin, this.showItemRect);
            if (PB2DUtils.CheckUIRectCross(this.showItemMergin, this._tempMergin)) {
                item.OnInShowRect();
            }
            else {
                item.OnOutShowRect();
            }
        });

    }

}