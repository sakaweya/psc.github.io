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
var Favorite;
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
                            var exlist = ['#header', '#footer', '#contentpanel', '#list'];
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
                            var exlist = ['#header', '#footer', '#contentpanel', '#list'];
                            var i, len = exlist.length;
                            for (i = 0; i < len; i++) {
                                if ($(e.target).is(exlist[i])) { return; }
                                if ($(e.target).parents(exlist[i]).size() > 0) { return; }
                            }
                            if ($('.ui-page-active').jqmData('panel') !== 'open') {
                                $('#contentpanel').panel('open');
                            }
                        });
                        // お気に入り読み込み
                        Favorite = new navFavoriteManager(api);
                        Favorite.load().then(function () {
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
                        });
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

    // 縦横 サイズ変更
    $(window).on('orientationchange resize', function (event) {
        setBackground('#page');
        setBackground('body');
    });

});

/*
    お気に入り
*/
var pageInit = function () {
    var el = '';
    if (Favorite.item) {
        var data = Favorite.item;
        var len = Favorite.item.length;
        var i;
        for (i = 0; i < len; i++) {
            var key = data[i].section.id + '_' + data[i].content.id + '_' + data[i].purpose.id + '_' + data[i].category.id + '_' + data[i].product.id;
            var img = VA_PRODUCT_IMAGES[key];
            var product = VA_PRODUCT_DETAILS[key];
            if (product) {
                jsonstr = 'data-pscarg=' + JSON.stringify({
                    SECTION_ID: product.SECTION_ID,
                    CONTENT_ID: product.CONTENT_ID,
                    PURPOSE_ID: product.PURPOSE_ID,
                    CATEGORY_ID: product.CATEGORY_ID,
                    PRODUCT_ID: product.PRODUCT_ID
                });

                el += '<li "ui-li-has-thumb" data-pscarg=' + JSON.stringify(data[i]) + '>';
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
                el += '<h3 class="topic" style="white-space: normal; word-wrap: break-word; word-break: break-all;">' + VA_CATEGORY[product.CATEGORY_ID].CATEGORY_NM + '</h3>';
                el += '<p class="topic" style="white-space: normal; word-wrap: break-word; word-break: break-all;"><strong>' + VA_PRODUCT[product.PRODUCT_ID].PRODUCT_NM + '</strong></p>';
                el += '</a>';
                el += '<a href="#" data-theme="e" class="delete">Delete</a>';
                el += '</li>';
            }
            else {
                el += '<li "ui-li-has-thumb" data-pscarg=' + JSON.stringify(data[i]) + '>';
                el += '<a href="#" >';
                el += '<img src="img/noimage_128.png">';
                el += '<h3 class="topic" style="white-space: normal; word-wrap: break-word; word-break: break-all;">' + data[i].category.name + '</h3>';
                el += '<p class="topic" style="white-space: normal; word-wrap: break-word; word-break: break-all;"><strong>' + data[i].product.name + '</strong></p>';
                el += '<p class="notfound" style="white-space: normal; word-wrap: break-word; word-break: break-all;">現在このコンテンツは存在しません。</p>';
                el += '</a>';
                el += '<a href="#" data-theme="e" class="delete">Delete</a>';
                el += '</li>';
            }
        }
    }
    var updateRegistCountMassage = function () {
        var msg = '最大' + Favorite.itemMax() + '件まで登録できます。';
        if (Favorite.item ){
            if( Favorite.item.length >= Favorite.itemMax())
                msg = '最大件数（' + Favorite.itemMax() + '件）登録されています。';
            else if( Favorite.item.length > 0) 
                msg += '（残り' + (Favorite.itemMax() - Favorite.item.length) + '件）';
        }
        $('#registCount').text(msg);
    }
    var updateNoneRegistMassage = function () {
        // 未登録表示
        if (!Favorite.item || Favorite.item.length == 0) {
            $('#noneRegist').show();
        }
    }
    updateRegistCountMassage();
    updateNoneRegistMassage();
    
    $('#list').append(el);
    $('#list').listview().listview('refresh');
    $('.notfound').css('color', 'red');
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
    // Swipe to remove list item
    $(document).on('swipeleft swiperight', '#list li', function (event) {
        var listitem = $(this),
            // These are the classnames used for the CSS transition
            dir = event.type === 'swipeleft' ? 'left' : 'right',
            // Check if the browser supports the transform (3D) CSS transition
            transition = $.support.cssTransform3d ? dir : false;

        confirmAndDelete(listitem, transition);
    });
    // Click delete split-button to remove list item
    $('.delete').on('click', function () {
        var listitem = $(this).parent('li');

        confirmAndDelete(listitem);
    });
    function confirmAndDelete(listitem, transition) {
        // Highlight the list item that will be removed
        listitem.children('.ui-btn').addClass('ui-btn-active');
        // Inject topic in confirmation popup after removing any previous injected topics
        $('#confirm .topic').remove();
        listitem.find('.topic').clone().insertAfter('#question');
        $('#confirm .topic').css('text-align', 'center');
        // Show the confirmation popup
        $('#confirm').popup('open');
        // Proceed when the user confirms
        $('#confirm #yes').on('click', function () {

            // お気に入りから削除
            Favorite.remove(listitem.data('pscarg'));

            // Remove with a transition
            if (transition) {

                listitem
                    // Add the class for the transition direction
                    .addClass(transition)
                    // When the transition is done...
                    .on('webkitTransitionEnd transitionend otransitionend', function () {
                        // ...the list item will be removed
                        listitem.remove();
                        // ...the list will be refreshed and the temporary class for border styling removed
                        $('#list').listview('refresh').find('.border-bottom').removeClass('border-bottom');
                    })
                    // During the transition the previous button gets bottom border
                    .prev('li').children('a').addClass('border-bottom')
                    // Remove the highlight
                    .end().end().children('.ui-btn').removeClass('ui-btn-active');
            }
                // If it's not a touch device or the CSS transition isn't supported just remove the list item and refresh the list
            else {
                listitem.remove();
                $('#list').listview('refresh');
            }
            updateRegistCountMassage();
            updateNoneRegistMassage();
        });
        // Remove active state and unbind when the cancel button is clicked
        $('#confirm #cancel').on('click', function () {
            listitem.children('.ui-btn').removeClass('ui-btn-active');
            $('#confirm #yes').off();
        });
        $("#confirm").on("popupafterclose", function (event, ui) {
            listitem.children('.ui-btn').removeClass('ui-btn-active');
        });
    }

}


