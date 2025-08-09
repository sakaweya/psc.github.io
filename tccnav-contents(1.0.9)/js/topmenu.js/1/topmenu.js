var _CurrentSectionID;
var SECTION;
var CONTENT;
var TOP_MENU;
var TOP_MENU_ITEM;
var VA_SECTION = new Array;
var VA_CONTENT = new Array;
var VA_TOP_MENU = new Array;
var VA_TOP_MENU_ITEM = new Array;

window.addEventListener('load', function () {
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
            $.getJSON('assets/TM_SECTION.json')
            , $.getJSON('assets/TM_CONTENT.json')
            , $.getJSON('assets/TM_TOP_MENU.json')
            , $.getJSON('assets/TM_TOP_MENU_ITEM.json')
        )
        .done(function (section, content, menu, item) {
            // データ整理
            SECTION = section[0];
            CONTENT = content[0];
            TOP_MENU = menu[0];
            TOP_MENU_ITEM = item[0];
            $.when(
                // SECTION_ID	SECTION_NM
                $.each(SECTION, function (index, data) {
                    VA_SECTION[data.SECTION_ID] = data;
                })
                // SECTION_ID	CONTENT_ID	        CONTENT_NM
                , $.each(CONTENT, function (index, data) {
                    VA_CONTENT[data.CONTENT_ID] = data;
                })
                // TOP_MENU_ID	TOP_MENU_NM	        POSITION_X	        POSITION_Y
                , $.each(TOP_MENU, function (index, data) {
                    VA_TOP_MENU[data.TOP_MENU_ID] = data;
                })
                // TOP_MENU_ID	TOP_MENU_ITEM_ID	TOP_MENU_ITEM_NM	CALL_CONTENT_ID	CONTENT_NM
                , $.each(TOP_MENU_ITEM, function (index, data) {
                    VA_TOP_MENU_ITEM[data.TOP_MENU_ITEM_ID] = data;
                })
            )
            .done(function () {

                // cordova deviceready
                pscnav.start({
                    startup: function (api,param) {
                        pscnav.api = api;

                        if (param) {
                            if (param.SECTION_ID)
                                _CurrentSectionID = param.SECTION_ID;
                        }

                        $('.navhistory').on('click', function () { api.historyBack(); });
                        $('.navtopmenu').on('click', function () { api.go('guidance.html'); });
                        $('.navsearch').on('click', function () { api.go('searchmenu.html', {}); });
                        $('.navcontact').on('click', function () { api.go('contact.html'); });
                        $('.navstar').on('click', function () { api.go('favorite.html'); });
                        $('.navbook').on('click', function () { api.goBookManager(); });
                        $('.navhelp').on('click', function () { api.go('information.html'); });
                        $('#page').on('swiperight', function (e) {
                            var exlist = ['#header', '#footer', '#contentpanel', '#img_menu', '.tlw-control-list'];
                            var i,len = exlist.length;
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
                        $('#page').on('swipeleft', function (e) {
                            var exlist = ['#header', '#footer', '#contentpanel', '#img_menu', '.tlw-control-list'];
                            var i, len = exlist.length;
                            for (i = 0; i < len; i++) {
                                if ($(e.target).is(exlist[i])) { return; }
                                if ($(e.target).parents(exlist[i]).size() > 0) { return; }
                            }
                            if ($('.ui-page-active').jqmData('panel') !== 'open') {
                                $('#contentpanel').panel('open');
                            }
                        });
                        // ページ初期化
                        pageInit();

                        // メニュー再配置
                        pageRefresh();
                        // ページスクロール
                        if (_CurrentSectionID) {
                            $.mobile.silentScroll($('#DIV_SECTION_ID' + _CurrentSectionID).offset().top - $('#header').offset().top - $('#header').height());
                        }
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

    var len, i, data, jsonstr;
    /*
        タブレット用パネル作成
    */

    len = CONTENT.length;
    data = CONTENT;
    var panel_ul_item = new Array;
    for (i = 0; i < len; i++) {
        if (!panel_ul_item[data[i].SECTION_ID]) {
            panel_ul_item[data[i].SECTION_ID] = '';
        }
        jsonstr = 'data-pscarg=' + JSON.stringify({
            SECTION_ID: data[i].SECTION_ID,
            CONTENT_ID: data[i].CONTENT_ID
        });
        panel_ul_item[data[i].SECTION_ID] += '<li><a class="load-link submenu-link" href="#" ' + jsonstr + '>' + data[i].CONTENT_NM + '</a>';
    }
    len = SECTION.length;
    data = SECTION;
    var panel_ul = ''
    for (i = 0; i < len; i++) {
        panel_ul += '<ul data-role="listview">'
        + '<li data-role="list-divider">' + data[i].SECTION_NM + '</li>'
        + panel_ul_item[data[i].SECTION_ID]
        + '</ul>';
    }
    var $wkpanel = $('<div id="DIV_CONTETN_PANEL"/>').append(panel_ul);
    $wkpanel.find('ul').listview().listview('refresh');
    $('#contentpanel').append($wkpanel);
    $("#contentpanel").trigger("updatelayout");

    /*
        タブレット用 メニュー作成
    */

    data = TOP_MENU_ITEM;
    len = TOP_MENU_ITEM.length;
    var ul_items = new Array;
    for (i = 0; i < len; i++) {
        if (!ul_items[data[i].TOP_MENU_ID]) {
            ul_items[data[i].TOP_MENU_ID] = '';
        }
        jsonstr = 'data-pscarg=' + JSON.stringify({
            SECTION_ID: VA_CONTENT[data[i].CALL_CONTENT_ID].SECTION_ID,
            CONTENT_ID: data[i].CALL_CONTENT_ID
        });
        ul_items[data[i].TOP_MENU_ID] += '<li><a class="tlw-link load-link submenu-link" href="#" ' + jsonstr + '>' + data[i].TOP_MENU_ITEM_NM + '</a>';
    }

    // トップメニュー
    data = TOP_MENU;
    len = TOP_MENU.length;
    var menu = '';
    for (i = 0; i < len; i++) {
        menu += '<ul id="UL_TOP_MENU_ID' + data[i].TOP_MENU_ID + '" class="tlw-control-list">'
            + '<li id="LI_TOP_MENU_ID' + data[i].TOP_MENU_ID + '">'
            + '<a class="tlw-control tlw-close">▼</a>'
            + '<span class="tlw-title tlw-control-title">' + data[i].TOP_MENU_NM + '</span>'
            + '<ul id="UL_TOP_MENU_ITEM' + data[i].TOP_MENU_ID + '"class="tlw-list">' + ul_items[data[i].TOP_MENU_ID] + '</ul>'
            + '</ll>'
            + '</ul>';
    }
    /*
        携帯用 メニュー作成  collapsible
    */
    data = CONTENT;
    len = CONTENT.length;
    var ul_contents = new Array;
    for (i = 0; i < len; i++) {
        if (!ul_contents[data[i].SECTION_ID]) {
            ul_contents[data[i].SECTION_ID] = '';
        }
        jsonstr = 'data-pscarg=' + JSON.stringify({
            SECTION_ID: data[i].SECTION_ID,
            CONTENT_ID: data[i].CONTENT_ID
        });
        ul_contents[data[i].SECTION_ID] += '<li><a class="load-link submenu-link" href="#" ' + jsonstr + '>' + data[i].CONTENT_NM + '</a>';
    }

    data = SECTION;
    len = SECTION.length;
    var section = '';
    for (i = 0; i < len; i++) {

        section += '<div id="DIV_SECTION_ID' + data[i].SECTION_ID + '" class="DIV_SECTION_ID" data-role="collapsible" data-collapsed="true">'
            + '<h3>' + data[i].SECTION_NM + '</h3>'
            + '<ul id="UL_SECTION_ID' + data[i].SECTION_ID + '" data-role="listview" class="UL_SECTION_ID">'
            + ul_contents[data[i].SECTION_ID]
            + '</ul>'
            + '</div>';
    }
    var $wksection = $('<div id="DIV_SECTION"/>').append(section);
    $wksection.find('.UL_SECTION_ID').listview().listview('refresh');
    $wksection.find('.DIV_SECTION_ID').collapsible();
    if (_CurrentSectionID) {
        $wksection.find('#DIV_SECTION_ID' + _CurrentSectionID).collapsible({ collapsed: false });
    }
    $('#div_menu').append(menu);        // タブレット用メニュー追加
    $('#mobile').append($wksection);    // 携帯用メニュー追加

    /*
        タブレット用 メニュー初期表示,イベント
    */
    var supportTouch = 'ontouchstart' in window;
    var tlwDownEvent = supportTouch ? 'touchstart' : 'mousedown';
    var tlwUpEvent = supportTouch ? 'touchend' : 'mouseup';
    // リスト(ul)
    $('.tlw-list').hide();
    // ▼▲
    $('.tlw-control').on('click', function (e) {
        $('.tlw-title').removeClass('tlw-active');
        $(this).next().addClass('tlw-active');
        $('.tlw-control-list').css('z-index', 'auto');
        $(this).parent().parent('.tlw-control-list').css('z-index', 1);
        if ($(this).hasClass('tlw-open')) {
            $(this).removeClass('tlw-open');
            $(this).addClass('tlw-close');
            $(this).text('▼');
        }
        else if ($(this).hasClass('tlw-close')) {
            $(this).removeClass('tlw-close');
            $(this).addClass('tlw-open');
            $(this).text('▲');
        }
        $(this).next().next().slideToggle(200);
    });
    // タイトル
    $('.tlw-title').on('click', function (e) {
        $('.tlw-title').removeClass('tlw-active');
        $(this).addClass('tlw-active');
        $('.tlw-control-list').css('z-index', 'auto');
        $(this).parent().parent('.tlw-control-list').css('z-index', 1);
        if ($(this).prev().hasClass('tlw-open')) {
            $(this).prev().removeClass('tlw-open');
            $(this).prev().addClass('tlw-close');
            $(this).prev().text('▼');
        }
        else if ($(this).prev().hasClass('tlw-close')) {
            $(this).prev().removeClass('tlw-close');
            $(this).prev().addClass('tlw-open');
            $(this).prev().text('▲');
        }
        $(this).next().slideToggle(200);
    });
    // 項目(li a)
    $('.tlw-link').on(tlwDownEvent, function (e) {
        $('.tlw-control-list').css('z-index', 'auto');
        $(this).parent().parent().parent().parent('.tlw-control-list').css('z-index', 1);
    });
    /*
        サブメニューへのリンク
    */
    $('.submenu-link').on('click', function (e) {
        var param = $(this).data('pscarg'); // json
        $.when(
            // 選択状態を保存
            pscnav.api.replaceParam(function (p) {
                return param;
            }, null, null)
        ).done(function () {
            pscnav.api.go('submenu.html', param);
        });
    });
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
var tlwDefault;
var tlwResizeRate;
var tlwPosition = new Array;
var pageRefresh = function () {

    // 解像度を取得
    var sh = window.screen.height;
    var sw = window.screen.width;
    var iw = window.innerWidth;
    var ih = window.innerHeight;

    // タブレット用メニューリサイズ
    var menuResize = function () {

        if (iw <= 768) {
            var rate = iw / 768;

            // レートが同じならリサイズしない
            if (tlwResizeRate && tlwResizeRate == rate)
                return;

            // paddingはない機種も存在するためpadding-topを追加
            if ($('.tlw-control-list').css('font-size') && ($('.tlw-link').css('padding') || $('.tlw-link').css('padding-top'))) {
                tlwResizeRate = rate;
                if (!tlwDefault) {
                    tlwDefault = {
                        'FontSize': $('.tlw-control-list').css('font-size').replace('px', '')
                        , 'MaxWidth': $('.tlw-control-list').css('max-width').replace('px', '')
                        , 'PaddingT': $('.tlw-link').css('padding-top').replace('px', '')
                        , 'PaddingL': $('.tlw-link').css('padding-left').replace('px', '')
                        , 'PaddingR': $('.tlw-link').css('padding-right').replace('px', '')
                        , 'PaddingB': $('.tlw-link').css('padding-bottom').replace('px', '')
                    };
                }
                $('.tlw-control-list').css('font-size', Math.floor(tlwDefault.FontSize * rate) + 'px');
                $('.tlw-control-list').css('max-width', Math.floor(tlwDefault.MaxWidth * rate) + 'px');
                $('.tlw-link').css('padding-top', Math.floor(tlwDefault.PaddingT * rate) + 'px');
                $('.tlw-link').css('padding-left', Math.floor(tlwDefault.PaddingL * rate) + 'px');
                $('.tlw-link').css('padding-right', Math.floor(tlwDefault.PaddingR * rate) + 'px');
                $('.tlw-link').css('padding-bottom', Math.floor(tlwDefault.PaddingB * rate) + 'px');
            }
        }
        else {
            if (tlwDefault) {
                tlwResizeRate = 0;
                $('.tlw-control-list').css('font-size', tlwDefault.FontSize + 'px');
                $('.tlw-control-list').css('max-width', tlwDefault.MaxWidth + 'px');
                $('.tlw-link').css('padding-top', tlwDefault.PaddingT + 'px');
                $('.tlw-link').css('padding-left', tlwDefault.PaddingL + 'px');
                $('.tlw-link').css('padding-right', tlwDefault.PaddingR + 'px');
                $('.tlw-link').css('padding-bottom', tlwDefault.PaddingB + 'px');
            }
        }
    }
    // タブレット用メニュー再配置
    var menuReposition = function () {
        // タブレット用メニュー再配置
        var orgsize = img_true_size(img_menu);
        paramy = img_menu.height / orgsize.height;
        paramx = img_menu.width / orgsize.width;
        var len = TOP_MENU.length;
        var x, y;
        for (var i = 0; i < len; i++) {
            x = TOP_MENU[i].POSITION_X * paramx + $('#img_menu').offset().left - $('#div_menu').offset().left;
            y = TOP_MENU[i].POSITION_Y * paramy;

            // パラメータが同じなら再配置しない
            if (tlwPosition[TOP_MENU[i].TOP_MENU_ID] && tlwPosition[TOP_MENU[i].TOP_MENU_ID].x == x && tlwPosition[TOP_MENU[i].TOP_MENU_ID].y == y)
                continue;

            tlwPosition[TOP_MENU[i].TOP_MENU_ID] = { x: x, y: y };
            $('#UL_TOP_MENU_ID' + TOP_MENU[i].TOP_MENU_ID).css({ 'left': x, 'top': y });
        }
    }

    // 携帯用
    if (iw < 568) {
        $('#div_menu').hide();
        $('#mobile').show();
        $('#H2_MENU_HEADER').text('メニューリストから検索')
    }
    else {
        $('#div_menu').show();
        $('#mobile').hide();
        $('#H2_MENU_HEADER').text('イラストから検索')

        // タブレット用メニュー非表示
        $('.tlw-control-list').hide();
        menuReposition();
        menuResize();
        // タブレット用メニュー表示
        $('.tlw-control-list').show();
    }

    $('#header').toolbar('updatePagePadding');
    $('#footer').toolbar('updatePagePadding');

};

