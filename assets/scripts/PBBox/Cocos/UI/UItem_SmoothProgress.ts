// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property, requireComponent, menu } = cc._decorator;

@ccclass @menu("PBBox/UIComponent/SmoothProgress")@requireComponent(cc.ProgressBar)
export default class UItem_SmoothProgress extends cc.Component {
    progressBar:cc.ProgressBar;

    private _progress = 0;
    @property
    smooth = 5;

    get progress(){
        return this._progress;
    }
    @property({range:[0,1],slide:true})
    set progress(value){
        this._progress = value;
    }

    onLoad(){
        this.progressBar = this.getComponent(cc.ProgressBar);
        this.progressBar.progress = this.progress;
    }

    update(dt){
        if(this.progressBar.progress!=this.progress){
            this.progressBar.progress = cc.misc.lerp(this.progressBar.progress,this.progress,cc.misc.clamp01(dt*this.smooth));
        }
    }
}
