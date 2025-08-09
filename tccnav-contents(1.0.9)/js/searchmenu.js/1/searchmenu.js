var SEARCH_WORD = new Array;
var _searchValueBack;
var _searchValue;
var SECTION;
var CONTENT;
var CONTENT_ITEM;
var PURPOSE;
var CATEGORY;
var PRODUCT;
var PRODUCT_DETAILS;
var PRODUCT_IMAGES;
var PRODUCT_CALL;
var CONSTRUCTION_METHOD;
var CORP;
var VA_SECTION = new Array;
var VA_CONTENT = new Array;
var VA_CONTENT_ITEM = new Array;
var VA_PURPOSE = new Array;
var VA_CATEGORY = new Array;
var VA_PRODUCT = new Array;
var VA_PRODUCT_DETAILS = new Array;
var VA_PRODUCT_IMAGES = new Array;
var VA_PRODUCT_CALL = new Array;
var VA_CONSTRUCTION_METHOD = new Array;
var VA_CORP = new Array;
// 上付き、下付き、改行タグは検索対象がいとする
var UNSEARCH_TARGETS = ['<sub>', '</sub>', '<sup>', '</sup>', '<br/>', ];
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
            , $.getJSON('assets/TM_PRODUCT_IMAGE.json')
            , $.getJSON('assets/TM_PRODUCT_CALL.json')
            , $.getJSON('assets/TM_CONSTRUCTION_METHOD.json')
            , $.getJSON('assets/TM_CORP.json')
        )
        .done(function (section, content, content_item, purpose, category, product, product_details, product_images, product_call, construction_method, corp) {
            // データ整理
            SECTION = section[0];
            CONTENT = content[0];
            CONTENT_ITEM = content_item[0];
            PURPOSE = purpose[0];
            CATEGORY = category[0];
            PRODUCT = product[0];
            PRODUCT_IMAGES = product_images[0];
            PRODUCT_DETAILS = product_details[0];
            PRODUCT_CALL = product_call[0];
            CONSTRUCTION_METHOD = construction_method[0];
            CORP = corp[0];
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
                    var key = data.SECTION_ID + '_' + data.CONTENT_ID + '_' + data.PURPOSE_ID + '_' + data.CATEGORY_ID + '_' + data.PRODUCT_ID;
                    VA_PRODUCT_DETAILS[key] = data;
                })
                // PRODUCT_ID	PRODUCT_IMAGE_URL	PRODUCT_IMAGE_SIZE_X	PRODUCT_IMAGE_SIZE_Y
                , $.each(PRODUCT_IMAGES, function (index, data) {
                    var key = data.SECTION_ID + '_' + data.CONTENT_ID + '_' + data.PURPOSE_ID + '_' + data.CATEGORY_ID + '_' + data.PRODUCT_ID;
                    if (!VA_PRODUCT_IMAGES[key]) {
                        VA_PRODUCT_IMAGES[key] = new Array;
                    }
                    VA_PRODUCT_IMAGES[key].push(data);
                })

                // PRODUCT_ID	CALL_CORP_CD
                , $.each(PRODUCT_CALL, function (index, data) {
                    if (!VA_PRODUCT_CALL[data.PRODUCT_ID]) {
                        VA_PRODUCT_CALL[data.PRODUCT_ID] = new Array;
                    }
                    VA_PRODUCT_CALL[data.PRODUCT_ID].push(data);
                })
                // CONSTRUCTION_METHOD_ID	CONSTRUCTION_METHOD_NM
                , $.each(CONSTRUCTION_METHOD, function (index, data) {
                    VA_CONSTRUCTION_METHOD[data.CONSTRUCTION_METHOD_ID] = data;
                })

                // CORP_CD	CORP_NM	CORP_NM2	CORP_ABBR_NM	POST_CODE	ADDRESS	PHONE_NUMBER	CALL_URL
                , $.each(CORP, function (index, data) {
                    VA_CORP[data.CORP_CD] = data;
                })
            )
            .done(function () {

                var data = PRODUCT_DETAILS;
                var len = PRODUCT_DETAILS.length;
                var i, j, wd;
                var data2;
                var len2;
                console.time('loading');
                // 検索キーワードを作成
                for (i = 0; i < len; i++) {
                    wd = new Array;
                    wd.push(VA_SECTION[data[i].SECTION_ID].SECTION_NM);     // セクション
                    wd.push(VA_CONTENT[data[i].CONTENT_ID].CONTENT_NM);     // コンテンツ
                    wd.push(VA_PURPOSE[data[i].PURPOSE_ID].PURPOSE_NM);     // 用途
                    wd.push(VA_CATEGORY[data[i].CATEGORY_ID].CATEGORY_NM);  // 分類または材料
                    wd.push(VA_PRODUCT[data[i].PRODUCT_ID].PRODUCT_NM);     // 商品名
                    wd.push(VA_PRODUCT[data[i].PRODUCT_ID].SEARCH_TAG);     // 検索用タグ
                    wd.push(data[i].MERIT);                                 // 商品特長
                    data2 = VA_PRODUCT_CALL[data[i].PRODUCT_ID];
                    len2 = VA_PRODUCT_CALL[data[i].PRODUCT_ID].length;      // 販売店
                    for (j = 0; j < len2; j++) {
                        wd.push(VA_CORP[data2[j].CALL_CORP_CD].CORP_NM);
                    }
                    wd = wd.join(' ');
                    len2 = UNSEARCH_TARGETS.length;
                    for (j = 0; j < len2; j++) {
                        wd = wd.split(UNSEARCH_TARGETS[j]).join('');
                        wd = wd.split(UNSEARCH_TARGETS[j].toUpperCase()).join('');
                    }

                    SEARCH_WORD.push(toSearchWord(wd));
                }
                console.timeEnd('loading');

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
                            if (param.keyword) {
                                $('#custom-input').val(param.keyword);
                            }
                        }
                        // 商品検索
                        searchProduct();

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
    $('#custom-input').focus(function (e) {
        // フッターがソフトキーの上に出るため入力中は消す
        $("#footer").hide();
    });

    $('#custom-input').blur(function (e) {
        // iOS ソフトキーボードによるフッター位置不具合対策
        $.mobile.silentScroll(0);
        // フッターがソフトキーの上に出るため入力が終わったら表示する
        $("#footer").show();
    });
    $('#custom-input').keyup(function (e) {
        if (e.keyCode == 13) {
            $('#custom-input').blur();
        }
    });
    $('#custom-input').change(function (e) {

        $.when(
            // ローディング非表示
            $.mobile.loading('show')
        )
        .done(function () {
            setTimeout(function () {
                searchProduct();
                $.mobile.loading('hide');
            }, 200);
        })
        .fail(function (e) {
            $.mobile.loading('hide');
            console.log(e);
        });
    });
    $('#btn-clear').on('click', function (e) {
        $('#custom-input').val('');
        searchProduct();
    });

    // 縦横 サイズ変更
    $(window).on('orientationchange resize', function (event) {
        setBackground('#page');
        setBackground('body');
    });

});

