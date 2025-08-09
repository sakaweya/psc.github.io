var _CurrentSectionID = 0;
var _CurrentContentID = 0;
var _CurrentPurposeID = 0;
var _CurrentCategoryID = 0;

var SECTION;
var CONTENT;
var CONTENT_ITEM;
var PURPOSE;
var CATEGORY;
var PRODUCT;
var PRODUCT_DETAILS;
var VA_SECTION = new Array;
var VA_CONTENT = new Array;
var VA_CONTENT_ITEM = new Array;
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
            , $.getJSON('assets/TM_PURPOSE.json')
            , $.getJSON('assets/TM_CATEGORY.json')
            , $.getJSON('assets/TM_PRODUCT.json')
            , $.getJSON('assets/TM_PRODUCT_DETAIL.json')
        )
        .done(function (section, content, content_item, purpose, category, product, product_details) {
            // データ整理
            SECTION = section[0];
            CONTENT = content[0];
            CONTENT_ITEM = content_item[0];
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
                            var exlist = ['#header', '#footer', '#contentpanel'];
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
                            var exlist = ['#header', '#footer', '#contentpanel'];
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
                            _CurrentPurposeID = param.PURPOSE_ID;
                            _CurrentCategoryID = param.CATEGORY_ID;
                        }
                        // ページ初期化
                        pageInit();

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

    $('#H1_HEADER').text(VA_CATEGORY[_CurrentCategoryID].CATEGORY_NM);
    $('#header').toolbar('updatePagePadding');
    $('#H2_MENU_HEADER').text(VA_CATEGORY[_CurrentCategoryID].CATEGORY_NM);
    $("#P_MENU_DETAIL").text(VA_SECTION[_CurrentSectionID].SECTION_NM + ' > '
        + VA_CONTENT[_CurrentContentID].CONTENT_NM + ' > '
        + VA_PURPOSE[_CurrentPurposeID].PURPOSE_NM + ' > ');

    var key = _CurrentSectionID + '_' + _CurrentContentID + '_' + _CurrentPurposeID + '_' + _CurrentCategoryID;
    var data, len, i, jsonstr;

    data = VA_PRODUCT_DETAILS[key];
    len = VA_PRODUCT_DETAILS[key].length;

    var ul_items = '';
    for (i = 0; i < len; i++) {
        jsonstr = 'data-pscarg=' + JSON.stringify({
            SECTION_ID: _CurrentSectionID,
            CONTENT_ID: _CurrentContentID,
            PURPOSE_ID: _CurrentPurposeID,
            CATEGORY_ID: _CurrentCategoryID,
            PRODUCT_ID: data[i].PRODUCT_ID
        });
        ul_items += '<li><a class="load-link productdetails-link" href="#" ' + jsonstr + '>'
            + '<span style="white-space: normal; word-wrap: break-word;">'
            + VA_PRODUCT[data[i].PRODUCT_ID].PRODUCT_NM + '</span></a>';
    }

    var ul = '<ul id="UL_PRODUCT" data-role="listview" data-inset="true">'
        + '<li data-role="list-divider"><h3>商品名／工法名</h3></li>'
        + ul_items
        + '</ul>';

    var $wkprodctlist = $('<div id=PRODUCT_LIST>').append(ul);
    $wkprodctlist.find('#UL_PRODUCT').listview().listview('refresh');

    $('#main').append($wkprodctlist);
    /*
        商品詳細へのリンク
    */
    $('.productdetails-link').on('click', function (e) {
        var param = $(this).data('pscarg'); // json
        pscnav.api.go('productdetails.html', param);
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
