var _CurrentSectionID = 0;
var _CurrentContentID = 0;
var _CurrentItemID = 0;
var _CurrentPurposeID;
var _CurrentCategoryID;
var SECTION;
var CONTENT;
var CONTENT_ITEM;
var SUB_MENU;
var SUB_MENU_ITEM;
var PURPOSE;
var CATEGORY;
var VA_SECTION = new Array;
var VA_CONTENT = new Array;
var VA_CONTENT_ITEM = new Array;
var VA_CONTENT_ITEM_KEYVALUE = new Array;
var VA_SUB_MENU = new Array;
var VA_SUB_MENU_ITEM = new Array;
var VA_PURPOSE = new Array;
var VA_CATEGORY = new Array;
var VA_PRODUCT = new Array;
var VA_PRODUCT_DETAILS = new Array;

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
            , $.getJSON('assets/TM_CONTENT_ITEM.json')
            , $.getJSON('assets/TM_SUB_MENU.json')
            , $.getJSON('assets/TM_SUB_MENU_ITEM.json')
            , $.getJSON('assets/TM_PURPOSE.json')
            , $.getJSON('assets/TM_CATEGORY.json')
            , $.getJSON('assets/TM_PRODUCT.json')
            , $.getJSON('assets/TM_PRODUCT_DETAIL.json')

        )
        .done(function (section, content, content_item, menu, menu_item, purpose, category, product, product_details) {
            // データ整理
            SECTION = section[0];
            CONTENT = content[0];
            CONTENT_ITEM = content_item[0];
            SUB_MENU = menu[0];
            SUB_MENU_ITEM = menu_item[0];
            PURPOSE = purpose[0];
            CATEGORY = category[0];
            PRODUCT = product[0];
            PRODUCT_DETAILS = product_details[0];
            $.when(
                // SECTION_ID	SECTION_NM
                $.each(SECTION, function (index, data) {
                    VA_SECTION[data.SECTION_ID] = data;
                })
                // SECTION_ID	CONTENT_ID	CONTENT_NM
                , $.each(CONTENT, function (index, data) {
                    VA_CONTENT[data.CONTENT_ID] = data;
                })
                // CONTENT_ID	CONTENT_NM	CONTENT_ITEM_ID	CONTENT_ITEM_NM	CONTENT_ITEM_IMAGE_URL
                , $.each(CONTENT_ITEM, function (index, data) {
                    VA_CONTENT_ITEM[data.CONTENT_ITEM_ID] = data;
                    if (!VA_CONTENT_ITEM_KEYVALUE[data.CONTENT_ID])
                        VA_CONTENT_ITEM_KEYVALUE[data.CONTENT_ID] = new Array;
                    VA_CONTENT_ITEM_KEYVALUE[data.CONTENT_ID].push(data);
                })
                // CONTENT_ITEM_ID	CONTENT_ITEM_NM	SUB_MENU_ID	SUB_MENU_NM	SUB_MENU_GROUP_ID	POSITION_X	POSITION_Y
                , $.each(SUB_MENU, function (index, data) {
                    VA_SUB_MENU[data.SUB_MENU_ID] = data;
                })
                // SUB_MENU_ID	SUB_MENU_NM	SUB_MENU_ITEM_ID	SUB_MENU_ITEM_NM
                , $.each(SUB_MENU_ITEM, function (index, data) {
                    VA_SUB_MENU_ITEM[data.SUB_MENU_ITEM_ID] = data;
                })
                // PURPOSE_ID PURPOSE_NM
                , $.each(PURPOSE, function (index, data) {
                    VA_PURPOSE[data.PURPOSE_ID] = data;
                })
                // CATEGORY_ID CATEGORY_NM
                , $.each(CATEGORY, function (index, data) {
                    VA_CATEGORY[data.CATEGORY_ID] = data;
                })
                // PRODUCT_ID	PRODUCT_NM
                , $.each(PRODUCT, function (index, data) {
                    VA_PRODUCT[data.PRODUCT_ID] = data;
                })
                // SECTION_ID	CONTENT_ID	PURPOSE_ID	CATEGORY_ID	PRODUCT_ID	CONSTRUCTION_METHOD_ID	MERIT
                , $.each(PRODUCT_DETAILS, function (index, data) {
                    var key = data.SECTION_ID + '_' + data.CONTENT_ID + '_' + data.PURPOSE_ID + '_' + data.CATEGORY_ID;
                    if (!VA_PRODUCT_DETAILS[key]) {
                        VA_PRODUCT_DETAILS[key] = new Array;
                    }
                    VA_PRODUCT_DETAILS[key].push(data);
                })
            )
            .done(function () {
                // cordova deviceready
                pscnav.start({
                    startup: function (api, param) {
                        pscnav.api = api;

                        $('.navhistory').on('click', function () { api.historyBack(); });
                        $('.navtopmenu').on('click', function () { api.go('guidance.html'); });
                        $('.navsearch').on('click', function () { api.go('searchmenu.html', {}); });
                        $('.navcontact').on('click', function () { api.go('contact.html'); });
                        $('.navstar').on('click', function () { api.go('favorite.html'); });
                        $('.navbook').on('click', function () { api.goBookManager(); });
                        $('.navhelp').on('click', function () { api.go('information.html'); });
                        $('#page').on('swiperight', function (e) {
                            var exlist = ['#header', '#footer', '#contentpanel', '#div_menu', '.tlw-control-list'];
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
                        $('#page').on('swipeleft', function (e) {
                            var exlist = ['#header', '#footer', '#contentpanel', '#div_menu', '.tlw-control-list'];
                            var i, len = exlist.length;
                            for (i = 0; i < len; i++) {
                                if ($(e.target).is(exlist[i])) { return; }
                                if ($(e.target).parents(exlist[i]).size() > 0) { return; }
                            }
                            if ($('.ui-page-active').jqmData('panel') !== 'open') {
                                $('#contentpanel').panel('open');
                            }
                        });
                        if (param) {
                            _CurrentSectionID = param.SECTION_ID;
                            _CurrentContentID = param.CONTENT_ID;
                            if (param.CONTENT_ITEM_ID)
                                _CurrentItemID = param.CONTENT_ITEM_ID;
                            if (param.PURPOSE_ID)
                                _CurrentPurposeID = param.PURPOSE_ID;
                            if (param.CATEGORY_ID)
                                _CurrentCategoryID = param.CATEGORY_ID;
                        }
                        // ページ初期化
                        pageInit();
                        // ページリフレッシュ
                        pageRefresh();
                        // ページスクロール
                        if (_CurrentPurposeID) {
                            $.mobile.silentScroll($('#DIV_PURPOSE_ID' + _CurrentPurposeID).offset().top - $('#header').offset().top - $('#header').height());
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

    /*
        ヘッダー
    */
    $('#H1_HEADER').text(VA_CONTENT[_CurrentContentID].CONTENT_NM);
    $('#H2_MENU_HEADER').text(VA_CONTENT[_CurrentContentID].CONTENT_NM);
    $("#P_MENU_DETAIL").text(VA_SECTION[_CurrentSectionID].SECTION_NM + ' > ');
    var data, len, i, jsonstr;
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
        if (_CurrentSectionID == data[i].SECTION_ID && _CurrentContentID == data[i].CONTENT_ID)
        {
            panel_ul_item[data[i].SECTION_ID] += '<li><a class="load-link ui-state-disabled submenu-link" href="#" ' + jsonstr + '>' + data[i].CONTENT_NM + '</a>';
        }
        else {
            panel_ul_item[data[i].SECTION_ID] += '<li><a class="load-link submenu-link" href="#" ' + jsonstr + '>' + data[i].CONTENT_NM + '</a>';
        }
    }
    len = SECTION.length;
    data = SECTION;
    var panel_ul=''
    for (i = 0; i < len; i++) {
        panel_ul += '<ul data-role="listview">'
        + '<li data-role="list-divider">' + data[i].SECTION_NM + '</li>'
        + panel_ul_item[data[i].SECTION_ID]
        +'</ul>';
    }
    var $wkpanel = $('<div id="DIV_CONTETN_PANEL"/>').append(panel_ul);
    $wkpanel.find('ul').listview().listview('refresh');
    $('#contentpanel').append($wkpanel);
    $("#contentpanel").trigger("updatelayout");

    /*
        タブレット用ページ選択作成
    */
    len = CONTENT_ITEM.length;
    data = CONTENT_ITEM;
    var radio = '';
    var content_count=0;
    for (i = 0; i < len; i++) {
        if (data[i].CONTENT_ID == _CurrentContentID) {
            radio += '<input type="radio" name="page-select" class="page-select" id="page-select-' + data[i].CONTENT_ITEM_ID + '" value="' + data[i].CONTENT_ITEM_ID + '" >'
            + '<label for="page-select-' + data[i].CONTENT_ITEM_ID + '">' + data[i].CONTENT_ITEM_NM + '</label>';
            content_count++;
        }
    }
    if (content_count> 1) {
        // 戻る
        radio = '<a href="#" class="ui-btn ui-icon-carat-l ui-corner-all ui-btn-icon-notext ui-btn-inline ui-state-disabled prev">prev</a>'
        + radio
        // 進む
        + '<a href="#" class="ui-btn ui-icon-carat-r ui-corner-all ui-btn-icon-notext ui-btn-inline next">next</a>';
    }
    $('#DIV_CONTENT_ITEM').controlgroup('container')['append'](radio);
    $('.page-select').checkboxradio();
    $('#DIV_CONTENT_ITEM').controlgroup("refresh");
    /*
        タブレット用　メニュー作成
    */
    // サブメニュー項目
    data = SUB_MENU_ITEM;
    len = SUB_MENU_ITEM.length;
    var ul_items = new Array;

    var contentid;
    var purposeid;

    for (i = 0; i < len; i++) {
        contentid = VA_CONTENT_ITEM[VA_SUB_MENU[data[i].SUB_MENU_ID].CONTENT_ITEM_ID].CONTENT_ID;
        purposeid = VA_SUB_MENU[data[i].SUB_MENU_ID].PURPOSE_ID;

        if (contentid == _CurrentContentID) {
            if (!ul_items[data[i].SUB_MENU_ID]) {
                ul_items[data[i].SUB_MENU_ID] = '';
            }
            jsonstr = 'data-pscarg=' + JSON.stringify({
                SECTION_ID: _CurrentSectionID,
                CONTENT_ID: _CurrentContentID,
                PURPOSE_ID: purposeid,
                CATEGORY_ID: data[i].CATEGORY_ID,
            });
            ul_items[data[i].SUB_MENU_ID] += '<li><a class="tlw-link load-link productlist-link" href="#" ' + jsonstr + '>●' + data[i].SUB_MENU_ITEM_NM + '</a>';
        }
    }
    // サブメニューグループ
    data = SUB_MENU;
    len = SUB_MENU.length;
    var ul_grorups = Array;
    var groupid;
    for (i = 0; i < len; i++) {
        contentid = VA_CONTENT_ITEM[data[i].CONTENT_ITEM_ID].CONTENT_ID;
        if (contentid == _CurrentContentID) {
            groupid = (data[i].SUB_MENU_GROUP_ID) ? data[i].SUB_MENU_GROUP_ID : data[i].SUB_MENU_ID;

            if (!ul_grorups[groupid]) {
                ul_grorups[groupid] = '';
            }
            ul_grorups[groupid] += '<li id="LI_SUB_MENU_ID' + data[i].SUB_MENU_ID + '">'
                + '<a class="tlw-control tlw-open">▲</a>'
                + '<span class="tlw-title tlw-contorol-title">' + data[i].SUB_MENU_NM + '</span>'
                + '<ul id="UL_SUB_MENU_ITEM' + data[i].SUB_MENU_ID + '"class="tlw-list">' + ul_items[data[i].SUB_MENU_ID] + '</ul>'
                + '</ll>';
        }
    }
    // サブメニュー
    var menu = new Array;
    for (i = 0; i < len; i++) {
        contentid = VA_CONTENT_ITEM[data[i].CONTENT_ITEM_ID].CONTENT_ID;
        if (contentid == _CurrentContentID) {
            if (!data[i].SUB_MENU_GROUP_ID) {
                groupid = (data[i].SUB_MENU_GROUP_ID) ? data[i].SUB_MENU_GROUP_ID : data[i].SUB_MENU_ID;
                if (!menu[data[i].CONTENT_ITEM_ID])
                    menu[data[i].CONTENT_ITEM_ID] = '';
                menu[data[i].CONTENT_ITEM_ID] += '<ul id="UL_SUB_MENU_GROUP_ID' + data[i].SUB_MENU_ID + '" class="tlw-control-list CONTENT_ITEM_ID' + data[i].CONTENT_ITEM_ID + '">'
                    + ul_grorups[groupid]
                    + '</ul>';
            }
        }
    }
    /*
        携帯用メニュー作成   collapsible
    */
    var ul_purposes = new Array;
    var purpose_category_flg = new Array;

    var sortIndex = 0;
    var sortIndexs = new Array;
    var sortDatas = new Array;

    data = SUB_MENU;
    len = SUB_MENU.length;
    for (i = 0; i < len; i++)
    {
        contentid = VA_CONTENT_ITEM[data[i].CONTENT_ITEM_ID].CONTENT_ID;
        purposeid = data[i].PURPOSE_ID;
        if (contentid == _CurrentContentID) {
            if (sortIndexs[purposeid] == null) {
                sortIndexs[purposeid] = sortIndex++;
                ul_purposes[sortIndexs[purposeid]] = '';
                sortDatas[sortIndexs[purposeid]] = VA_PURPOSE[purposeid];
            }
        }
    }

    data = SUB_MENU_ITEM;
    len = SUB_MENU_ITEM.length;
    for (i = 0; i < len; i++) {
        contentid = VA_CONTENT_ITEM[VA_SUB_MENU[data[i].SUB_MENU_ID].CONTENT_ITEM_ID].CONTENT_ID;
        purposeid = VA_SUB_MENU[data[i].SUB_MENU_ID].PURPOSE_ID;
        if (contentid == _CurrentContentID) {
            // 同一の用途、分類のは排除
            if (!purpose_category_flg[purposeid + '_' + data[i].CATEGORY_ID]) {
                purpose_category_flg[purposeid + '_' + data[i].CATEGORY_ID] = true;
                jsonstr = 'data-pscarg=' + JSON.stringify({
                    SECTION_ID: _CurrentSectionID,
                    CONTENT_ID: _CurrentContentID,
                    PURPOSE_ID: purposeid,
                    CATEGORY_ID: data[i].CATEGORY_ID,
                });
                ul_purposes[sortIndexs[purposeid]] += '<li><a class="load-link productlist-link" href="#" ' + jsonstr + '>'
                    + '<span style="white-space: normal; word-wrap: break-word;">'
                    + VA_CATEGORY[data[i].CATEGORY_ID].CATEGORY_NM + '</span></a>';
            }
        }
    }
    var purpose = '';
    len = ul_purposes.length;
    
    for (i = 0; i < len; i++) {
        purpose += '<div id="DIV_PURPOSE_ID' + sortDatas[i].PURPOSE_ID + '" data-role="collapsible" data-collapsed="true" class="DIV_PURPOSE_ID">'
        + '<h3>' + sortDatas[i].PURPOSE_NM + '</h3>'
        + '<ul id="UL_PURPOSE_ID' + sortDatas[i].PURPOSE_ID + '" data-role="listview" class="UL_PURPOSE_ID">'
        + ul_purposes[i]
        + '</ul>'
        + '</div>';
    }

    var $wkpurpose = $('<div id="DIV_PURPOSE"/>').append(purpose);
    $wkpurpose.find('.DIV_PURPOSE_ID').collapsible();
    $wkpurpose.find('.UL_PURPOSE_ID').listview().listview('refresh');
    if (_CurrentPurposeID) {
        $wkpurpose.find('#DIV_PURPOSE_ID' + _CurrentPurposeID).collapsible({ collapsed: false });
    }
    /*
        コンテンツ画像
    */
    data = VA_CONTENT_ITEM_KEYVALUE[_CurrentContentID];
    if (data) {
        len = VA_CONTENT_ITEM_KEYVALUE[_CurrentContentID].length;
        div_img = '<div class="viewport"><div class="flipsnap">';   // flipsnap
        for (i = 0; i < len; i++) {
            div_img += '<div id="DIV_CONTENT_ITEM_IMAGE' + data[i].CONTENT_ITEM_ID+'" class="item"> '     // flipsnap
                + '<img id="CONTENT_ITEM_IMAGE' + data[i].CONTENT_ITEM_ID + '" class="CONTENT_ITEM_IMAGE" src="' + data[i].CONTENT_ITEM_IMAGE_URL + '" value="' + i + '"/>'
                + menu[data[i].CONTENT_ITEM_ID]
                + '</div>'
        }
        div_img += '</div></div>';

        $('#content-item-images').append(div_img);  // イメージ
        /*
            flipsnapの初期化
        */
        flipsnapInit();
        $(".my-gallery").css('background-color', '#0B4Ea2');
    }

    $('#mobile').append($wkpurpose);    // 携帯用メニュー追加

    /*
        タブレット用 メニュー初期表示,イベント
    */
    var supportTouch = 'ontouchstart' in window;
    var tlwDownEvent = supportTouch ? 'touchstart' : 'mousedown';
    var tlwUpEvent = supportTouch ? 'touchend' : 'mouseup';

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
        pscnav.api.go('submenu.html', param);
    });
    /*
        商品一覧へのリンク
    */
    $('.productlist-link').on('click', function (e) {

        var param = $(this).data('pscarg'); // json
        param.CONTENT_ITEM_ID = _CurrentItemID;
        $.when(
            // 選択状態を保存
            pscnav.api.replaceParam(function (p) {
                return param;
            }, null, null)
        ).done(function () {
            var key = param.SECTION_ID + '_' + param.CONTENT_ID + '_' + param.PURPOSE_ID + '_' + param.CATEGORY_ID;
            // 該当商品がひとつなら商品詳細へ
            if (VA_PRODUCT_DETAILS[key].length == 1) {
                param['PRODUCT_ID'] = VA_PRODUCT_DETAILS[key][0].PRODUCT_ID;
                pscnav.api.go('productdetails.html', param);
                return;
            }
            // 該当商品が複数なら商品一覧へ
            pscnav.api.go('productlist.html', param);
        });
    });
    /*
        ロード用イベント
    */
    $('.load-link').on('click', function () {
        $.mobile.loading('show');
    });


    // コンテンツページ選択
    if (_CurrentItemID) {
        contentItemSelect(_CurrentItemID);
    }
    else {
        contentItemSelect($('.page-select:first').attr('value'));
    }

    // 縦横 サイズ変更
    $(window).on('orientationchange resize', function (event) {
        setBackground('#page');
        setBackground('body');
        pageRefresh();

    });
};

/*
    コンテンツページ選択
*/
var contentItemSelect = function (item_id) {
    // メニュー

    if ('prev' == item_id) {
        if ($('.page-select:first').attr('value') == _CurrentItemID) { return; }
        var prev;
        $('.page-select').each(function () {
            if ($(this).attr('value') == _CurrentItemID) {
                item_id = $(prev).attr('value');
                return false;
            }
            prev = this;
        });
    }
    else if ('next' == item_id) {
        if ($('.page-select:last').attr('value') == _CurrentItemID) { return; }
        var next;
        $('.page-select').each(function () {
            if (next) {
                item_id = $(this).attr('value');
                return false;
            }
            if ($(this).attr('value') == _CurrentItemID)
                next = true;
        });
    }

    // セレクタ＜＞の表示
    if (item_id == $('.page-select:first').attr('value')) {
        $('.prev').addClass('ui-state-disabled');
    }
    else{
        $('.prev').removeClass('ui-state-disabled');
    }

    if (item_id == $('.page-select:last').attr('value')) {
        $('.next').addClass('ui-state-disabled');
    }
    else {
        $('.next').removeClass('ui-state-disabled');
    }
    $('#page-select-' + item_id).attr('checked', true);
    $('.page-select').checkboxradio('refresh');
    
    _CurrentItemID = item_id;
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
        $('.CONTENT_ITEM_IMAGE').each(function () {
            var orgsize = img_true_size(this);
            if ((orgsize.width & orgsize.height) <= 0)
                return;

            var paramy = this.height / orgsize.height;
            var paramx = this.width / orgsize.width;

            var len = SUB_MENU.length;
            var contentid;
            var x, y, groupid;
            var id = $(this).attr('id');
            var offsetleft = $(this).offset().left;
            for (var i = 0; i < len ; i++) {
                contentid = VA_CONTENT_ITEM[SUB_MENU[i].CONTENT_ITEM_ID].CONTENT_ID;
                if (_CurrentContentID == contentid) {
                    if (id == 'CONTENT_ITEM_IMAGE' + SUB_MENU[i].CONTENT_ITEM_ID) {
                        if (SUB_MENU[i].POSITION_X && SUB_MENU[i].POSITION_Y) {
                            x = SUB_MENU[i].POSITION_X * paramx + offsetleft - $('#DIV_CONTENT_ITEM_IMAGE' + SUB_MENU[i].CONTENT_ITEM_ID).offset().left;
                            y = SUB_MENU[i].POSITION_Y * paramy;
                            groupid = (SUB_MENU[i].SUB_MENU_GROUP_ID) ? SUB_MENU[i].SUB_MENU_GROUP_ID : SUB_MENU[i].SUB_MENU_ID;

                            // パラメータが同じなら再配置しない
                            if (tlwPosition[groupid] && tlwPosition[groupid].x == x && tlwPosition[groupid].y == y)
                                continue;

                            tlwPosition[groupid] = { x: x, y: y };
                            $('#UL_SUB_MENU_GROUP_ID' + groupid).css({ 'left': x, 'top': y });
                        }
                    }
                }
            }
        });
    }

    // 携帯用
    if (iw < 568) {
        $('#DIV_CONTENT_ITEM').hide();
        $('#div_menu').hide();
        $('#mobile').show();
    }
    else {
        $('#DIV_CONTENT_ITEM').show();
        $('#div_menu').show();
        $('#mobile').hide();

        // メニュー再配置
        flipsnapAdjustSize();
        menuReposition();
        menuResize();

        // コンテンツページ選択(
        if (_CurrentItemID) {
            if (flipsnap.currentPoint != $('#CONTENT_ITEM_IMAGE' + _CurrentItemID).attr('value'))
                flipsnap.moveToPoint($('#CONTENT_ITEM_IMAGE' + _CurrentItemID).attr('value'));
        }
    }

    $('#header').toolbar('updatePagePadding');
    $('#footer').toolbar('updatePagePadding');

    // 画像 読み込み完了
    $('.CONTENT_ITEM_IMAGE').on("load", function () {
        menuReposition();
    });

};
/*
    flipsnapの初期化
*/
var flipsnap;
var flipsnapInit = function () {

    var $fsnap = $('#content-item-images');
    var $pointer = $fsnap.find('.pointer span');
    var $pointerlink = $fsnap.find('.pointer a');
    flipsnap = Flipsnap('#content-item-images .flipsnap');

    flipsnap.element.addEventListener('fspointmove', function (ev) {
        contentItemSelect($('.CONTENT_ITEM_IMAGE[value="' + flipsnap.currentPoint + '"]').attr('id').replace('CONTENT_ITEM_IMAGE', ''));
    }, false);

    $('.page-select').on('change', function () {
        contentItemSelect($(this).attr('value'));
        flipsnap.moveToPoint($('#CONTENT_ITEM_IMAGE' + $(this).attr('value')).attr('value'));
    });
    $('.next').on('click', function () {
        contentItemSelect('next');
        flipsnap.toNext();
    });
    $('.prev').on('click', function () {
        contentItemSelect('prev');
        flipsnap.toPrev();
    });
}
/*
    flipsnapのイメージサイズ調整
*/
var flipsnapAdjustSize = function () {

    var $item = $('.viewport .flipsnap .item');
    var itemmargin = $item.outerWidth() - $item.width();

    $item.width($('.viewport').width() - itemmargin);

    $('.flipsnap').width($item.outerWidth() * $('.CONTENT_ITEM_IMAGE').length);
    if (flipsnap.distance != $item.outerWidth()) {
        flipsnap.distance = $item.outerWidth();
        flipsnap.refresh();
    }
}