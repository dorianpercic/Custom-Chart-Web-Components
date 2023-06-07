/** Class for line chart web component. */
class LineChart extends HTMLElement {
    /**
     * Constructor of web component, create Shadow DOM.
     * @constructor
     */
    constructor() {
        super();
        // !!Test so far!!
        this.attachShadow({ mode: 'open' }).innerHTML = `
      <style>
        :host {
          --background: lightblue;
        }
        span {
          background: var(--background);
        }
      </style>
      <span>Hello, line component!</span>
    `;
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
            this.drawLineChart(width, height, dataDict);
        }
        catch (error) {
            console.error('[Error]', error.message);
        }
    }
    /** Function for drawing the chart in table mode. */
    handleDataSeriesMode() {
        try {
            console.log('hi');
            const dataDict = this.getDataSeriesDict();
            const width = this.setChartWidth();
            const height = this.setChartHeight();
            this.drawLineChart(width, height, dataDict);
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
    drawLineChart(width, height, dataDict) {
        var _a;
        const margin = { top: 70, right: 30, bottom: 40, left: 80 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        const data = Object.entries(dataDict).map(([key, value]) => ({
            date: key,
            value: value,
        }));
        const x = d3
            .scalePoint()
            .range([0, innerWidth])
            .domain(data.map((d) => d.date));
        const y = d3
            .scaleLinear()
            .range([innerHeight, 0])
            .domain([0, d3.max(data, (d) => d.value)]);
        const line = d3
            .line()
            .x((d) => x(d.date))
            .y((d) => y(d.value));
        const lineChartSvg = d3
            .create('svg')
            .attr('width', width)
            .attr('height', height);
        const g = lineChartSvg
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
        g.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 1.5)
            .attr('d', line);
        g.append('g')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(d3.axisBottom(x));
        g.append('g').call(d3.axisLeft(y));
        (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.appendChild(lineChartSvg.node());
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
        console.log(dataDict);
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
// Define the custom element "line-chart"
customElements.define('line-chart', LineChart);
