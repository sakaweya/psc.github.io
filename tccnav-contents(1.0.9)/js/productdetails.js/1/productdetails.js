var _CurrentSectionID = 0;
var _CurrentContentID = 0;
var _CurrentPurposeID = 0;
var _CurrentCategoryID = 0;
var _CurrentProdctID = 0;
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
var BUSINESS_OFFICE;
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
var VA_BUSINESS_OFFICE = new Array;
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
            , $.getJSON('assets/TM_BUSINESS_OFFICE.json')
        )
        .done(function (section, content, content_item, purpose, category, product, product_details, product_images, product_call, construction_method, corp, business_office) {
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
            BUSINESS_OFFICE = business_office[0];
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

                        $('.navhistory').on('click', function () { api.historyBack(); });
                        $('.navtopmenu').on('click', function () { api.go('guidance.html'); });
                        $('.navsearch').on('click', function () { api.go('searchmenu.html'); });
                        $('.navcontact').on('click', function () { api.go('contact.html'); });
                        $('.navstar').on('click', function () { api.go('favorite.html'); });
                        $('.navbook').on('click', function () { api.goBookManager(); });
                        $('.navhelp').on('click', function () { api.go('information.html'); });
                        $('#page').on('swiperight', function (e) {
                            var exlist = ['#header', '#footer', '#contentpanel', '#product-images', '#gallery'];
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
                            var exlist = ['#header', '#footer', '#contentpanel', '#product-images', '#gallery'];
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
                            _CurrentProdctID = param.PRODUCT_ID;
                        }
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

});
/*
    ページ初期化
*/
var pageInit = function () {

    $('#H1_HEADER').text(VA_PRODUCT[_CurrentProdctID].PRODUCT_NM);
    $('#header').toolbar('updatePagePadding');
    $('#H2_MENU_HEADER').text(VA_PRODUCT[_CurrentProdctID].PRODUCT_NM);
    $("#P_MENU_DETAIL").text(VA_SECTION[_CurrentSectionID].SECTION_NM + ' > '
        + VA_CONTENT[_CurrentContentID].CONTENT_NM + ' > '
        + VA_PURPOSE[_CurrentPurposeID].PURPOSE_NM + ' > '
        + VA_CATEGORY[_CurrentCategoryID].CATEGORY_NM + ' > ');

    /*
        商品説明
    */
    var key = _CurrentSectionID + '_' + _CurrentContentID + '_' + _CurrentPurposeID + '_' + _CurrentCategoryID + '_' + _CurrentProdctID;
    var data, len, i, jsonstr;

    data = VA_PRODUCT_DETAILS[key];

    var li = '<li>'
        + '<h2>特長</h2>'
        + '<p style="white-space: normal; word-wrap: break-word;" class="p-font-size-L">' + data.MERIT + '</p>'
        + '</li>';

    if ($.type(data.CONSTRUCTION_METHOD_ID) === "number") {

        li += '<li>'
            + '<h3>適用工法</h3>'
            + '<p style="white-space: normal;" class="p-font-size-L">' + VA_CONSTRUCTION_METHOD[data.CONSTRUCTION_METHOD_ID].CONSTRUCTION_METHOD_NM + '</p>'
            + '</li>';
    }

    data = VA_PRODUCT_CALL[_CurrentProdctID];
    len = VA_PRODUCT_CALL[_CurrentProdctID].length;

    var ul_items = '';
    for (i = 0; i < len; i++) {
        jsonstr = 'data-pscarg=' + JSON.stringify({
            CALL_CORP_CD: data[i].CALL_CORP_CD,
            CALL_BUSINESS_OFFICE_CD: data[i].CALL_BUSINESS_OFFICE_CD,
        });
        li += '<li>'
            + '<a href="#" class="load-link contact-link" ' + jsonstr + '>'
            + '<h2>本ページのお問い合せ先</h2>'
            + '<p style="white-space: normal;" class="p-font-size-L">' + VA_CORP[data[i].CALL_CORP_CD].CORP_ABBR_NM;
        li += (data[i].CALL_BUSINESS_OFFICE_CD) ? '<br/>' + VA_BUSINESS_OFFICE[data[i].CALL_BUSINESS_OFFICE_CD].BUSINESS_OFFICE_NM + '</p>' : '</p>';
        li += '</a>'
            + '</li>';

    }
    // カタログ
    if (VA_PRODUCT[_CurrentProdctID].PRODUCT_URL) {
        li += '<li><a href="#" data-pscarg=\'' + VA_PRODUCT[_CurrentProdctID].PRODUCT_URL + '\' class="url-link">'
        + '<h2>カタログを開く</h2>'
        + '<p style="white-space: normal; word-wrap: break-word;">' + VA_PRODUCT[_CurrentProdctID].PRODUCT_URL + '</p></a></li>';
    }
    var ul = '<ul id="PRODUCT_UL" data-role="listview" data-inset="true">'
        + li
        + '</ul>';

    var $wkproductdetail = $('<div id="PRODUCT_DETAIL"/>').append(ul);
    $wkproductdetail.find('#PRODUCT_UL').listview().listview('refresh');

    $('#details').append($wkproductdetail);
    /*
        問い合わせへのリンク
    */
    $('.contact-link').on('click', function (e) {
        var param = $(this).data('pscarg'); // json
        pscnav.api.go('contact.html', param);
    });
    /*
        外部ブラウザURLへのリンク
    */
    $('.url-link').on('click', function (e) {
        var param = $(this).data('pscarg'); // json
        window.open(param, '_system');
    });/*
        ロード用イベント
    */
    $('.load-link').on('click', function () {
        $.mobile.loading('show');
    });
    /*
        お気に入りに登録
    */
    var item = new navFavoriteItem();
    item.section.id = _CurrentSectionID;
    item.section.name = VA_SECTION[_CurrentSectionID].SECTION_NM;
    item.content.id = _CurrentContentID;
    item.content.name = VA_CONTENT[_CurrentContentID].CONTENT_NM;
    item.purpose.id = _CurrentPurposeID;
    item.purpose.name = VA_PURPOSE[_CurrentPurposeID].PURPOSE_NM;
    item.category.id = _CurrentCategoryID;
    item.category.name = VA_CATEGORY[_CurrentCategoryID].CATEGORY_NM;
    item.product.id = _CurrentProdctID;
    item.product.name = VA_PRODUCT[_CurrentProdctID].PRODUCT_NM;

    /*
        お気に入り
    */
    var updateRegistCount = function () {
        var msg;
        if ($('#favorite').attr('checked')) {
            msg = 'お気に入り（登録済み）';
        } else {
            msg = 'お気に入り（残り' + Favorite.itemMax() + '件）';
            if (Favorite.item) {
                if (Favorite.item.length >= Favorite.itemMax())
                    msg = 'お気に入り（最大）';
                else if (Favorite.item.length > 0)
                    msg = 'お気に入り（残り' + (Favorite.itemMax() - Favorite.item.length) + '件）';
            }
        }
        $('#checkLable').text(msg);
    }
    if (Favorite.contains(item)) {
        $('#favorite').attr('checked', true);
        $('#favorite').checkboxradio('refresh');
    } else {
        if (Favorite.item && Favorite.item.length >= Favorite.itemMax()) {
            $('#favorite').checkboxradio({ disabled: true });
            msg = '現在、お気に入りは最大件数（' + Favorite.itemMax() + '件）登録されています。';
            $('#registCount').text(msg);
            $('#registCount').show();
        }
    }
    $('#favorite').on('change',function(){
        if ($(this).attr('checked'))
            Favorite.add(item);
        else
            Favorite.remove(item);
        updateRegistCount();
    });
    updateRegistCount();
    $('#div_favorite').show();

    $('.p-font-size-L').css({ 'font-size': '1em' });

    /*
        商品画像
    */
    var div_img = '';
    var div_nav = '';
    data = VA_PRODUCT_IMAGES[key];
    if (data) {
        // URL が有効
        if (data[0].PRODUCT_IMAGE_URL) {
            len = VA_PRODUCT_IMAGES[key].length;
            // PRODUCT_ID	PRODUCT_IMAGE_URL	PRODUCT_IMAGE_SIZE_X	PRODUCT_IMAGE_SIZE_Y
            div_img = '<div class="viewport"><div class="flipsnap">';   // flipsnap
            for (i = 0; i < len; i++) {
                div_img += '<div class="item">'     // flipsnap
                    + '<figure style="margin:0;">'  // PhotoSwipe
                    + '<a href="' + data[i].PRODUCT_IMAGE_URL + '" data-size="' + data[i].PRODUCT_IMAGE_SIZE_X + 'x' + data[i].PRODUCT_IMAGE_SIZE_Y + '">'
                    + '<img id="PRODUCT_IMG_' + i + '" class="PRODUCT_IMG" src="' + data[i].PRODUCT_IMAGE_URL + '" alt="' + VA_PRODUCT[_CurrentProdctID].PRODUCT_NM + '" /></a>'
                    + '<figcaption>' + VA_PRODUCT[_CurrentProdctID].PRODUCT_NM + '(' + (i + 1) + '/' + len + ')' + '</figcaption>'
                    + '</figure>'
                    + '</div>';
            }
            div_img += '</div></div>';
            div_nav = '<div class="pointer">';
            if (len > 1) {
                // 戻る
                div_nav += '<a href="#" class="ui-btn ui-icon-carat-l ui-btn-icon-notext ui-corner-all ui-btn-inline ui-state-disabled prev">prev</a>';
            }
            div_nav += '<a href="" value="0"><span class= "current"></span></a>&nbsp;&nbsp;';
            for (i = 1; i < len; i++) {
                // 現在位置
                div_nav += '<a href="" value="' + i + '"><span></span></a>&nbsp;&nbsp;';
            }
            if (len > 1) {
                // 進む
                div_nav += '<a href="#" class="ui-btn ui-icon-carat-r ui-btn-icon-notext ui-corner-all ui-btn-inline next">next</a>';
            }
            div_nav += '</div>';

            $('#product-images').append(div_img);  // イメージ
            $('#product-images').append(div_nav);  // ナビゲーション
            /*
                flipsnapの初期化
            */
            flipsnapInit(data);
            /*
                PhotoSwipeの初期化
            */
            initPhotoSwipeFromDOM(".my-gallery");

            $(".my-gallery").css('background-color', '#0B4Ea2');
        }
    }

    // 縦横 サイズ変更
    $(window).on('orientationchange resize', function (event) {
        setBackground('#page');
        setBackground('body');
    });

};
/*
    flipsnapの初期化
*/
var flipsnapInit = function (data) {
    var fitSize = function () {
        $('.viewport').css('width', '100%');    
        $('.viewport').height(window.innerHeight * 0.35);
        var $item = $('.viewport .flipsnap .item');
        var itemmargin = $item.outerWidth() - $item.width();
        $item.width($('.viewport').width() - itemmargin);
        $item.height($('.viewport').height());

        var item_sz = { 'max_x': $item.width(), 'max_y': $item.height() };
        var xyr, x, y;
        var i;
        var len = data.length;
        for (i = 0; i < len; i++) {
            x = 'auto';
            y = 'auto';
            xyr = data[i].PRODUCT_IMAGE_SIZE_X / data[i].PRODUCT_IMAGE_SIZE_Y;
            if (item_sz.max_y * xyr < item_sz.max_x) {
                y = $item.height();
            }
            else {
                x = $item.width();
            }
            $('#PRODUCT_IMG_' + i).height(y);
            $('#PRODUCT_IMG_' + i).width(x);
        }
        $('.flipsnap').width($item.outerWidth() * i);
        return $item.outerWidth();
    }

    var distancepint = fitSize();

    var $fsnap = $('#product-images');
    var $pointer = $fsnap.find('.pointer span');
    var $pointerlink = $fsnap.find('.pointer a');
    var flipsnap = Flipsnap('#product-images .flipsnap', {
        distance: distancepint
    });
    flipsnap.element.addEventListener('fspointmove', function () {
        $pointer.filter('.current').removeClass('current');
        $pointer.eq(flipsnap.currentPoint).addClass('current');
        if (flipsnap.hasNext()) {
            $next.removeClass('ui-state-disabled');
        }
        else {
            $next.addClass('ui-state-disabled');
        }
        if (flipsnap.hasPrev()) {
            $prev.removeClass('ui-state-disabled');
        }
        else {
            $prev.addClass('ui-state-disabled');
        }
    }, false);
    $pointerlink.on('click', function () {
        flipsnap.moveToPoint($(this).attr('value'));
    });
    var $next = $fsnap.find('.next').on('click', function () {
        flipsnap.toNext();
    });
    var $prev = $fsnap.find('.prev').on('click', function () {
        flipsnap.toPrev();
    });
    // 縦横 サイズ変更
    $(window).on('orientationchange resize', function (event) {
        flipsnap.distance = fitSize();
        flipsnap.refresh();
    });

}
/*
    Photo Swipe 初期化
*/
var initPhotoSwipeFromDOM = function (gallerySelector) {

    // parse slide data (url, title, size ...) from DOM elements 
    // (children of gallerySelector)
    var parseThumbnailElements = function (el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;

        for (var i = 0; i < numNodes; i++) {

            figureEl = thumbElements[i]; // <figure> element

            // include only element nodes 
            if (figureEl.nodeType !== 1) {
                continue;
            }

            linkEl = figureEl.children[0]; // <a> element

            size = linkEl.getAttribute('data-size').split('x');

            // create slide object
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };



            if (figureEl.children.length > 1) {
                // <figcaption> content
                item.title = figureEl.children[1].innerHTML;
            }

            if (linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            }

            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }

        return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && (fn(el) ? el : closest(el.parentNode, fn));
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function (e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        // find root element of slide
        var clickedListItem = closest(eTarget, function (el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });

        if (!clickedListItem) {
            return;
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if (childNodes[i].nodeType !== 1) {
                continue;
            }

            if (childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }



        if (index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe(index, clickedGallery);
        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function () {
        var hash = window.location.hash.substring(1),
        params = {};

        if (hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if (!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');
            if (pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }

        if (params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        if (!params.hasOwnProperty('pid')) {
            return params;
        }
        params.pid = parseInt(params.pid, 10);
        return params;
    };

    var openPhotoSwipe = function (index, galleryElement, disableAnimation) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {
            index: index,

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),

            getThumbBoundsFn: function (index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();

                return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
            }

        };

        if (disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll(gallerySelector);

    for (var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i + 1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if (hashData.pid > 0 && hashData.gid > 0) {
        openPhotoSwipe(hashData.pid - 1, galleryElements[hashData.gid - 1], true);
    }
};
