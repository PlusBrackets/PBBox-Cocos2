// import { AudioClip, AudioSource, Component, _decorator } from "cc";
import AuidoManager from "./AudioManager";

const { ccclass, menu, property } = cc._decorator;

@ccclass @menu("PBBox/Audio/BGMPlayer")
export default class BGMPlayer extends cc.Component {
    @property(cc.AudioClip)
    bgm: cc.AudioClip = null;
    @property({ range: [0, 2], slide: true })
    volumeMut: number = 1;
    @property
    loop: boolean = true;
    @property
    delay: number = 0;
    @property
    stopOnDestory = true;

    start() {1
        if (this.delay == 0)
            AuidoManager.PlayBGM(this.bgm, this.volumeMut, this.loop);
        else
            this.scheduleOnce(() => AuidoManager.PlayBGM(this.bgm, this.volumeMut, this.loop), this.delay);
        this.scheduleOnce(()=>console.log(cc.audioEngine.getState(AuidoManager.instance.bgmId)),this.delay);
    }

    onDestroy() {
        if (this.stopOnDestory)
            AuidoManager.StopBGM();
    }
}