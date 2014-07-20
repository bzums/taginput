jQuery(function($) {
    'use strict';

    $('.panel-default').hover(
    	function(){
			$(this).addClass('panel-primary').removeClass('panel-default');
    	},

    	function(){
			$(this).removeClass('panel-primary').addClass('panel-default');
    	}
    );

    prettyPrint();

    $('#taginput-jqueryui').taginput();

    $('#taginput-bootstrap').taginput({
        style: 'bootstrap'
    });

    $('#taginput-custom').taginput({
        style: {
        	tagTpl: $('#wrapperTpl').html(),
            wrapperTpl: '<div class="custom-style">',
            deleteHandler: '.ui-icon-close'
        }
    });

});
