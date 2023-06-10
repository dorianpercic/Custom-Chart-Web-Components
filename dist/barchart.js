/** Class for bar chart web component. */
class BarChart extends HTMLElement {
    /**
     * Constructor of web component, create Shadow DOM.
     * @constructor
     */
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    /** This life-cycle method will be called as soon as the web component
     * is attached to the DOM.
     */
    connectedCallback() {
        if (this.querySelector('table')) {
            this.handleTableMode();
        }
        else if (this.querySelector('dataseries')) {
            this.handleDataSeriesMode();
        }
        else {
            console.error('Invalid chart structure: No table or data series found');
        }
    }
    /** Function for drawing the chart using data series. */
    handleTableMode() {
        try {
            const dataDict = this.getTableDict();
            const width = this.setChartWidth();
            const height = this.setChartHeight();
            this.drawBarChart(width, height, dataDict);
        }
        catch (error) {
            console.error('[Error]', error.message);
        }
    }
    /** Function for drawing the chart in table mode. */
    handleDataSeriesMode() {
        try {
            const dataDict = this.getDataSeriesDict();
            const width = this.setChartWidth();
            const height = this.setChartHeight();
            this.drawBarChart(width, height, dataDict);
        }
        catch (error) {
            console.error('[Error]', error.message);
        }
    }
    /**
     * Function drawing the chart and adding it to the Shadow DOM.
     * @param {number} width: Width of chart
     * @param {number} height: Height of chart
     * @param {{[key: string]: number}} dataDict: Dictionary of data points
     */
    drawBarChart(width, height, dataDict) {
        var _a;
        const margin = {
            top: height * 0.2,
            bottom: height * 0.2,
            left: width * 0.2,
            right: width * 0.2,
        };
        const dataArray = this.getDictValues(dataDict);
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;
        const barChartSvg = d3
            .create('svg')
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('version', '1.1');
        const xScale = d3
            .scaleBand()
            .domain(d3.range(dataArray.length))
            .range([0, chartWidth])
            .padding(0.1);
        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(dataArray) || 0])
            .range([chartHeight, 0]);
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale).ticks(5);
        barChartSvg
            .append('g')
            .attr('transform', `translate(${margin.left}, ${height - margin.bottom})`)
            .call(xAxis);
        barChartSvg
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)
            .call(yAxis);
        barChartSvg
            .append('g')
            .selectAll('rect')
            .data(dataArray.sort((a, b) => {
            return a - b;
        }))
            .join('rect')
            .attr('x', (_, i) => margin.left + xScale(i))
            .attr('y', (d) => margin.top + yScale(d))
            .attr('width', xScale.bandwidth())
            .attr('height', (d) => chartHeight - yScale(d))
            .attr('fill', 'red');
        // X-Axis
        barChartSvg
            .append('text')
            .attr('class', 'x-label')
            .attr('text-anchor', 'end')
            .attr('x', width - margin.right)
            .attr('y', height - margin.bottom + 40)
            .text("Custom label");
        // Y-Axis
        barChartSvg
            .append('text')
            .attr('class', 'y-label')
            .attr('text-anchor', 'end')
            .attr('x', -margin.bottom)
            .attr('y', margin.left - 60)
            .attr('dy', '.75em')
            .attr('transform', 'rotate(-90)')
            .text('Value');
        (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.appendChild(barChartSvg.node());
        //Adding CSS
        let style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', '../css/style.css');
        this.shadowRoot.append(style);
    }
    /**
     * Function, which creates the chart dictionary out of data series.
     * @returns {{[key: string]: number}}: Return dictionary of data points: key -> string, value -> number.
     */
    getDataSeriesDict() {
        const dataSeriesElement = this.querySelector('dataseries');
        if (!dataSeriesElement) {
            throw new Error('<dataseries> element not found');
        }
        const dataPointElements = dataSeriesElement.querySelectorAll('datapoint');
        if (!dataPointElements.length) {
            throw new Error('No <datapoint> elements found inside <dataseries>');
        }
        let dataDict = {};
        dataPointElements.forEach((dataPoint) => {
            let dataPointInnerHtml = dataPoint.innerHTML.replace(/\s/g, '');
            let dataValues = dataPointInnerHtml.split(',');
            if (!dataValues[1]) {
                throw new Error(`<datapoint> value is missing`);
            }
            else if (!this.isValidNumber(dataValues[1])) {
                throw new Error(`<datapoint> value ${dataValues[1]} is not a valid input for chart`);
            }
            dataDict[dataValues[0]] = parseFloat(dataValues[1]);
        });
        return dataDict;
    }
    /**
     * Function returning an array of the values of the input dictionary.
     * @param {{[key: string]: number}} dict: Input dictionary
     * @returns {number[]}: Return array of values of input dictionary.
     */
    getDictValues(dict) {
        return Object.values(dict);
    }
    /**
     * Function setting the chart width.
     * @returns {number}: Return width of chart. Default set to 500.
     */
    setChartWidth() {
        let width = 500;
        let containsLettersRegex = /[a-zA-Z]/g;
        let widthAttribute = this.getAttribute('width');
        if (widthAttribute && !containsLettersRegex.test(widthAttribute)) {
            if (+widthAttribute > 10) {
                width = +widthAttribute;
            }
        }
        return width;
    }
    /**
     * Function setting the chart height.
     * @returns {number}: Return height of chart. Default set to 300.
     */
    setChartHeight() {
        let height = 300;
        let containsLettersRegex = /[a-zA-Z]/g;
        let heightAttribute = this.getAttribute('height');
        if (heightAttribute && !containsLettersRegex.test(heightAttribute)) {
            if (parseInt(heightAttribute) > 10) {
                height = parseInt(heightAttribute);
            }
        }
        return height;
    }
    /**
     * Function checking if input is a valid number.
     * @param {string} str: Input string
     * @returns {boolean}: Return true if input string is a valid number, otherwise false.
     */
    isValidNumber(str) {
        return !isNaN(parseFloat(str));
    }
    /**
     * Function, which creates the chart dictionary out of table structure.
     * @returns {{[key: string]: number}}: Return dictionary of data points: key -> string, value -> number.
     */
    getTableDict() {
        const tableElement = this.querySelector('table');
        if (!tableElement) {
            throw new Error('<table> element not found');
        }
        const tableRows = Array.from(tableElement.querySelectorAll('tr'));
        const dataDict = {};
        tableRows.forEach((row) => {
            var _a, _b;
            const cells = Array.from(row.querySelectorAll('td'));
            if (cells.length < 2) {
                throw new Error('Invalid table structure: Each row must have at least two cells');
            }
            const key = (_a = cells[0].textContent) === null || _a === void 0 ? void 0 : _a.trim();
            const value = (_b = cells[1].textContent) === null || _b === void 0 ? void 0 : _b.trim();
            if (!key || !value) {
                throw new Error('Invalid table structure: Each cell must have a value');
            }
            if (!this.isValidNumber(value)) {
                throw new Error(`Invalid table structure: Value "${value}" is not a valid number`);
            }
            dataDict[key] = parseFloat(value);
        });
        return dataDict;
    }
}
// Define the custom element "bar-chart"
customElements.define('bar-chart', BarChart);
