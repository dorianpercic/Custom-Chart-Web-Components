/** Class for line chart web component. */
declare class LineChart extends HTMLElement {
    /**
     * Constructor of web component, create Shadow DOM.
     * @constructor
     */
    constructor();
    /** This life-cycle method will be called as soon as the web component
     * is attached to the DOM.
     */
    connectedCallback(): void;
    /** Function for drawing the chart using data series. */
    handleTableMode(): void;
    /** Function for drawing the chart in table mode. */
    handleDataSeriesMode(): void;
    /**
     * Function drawing the chart and adding it to the Shadow DOM.
     * @param {number} width: Width of chart
     * @param {number} height: Height of chart
     * @param {{[key: string]: number}} dataDict: Dictionary of data points
     */
    drawLineChart(width: number, height: number, dataDict: {
        [key: string]: number;
    }): void;
    /**
     * Function, which creates the chart dictionary out of data series.
     * @returns {{[key: string]: number}}: Return dictionary of data points: key -> string, value -> number.
     */
    getDataSeriesDict(): {
        [key: string]: number;
    };
    /**
     * Function returning an array of the values of the input dictionary.
     * @param {{[key: string]: number}} dict: Input dictionary
     * @returns {number[]}: Return array of values of input dictionary.
     */
    getDictValues(dict: {
        [key: string]: number;
    }): number[];
    /**
     * Function setting the chart width.
     * @returns {number}: Return width of chart. Default set to 500.
     */
    setChartWidth(): number;
    /**
     * Function setting the chart height.
     * @returns {number}: Return height of chart. Default set to 300.
     */
    setChartHeight(): number;
    /**
     * Function checking if input is a valid number.
     * @param {string} str: Input string
     * @returns {boolean}: Return true if input string is a valid number, otherwise false.
     */
    isValidNumber(str: string): boolean;
    /**
     * Function, which creates the chart dictionary out of table structure.
     * @returns {{[key: string]: number}}: Return dictionary of data points: key -> string, value -> number.
     */
    getTableDict(): {
        [key: string]: number;
    };
}
