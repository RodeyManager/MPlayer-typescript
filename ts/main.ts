/**
 * Created by Rodey on 2015/12/1.
 */


class Main{

    private static _instance: Main;
    public static getInstance(): Main{
        if(!Main._instance) return new Main();
        return Main._instance;
    }

    songs_url: string = 'assets/songs.json';
    song_list: Array<Song> = [];
    ajax: Ajax;
    appDom: HTMLElement;
    songDom: HTMLElement;
    lrcDom: HTMLElement;
    lrcCloseDom: HTMLElement;
    blurHeadDom: HTMLElement;
    player: Player;
    //当前播放索引
    index: number;
    //当前播放状态
    playState: boolean = false;

    constructor(url?: string){
        url && (this.songs_url = url);
        this.ajax = Ajax.getInstance({ type: 'get' });

    }

    /**
     * 页面渲染完成
     */
    public onLoad(): void{
        window.addEventListener('load', this._onLoad.bind(this), false);
    }
    private _onLoad(evt): void{
        this.appDom = <HTMLElement>document.querySelector('#app');
        this.songDom = <HTMLElement>document.querySelector('#songs');
        this.lrcDom = <HTMLElement>document.querySelector('#lrc-content');
        this.lrcCloseDom = <HTMLElement>document.querySelector('#close-lrc');
        this.blurHeadDom = <HTMLElement>document.querySelector('#blur-head');
        //初始化播放器
        this.player = new Player('audio');
        this.player.audio.addEventListener('play', this.changePlayerState.bind(this), false);
        this.player.audio.addEventListener('pause', this.changePlayerState.bind(this), false);
        //加载播放列表
        this.loadSongs();
    }

    /**
     * 开始加载播放列表
     */
    public loadSongs(): void{
        var ajaxSetting = {
            url: this.songs_url,
            data: { type: 'all' },
            success: (res)=>{ this._getSongListSuccess(res); },
            error: (err)=>{ this._getSongsListError(err); }
        };

        this.ajax.set(ajaxSetting);
        this.ajax.get();

    }

    /**
     * 加载播放列表成功
     * @param res
     * @private
     */
    public _getSongListSuccess(res: any): void{
        if(res.code === 200){
            //清楚列表加载进度
            this.appDom.classList.remove('loading');
            //创建播放列表
            this.createSongList(res.songs);
            //渲染列表
            this.renderSongList();
            //更新播放状态
            this.updateState(null, this.song_list[0]);
        }
    }

    /**
     * 加载播放播放列表失败
     * @param err
     * @private
     */
    public _getSongsListError(err: any): void{
        //清楚列表加载进度
        this.appDom.classList.remove('loading');
        this.appDom.innerHTML = '加载播放列表失败';
    }

    /**
     * 创建播放列表， 将歌曲列表信息保存到song_list中
     * @param songs
     */
    public createSongList(songs: any[]): void{

        var songs: any[] = songs,
            i: number = 0,
            len: number = songs.length,
            song: Song;

        for(; i < len; ++i){
            song = new Song((i + 1));
            song.setData(songs[i]);
            this.song_list.push(song);
        }

        song = this.song_list[0];

        this.player.setSong(song);
        this.index = 1;
        this.playState = true;
        this.player.audio.addEventListener('ended', this.playNext.bind(this), false);

    }

    /**
     * 播放下一首
     * @param evt
     */
    public playNext(evt: Event): void{

        this.playState = false;
        this.index++;
        if(this.index > this.song_list.length){
            this.index = 1;
        }
        var song: Song = this.findSong(this.index);
        this.player.setSong(song);
        this.playState = true;
        this.updateState(null, song);

    }

    /**
     * 根据id查找播放列表中的对应的歌曲对象
     * @param id
     * @returns {Song}
     */
    public findSong(id: number): Song{

        var id: number = id,
            i: number = 0,
            len: number = this.song_list.length,
            song: Song;
        for(; i < len; ++i){
            song = <Song>this.song_list[i];
            if(id === song.id){
                break;
            }
        }
        return song;
    }

    /**
     * 渲染播放列表
     * @param songs
     */
    public renderSongList(songs?: any[]): void{
        var songs: any[] = songs || this.song_list,
            song: Song,
            i: number = 0,
            len: number = songs.length,
            frame: DocumentFragment = document.createDocumentFragment(),
            li: HTMLElement;

        for(; i < len; ++i){
            song = songs[i];
            li = document.createElement('li');
            li.innerHTML =  '<img src="' + song.image + '" onerror="this.src=\'assets/images/enigma.jpg\'"/>' + (i + 1) + '、' + song.title + '<i class="icon icon-play2"></i>';
            li.setAttribute('data-id', String(song.id));
            frame.appendChild(li);
        }

        document.querySelector('#songs').appendChild(frame);
        //点击列表项进行播放
        this.songDom.addEventListener('click', this.playItem.bind(this), false);
        //关闭歌词显示
        this.lrcCloseDom.addEventListener('click', this.closeLrc.bind(this), false);

    }

