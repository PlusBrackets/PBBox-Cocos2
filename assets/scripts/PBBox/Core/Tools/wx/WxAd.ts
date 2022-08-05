import { EventManager } from "../EventManager";

export module WxAd {

    export class RewardedAd {

        /**关闭时间，返回isEnded，用于表示是否观看完毕 */
        static readonly EVENT_CLOSE = "EVENT_CLOSE";
        static readonly EVENT_ERROR = "EVENT_ERROR";
        static readonly EVENT_ONLOAD = "EVENT_ONLOAD";

        private wx: any;
        video: any;
        defaultEnd: boolean;

        eventManager: EventManager;

        private _onClose: Function;
        private _onErr: Function;
        private _thisArg: any;

        constructor(adId: string, defaultEnd: boolean = false) {
            this.wx = window["wx"];
            this.eventManager = new EventManager();
            this.defaultEnd = defaultEnd;
            if (!!this.wx) {
                this.video = this.wx.createRewardedVideoAd({ adUnitId: adId });
                let self = this;
                this.video.onClose(res => {
                    self.OnClose(res);
                });
                this.video.onError(err => {
                    self.OnError(err);
                });
                this.video.onLoad(() => {
                    self.OnLoad();
                })
            }
        }

        Show(onClose: (isEnded: boolean) => void, onErr?: (err) => void, thisArg?: any) {
            // this.eventManager.Once(RewardedAd.EVENT_CLOSE, onClose, thisArg);
            // !!onErr && this.eventManager.Once(RewardedAd.EVENT_ERROR, onErr, thisArg);
            this._onClose = onClose;
            this._onErr = onErr;
            this._thisArg = thisArg;
            let v = this.video;
            if (this.video) {
                this.video.show().catch(err => {
                    if (!!err) {
                        v.load().then(() => {
                            v.show();
                        });
                    }
                });
            }
            else {
                this.OnClose({ isEnded: this.defaultEnd });
                this.ClearOutsideListener();
            }
        }

        private OnClose(res) {
            let isEnd = res && res.isEnded || res === undefined;
            !!this._onClose && this._onClose.call(this._thisArg, isEnd);
            this.ClearOutsideListener();
            this.eventManager.Emit(RewardedAd.EVENT_CLOSE, isEnd);
        }

        private OnError(err) {
            console.error(err);
            !!this._onErr && this._onErr.call(this._thisArg, err);
            this.ClearOutsideListener();
            this.eventManager.Emit(RewardedAd.EVENT_ERROR, err);
        }

        private OnLoad() {
            this.eventManager.Emit(RewardedAd.EVENT_ONLOAD);
        }

        private ClearOutsideListener() {
            this._onClose = null;
            this._onErr = null;
            this._thisArg = null;
        }
    }

}