jQuery(function ($) {
  'use strict';

    function getTagCount(){
      return $('.taginput').taginput('get').length;
    }

    function getTagCountDom(){
      return $('.taginput-tag').length;
    }

    QUnit.module("API tests", {
        setup: function(){

        }
    });

    QUnit.test("taginput.add", function(assert) {
        expect( 2 );

        var $input = $('.taginput').taginput();

        $input.taginput('add', { name: 'test1' } );
        $input.taginput('add', { name: 'test2' } );

        assert.equal(getTagCount(), 2, "there should be one item");
        assert.equal(getTagCountDom(), 2, "there should be one item");
    });

    QUnit.test("taginput.remove", function(assert) {
        expect( 2 );
        
        var $input = $('.taginput').taginput();
        $input.taginput('add', { name: 'test1' } );
        $input.taginput('add', { name: 'test2' } );
        $input.taginput('remove', { name: 'test1' } );

        assert.equal(getTagCount(), 1, "there should be one item");
        assert.equal(getTagCountDom(), 1, "there should be one item");
    });

    QUnit.test("taginput.clear", function(assert) {
        expect( 2 );
        
        var $input = $('.taginput').taginput();    
        $input.taginput('add', { name: 'test1' } );
        $input.taginput('add', { name: 'test2' } );
        $input.val('some');
        $input.taginput('clear');

        assert.equal(getTagCount(), 0, "there should be no item");
        assert.equal(getTagCountDom(), 0, "there should be no item");
    });

    QUnit.test("multiple entries", function(assert) {
        expect( 2 );

        var $input = $('.taginput').taginput();
        $input.taginput('add', { name: 'test' } );
        $input.taginput('add', { name: 'test' } );

        assert.equal(getTagCount(), 1, "there should be one item");
        assert.equal(getTagCountDom(), 1, "there should be one item");
    });

    QUnit.module("DOM tests", {
        setup: function(){

        }
    });

    QUnit.test("dom add", function(assert) {
        expect( 2 );

        var $input = $('.taginput').taginput();
        var $newInput = $('.taginput-wrapper input').val('test1');

        var event = $.Event( "keydown" );
        event.keyCode = 13;
        $newInput.trigger( event );

        assert.equal(getTagCount(), 1, "there should be one item");
        assert.equal(getTagCountDom(), 1, "there should be one item");
    });

    QUnit.test("dom remove", function(assert) {
        expect( 2 );

        var $input = $('.taginput').taginput();
        var $newInput = $('.taginput-wrapper input').val('test1');

        var event = $.Event( "keydown" );
        event.keyCode = 13;
        $newInput.trigger( event );

        $('.taginput-tag').trigger('click');

        assert.equal(getTagCount(), 0, "there should be no item");
        assert.equal(getTagCountDom(), 0, "there should be no item");
    });

    QUnit.test("dom dissolve", function(assert) {
        expect( 3 );

        var $input = $('.taginput').taginput();
        var $newInput = $('.taginput-wrapper input').val('test1');

        var event = $.Event( "keydown" );
        event.keyCode = 13;
        $newInput.trigger( event );

        var delEvent = $.Event( "keydown" );
        delEvent.keyCode = 8;
        $newInput.trigger( delEvent );

        assert.equal(getTagCount(), 0, "there should be no item");
        assert.equal(getTagCountDom(), 0, "there should be no item");
        assert.equal($newInput.val(), 'test1', "there should be the correct value int the input field");
    });

});
