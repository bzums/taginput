jQuery(function($) {
    'use strict';

    prettyPrint();

    var $input = $('#taginput-jqueryui').taginput();

    $('#taginput-bootstrap').taginput({
        style: 'bootstrap'
    });

    $('.panel-default').hover(
    	function(){
			$(this).toggleClass('panel-primary').toggleClass('panel-default');
    	}
    );

});
