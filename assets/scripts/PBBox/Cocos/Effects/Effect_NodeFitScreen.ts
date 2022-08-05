// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property, menu } = cc._decorator;

enum FitType {
    Size,
    Scale
}

/**根据屏幕比例自适应Node的Size大小 */
@ccclass @menu("PBBox/Effects/NodeFitScreen")
export default class NodeFitScreen extends cc.Component {

    @property
    fitWidth = true;
    @property
    fitHeight = false;

    @property
    compareLarge = false;
    @property({ type: cc.Enum(FitType) })
    fitType: FitType = FitType.Size;

    defaultSize: cc.Size = null;
    defaultScale: cc.Vec3 = cc.Vec3.ONE;

    static readonly defaultW = 750;
    static readonly defaultH = 1334;

    onLoad() {
        this.defaultSize = this.node.getContentSize();
        this.node.getScale(this.defaultScale);
        cc.view.on("canvas-resize", this.Resize, this);
        this.Resize();
    }

    onDestroy() {
        cc.view.off("canvas-resize", this.Resize, this);
    }

    Resize() {
        let scale = this.compareLarge ? 0 : Number.MAX_VALUE;
        let defaultW = NodeFitScreen.defaultW;
        let defaultH = NodeFitScreen.defaultH;
        if (cc.Canvas.instance) {
            let designSize = cc.Canvas.instance.designResolution;
            defaultW = designSize.width;
            defaultH = designSize.height;
        }
        if (this.fitWidth) {
            let scaleW = cc.winSize.width / defaultW;
            scale = scaleW;
        }
        if (this.fitHeight) {
            let scaleH = cc.winSize.height / defaultH;
            if (this.compareLarge && scale < scaleH || !this.compareLarge && scale > scaleH)
                scale = scaleH;
        }
        switch (this.fitType) {
            case FitType.Size:
                let size = new cc.Size(this.defaultSize);
                size.height *= scale;
                size.width *= scale;
                this.node.setContentSize(size);
                break;
            case FitType.Scale:
                this.node.setScale(this.defaultScale.mul(scale));
                break;
        }
    }
}
