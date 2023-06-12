/** Class for line chart web component. */
class LineChart extends HTMLElement {
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
    } else if (this.querySelector('dataseries')) {
      this.handleDataSeriesMode();
    } else {
      console.error('Invalid chart structure: No table or data series found');
    }
  }

  /** Function for drawing the chart using data series. */
  handleTableMode(): void {
    /*try {
      const dictionaries = this.getTableDict();
      const width = this.setChartWidth();
      const height = this.setChartHeight();
      this.drawLineChart(width, height, dictionaries);
    } catch (error) {
      console.error('[Error]', error.message);
    }*/
  }

  /** Function for drawing the chart in table mode. */
  handleDataSeriesMode(): void {
    try {
      const dictionaries = this.getDataSeriesDict();
      const width = this.setChartWidth();
      const height = this.setChartHeight();
      this.drawLineChart(width, height, dictionaries);
    } catch (error) {
      console.error('[Error]', error.message);
    }
  }

  /**
   * Function drawing the chart and adding it to the Shadow DOM.
   * @param {number} width: Width of chart
   * @param {number} height: Height of chart
   * @param [{{[key: string]: number}}, {{[key: string]: string}}] dataDict: 2 dictionaries, 1 consisting of datapoints
   * and the other of the x and y axis headers.
   */
  drawLineChart(
    width: number,
    height: number,
    dictionaries: [{ [key: string]: number }, { [key: string]: string }]
  ): void {
    const margin = {
      top: height * 0.2,
      bottom: height * 0.2,
      left: width * 0.2,
      right: width * 0.2,
    };
    const dataDict = dictionaries[0];
    const headers = dictionaries[1];

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
      .line<{ date: string; value: number }>()
      .x((d) => x(d.date)!)
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
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line);

    //x label
    lineChartSvg
      .append('text')
      .attr('class', 'x-label')
      .attr('text-anchor', 'end')
      .attr('x', width - margin.right)
      .attr('y', height - margin.bottom + 40)
      .text(headers['x-axis']);

    //y label
    lineChartSvg
      .append('text')
      .attr('class', 'y-label')
      .attr('text-anchor', 'end')
      .attr('x', -margin.bottom)
      .attr('y', margin.left - 60)
      .attr('dy', '.75em')
      .attr('transform', 'rotate(-90)')
      .text(headers['y-axis']);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x));

    g.append('g').call(d3.axisLeft(y));

    this.shadowRoot?.appendChild(lineChartSvg.node());

    let style = document.createElement('link');
    style.setAttribute('rel', 'stylesheet');
    style.setAttribute('href', '../css/style.css');
    this.shadowRoot.append(style);
  }

  /**
   * Function, which creates the chart dictionary out of data series.
   * @returns [{{[key: string]: number}}, {{[key: string]: string}}]: Return 2 dictionaries:
   * 1. Data points: key -> string, value -> number.
   * 2. X and Y Axis names: key -> string, value -> string.
   */
  getDataSeriesDict(): [{ [key: string]: number }, { [key: string]: string }] {
    const dataSeriesElement = this.querySelector('dataseries');
    let xAxisName: any = 'x-Axis';
    let yAxisName: any = 'y-Axis';

    if (!dataSeriesElement) {
      throw new Error('<dataseries> element not found');
    }

    const dataPointElements = dataSeriesElement.querySelectorAll('datapoint');
    if (!dataPointElements.length) {
      throw new Error('No <datapoint> elements found inside <dataseries>');
    }

    const xAxisQuerySelector = this.querySelector('x-header');
    xAxisName =
      xAxisQuerySelector && xAxisQuerySelector.innerHTML !== ''
        ? xAxisQuerySelector.innerHTML
        : xAxisName;
    const yAxisQuerySelector = this.querySelector('y-header');
    yAxisName =
      yAxisQuerySelector && yAxisQuerySelector.innerHTML !== ''
        ? yAxisQuerySelector.innerHTML
        : yAxisName;
    let headerDict: { [key: string]: string } = {
      'x-axis': 'x-axis',
      'y-axis': 'y-axis',
    };
    headerDict['x-axis'] = xAxisName;
    headerDict['y-axis'] = yAxisName;

    let dataDict: { [key: string]: number } = {};

    dataPointElements.forEach((dataPoint) => {
      let dataPointInnerHtml = dataPoint.innerHTML.replace(/\s/g, '');
      let dataValues = dataPointInnerHtml.split(',');
      if (!dataValues[1]) {
        throw new Error(`<datapoint> value is missing`);
      } else if (!this.isValidNumber(dataValues[1])) {
        throw new Error(
          `<datapoint> value ${dataValues[1]} is not a valid input for chart`
        );
      }
      dataDict[dataValues[0]] = parseFloat(dataValues[1]);
    });
    return [dataDict, headerDict];
  }

  /**
   * Function returning an array of the values of the input dictionary.
   * @param {{[key: string]: number}} dict: Input dictionary
   * @returns {number[]}: Return array of values of input dictionary.
   */
  getDictValues(dict: { [key: string]: number }): number[] {
    return Object.values(dict);
  }

  /**
   * Function setting the chart width.
   * @returns {number}: Return width of chart. Default set to 500.
   */
  setChartWidth(): number {
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
  setChartHeight(): number {
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
  isValidNumber(str: string): boolean {
    return !isNaN(parseFloat(str));
  }

  /**
   * Function, which creates the chart dictionary out of table structure.
   * @returns {{[key: string]: number}}: Return dictionary of data points: key -> string, value -> number.
   */
  getTableDict(): { [key: string]: number } {
    const tableElement = this.querySelector('table');

    if (!tableElement) {
      throw new Error('<table> element not found');
    }

    const tableRows = Array.from(tableElement.querySelectorAll('tr'));

    const dataDict: { [key: string]: number } = {};

    tableRows.forEach((row) => {
      const cells = Array.from(row.querySelectorAll('td'));
      if (cells.length < 2) {
        throw new Error(
          'Invalid table structure: Each row must have at least two cells'
        );
      }

      const key = cells[0].textContent?.trim();
      const value = cells[1].textContent?.trim();

      if (!key || !value) {
        throw new Error('Invalid table structure: Each cell must have a value');
      }

      if (!this.isValidNumber(value)) {
        throw new Error(
          `Invalid table structure: Value "${value}" is not a valid number`
        );
      }

      dataDict[key] = parseFloat(value);
    });

    return dataDict;
  }
}

// Define the custom element "line-chart"
customElements.define('ec-linechart', LineChart);
