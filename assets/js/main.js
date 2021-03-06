/**
 * Created by Rodey on 2015/12/1.
 */
var Main = (function () {
    function Main(url) {
        this.songs_url = 'assets/songs.json';
        this.song_list = [];
        //当前播放状态
        this.playState = false;
        url && (this.songs_url = url);
        this.ajax = Ajax.getInstance({ type: 'get' });
    }
    Main.getInstance = function () {
        if (!Main._instance)
            return new Main();
        return Main._instance;
    };
    /**
     * 页面渲染完成
     */
    Main.prototype.onLoad = function () {
        window.addEventListener('load', this._onLoad.bind(this), false);
    };
    Main.prototype._onLoad = function (evt) {
        this.appDom = document.querySelector('#app');
        this.songDom = document.querySelector('#songs');
        this.lrcDom = document.querySelector('#lrc-content');
        this.lrcCloseDom = document.querySelector('#close-lrc');
        this.blurHeadDom = document.querySelector('#blur-head');
        //初始化播放器
        this.player = new Player('audio');
        this.player.audio.addEventListener('play', this.changePlayerState.bind(this), false);
        this.player.audio.addEventListener('pause', this.changePlayerState.bind(this), false);
        //加载播放列表
        this.loadSongs();
    };
    /**
     * 开始加载播放列表
     */
    Main.prototype.loadSongs = function () {
        var _this = this;
        var ajaxSetting = {
            url: this.songs_url,
            data: { type: 'all' },
            success: function (res) { _this._getSongListSuccess(res); },
            error: function (err) { _this._getSongsListError(err); }
        };
        this.ajax.set(ajaxSetting);
        this.ajax.get();
    };
    /**
     * 加载播放列表成功
     * @param res
     * @private
     */
    Main.prototype._getSongListSuccess = function (res) {
        if (res.code === 200) {
            //清楚列表加载进度
            this.appDom.classList.remove('loading');
            //创建播放列表
            this.createSongList(res.songs);
            //渲染列表
            this.renderSongList();
            //更新播放状态
            this.updateState(null, this.song_list[0]);
        }
    };
    /**
     * 加载播放播放列表失败
     * @param err
     * @private
     */
    Main.prototype._getSongsListError = function (err) {
        //清楚列表加载进度
        this.appDom.classList.remove('loading');
        this.appDom.innerHTML = '加载播放列表失败';
    };
    /**
     * 创建播放列表， 将歌曲列表信息保存到song_list中
     * @param songs
     */
    Main.prototype.createSongList = function (songs) {
        var songs = songs, i = 0, len = songs.length, song;
        for (; i < len; ++i) {
            song = new Song((i + 1));
            song.setData(songs[i]);
            this.song_list.push(song);
        }
        song = this.song_list[0];
        this.player.setSong(song);
        this.index = 1;
        this.playState = true;
        this.player.audio.addEventListener('ended', this.playNext.bind(this), false);
    };
    /**
     * 播放下一首
     * @param evt
     */
    Main.prototype.playNext = function (evt) {
        this.playState = false;
        this.index++;
        if (this.index > this.song_list.length) {
            this.index = 1;
        }
        var song = this.findSong(this.index);
        this.player.setSong(song);
        this.playState = true;
        this.updateState(null, song);
    };
    /**
     * 根据id查找播放列表中的对应的歌曲对象
     * @param id
     * @returns {Song}
     */
    Main.prototype.findSong = function (id) {
        var id = id, i = 0, len = this.song_list.length, song;
        for (; i < len; ++i) {
            song = this.song_list[i];
            if (id === song.id) {
                break;
            }
        }
        return song;
    };
    /**
     * 渲染播放列表
     * @param songs
     */
    Main.prototype.renderSongList = function (songs) {
        var songs = songs || this.song_list, song, i = 0, len = songs.length, frame = document.createDocumentFragment(), li;
        for (; i < len; ++i) {
            song = songs[i];
            li = document.createElement('li');
            li.innerHTML = '<img src="' + song.image + '" onerror="this.src=\'assets/images/enigma.jpg\'"/>' + (i + 1) + '、' + song.title + '<i class="icon icon-play2"></i>';
            li.setAttribute('data-id', String(song.id));
            frame.appendChild(li);
        }
        document.querySelector('#songs').appendChild(frame);
        //点击列表项进行播放
        this.songDom.addEventListener('click', this.playItem.bind(this), false);
        //关闭歌词显示
        this.lrcCloseDom.addEventListener('click', this.closeLrc.bind(this), false);
    };
    /**
     * 监听audio播放和暂停动作
     * @param evt
     */
    Main.prototype.changePlayerState = function (evt) {
        var type = evt.type, song = this.findSong(this.index);
        this.playState = (type === 'play') ? true : false;
        this.updateState(null, song);
    };
    /**
     * 更新页面样式
     * @param target
     * @param song
     */
    Main.prototype.updateState = function (target, song) {
        var id = song.id, image = song.image, target = target || null;
        if (!target) {
            target = document.querySelector('#songs>li[data-id="' + id + '"]>i');
        }
        var parentLI = target.parentElement, img = target.previousElementSibling;
        //改变按钮状态
        var is = document.querySelectorAll('#songs>li>i');
        var imgs = document.querySelectorAll('#songs>li>img');
        for (var i = 0, len = is.length; i < len; ++i) {
            var itag = is[i], imgtag = imgs[i];
            itag.className = 'icon icon-play2';
            imgtag.className = '';
        }
        if (this.playState) {
            target.classList.add('icon-pause');
            //让图片旋转
            img.classList.add('rotation-anim');
        }
        else {
            target.classList.remove('icon-pause');
            //让图片旋转
            img.classList.remove('rotation-anim');
        }
        //改变背景
        this.setBlurHead(image);
    };
    /**
     * 设置背景
     * @param image
     */
    Main.prototype.setBlurHead = function (image) {
        this.blurHeadDom.style.background = 'white url("' + image + '") no-repeat center center';
        this.blurHeadDom.style.backgroundSize = '100% 100%';
    };
    /**
     * 点击播放歌曲
     * @param evt
     */
    Main.prototype.playItem = function (evt) {
        var target = evt.target;
        if (target.tagName === 'I' && target.className.indexOf('icon') !== -1) {
            var parentLI = target.parentElement, img = target.previousElementSibling, id = Number(parentLI.getAttribute('data-id')), song = this.findSong(id);
            if (this.playState && target.className.indexOf('icon-pause') !== -1) {
                this.player.pause();
                this.playState = false;
            }
            else {
                this.index = id;
                this.playState = true;
                if (this.player.currentTime > 0 && this.player.song != song) {
                    this.player.play(this.player.currentTime);
                }
                else {
                    this.player.setSong(song);
                }
            }
            //改变按钮状态
            this.updateState(target, song);
        }
        else if (target.tagName === 'IMG') {
            var parentLI = target.parentElement, id = Number(parentLI.getAttribute('data-id'));
            if (id === this.index) {
                this.showLrc();
            }
        }
    };
    /**
     * 显示歌词
     * @param song
     */
    Main.prototype.showLrc = function () {
        var _this = this;
        var song = this.findSong(this.index), lrc = song.lrc;
        this.ajax.set({
            url: lrc,
            dataType: 'text',
            success: function (res) {
                var lrcText = _this.formatLrc(res);
                _this.lrcDom.innerHTML = lrcText;
                _this.lrcDom.parentElement.style.display = 'block';
            },
            error: function (err) {
                _this.lrcDom.innerHTML = '<p>暂未找到相关歌词信息</p>';
                _this.lrcDom.parentElement.style.display = 'block';
            }
        });
        this.ajax.get();
    };
    /**
     * 隐藏歌词
     * @param evt
     */
    Main.prototype.closeLrc = function (evt) {
        this.lrcDom.parentElement.style.display = 'none';
    };
    /**
     * 格式化歌词
     * @param lrcText
     * @returns {string}
     */
    Main.prototype.formatLrc = function (lrcText) {
        var text = lrcText;
        text = lrcText.replace(/\[ti:([\s\S]*?)\]/gi, function (match, title) {
            return title + '<br />';
        })
            .replace(/\[ar:([\s\S]*?)\]/gi, function (match, author) {
            return author + '<br />';
        })
            .replace(/\[al:([\s\S]*?)\]/gi, function (match, al) {
            return al + '<br />';
        })
            .replace(/\[([\s\S]*?)\]([\s\S]*?)[\r|\n|\t]/gi, function (match, line, text) {
            return '<p>' + text.replace(/^\s*|\s*$/i, '') + '</p>';
        });
        return text;
    };
    return Main;
})();
var main = Main.getInstance();
main.onLoad();
//# sourceMappingURL=main.js.map