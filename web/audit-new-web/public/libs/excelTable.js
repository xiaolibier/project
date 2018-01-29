/*
 * author:
 */
(function ($) {
   Date.prototype.Format = function (fmt) {
      var o = {
         "M+": this.getMonth() + 1, //月份 
         "d+": this.getDate(), //日 
         "h+": this.getHours(), //小时 
         "m+": this.getMinutes(), //分 
         "s+": this.getSeconds(), //秒 
         "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
         "S": this.getMilliseconds() //毫秒 
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
         if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
   }        

   $.fn.ExportExcel = function (tab_id, options) {
      var defaults = {
         height: '24px',
         'line-height': '24px',
         margin: '0 5px',
         padding: '0 11px',
         color: '#000',
         background: '#02bafa',
         border: '1px #26bbdb solid',
         'border-radius': '3px',
         /*color: #fff;*/
         display: 'inline-block',
         'text-decoration': 'none',
         'font-size': '12px',
         outline: 'none',
         cursor: 'pointer'
      }
      var options = $.extend(defaults, options);
      return this.each(function () {
         var currentObject = $(this); //获取当前对象 
         //currentObject.css(defaults);
         //currentObject.onmouseover = function () {
         //   $(this).css('cursor', 'hand');
         //};

         //currentObject.on('click',function () {
            //From:jsfiddle.net/h42y4ke2/16/
            var tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
            tab_text = tab_text + '<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"/><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';

            tab_text = tab_text + '<x:Name>Test Sheet</x:Name>';

            tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
            tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';

            tab_text = tab_text + "<table border='1px'>";
            tab_text = tab_text + $('#' + tab_id + ' table').html();
            tab_text = tab_text + '</table></body></html>';

            var data_type = 'data:application/vnd.ms-excel';
            //var data_type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

            var timeStr = new Date().Format('yyyyMMddhhmmss');
            //window.open(data_type + ', ' + encodeURIComponent(tab_text));
            location.href = data_type + ', ' + encodeURIComponent(tab_text);
			
			//$(this).attr('href', data_type + ', ' + encodeURIComponent(tab_text));
            $(this).attr('download', 'excel' + timeStr + '.xlsx');
         //});
      })
   }
})(jQuery);