/*        
 *  jQuery.ui widget for creating tags in an input field
 *
 *  Author: bzums
 *  Version: 0.1.0
 *  Copyright: www.samsam4.org
 *  License: MIT (http://www.opensource.org/licenses/mit-license.php) or GPLv3 (http://www.gnu.org/copyleft/gpl.html) at your own discretion
 *
 */

/* global jQuery */

;(function ( $, window, document, undefined ) {

	// Mapping for keys
    var keys = {
        WHITESPACE: 32,
        ENTER: 13,
        TAB: 9,
        BACKSPACE: 8
    },

    style = {

        jquery: {
            tagTpl: '<button class="taginput-tag ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-secondary" role="button" aria-disabled="false"><span class="ui-button-icon-secondary ui-icon ui-icon-close"></span><span class="ui-button-text"></span></button>',
            wrapperTpl: '<div class="taginput-wrapper ui-widget ui-widget-content ui-corner-all"></div>'
        },

        bootstrap: {
            tagTpl: '<button class="taginput-tag btn btn-default btn-sm"><span class="glyphicon glyphicon-remove"></span><span></span></button>',
            wrapperTpl: '<div class="taginput-wrapper form-control"></div>'
        }
    },

    defaults = {

        style: 'jquery',

        separateKeyCodes: [ keys.WHITESPACE, keys.ENTER, keys.TAB ],

        placeholder: 'Add tag...',

        allowMultiple: false,

        exists: function($tag) {
      		$tag.hide().fadeIn();
    	},

    	tagLabel: function(tag){
    		return tag;
    	},

    	tagValue: function(tag){
      		return tag;
    	}
    },

    pluginName = 'taginput';

    // Constructor function
    function Taginput(element, options){
    	
    	this._tags = [];
    	this.$element = $(element);

    	this._defaults = defaults;
        this._name = pluginName;

    	this._create(options);
    }

    Taginput.prototype = {

    	constructor: Taginput,

    	_create: function (options) {
            
			this.options = $.extend({}, defaults, options);

			this.$element.hide();

			this.$input = $('<input type="text" placeholder="' + this.options.placeholder + '"/>')
				.insertAfter(this.$element);

            this.$input.wrap(style[ this.options.style ].wrapperTpl);
            
            // Bind events
            this.$input.on( 'keydown.taginput', $.proxy(this._keydown, this));

            // Ease to focus input field
            var self = this;
            this.$input.parent().on( 'click.taginput', 
            	function(){
                    self.$input.focus();
                }
            );
        },
 
        _destroy: function () {

 			this.$input.off('keydown.taginput');
 			this.$input.parent().off('click.taginput');

            this.$input.after().remove();
            this.$input.unwrap();
        },
        
        // Keydown handler for the input field
        _keydown: function(event){

            event.stopPropagation();
                
            var val = $.trim(this.$input.val());

            // on backspace: 
            // check whether there is previous tag to be edited
            if(event.keyCode == keys.BACKSPACE && val === ''){
                this._dissolveLast();
                event.preventDefault();
            }
                
            // on keys in options.separateKeyCodes:
            // if input field value is not blank create new tag and clear input field
            if($.inArray(event.keyCode, this.options.separateKeyCodes) >= 0){
                this._createTagFromInputField();
                event.preventDefault();
            }
                
            // on tab: 
            // prevent losing focus     
            if (event.keyCode == keys.TAB){
                event.preventDefault();
            }  
        },

        // Checks whether there is text in input field, if so:
        // creates tag and clears input field
        _createTagFromInputField: function(){

            var val = $.trim(this.$input.val());
            if(val !== ''){
                if(this.options.getTagObject){
                    val = this.options.getTagObject(val);
                }
                this.add(val);
                this.$input.val('');
            }
        },
        
        // Edit the latest tag: if there are tags delete the latest one and fill input field
        // with the name of the tag
        _dissolveLast: function(){

            if(this._tags.length > 0){
                var $btn = this.$input.prev(),
                	tag = $btn.data('taginput-data');

                this.remove(tag);
                this.$input.val(this.options.tagLabel(tag));
            }
        },        

        // Returns jQuery element of the tag with given name
        _getTagElem: function(tag){
        	
        	var self = this,
        		$elem = null;

			this.$input.parent().find('.taginput-tag').each(function(index, value){

				var data = $(value).data('taginput-data');
                if(self.options.tagValue(data) === self.options.tagValue(tag)){
                    $elem = $(value);
                }
            });

            return ($elem === null) ? false : $elem;
        },

        // Propagates current items to $element.val
        // Trigger change event on $element
        _pushVal: function(){

        	var self = this,
        		val = $.map(this._tags, function(tag) {
            		return self.options.tagValue(tag).toString();
          	});

      		this.$element.val(val).trigger('change');
        },

        // Checks whether a tag with the given name exists already
        exists: function(tag){

        	var self = this,
        		found = false;

        	$.each(this._tags, function(index, value){
                if(self.options.tagValue(tag) === self.options.tagValue(value)){
                	found =  true;
                }
            });

            return found;
        },

        // Adds a new tag with given name and data to the widget,
        // but only if the tag name is not present, yet
        add: function(tag){
            var self = this;

            // Call exists if tag already exists
            if(!this.options.allowMultiple && this.exists(tag)){

				if (this.options.exists) {
         			this.options.exists.call(this.$element, this._getTagElem(tag));
        		}
            }  
            // Else update state
            else{

                // User can avoid add via returning false in add event handler
                var avoidAdd = false;

                if (this.options.add) {
                    avoidAdd = (this.options.add.call(this.$element, tag) === false);
                }

                if(!avoidAdd){
	            
                    // View
    	            var $tag = $(style[this.options.style].tagTpl);
    	            $tag.children().last().html(this.options.tagLabel(tag));

    	            $tag.data('taginput-data', tag)
    	            .on('click', function(event){
    	                event.preventDefault();
    	                self.remove(tag);
    	            });
    	            this.$input.before($tag);
    	            
    	            // Model
    	            this._tags.push(tag);

                    this._pushVal();
                }
	        }

            return this.$element[0];
        },
        
        // Deletes the tag(s) with the given name
        remove: function(tag){
            
            var self = this;

            // User can avoid remove via returning false in add event handler
            var avoidRemove = false;

            if (this.options.remove) {
                avoidRemove = (this.options.remove.call(this.$element, tag) === false);
            }

            if(!avoidRemove){

                // View
                this._getTagElem(tag).remove();
                    
                // Model
                this._tags = $.grep(this._tags, function(value, index){
                    return self.options.tagValue(value) !== self.options.tagValue(tag);
                });

                this._pushVal();
                this.$input.focus();
            }

            return this.$element[0];
        },
        
        // Returns array of data of all present tags 
        get: function(){
            
            return this._tags;
        },
        
        
        // Deletes all present tags and fills the widget with the given tags
        set: function(tags){
            
            var self = this;
            self.clear();
            $.each(tags, function(index, value){
                self.add(value);
            });

            return this.$element[0];
        },

        // Deletes all present tags 
        clear: function(){
            
            var self = this;
            $.each(self._tags, function(index, value){
                self.remove(value);
            });

            return this.$element[0];
        },
    };

    // Register JQuery plugin
    $.fn[ pluginName ] = function(arg1, arg2) {

        var self = this;
        var results = [];

        this.each(function() {
            var taginput = self.data(pluginName);

            // Initialize a new tags input
            if ( !taginput ) {

                taginput = new Taginput(self, arg1);
                self.data(pluginName, taginput);
                results.push(this);
            } else {

                // Invoke function on existing taginput
                var retVal = taginput[arg1](arg2);
                if (retVal !== undefined)
                results.push(retVal);
            }
        });

        if ( typeof arg1 == 'string') {
            // Return the results from the invoked function calls
            if(results.length > 0){
                // Return jQuery collection if return type of 
                // invoked function is a dom element
                if( results[0] !== this[0] ){
                    return results.length > 1 ? results : results[0];
                }
            }
        }

        // Else: return collection of matched elements
        return arrayToJQueryCollection(results);
    };

    // Create a jQuery collection from an array of dom elements
    function arrayToJQueryCollection(arr){

        var $elems = $();

        $.each(arr, function(index, val){
            $elems.push(val);
        });

        return $elems;
    }


})( jQuery, window, document );