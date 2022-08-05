/**一些计算 */
export module PBUtils {
    /**将n限制在[min,max]的范围内，默认[0，1] */
    export const Clamp = (n: number, min?: number, max?: number): number => {
        !min && (min = 0);
        !max && (max = 1);
        return Math.max(min, Math.min(max, n));
    }

    export const Random_Range = (min: number, max: number): number => {
        return Math.random() * (max - min) + min;
    }

    /**[min,max) */
    export const Random_RangeInt = (min: number, max: number): number => {
        return Math.floor(Random_Range(min, max));
    }

    export const Random_ListItem = <T>(list: T[]): T => {
        let index = Random_RangeInt(0, list.length);
        return list[index];
    }

    /**使用json转化来进行简易的clone，建议仅使用在数据类上 */
    export const CloneByJson = <T>(obj: T): T => {
        return JSON.parse(JSON.stringify(obj)) as T;
    }

    export const Random_PAndN = (): number => {
        return Math.random() >= 0.5 ? 1 : -1;
    }

    export const SecondToMinute = (s: number): { minute: number, second: number } => {
        let m = Math.floor(s / 60);
        let ls = s % 60;
        return { minute: m, second: ls };
    }

     /**网络相关工具 */
     export class Net {

        private constructor(){}

        /**获取url中的参数,默认为window.location.search */
        public static GetQueryParam(paramName: string, query?: string): any {
            if (!query)
                query = window.location.search;
            var reg = new RegExp("(^|&)" + paramName + "=([^&]*)(&|$)");
            var r = query.substr(1).match(reg);
            if (r != null)
                return r[2];
            return null;
        }

        public static SetCookie(name, value, timesec: number = 3600) {
            let exp = new Date();
            exp.setTime(exp.getTime() + timesec * 1000);
            document.cookie = name + "=" + escape(value) + ";expires=" + exp.toUTCString() + ";path=/";
        }

        public static GetCookie(name) {
            let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return unescape(arr[2]);
            else
                return null;
        }
    }

}