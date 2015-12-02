/**
 * Created by Rodey on 2015/12/2.
 * 歌曲播放类
 */
var Player = (function () {
    function Player(audioId, song) {
        this.audioId = audioId;
        this.song = song;
        this.audio = document.querySelector('#' + audioId);
    }
    /**
     * 设置歌曲
     * @param song
     */
    Player.prototype.setSong = function (song) {
        song && (this.song = song);
        this.audio.addEventListener('loadstart', this.loadSong.bind(this), false);
        this.audio.src = song.url;
    };
    /**
     * 加载歌曲
     * @param evt
     */
    Player.prototype.loadSong = function (evt) {
        this.audio.removeEventListener('loadstart', this.loadSong.bind(this), false);
        this.play(evt.target.currentTime);
    };
    /**
     * 开始播放歌曲
     * @param time
     */
    Player.prototype.play = function (time) {
        if (time === void 0) { time = 0; }
        this.currentTime = time || this.currentTime;
        this.audio.pause();
        this.audio.currentTime = time || 0;
        this.audio.play();
    };
    /**
     * 暂停
     */
    Player.prototype.pause = function () {
        this.currentTime = this.audio.currentTime;
        this.audio.pause();
    };
    /**
     * 设置音量
     * @param volume
     */
    Player.prototype.setVolume = function (volume) {
        this.audio.volume = volume;
    };
    return Player;
})();
//# sourceMappingURL=Player.js.map