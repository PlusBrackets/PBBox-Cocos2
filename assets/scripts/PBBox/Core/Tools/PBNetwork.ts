import { EventManager } from "./EventManager";
import { PBDataManager } from "./PBDataManager";
import { PBDataOperator } from "./PBDataOperator";

export type PBHttpSetting = Partial<{
    url: string;
    data: any;
    responseType: XMLHttpRequestResponseType;
    headers: {};
    timeout: number;    
    loadstart: (xhr: XMLHttpRequest) => void;
    success: (result: any, status: number, xhr: XMLHttpRequest) => void;
    error: (status: number, xhr: XMLHttpRequest, error: ProgressEvent<XMLHttpRequestEventTarget>) => void;
    loadend: (status: number, xhr: XMLHttpRequest) => void;
    progress: (loaded: number, total: number, xhr: XMLHttpRequest, ev: ProgressEvent<XMLHttpRequestEventTarget>) => void;
}>

/**
 * 网络请求
 */
export class PBNetwork {

    /**(xhr:XMLHttpRequest)=>void */
    static readonly EVENT_LOADSTART = "loadstart";
    /**(status: number, xhr: XMLHttpRequest) => void */
    static readonly EVENT_LOADEND = "loadend";
    /**(result: any, status: number, xhr: XMLHttpRequest) => void */
    static readonly EVENT_SUCCESS = "success";
    /**(status: number, xhr: XMLHttpRequest, error: ProgressEvent<XMLHttpRequestEventTarget>) => void */
    static readonly EVENT_ERROR = "error";
    /**(loaded: number, total: number, xhr: XMLHttpRequest, ev: ProgressEvent<XMLHttpRequestEventTarget>) => void */
    static readonly EVENT_PROGRESS = "progress";

    private static _instance: PBNetwork|null = null;
    static get instance() {
        if (!this._instance)
            this._instance = new PBNetwork();
        return this._instance;
    }

    /**
     * 事件管理器，使用PBNetwork.EVENT等事件监听请求状态
     */
    private _eventManager: EventManager;
    get eventManager() {
        return this._eventManager;
    }

    /**
     * 当转化为请求字符串时调用，可用来判断value的类型进行自定义的解析
     */
    onParseQueryData: (key: string, value:any) => string = (key, value) => { return value; }

    private constructor() {
        this._eventManager = new EventManager();
    }

    /**
     * Post请求
     * @param setting 
     * @param simulate 是否使用PBDataManager的数据进行模拟，key值为setting.url 
     * @param simulateLag 模拟延迟的时间
     */
    static POST(setting: PBHttpSetting, simulate = false, simulateLag = 0): XMLHttpRequest|null {
        if (!simulate)
            return this.instance.HttpRequest(setting, "POST");
        else
            return this.instance.SimulateHttpRequest(setting, simulateLag);
    }

    /**
     * Get请求
     * @param setting 
     * @param simulate 是否使用PBDataManager的数据进行模拟，key值为setting.url 
     * @param simulateLag 模拟延迟的时间
     */
    static GET(setting: PBHttpSetting, simulate = false, simulateLag = 0): XMLHttpRequest|null {
        if (!simulate)
            return this.instance.HttpRequest(setting, "GET");
        else
            return this.instance.SimulateHttpRequest(setting, simulateLag);
    }

    /**
     * 默认的网络请求设置,参数会被Post或Get传入的setting的参数覆盖
     */
    defalutHttpSetting: PBHttpSetting = {
        responseType: "text",
        headers: { "Content-type": "application/x-www-form-urlencoded" },
        timeout: 0
    }


    /**模拟请求网络访问*/
    private SimulateHttpRequest(setting: PBHttpSetting, simulateLag: number = 0) {
        //loadstart
        this._eventManager.Emit(PBNetwork.EVENT_LOADSTART, null);
        !!setting.loadstart && setting.loadstart(null as any);

        let self = this;
        let request = () => {
            PBDataManager.GetData(setting.url as string, setting.data, (sdata) => {
                if (sdata.status == PBDataOperator.CODE_SUCCESS) {
                    self._eventManager.Emit(PBNetwork.EVENT_SUCCESS, sdata.result, sdata.status, null);
                    !!setting.success && setting.success(sdata.result, sdata.status, null as any);
                }
                else {
                    self._eventManager.Emit(PBNetwork.EVENT_ERROR, sdata.status, null, null);
                    !!setting.error && setting.error(sdata.status, null as any, null as any);
                }
                self._eventManager.Emit(PBNetwork.EVENT_LOADEND, sdata.status, null);
                !!setting.loadend && setting.loadend(sdata.status, null as any);
            });
        }

        if (simulateLag > 0) {
            setTimeout(() => {
                request();
            }, simulateLag);
        }
        else {
            request();
        }
        return null;
    }