    /**
     * 监听audio播放和暂停动作
     * @param evt
     */
    public changePlayerState(evt: Event): void{
        var type: string = evt.type,
            song: Song = this.findSong(this.index);
        this.playState = (type === 'play') ? true : false;
        this.updateState(null, song);
    }

    /**
     * 更新页面样式
     * @param target
     * @param song
     */
    public updateState(target: HTMLElement, song: Song): void{

        var id: number = song.id,
            image: string = song.image,
            target: HTMLElement = target || null;
        if(!target){
            target = <HTMLElement>document.querySelector('#songs>li[data-id="'+ id +'"]>i');
        }

        var parentLI: HTMLElement = target.parentElement,
            img: HTMLImageElement = <HTMLImageElement>target.previousElementSibling;

        //改变按钮状态
        var is: any = document.querySelectorAll('#songs>li>i');
        var imgs: any = document.querySelectorAll('#songs>li>img');
        for(var i: number = 0, len: number = is.length; i < len; ++i){
            var itag: HTMLElement = <HTMLElement>is[i],
                imgtag: HTMLElement = <HTMLElement>imgs[i];
            itag.className = 'icon icon-play2';
            imgtag.className = '';
        }

        if(this.playState) {
            target.classList.add('icon-pause');
            //让图片旋转
            img.classList.add('rotation-anim');
        }else{
            target.classList.remove('icon-pause');
            //让图片旋转
            img.classList.remove('rotation-anim');
        }
        //改变背景
        this.setBlurHead(image);
    }

    /**
     * 设置背景
     * @param image
     */
    public setBlurHead(image: string): void{
        this.blurHeadDom.style.background = 'white url("'+ image +'") no-repeat center center';
        this.blurHeadDom.style.backgroundSize = '100% 100%';
    }

    /**
     * 点击播放歌曲
     * @param evt
     */
    public playItem(evt: Event): void{
        var target: HTMLElement = <HTMLElement>evt.target;

        if(target.tagName === 'I' && target.className.indexOf('icon') !== -1){
            var parentLI: HTMLElement = target.parentElement,
                img: HTMLImageElement = <HTMLImageElement>target.previousElementSibling,
                id: number = Number(parentLI.getAttribute('data-id')),
                song: Song = this.findSong(id);
            if(this.playState && target.className.indexOf('icon-pause') !== -1){
                this.player.pause();
                this.playState = false;
                //target.classList.remove('icon-pause');
            }else{
                this.index = id;
                this.playState = true;
                if(this.player.currentTime > 0 && this.player.song != song){
                    this.player.play(this.player.currentTime);
                }else{
                    this.player.setSong(song);
                }
            }


            //改变按钮状态
            this.updateState(target, song);

        }
        //显示歌词
        else if(target.tagName === 'IMG'){
            var parentLI: HTMLElement = target.parentElement,
                id: number = Number(parentLI.getAttribute('data-id'));
            if(id === this.index){
                this.showLrc();
            }
        }

    }

    /**
     * 显示歌词
     * @param song
     */
    public showLrc(): void{
        var song: Song = this.findSong(this.index),
            lrc: string = song.lrc;
        this.ajax.set({
            url: lrc,
            dataType: 'text',
            success: (res)=>{
                var lrcText = this.formatLrc(res);
                this.lrcDom.innerHTML = lrcText;
                this.lrcDom.parentElement.style.display = 'block';
            },
            error: (err)=>{
                this.lrcDom.innerHTML = '<p>暂未找到相关歌词信息</p>';
                this.lrcDom.parentElement.style.display = 'block';
            }
        });
        this.ajax.get();
    }

    /**
     * 隐藏歌词
     * @param evt
     */
    public closeLrc(evt: Event): void{
        this.lrcDom.parentElement.style.display = 'none';
    }

    /**
     * 格式化歌词
     * @param lrcText
     * @returns {string}
     */
    public formatLrc(lrcText: string): string{

        var text: string = lrcText;
        text = lrcText.replace(/\[ti:([\s\S]*?)\]/gi, function(match, title){
            return title + '<br />';
        })
        .replace(/\[ar:([\s\S]*?)\]/gi, function(match, author){
            return author + '<br />';
        })
        .replace(/\[al:([\s\S]*?)\]/gi, function(match, al){
            return al + '<br />';
        })
        .replace(/\[([\s\S]*?)\]([\s\S]*?)[\r|\n|\t]/gi, function(match, line, text){
            return '<p>' + text.replace(/^\s*|\s*$/i, '') + '</p>';
        });
        return text;

    }


}


var main = Main.getInstance();
main.onLoad();






