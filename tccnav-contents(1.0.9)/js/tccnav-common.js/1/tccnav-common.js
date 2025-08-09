/*
    戻るボタン ios safari のキャッシュ対策
*/
$(function () {
    // 戻るボタン ios safari のキャッシュ対策
    $(window).on('pageshow', function (event) {
        try {
            if (event.originalEvent && event.originalEvent.persisted) {
                //window.location.reload();
                $.mobile.loading('hide');
            }
        }
        catch (e) {
            console.log(e);
        }
    });
});

/*
    画像の元サイズを取得します
*/
window.img_true_size = function (image) {
    var w = image.width,
        h = image.height;

    if (typeof image.naturalWidth !== 'undefined') {  // for Firefox, Safari, Chrome
        w = image.naturalWidth;
        h = image.naturalHeight;

    } else if (typeof image.runtimeStyle !== 'undefined') {    // for IE
        var run = image.runtimeStyle;
        var mem = { w: run.width, h: run.height };  // keep runtimeStyle
        run.width = 'auto';
        run.height = 'auto';
        w = image.width;
        h = image.height;
        run.width = mem.w;
        run.height = mem.h;

    } else {         // for Opera
        var mem = { w: image.width, h: image.height };  // keep original style
        image.removeProperty('width');
        image.removeProperty('height');
        w = image.width;
        h = image.height;
        image.width = mem.w;
        image.height = mem.h;
    }

    return { width: w, height: h };
}
/*
    背景を設定します
*/
window.setBackground = function (page) {

    // スクリーンサイズ
    var sh = window.screen.height;
    var sw = window.screen.width;
    // 表示サイズ
    var ih = window.innerHeight;
    var iw = window.innerWidth;
    // フッター高さ
    var offset = ($('#footer').height()) ? $('#footer').height() : 0;

    // アスペクト比(4:3)と過程
    var AspectRatioWidth3 = iw / (ih / 4);
    // アスペクト比(16:9 or 10)と過程
    var AspectRatioWidth9_10 = iw / (ih / 16);
    // 画像は縦長
    var AspectImage43 = 'img/tccbk_43.png';
    var AspectImage169 = 'img/tccbk_169.png';
    var AspectImage1610 = 'img/tccbk_1610.png';
    var AspectImage;

    if (AspectRatioWidth3 > 2.9 && AspectRatioWidth3 < 4) {
        // 4：3
        AspectImage = AspectImage43;
        offset += iw / 3 * 4 - ih;
    }
    else if (AspectRatioWidth9_10 > 8.9 && AspectRatioWidth9_10 < 9.5) {
        // 16：9
        AspectImage = AspectImage169;
        offset += iw / 9 * 16 - ih;
    }
    else if (AspectRatioWidth9_10 >= 9.5 && AspectRatioWidth9_10 < 11) {
        // 16：10
        AspectImage = AspectImage1610;
        offset += iw / 10 * 16 - ih;
    }
    else {
        // 4：3
        AspectImage = AspectImage43;
        offset += iw / 3 * 4 - ih;
    }
    offset = (offset < 0) ? 0 : 0 - offset;
    var AspectCss = {
        'background-size': '100% auto'
        //, 'background-position-y': offset + 'px'
        , 'background-color': '#82b0e2'
    };
    if ($(page).css('background-image').indexOf(AspectImage) < 0)
        AspectCss['background-image'] = 'url(' + AspectImage + ')';
    $(page).css(AspectCss);
};
/*
    JQMのswipeのパラメータを設定します
*/
window.setJQMSwipeParam = function (page) {
    //$.event.special.swipe.scrollSupressionThreshold (default: 10px) ? More than this horizontal displacement, and we will suppress scrolling.
    //（この水平変位よりスクロールを抑制する。）
    $.event.special.swipe.scrollSupressionThreshold = 60;
    //（スクロールタッチのちょっとした水平方向のブレでスクロール抑止になるため、数値をデフォルトより増やしています。）

    //$.event.special.swipe.durationThreshold (default: 1000ms) ? More time than this, and it isn’t a swipe.
    //（この時間以上はスワイプとしない。）
    $.event.special.swipe.durationThreshold = 500;
    //（1秒は長い）

    //$.event.special.swipe.horizontalDistanceThreshold (default: 30px) ? Swipe horizontal displacement must be more than this.
    //（スワイプ水平変位は、これ以上でなければならない。）
    $.event.special.swipe.horizontalDistanceThreshold = 60;
    //（ちょっとしたタッチの水平方向の動きでスワイプとなるため 、数値をデフォルトより増やしています。）

    //$.event.special.swipe.verticalDistanceThreshold (default: 75px) ? Swipe vertical displacement must be less than this.
    //（スワイプ垂直変位は、これより小さくなければならない。）
    $.event.special.swipe.verticalDistanceThreshold = 20;
    //（たとえばナナメ方向のちょっとしたタッチの動きでスワイプとなるため 、数値をデフォルトより減らしています。）

    /*
        Android 4.4.2 対応 JQMのswipe Event が実行されないため touchmove で preventDefaultを発行し対応
        ※　$(window).on('touchmove', function(ev){...})だとJQMのpageconteinerのchangeを発行した後動かなくなる
    */
    var initialTouch;
    document.addEventListener('touchstart', function (ev) {
        initialTouch = ev.changedTouches[0];
    },false);
    document.addEventListener('touchmove', function (ev) {
        var movingTouch = ev.changedTouches[0];
        if (Math.abs(movingTouch.pageX - initialTouch.pageX) > 10 && Math.abs(movingTouch.pageY - initialTouch.pageY) < 25) {
            ev.preventDefault();
        }
    },false);
}

