// import { AudioClip, Component, _decorator } from "cc";
import AuidoManager from "./AudioManager";

const { ccclass, property,menu} = cc._decorator;

@ccclass("PlaySFXCfg")
export class PlaySFXCfg{
    @property(cc.AudioClip)
    clip:cc.AudioClip = null;
    @property()
    volumeMut:number = 1
    @property()
    delay:number = 0;
    // @property
    // duration:number = 0; 
}

@ccclass@menu("PBBox/Audio/SFXPlayer")
export default class SFXPlayer extends cc.Component{
    @property([PlaySFXCfg])
    sfxCfgs:PlaySFXCfg[] = [];
    @property({tooltip:"若为true，则会在sfxCfgs中随机选取一个来播放"})
    isRamdomMode:boolean =false;

    PlaySFXs(){
        this.sfxCfgs.forEach(cfg => {
            AuidoManager.PlaySFX(cfg.clip,{
                volumeMut:cfg.volumeMut,
                delay:cfg.delay,
                // duration:cfg.duration
            })
        });
    }
}