    /**
     * 使用XMLHttpRequest进行网络请求
     */
    private HttpRequest(setting: PBHttpSetting, requestType: string = "GET"): XMLHttpRequest|null {
        let _setting: PBHttpSetting = {};
        _setting = Object.assign(_setting, this.defalutHttpSetting);
        _setting = Object.assign(_setting, setting);
        if (!_setting.url || !_setting.responseType) {
            console.error("http request param err");
            return null;
        }
        let xhr = new XMLHttpRequest();
        xhr.addEventListener("loadstart", e => {
            this._eventManager.Emit(PBNetwork.EVENT_LOADSTART, xhr);
            !!_setting.loadstart && _setting.loadstart(xhr);
        });
        xhr.addEventListener("loadend", e => {
            !!_setting.loadend && _setting.loadend(xhr.status, xhr);
            this._eventManager.Emit(PBNetwork.EVENT_LOADSTART, xhr);
        });
        xhr.addEventListener("load", e => {
            const status = xhr.status;
            if ((status >= 200 && status < 300) || status === 304) {
                let result;
                if (xhr.responseType === "text" || xhr.responseType === "") {
                    result = xhr.responseText;
                }
                else if (xhr.responseType === "document") {
                    result = xhr.responseXML;
                }
                else {
                    result = xhr.response;
                }
                !!_setting.success && _setting.success(result, status, xhr);
                this._eventManager.Emit(PBNetwork.EVENT_SUCCESS, result, status, xhr);
            }
            else {
                !!_setting.error && _setting.error(status, xhr, e);
                this._eventManager.Emit(PBNetwork.EVENT_ERROR, status, xhr, e);
            }
        });
        xhr.addEventListener("timeout", e => {
            !!_setting.error && _setting.error(408, xhr, e);
            this._eventManager.Emit(PBNetwork.EVENT_ERROR, 408, xhr, e);
        });
        xhr.addEventListener("error", e => {
            !!_setting.error && _setting.error(xhr.status, xhr, e);
            this._eventManager.Emit(PBNetwork.EVENT_ERROR, xhr.status, xhr, e);
        });
        xhr.addEventListener("progress", e => {
            !!_setting.progress && _setting.progress(e.loaded, e.total, xhr, e);
            this._eventManager.Emit(PBNetwork.EVENT_PROGRESS, e.loaded, e.total, xhr, e);
        });

        _setting = this.CheckUrlAData(requestType, _setting);
        xhr.open(requestType, _setting.url as string);
        
        xhr.responseType = _setting.responseType as XMLHttpRequestResponseType;
        if (!!_setting.headers) {
            for (let key of Object.keys(_setting.headers)) {
                xhr.setRequestHeader(key, (_setting.headers as any)[key]);
            }
        }
        if (!!_setting.timeout) {
            xhr.timeout = _setting.timeout;
        }
        xhr.send(_setting.data);
        return xhr;
    }

    /**
     * 检查并将url和data解析成GET或POST对应的请求数据
     * @param requestType 
     * @param setting 
     */
    private CheckUrlAData(requestType: string, setting: PBHttpSetting): PBHttpSetting {
        if (requestType === "GET") {
            let pstr = (setting.data instanceof Object) ? this.GetQueryParamStr(setting.data) : setting.data;
            if (!!setting.data) {
                setting.url += "?" + pstr;
                setting.data = null;
            }
        }
        else {
            if (!(typeof setting.data === "string" || setting.data instanceof FormData)) {
                setting.data = this.GetQueryParamStr(setting.data);
            }
        }
        return setting;
    }

    /**
     * 将data转化为xxx=aaaa&xx=bbb...的字符串
     * @param data 
     */
    private GetQueryParamStr(data: Object) {
        let params: string[] = [];
        if (!!data) {
            Object.keys(data).forEach(key => {
                let value = this.onParseQueryData(key, (data as any)[key]);
                params.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
            });
        }
        return params.join("&");
    }

}
