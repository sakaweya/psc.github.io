var _CurrentCorpCD = 0;
var _CurrentBusinessOfficeCD;
var CORP;
var BUSINESS_OFFICE;
var VA_CORP = new Array;
var VA_BUSINESS_OFFICE = new Array;

window.addEventListener('load', function () {
    $('[data-role="panel"]').panel({ theme: 'c' });
    $('#contentpanel').find('ul').listview().listview('refresh');
    $("#contentpanel").trigger("updatelayout");
    setBackground('#page');
    setBackground('#business_office');
    setBackground('body');
    setJQMSwipeParam();

    $.when(
            // ローディング表示
            $.mobile.loading('show')
    )
    .done(function () {
        // データ読み込み
        $.when(
            $.getJSON('assets/TM_CORP.json')
            , $.getJSON('assets/TM_BUSINESS_OFFICE.json')
        )
        .done(function (corp, office) {
            CORP = corp[0];
            BUSINESS_OFFICE = office[0];
            // データ整理
            $.when(
                // CORP_CD	CORP_NM	CORP_NM2	CORP_ABBR_NM	POST_CODE	ADDRESS	PHONE_NUMBER	CALL_URL
                $.each(CORP, function (index, data) {
                    VA_CORP[data.CORP_CD] = data;
                })
                // CORP_CD	BUSINESS_OFFICEE_CD	BUSINESS_OFFICE_NM	POST_CODE	ADDRESS	PHONE_NUMBER
                , $.each(BUSINESS_OFFICE, function (index, data) {
                    VA_BUSINESS_OFFICE[data.BUSINESS_OFFICE_CD] = data;
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
                            if ($(e.target).is("#business_office") || $(e.target).parents("#business_office").size() > 0) {
                                if (!_CurrentCorpCD) {
                                    $("body").pagecontainer("change", "#page");
                                    return;
                                }
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
                        if (param) {
                            _CurrentCorpCD = param.CALL_CORP_CD;
                            _CurrentBusinessOfficeCD = param.CALL_BUSINESS_OFFICE_CD;
                        }
                        // ページ初期化
                        pageInit();

                        // ローディング非表示
                        $.mobile.loading('hide');
                        // cordova Android 戻るボタン
                        document.addEventListener('backbutton', function () {
                            $.mobile.loading('show');
                            if ($("body").pagecontainer('getActivePage').attr('id') == 'business_office' && !$('#business_office_back').hasClass('navhistory')) {
                                $("body").pagecontainer("change", "#page");
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
        問い合わせ先 代表作成
    */
    var len, data, i;
    len = CORP.length;
    data = CORP;
    var ul_corp = '';
    var addr, tel, map;
    var $div_corp = $('<div id="DIV_CORP"/>');

    for (i = 0; i < len; i++) {
        $div_corp.append($('<a id="' + data[i].CORP_CD + '" href="#business_office" class="BTN_CORP ui-btn ui-icon-carat-r ui-btn-icon-right" style="text-align:left;">' + data[i].CORP_NM + '</a>').button());
    }
    $('#main').append($div_corp);

    $('.BTN_CORP').on('click', function (e) {
        var param = $(this).attr("id"); // json
        SelectCorp(param);
    });
    /*
        問い合わせ 事業所作成
    */
    len = BUSINESS_OFFICE.length;
    data = BUSINESS_OFFICE;
    var ul_offices = new Array;
    var li_addr;
    for (i = 0; i < len; i++) {

        if (!ul_offices[data[i].CORP_CD]) {
            ul_offices[data[i].CORP_CD] = '';
        }
        // 住所
        addr = '';
        li_addr = ''
        if (data[i].POST_CODE != '-' && data[i].POST_CODE != null && data[i].POST_CODE != '') {
            addr = '〒' + data[i].POST_CODE + '  ';
        }
        if (data[i].ADDRESS != '-' && data[i].ADDRESS != null && data[i].ADDRESS != '') {
            addr = data[i].ADDRESS;
        }
        if (addr != '') {
            // 地図URL
            map = CreateGaibuMapURL(data[i].ADDRESS);
            li_addr = '<li><a href="#" data-pscarg=\'' + map + '\' class="ui-icon-location location-link">'
                + '<span style="white-space: normal; word-wrap: break-word;">' + addr + '</span></a></li>';
        }
        // 電話
        tel = data[i].PHONE_NUMBER;
        tel = tel.split('-').join('');
        tel = tel.split('ｰ').join('');
        tel = tel.split('－').join('');
        tel = tel.split('ー').join('');
        tel = tel.split(' ').join('');
        tel = tel.split('　').join('');

        ul_offices[data[i].CORP_CD] += '<ul id="UL_BUSINESS_OFFICE' + data[i].BUSINESS_OFFICE_CD + '" data-role="listview" data-inset="true" class="UL_BUSINESS_OFFICE">'
        + '<li data-role="list-divider"><h4 style="white-space: normal; word-wrap: break-word;">' + data[i].BUSINESS_OFFICE_NM + '</h4></li>'
        + li_addr
        + '<li><a href="#" data-pscarg=\'' + tel + '\' class="ui-icon-phone phone-link">'
        + '<span style="white-space: normal; word-wrap: break-word;">TEL.' + data[i].PHONE_NUMBER + '</span></a></li>'
        + '</ul>';
    }
    // 問い合わせ 事業所 一覧
    len = CORP.length;
    data = CORP;
    var div_offices = '';
    for (i = 0; i < len; i++) {
        div_offices += '<div id="DIV_BUSINESS_OFFICE' + data[i].CORP_CD + '"class="DIV_BUSINESS_OFFICE" >'
        + ul_offices[data[i].CORP_CD]
        + '</div>';
    }
    var $divcorp = $('<div id="DIV_CORP"/>').append(ul_corp);
    $divcorp.find('.UL_CORP').listview().listview('refresh');

    var $divoffice = $('<div id="DIV_BUSINESS_OFFICE"/>').append(div_offices);
    $divoffice.find('.UL_BUSINESS_OFFICE').listview().listview('refresh');

    $('#business_office_main').append($divoffice);  // 問い合わせ事業所追加

    // 会社選択
    SelectCorp(_CurrentCorpCD);
    // 指定ありなら直接事業所を表示
    if (_CurrentCorpCD) {
        // 戻るボタンはnavhistory
        $('#business_office_back').attr('href', '#');
        $("body").pagecontainer("change", "#business_office", {
            changeHash: false,
            transition: 'none',
        });
        if (_CurrentBusinessOfficeCD) {
            $.mobile.silentScroll($('#UL_BUSINESS_OFFICE' + _CurrentBusinessOfficeCD).offset().top - $('#business_office_header').offset().top - $('#business_office_header').height());
        }
    }
    else {
        // 指定なしなら
        // 戻るボタンは企業一覧へ
        $('#business_office_back').removeClass('navhistory');
    }

    /*
        地図へのリンク
    */
    $('.location-link').on('click', function (e) {
        var param = $(this).data('pscarg'); // json
        window.open(param, '_system');
    });
    /*
        電話へのリンク
    */
    $('.phone-link').on('click', function (e) {
        var param = $(this).data('pscarg'); // json
        window.open('tel:' + param, '_system');

    });
    /*
        外部ブラウザURLへのリンク
    */
    $('.url-link').on('click', function (e) {
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
        setBackground('#business_office');
        setBackground('body');
    });

};
/*
    会社選択
*/
var SelectCorp = function(corpcd , business_office_cd){
    if(corpcd){
        $('#corp_title').text(VA_CORP[corpcd].CORP_NM);
        $('#corp_url').text(VA_CORP[corpcd].CALL_URL);
        $('#corp_url').data('pscarg', VA_CORP[corpcd].CALL_URL);
        $('#corp_name').text(VA_CORP[corpcd].CORP_NM);
        $('.DIV_BUSINESS_OFFICE').hide();
        $('#DIV_BUSINESS_OFFICE' + corpcd).show();
    }
}
/*
    外部連携用　ＵＲＬ生成処理
*/
var CreateGaibuMapURL = function (address) {

    address = address.split(' ').join('').split('　').join('');
    var strURL = encodeURIComponent(address);

    
    // iOS Apple Maps
    if(navigator.userAgent.indexOf('Mac') != -1){
        strURL = 'http://maps.apple.com/?q=' + strURL;
    }
    else {
        strURL = 'http://maps.google.com/maps?q=' + strURL;
    }
    return strURL;
};