/**
 * jQuery Countdown Timer plugin v1.0
 *
 * https://github.com/unthunk/jquery-countdown-timer
 *
 * Copyright 2013 Lucas Myers
 * Released under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

(function($){

	var labels = [],

		start = function(el,options) {
			if($(el).data('countdown-label') >= 0){
					// there's already a timer on this
					methods.stop(el);
				}
				// handle the label
				var label = $(el).data('countdown-label') >= 0 ? $(el).data('countdown-label') : labels.length,
					opts = $(el).data('countdown-opts') ? $(el).data('countdown-opts') : options;
				$(el).data('countdown-label',label);
				$(el).data('countdown-opts',opts);

				update(el,opts);

				labels[label] = setInterval(function(){
					tick(el);
				},1000);
		},

		tick = function(el) {
			var opts = ($(el).data('countdown-opts')),
				done = false;

			// countdown 1 second
			opts.s--;
			// detect if countdown is done (all 0's)
			if(opts.y === 0 && opts.m === 0 && opts.d === 0 && opts.h === 0 && opts.m === 0 && opts.s === 0){
				done = true;
			}

			// if seconds is less than 0, reset to 59, then decrement up the counter
			if(opts.s < 0) {
				opts.s = 59;

				// minutes
				if(opts.m === 0){
					opts.m = 59;

					// hours
					if(opts.h === 0){
						opts.h = 23;

						// days
						if(opts.d === 0) {
							opts.d = 364;
							// years
							opts.y--;
						}
						else {
							opts.d--;
						}
					}
					else {
						opts.h--;
					}
				}
				else{
					opts.m--;
				}
			}

			// update display
			update(el,opts);

			// end of countdown, end timer and run callback
			if(done) {
				methods.stop(el);
				$(el).removeData('countdown-label countdown-opts');
				if(opts.done && typeof opts.done === 'function') {
					opts.done();
				}
			}
			else {

				// save countdown
				$(el).data('countdown-opts',opts);
			}
		},

		update = function(el,opts) {
			// run opts.tpl if it is passed in
			if(opts.tpl && typeof opts.tpl === "function"){
				opts.tpl(el,opts);
			}
			else {
				// display the countdown
				var template = _.template(
					$("#countdown-tpl").html()
				);

				$(el).html(template(opts));
			}


			function format(val) {
				var formatted = '' + val;
				if(formatted.length === 1) {
					formatted = ''+'0' + val;
				}
				return formatted;
			}
		},

		methods = {
			init: function(options) {
				var that = this;
				return this.each(function(){
					var $this = $(this);
					var opts = $.extend({}, $.fn.countdown.defaults, options);
					$($this).data('countdown-opts',opts);
					if(opts.autostart) {
						start($this,opts);
					}
				});
			},

			pause: function() {
				return this.each(function(){
					var $this = $(this);
					methods.stop($this);
				});
			},

			resume: function() {
				return this.each(function(){
					var $this = $(this);
					var opts = $.extend({}, $.fn.countdown.defaults, $($this).data('countdown-opts'));
					start($this,opts);
				});
			},

			start: function() {
				return this.each(function(){
					var $this = $(this);
					var opts = $.extend({}, $.fn.countdown.defaults, $($this).data('countdown-opts'));
					start($this,opts);
				});
			},

			stop: function(el) {
				if(el){
					clearInterval(labels[$(el).data('countdown-label')]);
				}
				else {
					return this.each(function(){
						var $this = $(this);
						clearInterval(labels[$($this).data('countdown-label')]);
					});
				}
			}

		};

	$.fn.countdown = function(options){

		if ( methods[options] ) {
			return methods[ options ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof options === 'object' || ! options ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
		}

	};

	$.fn.countdown.defaults = {
		autostart: false,
		y: 0,
		d: 0,
		h: 0,
		m: 0,
		s: 0
	};

})(jQuery);