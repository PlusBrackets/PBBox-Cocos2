import BundleManager from "../BundleManager";

const { property, ccclass, requireComponent, menu } = cc._decorator

export enum BundleLoadSpriteFixedSize {
    None,
    FixedWidth,
    FixedHeight,
    ScaleBySource
}

@ccclass @requireComponent(cc.Sprite) @menu("PBBox/UIComponent/BundleLoadSprite")
export default class UItem_BundleLoadSprite extends cc.Component {

    private sprite: cc.Sprite = null;
    @property
    sizeScale: number = 1;
    @property({ type: cc.Enum(BundleLoadSpriteFixedSize) })
    resizeType: BundleLoadSpriteFixedSize = BundleLoadSpriteFixedSize.None;

    isSpriteLoaded = false;

    onLoad() {
        this.sprite = this.getComponent(cc.Sprite);
    }

    LoadSprite(bundle: string, spritePath: string,callBack:Function=null) {
        let self = this;
        this.isSpriteLoaded = false;
        BundleManager.instance.LoadRes(bundle, spritePath, cc.SpriteFrame, (err, asset) => {
            self.OnLoadedSprite(err, asset as cc.SpriteFrame,callBack);
        }
        );
    }

    LoadAtlasSprite(bundle: string, atlasPath: string, spriteName: string, callBack: Function | null = null) {
        let self = this;
        this.isSpriteLoaded = false;
        BundleManager.instance.LoadRes(bundle, atlasPath, cc.SpriteAtlas, (err: Error | undefined, asset: any) => {
            self.OnLoadedSprite(err, (asset as cc.SpriteAtlas).getSpriteFrame(spriteName), callBack as Function);
        }
        );
    }

    protected OnLoadedSprite(err: Error, asset: cc.SpriteFrame,callBack:Function) {
        if (!err) {
            this.sprite.spriteFrame = asset;
            this.ResizeOnload();
            !!callBack&&callBack();    
            this.isSpriteLoaded = true;
        }
    }

    protected ResizeOnload() {
        let sourceSize = this.sprite.spriteFrame.getOriginalSize();
        let nodeSize = this.node.getContentSize();
        switch (this.resizeType) {
            case BundleLoadSpriteFixedSize.FixedWidth:
                nodeSize.height = nodeSize.width / sourceSize.width * sourceSize.height;
                break;
            case BundleLoadSpriteFixedSize.FixedHeight:
                nodeSize.width = nodeSize.height / sourceSize.height * sourceSize.width;
                break;
            case BundleLoadSpriteFixedSize.ScaleBySource:
                nodeSize.width = sourceSize.width * this.sizeScale;
                nodeSize.height = sourceSize.height * this.sizeScale;
                break;
        }
        this.node.setContentSize(nodeSize);
    }
}