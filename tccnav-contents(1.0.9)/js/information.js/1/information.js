var _CurrentCorpCD = 0;
var CORP;
var BUSINESS_OFFICE;
var VA_CORP = new Array;
var VA_BUSINESS_OFFICE = new Array;

window.addEventListener('load', function () {
    $('[data-role="panel"]').panel({ theme: 'c' });
    $('#contentpanel').find('ul').listview().listview('refresh');
    $("#contentpanel").trigger("updatelayout");
    setJQMSwipeParam();

    $.when(
            // ローディング表示
            $.mobile.loading('show')
    )
    .done(function () {
        // cordova deviceready
        pscnav.start({
            startup: function (api, param) {
                pscnav.api = api;
                
                $('.navhistory').on('click', function () { api.historyBack(); });
                $('.navtopmenu').on('click', function () { api.go('guidance.html'); });
                $('.navsearch').on('click', function () { api.go('searchmenu.html'); });
                $('.navcontact').on('click', function () { api.go('contact.html'); });
                $('.navstar').on('click', function () { api.go('favorite.html'); });
                $('.navbook').on('click', function () { api.goBookManager(); });
                $('.navhelp').on('click', function () { api.go('information.html'); });
                $('[data-role="page"]').on('swiperight', function (e) {
                    var exlist = ['[data-role="header"]', '[data-role="footer"]', '[data-role="panel"]'];
                    var i, len = exlist.length;
                    for (i = 0; i < len; i++) {
                        if ($(e.target).is(exlist[i])) { return; }
                        if ($(e.target).parents(exlist[i]).size() > 0) { return; }
                    }
                    if ($(e.target).is("#index") || $(e.target).parents("#index").size() > 0) {
                        setBackground('body');
                        $(this).addClass('shadow');
                        $(this)
                            // Add the class for the transition direction
                            .addClass('right')
                            // When the transition is done...
                            .on('webkitTransitionEnd transitionend otransitionend', function () {
                                api.historyBack()
                            });
                        return;
                    }
                    $("body").pagecontainer("change", "#index");
                });
                $('[data-role="page"]').on('swipeleft', function (e) {
                    var exlist = ['[data-role="header"]', '[data-role="footer"]', '[data-role="panel"]'];
                    var i, len = exlist.length;
                    for (i = 0; i < len; i++) {
                        if ($(e.target).is(exlist[i])) { return; }
                        if ($(e.target).parents(exlist[i]).size() > 0) { return; }
                    }
                    if ($('.ui-page-active').jqmData('panel') !== 'open') {
                        $(this).append($('#contentpanel'));
                        $('#contentpanel').panel('open');
                    }
                });
                // 共通パネルだと画面レイアウトに不都合あり
                // 現在表示されているページコンテンツに配置してから表示
                $('.a_contentpanel').on('click', function () {
                    if ($('.ui-page-active').jqmData('panel') !== 'open') {
                        $('.ui-page-active').append($('#contentpanel'));
                        $('#contentpanel').panel('open');
                    }
                });
                // ページ初期化
                pageInit();

                // ローディング非表示
                $.mobile.loading('hide');
                // cordova Android 戻るボタン
                document.addEventListener('backbutton', function () {
                    $.mobile.loading('show');
                    if ($("body").pagecontainer('getActivePage').attr('id') != 'index') {
                        $("body").pagecontainer("change", "#index");
                    }
                    else {
                        pscnav.api.historyBack();
                    }
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

    // 携帯用
    if (sw <= 600 || iw <= 600) {
    }
    else {
    }

};