/**
 * Created by Rodey on 2015/12/2.
 * 歌曲播放类
 */

class Player{

    //Audio Element 对象
    public audio: HTMLAudioElement;
    //audio tag id
    public audioId: string;
    //当前播放进度
    public currentTime: number;
    //歌曲
    public song: Song;

    constructor(audioId: string, song?: Song){
        this.audioId = audioId;
        this.song = song;
        this.audio = <HTMLAudioElement>document.querySelector('#' + audioId);

    }

    /**
     * 设置歌曲
     * @param song
     */
    public setSong(song?: Song): void{
        song && (this.song = song);
        this.audio.addEventListener('loadstart', this.loadSong.bind(this), false);
        this.audio.src = song.url;
    }

    /**
     * 加载歌曲
     * @param evt
     */
    public loadSong(evt: Event): void{
        this.audio.removeEventListener('loadstart', this.loadSong.bind(this), false);
        this.play((<HTMLAudioElement>evt.target).currentTime);
    }

    /**
     * 开始播放歌曲
     * @param time
     */
    public play(time: number = 0): void{
        this.currentTime = time || this.currentTime;
        this.audio.pause();
        this.audio.currentTime = time || 0;
        this.audio.play();
    }

    /**
     * 暂停
     */
    public pause(): void{
        this.currentTime = this.audio.currentTime;
        this.audio.pause();
    }

    /**
     * 设置音量
     * @param volume
     */
    public setVolume(volume: number): void{
        this.audio.volume = volume;
    }

}
