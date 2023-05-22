/* A BaseClass for any Web Component that does SVG thingy things */
class SVGMeisterElement extends HTMLElement {
    // ########################################################## createCircle()
    createSVGCircle(
        // one args parameter Object for all parameters
        { ...args }
    ) {
        // calc circle size
        const circleSize = this.pieSize / 2;
        const pathLength = 100;
        const slice = this.createSVGElement({
            tag: 'circle',
            attributes: {
                pathLength: pathLength, // 100 for a 100% Pie
                size: args.size || pathLength,
                'stroke-dasharray':
                    args.dashArray ||
                    args.size + ' ' + (pathLength - args.size),
                'stroke-dashoffset': args.offset || 0,
                'stroke-width': args.strokeWidth || circleSize,
                stroke: args.stroke || 'black',
                fill: args.fill || 'none',
                // center point can be declared in multiple notations:
                cx: args.cx || (args.point && args.point.x) || this.width / 2,
                cy: args.cy || (args.point && args.point.y) || this.height / 2,
                r: args.r || circleSize / 2,
            },
        });

        // -------------------------------------------------- slice.getPointAt()
        // function on EACH slice so config parameters are re-used
        // default getPointAt( .5 , config.size/2 ) is the SLICE middle point
        slice.getPointAt = (
            distance = 0.5, // 0=CIRCLE center , .5=middle , 1=circle outer edge
            offset = slice.size / 2 // 0=start slice , size/2=middle slice , size=end slice
        ) => {
            // need to create a temporary DOM element
            // so the default .getPointAtLength and .getTotalLength functions can be used
            const tempPt = this.svg.appendChild(
                this.createSVGCircle({
                    //...config, // use same circle settings
                    ...slice.attributes,
                    // but a diffent radius
                    r: circleSize * distance,
                })
            );
            // calculate startoffset relative to the start of the slice
            let len = offset - args.offset;
            if (len < 0) len = pathLength + len;
            const point = tempPt.getPointAtLength(
                (len * tempPt.getTotalLength()) / pathLength
            );
            // got point(x,y) now, remove the temp circle from the DOM
            tempPt.remove();
            return point;
        };
        // return SVG <circle> element
        return slice;
    }
    // ########################################################## addPoint()
    // draw a circle on the SVG
    addSVGPoint(
        point,
        fill = 'white',
        stroke = 'black',
        r = 4,
        strokeWidth = 2
    ) {
        this.svg.append(
            this.createSVGCircle({
                point,
                r,
                fill,
                stroke,
                strokeWidth,
            })
        );
    }
    // ########################################################## createElement()
    createSVGElement({
        tag,
        attributes = {},
        innerHTML = false,
        append = false,
    }) {
        // create an Element in SVG NameSpace
        const element = document.createElementNS(
            'http://www.w3.org/2000/svg',
            tag
        );
        // read all { key:value } pairs and set as attribute
        Object.entries(attributes).forEach(([key, value]) =>
            element.setAttribute(key, value)
        );
        // add optional HTML
        if (innerHTML) element.innerHTML = innerHTML;
        if (append) element.append(...append);
        return element;
    }
}

/* Custom Elements API defining the <pie-chart> Web Component */

customElements.define(
    'pie-chart',
    class extends SVGMeisterElement {
        connectedCallback() {
            // fires on the OPENING <pie-chart> tag
            setTimeout(() =>
                // so we wait till all innerHTML is parsed
                this.renderPieChart({
                    pieSize: 200, // try different sizes, see what happens (the font-size is relative to the pieSize/viewBox)
                    padding: 20,
                })
            );
        }
        // ########################################################## render()
        renderPieChart({ pieSize = 200, padding = 0 }) {
            this.pieSize = pieSize;
            this.height = pieSize + padding;
            this.width = pieSize + padding;

            // offset: 0 - 100 , 0 = pie chart starts at top
            this.sliceTopOffset =
                Number(this.getAttribute('slice-offset')) || 0;
            this.labelPosition = this.getAttribute('label-position') || 0.8;

            this.svg = this.createSVGElement({
                tag: 'svg',
                attributes: {
                    viewBox: `0 0 ${this.width} ${this.height}`,
                },
                // SVG doesn't do CSS background:color, a <filter> does the job
                innerHTML: `<defs><filter x="0" y="0" width="1" height="1" id="label">
<feFlood flood-color="#222" flood-opacity="0.4"/>
<feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
</filter></defs>`,
                append: this.createSlicesWithCircles(),
            });

            // replace <pie-chart> with our <svg>
            this.replaceWith(this.svg);

            this.addSliceLabels();
        }
        // ########################################################## addSliceLabels()
        addSliceLabels() {
            this.slices.forEach((slice) => {
                const sliceMiddlePoint = slice.getPointAt(this.labelPosition);
                //this.addSVGPoint(sliceMiddlePoint);
                this.svg.append(
                    this.createSVGElement({
                        tag: 'text',
                        attributes: {
                            x: sliceMiddlePoint.x,
                            y: sliceMiddlePoint.y - 0,
                            fill: 'white',
                            'font-size': 10, // in viewBox pieSize units
                            'text-anchor': 'middle',
                            'font-family': 'arial',
                            filter: 'url(#label)', // grey background color with opacity
                        },
                        innerHTML: slice.label + ' ' + slice.size + '%',
                    })
                );
            });
        }
        // ########################################################## createSlices()
        createSlicesWithCircles() {
            // offset=25 pie-slice starts at the top of the circle
            let offset = 25 - this.sliceTopOffset;
            // get all <slice> elements in lightDOM
            const slices = [...this.querySelectorAll('slice')];
            // return an array of circles/slices
            this.slices = slices.map((slice) => {
                const size = parseFloat(slice.getAttribute('size'));
                let circle = this.createSVGCircle({
                    size,
                    offset,
                    stroke: slice.getAttribute('stroke'),
                });
                // save the label and size (because the slice element itself is removed)
                circle.size = size;
                circle.label = slice.innerHTML;
                // calculate offset for NEXT slice
                offset -= size;
                return circle;
            });
            return this.slices;
        }
    }
); //define
