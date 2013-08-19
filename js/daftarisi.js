// JavaScript Document
//<![CDATA[ 
$(window).load(function(){
(function($) {
    $.fn.toc = function(o, p) {
        p = $.extend({
            title: "Table of Content"
        }, p);
        this.prepend('<div id="toc-list"  style="clear: left; float: left; margin-bottom: 1em; margin-right: 1em;"><strong>' + p.title + '</strong><ol></ol></div>').children(o).each(function(i) {
            i = i + 1;
            $(this).attr('id', 'section-' + i).nextUntil(o).after('<a href="#toc-list">Top &uArr;</a>');
            $('<li><a href="#section-' + i + '">' + $(this).text() + '</a></li>').appendTo('#toc-list ol');
        });
    };
})(jQuery);

$(function() {
    $('article').toc('h3', {
        title: "Tabel Konten:"
    });

    $('#toc-list a, a[href="#toc-list"]').on("click", function() {
        var hash = this.hash;
        $('html,body').animate({scrollTop: $(hash).offset().top}, 600, function() {
            window.location.hash = hash;
        });
        return false;
    });

});
});//]]>  
