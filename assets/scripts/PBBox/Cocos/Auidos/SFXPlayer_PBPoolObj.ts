// import { AudioClip, Component, _decorator } from "cc";
import { PBPoolObj } from "../PBPool";
import SFXPlayer from "./SFXPlayer";

const { ccclass, property ,menu} = cc._decorator;

@ccclass@menu("PBBox/Audio/SFXPlayer_PBPoolObj")
export default class SFXPlayer_PBPoolObj extends SFXPlayer {

    private poolObj:PBPoolObj;

    onLoad(){
        this.poolObj = this.getComponent(PBPoolObj);
        if(this.poolObj.isInitCalled){ 
            this.OnSpawned();
        }
        this.node.on(PBPoolObj.OnReuseObj,this.OnSpawned,this);
    }

    private OnSpawned(){
        this.PlaySFXs();
    }
    
}