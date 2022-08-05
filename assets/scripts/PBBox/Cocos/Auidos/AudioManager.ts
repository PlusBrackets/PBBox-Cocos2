// import { AudioClip, AudioSource, game, Node, Prefab } from "cc";
import { PBPool } from "../PBPool";
// import SFXPlaySource from "./SFXPlaySource";


export type SFXCfg = Partial<{
    volumeMut?: number;
    delay?: number;
    // loop?: boolean;
    // duration?: number;
}>

export default class AuidoManager {
    private static _instance: AuidoManager | null = null;
    static get instance() {
        if (!this._instance)
            this._instance = new AuidoManager();
        return this._instance;
    }

    private soundsPlayer: cc.AudioSource;
    private bgmPlayer: cc.AudioSource;
    // private sfxPlayerPool: PBPool;
    private _bgmId: number = undefined;
    get bgmId():number{
        return this._bgmId;
    }
    private currentBgmClip: cc.AudioClip = null;

    private _soundsVolume: number = 1;
    get soundVolume() {
        return this._soundsVolume;
    }
    set soundVolume(value: number) {
        this._soundsVolume = value;
        // this.soundsPlayer.volume = value;
        cc.audioEngine.setEffectsVolume(value);
    }

    private _bgmVolume: number = 1;
    get bgmVolume() {
        return this._bgmVolume;
    }
    set bgmVolume(value: number) {
        this._bgmVolume = value;
        // this.bgmPlayer.volume = value * this.bgmVolumeMut;
        // cc.audioEngine.setMusicVolume(value * this.bgmVolumeMut);
        if (this._bgmId !== undefined) {
            cc.audioEngine.setVolume(this._bgmId, value * this._bgmVolumeMut);
        }

    }
    private _bgmVolumeMut: number = 1;
    get bgmVolumeMut() {
        return this._bgmVolumeMut;
    }
    set bgmVolumeMut(value: number) {
        this._bgmVolumeMut = value;
        this.bgmVolume = this.bgmVolume;
    }

    private constructor() {

        this.soundsPlayer = new cc.Node("SoundsPlayNode").addComponent(cc.AudioSource);
        this.bgmPlayer = new cc.Node("BgmPlayNode").addComponent(cc.AudioSource);
        cc.game.addPersistRootNode(this.soundsPlayer.node);
        cc.game.addPersistRootNode(this.bgmPlayer.node);
        this.soundsPlayer.volume = this.soundVolume;
        this.bgmPlayer.volume = this.bgmVolume;
    }

    static PlaySFX(clip: cc.AudioClip, volumeMut?: number): void;
    static PlaySFX(clip: cc.AudioClip, cfg: SFXCfg): void;

    static PlaySFX(clip: cc.AudioClip, param?: number | SFXCfg) {
        if (!param && param != 0)
            param = 1;
        if (typeof param === "number") {
            // this.instance.soundsPlayer.playOneShot(clip, param);
            let sfxid = cc.audioEngine.playEffect(clip, false);
            cc.audioEngine.setVolume(sfxid, param);
        }
        else {
            // let data: any = {};
            // data.volume = (!!param.volumeMut ? param.volumeMut : 1) * this.instance.soundVolume;
            // data.clip = clip;
            // data = Object.assign(data, param);
            // this.instance.sfxPlayerPool.Get(this.instance.soundsPlayer.node, data);
            let voluemMut = !!param.volumeMut ? param.volumeMut : 1;
            this.instance.soundsPlayer.scheduleOnce(() => {
                AuidoManager.PlaySFX(clip, voluemMut);
            }, param.delay)
        }
    }

    static PlayBGM(clip: cc.AudioClip, volumeMut?: number, loop: boolean = true) {
        // console.log(this.instance.bgmPlayer.clip);
        this.instance.bgmPlayer.loop = loop;
        // this.instance._bgmVolumeMut = 1;

        if (!this.instance.currentBgmClip || this.instance.currentBgmClip.name !== clip.name) {
            if (this.instance._bgmId !== undefined) {
                cc.audioEngine.stop(this.instance._bgmId);
            }
            this.instance.currentBgmClip?.decRef();
            this.instance.currentBgmClip = clip;
            this.instance.currentBgmClip.addRef();
            this.instance._bgmId = cc.audioEngine.play(clip, loop, 1);
        }

        if (typeof volumeMut === "number") {
            if (Math.abs(this.instance.bgmVolumeMut - volumeMut) > 0.05) {
                AuidoManager.SetBgmVolumeMut(volumeMut);
            }
            else {
                this.instance.bgmVolumeMut = volumeMut;
            }
        }
        this.instance.bgmVolume = this.instance.bgmVolume;

        // if (!this.instance.bgmPlayer.clip || clip.name != this.instance.bgmPlayer.clip.name) {
        //     this.instance.bgmPlayer.clip?.decRef();
        //     clip.addRef();
        //     if (this.instance.bgmPlayer.isPlaying) {
        //         this.instance.bgmPlayer.stop();
        //     }
        //     this.instance.bgmPlayer.clip = clip;
        //     this.instance.bgmPlayer.play();
        // }
        // cc.audioEngine.play(clip,loop,1);
        // clip.addRef();
        // cc.audioEngine.playMusic(clip, loop);
        // cc.audioEngine.
    }

    static StopBGM() {
        // this.instance.bgmPlayer.stop();
        // this.instance.bgmPlayer.clip?.decRef();
        // cc.audioEngine.stopMusic();
        if (this.instance._bgmId !== undefined) {
            cc.audioEngine.stop(this.instance._bgmId);
            this.instance._bgmId = undefined;
            this.instance.currentBgmClip.decRef();
            this.instance.currentBgmClip = null;
        }
    }

    static PauseBGM() {
        if (this.instance._bgmId !== undefined) {
            cc.audioEngine.pause(this.instance._bgmId);
        }
        // this.instance.bgmPlayer.pause();
        // cc.audioEngine.pauseMusic();
    }

    static ResumeBGM() {
        if (this.instance._bgmId !== undefined) {
            if (cc.audioEngine.getState(this.instance._bgmId) === cc.audioEngine.AudioState.PAUSED)
                cc.audioEngine.resume(this.instance._bgmId);
        }
        // if (!this.instance.bgmPlayer.isPlaying)
        //     this.instance.bgmPlayer.play();
        // cc.audioEngine.resumeMusic();
    }

    static SetBgmVolumeMut(value: number, dur: number = 0.5) {
        if (value === this.instance.bgmVolumeMut)
            return;
        cc.tween(this.instance).to(dur, { bgmVolumeMut: value }).call(() => {
            AuidoManager.instance.bgmVolumeMut = value
        }).start();
    }

}