/*
    商品検索  
*/
var searchProduct = function () {
    _searchValue = $('#custom-input').val();

    if (!_searchValue) {
        $('#custom-search').remove();
        _searchValueBack = '';
    }
    else {
        var inputValue = _searchValue;
        pscnav.api.replaceParam(function (p) {
            if (p) {
                p.keyword = inputValue;
            } else {
                p = { keyword: inputValue };
            }
            return p;
        }, null, null);

        var compwk = _searchValue.split('　').join(' ');
        var addedlist = new Array;
        _searchValue = compwk.split(' ');
        if (_searchValueBack != compwk) {
            _searchValueBack = compwk;
            $('#custom-search').remove();
            var data = SEARCH_WORD, len = data.length, el = '';
            var index, idx, andval = true;
            var searchwords = new Array;
            var jsonstr;

            for (idx = 0 ; idx < _searchValue.length ; idx++) {
                searchwords.push(toSearchWord(_searchValue[idx]));
            }

            for (index = 0; index < len; index++) {
                andval = true;
                try {
                    var target = SEARCH_WORD[index];
                    for (idx = 0 ; idx < searchwords.length ; idx++) {
                        andval &= target.indexOf(searchwords[idx]) >= 0;
                        if (andval == false) {
                            continue;
                        }
                    }
                }
                catch (e) {
                    console.log(e);
                    continue;
                }
                
                if (andval == true) {
                    var product = PRODUCT_DETAILS[index];
                    var key = product.SECTION_ID + '_' + product.CONTENT_ID + '_' + product.PURPOSE_ID + '_' + product.CATEGORY_ID + '_' + product.PRODUCT_ID;
                    var img = VA_PRODUCT_IMAGES[key];
                    // 分類と商材で絞込み
                    if (addedlist[product.CATEGORY_ID + '_' + product.PRODUCT_ID])
                        continue;
                    addedlist[product.CATEGORY_ID + '_' + product.PRODUCT_ID] = true;
                    jsonstr = 'data-pscarg=' + JSON.stringify({
                        SECTION_ID: product.SECTION_ID,
                        CONTENT_ID: product.CONTENT_ID,
                        PURPOSE_ID: product.PURPOSE_ID,
                        CATEGORY_ID: product.CATEGORY_ID,
                        PRODUCT_ID: product.PRODUCT_ID
                    });
                    el += '<li "ui-li-has-thumb">';
                    el += '<a href="#" class="load-link productdetails-link" ' + jsonstr + '>';
                    if (img) {
                    	// URL が有効
                        if (img[0].PRODUCT_IMAGE_URL) {
                            el += '<img src="' + img[0].PRODUCT_IMAGE_URL + '">';
                        }
                        else {
                            el += '<img src="img/noimage_128.png">';
                        }
                    }
                    else {
                        el += '<img src="img/noimage_128.png">';
                    }
                    el += '<h2 style="white-space: normal; word-wrap: break-word; word-break: break-all;">' + VA_CATEGORY[product.CATEGORY_ID].CATEGORY_NM + '</h2>';
                    el += '<p style="white-space: normal; word-wrap: break-word; word-break: break-all;"><strong>' + VA_PRODUCT[product.PRODUCT_ID].PRODUCT_NM + '</strong></p>';
                    el += '</a>';
                    el += '</li>';
                }
            }
            if (el == '') {
                inputValue = inputValue.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
                el = '<li style="white-space: normal; word-wrap: break-word;">「' + inputValue + '」の検索結果は見つかりませんでした</li>';
            }
            var ul = $('<ul id="custom-search" data-role="listview" data-inset="true"></ul>');
            ul.append(el);
            ul.listview().listview('refresh');

            $('#main').append(ul);
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
        }
        // ローディング非表示
        $.mobile.loading('hide');
    }
};
/*
    検索ワード置換
    パフォーマンスは無視して力技で変換
*/
(function () {
    var _fromSonants = 'がぎぐげござじずぜぞだぢづでどばびぶべぼゞガギグゲゴザジズゼゾダヂヅデドバビブベボヾヴ';
    var _toSonants = 'ｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾊﾋﾌﾍﾎヽｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾊﾋﾌﾍﾎヽｳ';
    var _fromPSounds = 'ぱぴぷぺぽパピプペポ';
    var _toPSounds = 'ﾊﾋﾌﾍﾎﾊﾋﾌﾍﾎ';
    var _fromWords = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわゐゑをんぁぃぅぇぉっゃゅょゎゝabcdefghijklmnopqrstuvwxyzａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ　！”＃＄％＆’（）＊＋，－．／０１２３４５６７８９：；＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ［￥］＾＿｀｛｜｝～。「」、・ヲァィゥェォャュョッーアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱン゛゜ｰｧｨｩｪｫｯｬｭｮ';
    var _toWords = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｲｴｦﾝｱｲｳｴｵﾂﾔﾕﾖﾜヽABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ !\'#$%&\'()*+,-./0123456789:;(=)?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\'(|)~.(),-ｦｱｲｳｴｵﾔﾕﾖﾂ-ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｲｴﾝﾞﾟ-ｱｲｳｴｵﾂﾔﾕﾖ';
    var _cmap = {};
    for (var i = 0; i < _fromSonants.length; ++i) {
        _cmap[_fromSonants[i]] = _toSonants[i] + 'ﾞ';
    }
    for (var i = 0; i < _fromPSounds.length; ++i) {
        _cmap[_fromPSounds[i]] = _toPSounds[i] + 'ﾟ';
    }
    for (var i = 0; i < _fromWords.length; ++i) {
        _cmap[_fromWords[i]] = _toWords[i];
    }
    var _exp = new RegExp(/[がぎぐげござじずぜぞだぢづでどばびぶべぼゞガギグゲゴザジズゼゾダヂヅデドバビブベボヾヴぱぴぷぺぽパピプペポあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわゐゑをんぁぃぅぇぉっゃゅょゎゝabcdefghijklmnopqrstuvwxyzａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ　！”＃＄％＆’（）＊＋，－．／０１２３４５６７８９：；＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ［￥］＾＿｀｛｜｝～。「」、・ヲァィゥェォャュョッーアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱン゛゜ｰｧｨｩｪｫｯｬｭｮ]/g);
    window.toSearchWord = function (word) {
        if (!word) { return word; }
        return word.replace(_exp, function (c) { return _cmap[c]; });
    };
})();