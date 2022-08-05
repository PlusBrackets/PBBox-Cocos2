// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { GameTimer } from "../TimeManager";

const { ccclass, property, requireComponent, menu } = cc._decorator;

@ccclass @menu("PBBox/UIComponent/AnimNumLabel") @requireComponent(cc.Label)
export default class UItem_AnimNum extends cc.Component {
    label: cc.Label;

    @property
    private num = 0;
    @property
    animOnStart = false;
    @property
    animTime = 3;
    @property
    frontText: string = "";
    @property
    backText: string = "";
    @property
    toFixed:number = 0;

    private lastNum = 0;
    private timer: GameTimer = new GameTimer();

    onLoad() {
        this.label = this.getComponent(cc.Label);
    }

    start() {
        if (!this.animOnStart)
            this.SetText(this.num);
        else{
            let to = this.num;
            let n = Number(this.label.string);
            if(Number.isNaN(n))
                n = this.num;
            this.num = n;
            this.SetNum(to);
        }
    }

    SetNum(value: number,anim:boolean = true) {
        this.lastNum = this.num
        this.num = value;
        if(!anim)
            this.lastNum = value;
        if (this.lastNum != this.num) {
            this.AnimNum();
        }
        else{
            this.SetText(this.num);
        }
    }

    GetNum() {
        return this.num;
    }

    AnimNum() {
        this.timer.Start(this.animTime)
        this.schedule(this.OnAnim)
    }

    private OnAnim() {
        let t = cc.misc.clamp01(cc.easing.quintOut(this.timer.progress));
        let n = cc.misc.lerp(this.lastNum, this.num, t);
        if (this.timer.isOver) {
            this.unschedule(this.OnAnim);
            n = this.num;
        }
        this.SetText(n);
    }

    SetText(value:number){   
        this.label.string = this.frontText + value.toFixed(this.toFixed) + this.backText;
    }
}
