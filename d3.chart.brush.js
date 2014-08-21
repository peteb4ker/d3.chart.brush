/*!
 * @overview  Brush / context component for the d3.chart framework.
 * @copyright Copyright (c) 2014 Sentient Energy, Inc.
 * @license   Licensed under MIT license
 * @author    Pete Baker
 * @version   0.1.0
 */
(function (d3) {
    d3.chart("Brush", {

    /**
     * __Brush component for ```d3.chart``` v0.2 and ```d3.chart.base``` v0.4__
     *
     * Intended to be used as a component of a larger chart.
     *
     * __Chart Basic usage__
     *
     * ```javascript
     * chart.brush = chart.append("g").chart("Brush", {scale: x});
     * ```
     * @namespace d3.chart
     * @class Brush
     * @constructor
     */
    initialize: function(options) {
        var chart = this;

        console.log("[Brush] initialize", options);

        if (options === undefined) throw "x and y scales are required";
        ["x", "y", "shape"].forEach(function(d) { if (options[d] === undefined) throw d+" option is required"; });

        chart._x = options.x;
        chart._y = options.y;
        chart._shape = options.shape;

        //create and configure the brush
        chart._brush = d3.svg.brush()
                             .x(chart._scale)
                             .on("brush", function(extent) {
                                 //update the scale domain
                                 chart._scale.domain(chart._brush.empty() ? chart._scale.domain() : chart._brush.extent());

                                 //trigger the brush:brushed event to propagate the brush extent to any listeners
                                 chart.trigger("brush:brushed", chart._brush.extent());
                             });

        //define the brush layer
        this.layer("brush", chart.base, {
            dataBind: function(data) {
                chart.data = data;

                return this.select("path").data([data]);
            },
            insert: function() {
                this.append("path");

                return this.append("g").classed("brush", true);
            },
            events: {
                "merge:transition": function() {
                    this.select("path").attr("d", chart._shape);

                    this.call(chart._brush);
                }
            }
        });
    }
});
}(d3));
