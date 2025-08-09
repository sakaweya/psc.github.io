window.addEventListener('load', function () {
    setBackground('#page');
    setBackground('body');
    $.when(
        // ローディング表示
        $.mobile.loading('show')
    )
    .done(function () {

        // cordova deviceready
        pscnav.start({
            startup: function (api) {
                pscnav.api = api;
                pageRefresh();

                $('.navtop').on('click', function () { api.go('topmenu.html', {}); });
                $('.navsearch').on('click', function () { api.go('searchmenu.html', {}); });
                $('.navcontact').on('click', function () { api.go('contact.html'); });
                $('.navhelp').on('click', function () { api.go('information.html'); });
                $('.navsolution').on('click', function () { api.go('solution.html'); });

                // ページ初期化
                pageInit();

                // メニュー再配置
                pageRefresh();

                // ページ読み込み完了
                $.mobile.loading('hide');

                // cordova Android 戻るボタン
                document.addEventListener('backbutton', function () {
                    $.mobile.loading('show');
                    pscnav.api.historyBack();
                    $.mobile.loading('hide');
                }, false);
            },
            id: 'tccnav'
        });
    })
    .fail(function (e) {
        console.log(e);
    });
});
/*
    ページ初期化
*/
var pageInit = function () {

    /*
        ロード用イベント
    */
    $('.load-link').on('click', function () {
        $.mobile.loading('show');
    });
    /*
        縦横 サイズ変更
    */
    $(window).on('orientationchange resize', function (event) {
        setBackground('#page');
        setBackground('body');
        // メニュー再配置
        pageRefresh();
    });
};

/*
    ページリフレッシュ
*/
var pageRefresh = function () {

    // 解像度を取得
    var sh = window.screen.height;
    var sw = window.screen.width;
    var iw = window.innerWidth;
    var ih = window.innerHeight;
    var els_t_p = ['#div_main_menu_port .navtop', '#div_main_menu_port .navsearch', '#div_main_menu_port .navcontact', '#div_main_menu_port .navsolution'];
    var els_t_l = ['#div_main_menu_land .navtop', '#div_main_menu_land .navsearch', '#div_main_menu_land .navcontact', '#div_main_menu_land .navsolution'];
    var els_m = ['#div_mobile_menu .navtop', '#div_mobile_menu .navsearch', '#div_mobile_menu .navcontact', '#div_mobile_menu .navsolution'];
    var els;
    var max_height = 0;

    // 携帯用
    if (iw < 568) {
        $('#div_main').hide();
        $('#div_mobile').show();
        els = els_m;
    }
    else {
        $('#div_main').show();
        $('#div_mobile').hide();
        if (ih > iw) {
            $('#div_main_menu_land').show();
            $('#div_main_menu_port').hide();
            els = els_t_l;
        }
        else {
            $('#div_main_menu_port').show();
            $('#div_main_menu_land').hide();
            els = els_t_p;
        }
    }

    var len;
    var i;
    len = els.length;
    $(els.join(',')).height('auto');
    for (i = 0; i < len; i++) {
        max_height = Math.max($(els[i]).height(), max_height);
    }
    if (max_height > 0){
        $(els.join(',')).height(max_height);
    }
};

