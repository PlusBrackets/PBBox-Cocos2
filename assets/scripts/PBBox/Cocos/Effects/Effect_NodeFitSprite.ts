// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, menu, property } = cc._decorator;

/**根据图片储存自适应Node的Size大小 */
@ccclass @menu("PBBox/Effects/NodeFitSprite")
export default class NodeFitSprite extends cc.Component {

    @property
    fitWidth = true;
    @property
    fitHeight = false;

    @property
    compareLarge = false;

    @property({ type: cc.Sprite, tooltip: "若为空则取自身node上的sprite" })
    targetSprite: cc.Sprite = null;


    start() {
        this.scheduleOnce(this.Resize, 0);
    }

    Resize() {
        let spr = this.targetSprite;
        if (!this.targetSprite)
            spr = this.getComponent(cc.Sprite);
        if (spr && spr.spriteFrame) {

            let spSize = spr.spriteFrame.getRect().size;
            let wHratio = spSize.width / spSize.height;

            let ss = this.node.getContentSize();
            let sWHR = ss.width / ss.height;
            let hScale = 1;
            if (this.fitWidth) {
                hScale = sWHR / wHratio;
            }
            let wScale = 1;
            if (this.fitHeight) {
                wScale = wHratio / sWHR;
            }
            if (this.fitWidth && this.fitHeight) {
                if (this.compareLarge)
                    wScale > hScale ? (hScale = 1) : (wScale = 1);
                else {
                    wScale < hScale ? (hScale = 1) : (wScale = 1);
                }
            }
            ss.width *= wScale;
            ss.height *= hScale;
            this.node.setContentSize(ss);
        }

        this.node.once(cc.Node.EventType.SIZE_CHANGED, this.Resize, this);
    }
}
