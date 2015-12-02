/**
 * Created by Rodey on 2015/12/1.
 */

class Ajax{

    xhr: XMLHttpRequest;
    url: string;
    type: string = 'POST';
    data: any;
    dataType: string = 'JSON';
    success: Function;
    error: Function;

    private static _instance: Ajax;
    public static getInstance(setting?: Object): Ajax{
        if(!this._instance)
            return this._instance = new Ajax(setting);
        return this._instance;
    }

    constructor(setting?: Object){
        if(setting){
            for(var k in setting){
                this[k] = setting[k];
            }
        }

        if(!this.xhr){
            this.xhr = new XMLHttpRequest();
            this.xhr.addEventListener('readystatechange', this._onReadyStateChange.bind(this), false);
        }
        //this._init();
    }

    private _init(): void{

        this.data && (this.url = this._parseUrl(this.data));

        var type = this.type.toLocaleLowerCase();

        try{
            this[type]();
        }catch(e){}

    }

    public set(setting: Object): void{
        for(var k in setting){
            this[k] = setting[k];
        }
    }

    public post(): void{
        this._open('POST');
    }

    public get(): void{
        this._open('GET');
    }

    public put(): void{
        this._open('PUT');
    }

    public delete(): void{
        this._open('DELETE');
    }

    public abort(): void{
        this.xhr.abort();
    }

    private _open(type: string, url?: string, async?: boolean): void{
        this.xhr.open(type, url || this.url, async || true);
        this.xhr.send();
    }

    private _onReadyStateChange(): void{
        this.xhr.removeEventListener('readystatechange', this._onReadyStateChange, false);
        if(this.xhr.readyState === 4){
            if(this.xhr.status === 200){
                this._callFunction();
            }else{
                this.error('ajax error');
            }
        }
    }

    private _callFunction(error?: any): void{

        switch (this.dataType.toLocaleLowerCase()){

            case 'text':
                this.success(this.xhr.responseText);
                break;
            case 'json':
                var result;
                try{
                    result = JSON.parse(this.xhr.responseText);
                }catch(e) {
                    throw e;
                }
                this.success(result);
                break;

        }

    }

    public parseData(data): string{

        var dataStr = '';
        for(var k in data){
            dataStr += '&' + k + '=' + data[k];
        }
        return dataStr.replace(/^&/i, '?');

    }

    private _parseUrl(data): string{

        var url: string = this.url;
        url = url.split('?')[0] + this.parseData(data);
        return url;
    }






}
