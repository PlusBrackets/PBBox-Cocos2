// import { UITransform, Vec3 } from "cc";

export module PB2DUtils {

    let _tempVec3: cc.Vec3;
    export const tempVec3 = () => {
        if (!_tempVec3)
            _tempVec3 = new cc.Vec3();
        return _tempVec3;
    }

    export class UIAnchorMarginData {
        x: number;
        y: number;
        left: number;
        right: number;
        top: number;
        bottom: number;
    }

    export const CheckUIRectCross = (a: UIAnchorMarginData, b: UIAnchorMarginData): boolean => {
        let av = a.top + a.bottom > b.top + b.bottom;
        let ra = av ? a : b;
        let rb = av ? b : a;
        let vt = ra.y + ra.top >= rb.y - rb.bottom && ra.y - ra.bottom <= rb.y + rb.top;
        let ah = a.left + a.right > b.left + b.right;
        ra = ah ? a : b;
        rb = ah ? b : a;
        let ht = ra.x + ra.right >= rb.x - rb.left && ra.x - ra.left <= rb.x + rb.right;
        return vt && ht;
    }

    export const GetUITransformMargin = (uitransfrom: cc.Node, out: UIAnchorMarginData, toParent?: cc.Node): UIAnchorMarginData => {
        const csize = uitransfrom.getContentSize();
        out.left = uitransfrom.anchorX * csize.width;
        out.right = (1 - uitransfrom.anchorX) * csize.width;
        out.bottom = uitransfrom.anchorY * csize.height;
        out.top = (1 - uitransfrom.anchorY) * csize.height;
        let p = tempVec3();
        if (toParent) {
            toParent.convertToNodeSpaceAR(uitransfrom.parent.convertToWorldSpaceAR(uitransfrom.position, p));
        }
        else {
            uitransfrom.getPosition(p);
        }
        out.x = p.x;
        out.y = p.y;
        return out;
    }
}