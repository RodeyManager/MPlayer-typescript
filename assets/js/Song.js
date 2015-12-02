/**
 * Created by Rodey on 2015/12/2.
 * 歌曲类
 */
var Song = (function () {
    function Song(id, title, url, image) {
        this.id = id;
        this.title = title;
        this.url = url;
        this.image = image;
    }
    Song.prototype.setData = function (data) {
        for (var k in data) {
            this[k] = data[k];
        }
    };
    return Song;
})();
//# sourceMappingURL=Song.js.map