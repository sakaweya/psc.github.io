var SOL;
var VA_SOL = new Array;

window.addEventListener('load', function () {
    $('[data-role="panel"]').panel({ theme: 'c' });
    $('#contentpanel').find('ul').listview().listview('refresh');
    $("#contentpanel").trigger("updatelayout");
    setBackground('#page');
    setBackground('body');
    setJQMSwipeParam();

    $.when(
            // ローディング表示
            $.mobile.loading('show')
    )
    .done(function () {
        // データ読み込み
        $.when(
            $.getJSON('assets/TM_SOLUTION.json')
        )
        .done(function (sol) {
            SOL = sol;
            // データ整理
            $.when(
                // SOLUTION_CD	SOLUTION_NM	CALL_URL
                $.each(SOL, function (index, data) {
                    VA_SOL[data.SOLUTION_CD] = data;
                })
            )
            .done(function () {
                // cordova deviceready
                pscnav.start({
                    startup: function (api, param) {
                        pscnav.api = api;
                        $('.navhistory').on('click', function () {
                            if ($(this).hasClass('navhistory'))
                                api.historyBack();
                        });
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
                            $(this).addClass('shadow');
                            $(this)
                                // Add the class for the transition direction
                                .addClass('right')
                                // When the transition is done...
                                .on('webkitTransitionEnd transitionend otransitionend', function () {
                                    api.historyBack()
                                });
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
        })
        .fail(function (e) {
            console.log(e);
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
    var len, data, i;
    len = SOL.length;
    data = SOL;
    var ul_corp = '';
    var url;
    var $div_sol = $('<div id="DIV_SOL"/>');

    for (i = 0; i < len; i++) {
        $div_sol.append($('<a id="' + data[i].SOLUTION_CD + '" href="#" data-pscarg="' + data[i].CALL_URL + '" class="BTN_SOL ui-btn ui-icon-carat-r ui-btn-icon-right" style="text-align:left;">' + data[i].SOLUTION_NM + '</a>').button());
    }
    $('#main').append($div_sol);

    $('.BTN_SOL').on('click', function (e) {
        var param = $(this).data('pscarg'); // json
        window.open(param, '_system');
    });

    /*
        ロード用イベント
    */
    $('.load-link').on('click', function () {
        $.mobile.loading('show');
    });

    // 縦横 サイズ変更
    $(window).on('orientationchange resize', function (event) {
        setBackground('#page');
        setBackground('body');
    });

};
