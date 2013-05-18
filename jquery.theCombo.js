/**
 * jquery.theCombo.js
 * Thiago Lagden | @thiagolagden | lagden@gmail.com
 * jQuery plugin
 */
;(function ($, window, document, undefined) {
    var pluginName = "theCombo";
    var defaults = {
        theCss: false
    };

    function Plugin(element, options) {
        this.element = element;
        this.$element = $(element);
        this.$span = null;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function () {
            if (this.$element.is('select'))
                this.stylezando();
        }
        , stylezando: function() {
            this.$span = $('<span></span>');
            var options = this.$element.find('option');
            var title = (options.filter(":selected").val() != '')
            ? options.filter(":selected").text()
            : options.eq(0).text();

            this.$element
            .after(
                this.$span
                .attr("class", this.$element.attr("class"))
                .css({
                    'width': this.element.clientWidth + 'px'
                    , 'top': this.element.offsetTop + 'px'
                    , 'left': this.element.offsetLeft + 'px'
                    , 'position': 'absolute'
                    , 'zIndex': 1
                })
                .html(title)
            )
            .addClass(this.options.theCss)
            .css({'position': 'relative', 'opacity': 0, 'zIndex': 2, 'height': this.$span.get(0).clientHeight + 'px'})
            .on('change.'+this._name, {"sp": this.$span, "el": this.$element},this.change);

            var frm = this.$element.parents('form:eq(0)');
            if(frm.length === 1)
            {
                frm
                .on('reset', {"el": this.$element, "eventName": this._name}, function(ev){
                    ev.data.el.val('').trigger('change.'+ ev.data.eventName);
                });
            }
        }
        , change: function(ev) {
            ev.data.sp.text(ev.data.el.find('option:selected').text());
        }
        , destroy: function() {
            this.$element
            .removeClass(this.options.theCss)
            .off('change.'+this._name)
            .css({'position': '', 'opacity': '', 'zIndex': ''})
            .next('span:eq(0)').remove();
            this.$span = null;
        }
    };

    $.fn[pluginName] = function (options) {
        var args = arguments;
        if (options === undefined || typeof options === 'object') {
            return this.each(function () {
                if (!$.data(this, "plugin_" + pluginName))
                    $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            var returns;

            this.each(function () {
                var instance = $.data(this, 'plugin_' + pluginName);
                if (instance instanceof Plugin && typeof instance[options] === 'function')
                    returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ));

                if (options === 'destroy')
                    $.data(this, 'plugin_' + pluginName, null);
            });

            return returns !== undefined ? returns : this;
        }
    };
})(jQuery, window, document);