/*
    お気に入り
*/
var navFavoriteManager = function (api) {
    this.api = api;
}
navFavoriteManager.prototype.contains = function (favoriteItem) {
    if (!this.item)
        return false;

    var contain = Enumerable.from(this.item)
                    .where(function (p) {
                        var ret = p.section.id == favoriteItem.section.id
                            && p.content.id == favoriteItem.content.id
                            && p.purpose.id == favoriteItem.purpose.id
                            && p.category.id == favoriteItem.category.id
                            && p.product.id == favoriteItem.product.id;
                        return ret;
                    })
                    .select(function (p) {
                        return p;
                    })
                    .firstOrDefault();
    return contain ? true : false;
}
navFavoriteManager.prototype.load = function () {
    var _this = this;
    return this.api.replaceStaticParam('favorite.html', function (p, arg) {
        _this.item = p;
        arg.cancel = true;
        return p;
    }, null, null);
};
;
navFavoriteManager.prototype.save = function () {
    if (this.item && this.item.length > this.itemMax()) {
        this.item = Enumerable.from(this.item)
            .select(function (p) { return p; })
            .take(this.itemMax())
            .toArray();
    }
    var _this = this;
    return this.api.replaceStaticParam('favorite.html', function (p, arg) {
        p = _this.item;
        return p;
    }, null, null);
};
navFavoriteManager.prototype.add = function (favoriteItem) {
    if (!this.item)
        this.item = new Array;
    if (!this.contains(favoriteItem)) {
        if (this.item.length < this.itemMax()) {
            this.item.push(favoriteItem);
            this.save();
        }
    }
};
navFavoriteManager.prototype.remove = function (favoriteItem) {
    if (this.item) {
        this.item = Enumerable.from(this.item)
            .where(function (p) {
                return p.section.id != favoriteItem.section.id
                    || p.content.id != favoriteItem.content.id
                    || p.purpose.id != favoriteItem.purpose.id
                    || p.category.id != favoriteItem.category.id
                    || p.product.id != favoriteItem.product.id
            })
            .select(function (p) { return p; })
            .toArray();
        this.save();
    }
};
navFavoriteManager.prototype.itemMax = function () {
    return 20;
}
var navFavoriteItem = function () {
    this.section = { id: null, name: null };
    this.content = { id: null, name: null };
    this.purpose = { id: null, name: null };
    this.category = { id: null, name: null };
    this.product = { id: null, name: null };
}