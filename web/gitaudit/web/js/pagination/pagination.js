/**
 * 表格插件
 * Created by Zhouhaibin.
 */
(function ($) {
    var methods = {
        init: function(options) {
            var options = $.extend({}, $.fn.MyPagination.defaults, options);
            return this.each(function() {
                var $this = $(this);
                create($this, options);
            });
        },

        empty: null
    };

    $.fn.MyPagination = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.MyPagination');
        }
    };

    function getOptions($this) {
        return $this.data('options');
    };

    function create($this, options) {
        $this.addClass("main-page");
        $this.data('options', options);
        var dictionary = getDictionary(options);

        var currentPage = options.currentPage;
        var totalPage = options.totalPage;
        var resultsPerPage = options.resultsPerPage;
        var totalCount = options.totalCount;
//        var totalPage = parseInt(totalCount / resultsPerPage);
//        if (totalCount % resultsPerPage != 0)
//            totalPage ++;
        if (currentPage > totalPage && totalCount > 0) {
            gotoPage($this, totalPage, resultsPerPage);
            return;
        }
        var pages = [];
        pages.push({page: currentPage - 1, name: dictionary.prevPage});    //"上一页"
        if (totalPage <= 5) {
            for (var i = 1; i <= totalPage; i ++) {
                pages.push({page: i, name: "" + i});
            }
        } else {
            pages.push({page: 1, name: "1"});

            if (currentPage <= 3) {
                pages.push({page: 2, name: "2"});
                pages.push({page: 3, name: "3"});
                pages.push({page: 0, name: "..."});
            } else if (currentPage >= totalPage - 2) {
                pages.push({page: 0, name: "..."});
                pages.push({page: totalPage - 2, name: "" + (totalPage - 2)});
                pages.push({page: totalPage - 1, name: "" + (totalPage - 1)});
            } else {
                pages.push({page: 0, name: "..."});
                pages.push({page: currentPage, name: "" + currentPage});
                pages.push({page: 0, name: "..."});
            }

            pages.push({page: totalPage, name: "" + totalPage});
        }
        pages.push({page: currentPage + 1, name: dictionary.nextPage});    //"下一页"
        var innerHtml = '';

        //开始调整顺序
        innerHtml +=
            '<p class="page-info">' +
            '<span class="page-size page-text">' + dictionary.resultsPerPage1 + '</span>' +
//                '<div class="fl page-size-select-container">' +
        '<select class="form-control page-size page-size-select">' +
        '<option value = "10">10</option>' +
        '<option value = "20">20</option>' +
        '<option value = "30">30</option>' +
        '<option value = "40">40</option>' +
        '<option value = "50">50</option>' +
        '<option value = "100">100</option>' +
        '</select>' +
//                '</div>' +
        '<span class="page-size page-text">' + dictionary.resultsPerPage2 + '</span>' +
        dictionary.total + '&nbsp;' + totalCount + '&nbsp;' + dictionary.records +
        '</p>';    //共XX条记录
        //结束调整顺序

        if (totalPage > 1){
            if (options.displayGotoPage) {
                innerHtml +=
                    ('<div class="page-button">' +
                    '<span class="page-number">' +
                    dictionary.turnToPage+
                    '</span>' +
                    '<input type="text" class="form-control goto-page-no input-mini">' +
                    '<span class="page-text">' + dictionary.page + '</span>' +
                    '<button class="goto-page btn btn-default">' + dictionary.skip + '</button>' +
                    '</div>');
            }
            innerHtml += '<ul class="pagination">';
            for (var i = 0; i < pages.length; i ++) {
                var page = pages[i].page;
                var thisPage = '<li ';
                if (page <= 0 || page > totalPage) {
                    thisPage += 'class="disabled"';
                } else {
                    if (page == currentPage) {
                        thisPage += 'class="active"';
                    }
                }
                thisPage += '><a href="javascript:void(0)" page="' + page + '">' + pages[i].name + '</a></li>';
                innerHtml += thisPage;
            }
            innerHtml += '</ul>';
        }



        $this.html(innerHtml);
        $this.find(".page-size-select").val(resultsPerPage);
        if ($.select2 || $.prototype.select2) {
	        $this.find(".page-size-select").select2({
	            placeholder: "请选择...",
	            minimumResultsForSearch: -1,//去掉搜索框
	            allowClear: true
	        });
        }

        bindEvent($this);
    };

    function getDictionary(options) {
        var dictionary = options.dictionary[options.locale];
        if (dictionary == undefined)
            dictionary = options.dictionary["zh_CN"];
        return dictionary;
    };

    function bindEvent($this) {
        var options = getOptions($this);
        var dictionary = getDictionary(options);
        $this.find("a").unbind('click').bind('click', function(event) {
            var page = parseInt($(this).attr("page"));
            if (isNaN(page) || page <= 0 || page > options.totalPage || page == options.currentPage)
                return;
            gotoPage($this, page, options.resultsPerPage);
        });
        $this.find(".goto-page").unbind('click').bind('click',  function(event) {
            var page = parseInt($(this).parent().find(".goto-page-no").val());
            var msg;
            if (isNaN(page) || page <= 0) {
                msg = dictionary.pleaseInputValidPage1;
            } else if (page > options.totalPage) {
                msg = dictionary.pleaseInputValidPage2;
            } else if (page == options.currentPage) {
                msg = dictionary.pleaseInputValidPage3;
            } else
                gotoPage($this, page, options.resultsPerPage);
            if (msg) {
                if (window.Global) {
                    window.Global.tip(msg);
                } else {
                    alert(msg);
                }
            }
        });
        $this.find(".page-size-select").on("change", function(event) {
            var page = 1;
            if ($(this).parent().parent().find("li.active a").length > 0) {
                page = parseInt($(this).parent().parent().find("li.active a").attr("page"));
            }
            var limit = parseInt($(this).val());
            gotoPage($this, 1, limit);
        });
    };

    function gotoPage($this, page, resultsPerPage) {
        var options = getOptions($this);
        if (options.callback.onGotoPage) {
            options.callback.onGotoPage({
                page: page,
                limit: resultsPerPage
            }, options.callback.callbackPara);
        }

    };


    $.fn.MyPagination.defaults = {
        currentPage: 0,
        resultsPerPage: 20,
        totalPage: 0,
        totalCount: 0,
        displayGotoPage: true,
        locale: "zh-CN",//当前语言: zh-CN,en-US
        dictionary: {
            "zh-CN": {
                pleaseInputValidPage1: "请输入合法的页数!",
                pleaseInputValidPage2:"您输入的页数超过了最大页数!",
                pleaseInputValidPage3:"您输入的页数就是当前页，无需跳转!",
                prevPage: "上一页",
                nextPage: "下一页",
                turnToPage: '转到第',
                skip: '跳转',
                page: '页',
                resultsPerPage1: '每页',
                resultsPerPage2: '条',
                total: "共",
                records: "条记录"
            },
            "en-US": {
                pleaseInputValidPage1:"请输入合法的页数!",
                pleaseInputValidPage2:"您输入的页数超过了最大页数!",
                pleaseInputValidPage3:"您输入的页数就是当前页，无需跳转!",
                prevPage: "上一页",
                nextPage: "下一页",
                turnToPage: '转到第',
                skip: '跳转',
                page: '页',
                resultsPerPage1: '每页',
                resultsPerPage2: '条',
                total: "共",
                records: "条记录"
            }

        },
        callback: {
            callbackPara: undefined,//在任何callback时，将此参数传回去
            onGotoPage: undefined
        }
    };
}(jQuery));

