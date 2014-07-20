jQuery(function ($) {
  'use strict';

    function getTagCount(){
      return $('#taginput').taginput('get').length;
    }

    function getTagCountDom(){
      return $('.taginput-tag').length;
    }

    QUnit.module("API", {
        setup: function(){

        }
    });

    QUnit.test("initial values", function(assert) {
        expect( 2 );

        var $input = $('#taginput').val('test1,test2').taginput();

        assert.equal(getTagCount(), 2, "there should be two tags saved internally");
        assert.equal(getTagCountDom(), 2, "and two corresponding DOM elements");
    });

    QUnit.test("taginput.add", function(assert) {
        expect( 4 );

        var $input = $('#taginput').taginput();

        $input.taginput('add', 'test');

        assert.equal(getTagCount(), 1, "after calling add('test') there should be one tag saved internally");
        assert.equal(getTagCountDom(), 1, "and one corresponding DOM element");
        assert.deepEqual($input.taginput('get'), ['test'], "get() should return ['test']");
        assert.deepEqual($input.val(), 'test', "the initial input value should be updated to 'test'");
    });

    QUnit.test("taginput.get", function(assert) {
        expect( 1 );

        var $input = $('#taginput').taginput();

        $input.taginput('add', 'test');

        var val = $input.taginput('get');

        assert.deepEqual(val, [ 'test' ], "after calling add('test'), get() should return ['test']");
    });    

    QUnit.test("taginput.set", function(assert) {
        expect( 3 );

        var $input = $('#taginput').taginput();

        var tags = ['test1', 'test2'];
        $input.taginput('set', tags);

        assert.equal(getTagCount(), tags.length, "after calling set(arr) there should be #are.length tags saved internally");
        assert.equal(getTagCountDom(), tags.length, "and #arr.length corresponding DOM elements");
        assert.deepEqual($input.taginput('get'), tags, "get() should return arr");
    });    

    QUnit.test("taginput.remove", function(assert) {
        expect( 3 );
        
        var $input = $('#taginput').taginput();
        $input.taginput('add', 'test');
        $input.taginput('remove', 'test');

        assert.equal(getTagCount(), 0, "after calling remove() one tag should be removed internally");
        assert.equal(getTagCountDom(), 0, "and one corresponding DOM element");
        assert.deepEqual($input.val(), '', "the initial input value should be updated to empty");
    });

    QUnit.test("taginput.clear", function(assert) {
        expect( 4 );
        
        var $input = $('#taginput').taginput();    
        $input.taginput('add', 'test1');
        $input.taginput('add', 'test2');
        $input.val('some');
        $input.taginput('clear');

        assert.equal(getTagCount(), 0, "after calling clear() there should be no tag saved internally");
        assert.equal(getTagCountDom(), 0, "there should be no DOM element");
        assert.equal($input.val(), '', "the initial input field should be empty");
        assert.equal($('.taginput-wrapper input').val(), '', "the additional input field should be empty");
    });

    QUnit.test("chaining", function(assert) {
        expect( 3 );

        var $input = $('#taginput').taginput();
        var $retValue = null;

        $retValue = $input.taginput('add', 'test');
        assert.deepEqual($retValue, $input, "add() return value should be jquery object");

        $retValue = $input.taginput('remove', 'test');
        assert.deepEqual($retValue, $input, "remove() return value should be jquery object");

        $retValue = $input.taginput('clear', 'test');
        assert.deepEqual($retValue, $input, "clear() return value should be jquery object");
    });

    QUnit.module("DOM", {
        setup: function(){

        }
    });

    QUnit.test("dom add", function(assert) {
        expect( 2 );

        var $input = $('#taginput').taginput();
        var $newInput = $('.taginput-wrapper input').val('test1');

        var event = $.Event( "keydown" );
        event.keyCode = 13;
        $newInput.trigger( event );

        assert.equal(getTagCount(), 1, "there should be one item");
        assert.equal(getTagCountDom(), 1, "there should be one item");
    });

    QUnit.test("dom remove", function(assert) {
        expect( 2 );

        var $input = $('#taginput').taginput();
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

        var $input = $('#taginput').taginput();
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

    QUnit.module("options", {
        setup: function(){

        }
    });

    QUnit.test("multiple entries", function(assert) {
        expect( 4 );

        var $input = $('#taginput').taginput();
        $input.taginput('add', 'test');
        $input.taginput('add', 'test');

        assert.equal(getTagCount(), 1, "when adding two tags with the same value only one should be saved internally");
        assert.equal(getTagCountDom(), 1, "and there should be one corresponding DOM element");

        $input.taginput('destroy');

        $input.taginput({
            allowMultiple: true
        });
        $input.taginput('add', 'test');
        $input.taginput('add', 'test');

        assert.equal(getTagCount(), 2, "when allowMultiple is true two tags with the same value should be added both");
        assert.equal(getTagCountDom(), 2, "and the corresponding DOM elements");
    });

    QUnit.test("caseSensitive", function(assert) {
        expect( 2 );

        var $input = $('#taginput').taginput({
            caseSensitive: true
        });

        $input.taginput('add', 'test');
        $input.taginput('add', 'Test');

        assert.equal(getTagCount(), 2, "when adding two tags identically expect their cases there should be two tags saved internally");
        assert.equal(getTagCountDom(), 2, "and there should be two corresponding DOM elements");
    });

    QUnit.test("onAdd", function(assert) {
        expect( 2 );

        var $input = $('#taginput').taginput({
            onAdd: function(tag){
                return false;
            }
        });

        $input.taginput('add', 'test');

        assert.equal(getTagCount(), 0, "returning false in onAdd should avoid adding the tag internally");
        assert.equal(getTagCountDom(), 0, "and the corresponding DOM element");
    });

    QUnit.test("onRemove", function(assert) {
        expect( 2 );

        var $input = $('#taginput').taginput({
            onRemove: function(tag){
                return false;
            }
        });

        $input.taginput('add', 'test');
        $input.taginput('remove', 'test');
        $input.taginput('clear');

        assert.equal(getTagCount(), 1, "returning false in onRemove should avoid removing the tag internally");
        assert.equal(getTagCountDom(), 1, "and the corresponding DOM element");
    });    

});
