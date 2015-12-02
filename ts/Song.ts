/**
 * Created by Rodey on 2015/12/2.
 * 歌曲类
 */

class Song{

    //歌曲id
    public id: number;
    //歌曲标题
    public title: string;
    //歌曲地址
    public url: string;
    //歌词地址
    public lrc: string;
    //总时长
    public duration: number;
    //扩展名
    public ext: string;
    //头像地址
    public image: string;


    constructor(id?: number, title?: string, url?: string, image?: string){
        this.id = id;
        this.title = title;
        this.url = url;
        this.image = image;
    }

    public setData(data: any): void{
        for(var k in data){
            this[k] = data[k];
        }
    }


}
