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
      handleTableMode(this);
    } else if (this.querySelector('dataseries')) {
      handleDataSeriesMode(this);
    } else {
      console.error('Invalid chart structure: No table or data series found');
    }
  }

  /**
   * Function drawing the chart and adding it to the Shadow DOM.
   * @param {number} width: Width of chart
   * @param {number} height: Height of chart
   * @param [{{[key: string]: number}}, {{[key: string]: string}}] dataDict: 2 dictionaries, 1 consisting of datapoints
   * and the other of the x and y axis headers.
   */
  drawBarChart(
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
    const dataArray = getDictValues(dataDict);

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const barChartSvg = d3
      .create('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('version', '1.1');

    const xScale = d3.scaleBand().range([0, chartWidth]).padding(0.1);

    xScale.domain(Object.keys(dataDict));

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
      .data(dataArray)
      .join('rect')
      .attr('x', (_, i) => margin.left + xScale(Object.keys(dataDict)[i]))
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
      .text(headers['y-axis']);

    // Y-Axis
    barChartSvg
      .append('text')
      .attr('class', 'y-label')
      .attr('text-anchor', 'end')
      .attr('x', -margin.bottom)
      .attr('y', margin.left - 60)
      .attr('dy', '.75em')
      .attr('transform', 'rotate(-90)')
      .text(headers['x-axis']);

    this.shadowRoot?.appendChild(barChartSvg.node());

    // Adding CSS
    let style = document.createElement('link');
    style.setAttribute('rel', 'stylesheet');
    style.setAttribute('href', '../css/style.css');
    this.shadowRoot.append(style);
  }
}

// Define the custom element "bar-chart"
customElements.define('ec-barchart', BarChart);

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
      handleTableMode(this);
    } else if (this.querySelector('dataseries')) {
      handleDataSeriesMode(this);
    } else {
      console.error('Invalid chart structure: No table or data series found');
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
}

// Define the custom element "line-chart"
customElements.define('ec-linechart', LineChart);

/**
 *
 * Utility methods
 *
 *
 */

/**
 * Function, which creates the chart dictionary out of table structure.
 * @returns {{[key: string]: number}}: Return dictionary of data points: key -> string, value -> number.
 */
function getTableDict(
  classObject: LineChart | BarChart
): [{ [key: string]: number }, { [key: string]: string }] {
  const tableElement = classObject.querySelector('table');

  if (!tableElement) {
    throw new Error('<table> element not found');
  }
  let xAxisName: any = 'x-Axis';
  let yAxisName: any = 'y-Axis';

  const xAxisQuerySelector = classObject.querySelector('thead');
  xAxisName =
    xAxisQuerySelector && xAxisQuerySelector.innerHTML !== ''
      ? xAxisQuerySelector.innerHTML
      : xAxisName;
  const yAxisQuerySelector = classObject.querySelector('y-header');
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

  const tableRows = Array.from(tableElement.querySelectorAll('tr'));

  let dataDict: { [key: string]: number } = {};

  tableRows.forEach((row: any) => {
    const cells = Array.from(row.querySelectorAll('td'));
    if (cells.length < 2) {
      throw new Error(
        'Invalid table structure: Each row must have at least two cells'
      );
    }

    const key = (cells[0] as HTMLElement).textContent?.trim();
    const value = (cells[1] as HTMLElement).textContent?.trim();

    if (!key || !value) {
      throw new Error('Invalid table structure: Each cell must have a value');
    }

    if (!isValidNumber(value)) {
      throw new Error(
        `Invalid table structure: Value "${value}" is not a valid number`
      );
    }

    dataDict[key] = parseFloat(value);
  });

  return [dataDict, headerDict];
}

/**
 * Function, which creates the chart dictionary out of data series.
 * @returns [{{[key: string]: number}}, {{[key: string]: string}}]: Return 2 dictionaries:
 * 1. Data points: key -> string, value -> number.
 * 2. X and Y Axis names: key -> string, value -> string.
 */
function getDataSeriesDict(
  classObject
): [{ [key: string]: number }, { [key: string]: string }] {
  const dataSeriesElement = classObject.querySelector('dataseries');
  let xAxisName: any = 'x-Axis';
  let yAxisName: any = 'y-Axis';

  if (!dataSeriesElement) {
    throw new Error('<dataseries> element not found');
  }

  const dataPointElements = dataSeriesElement.querySelectorAll('datapoint');
  if (!dataPointElements.length) {
    throw new Error('No <datapoint> elements found inside <dataseries>');
  }

  const xAxisQuerySelector = classObject.querySelector('x-header');
  xAxisName =
    xAxisQuerySelector && xAxisQuerySelector.innerHTML !== ''
      ? xAxisQuerySelector.innerHTML
      : xAxisName;
  const yAxisQuerySelector = classObject.querySelector('y-header');
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
    } else if (!isValidNumber(dataValues[1])) {
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
function getDictValues(dict: { [key: string]: number }): number[] {
  return Object.values(dict);
}

/**
 * Function setting the chart width.
 * @returns {number}: Return width of chart. Default set to 500.
 */
function setChartWidth(classObject): number {
  let width = 500;
  let containsLettersRegex = /[a-zA-Z]/g;
  let widthAttribute = classObject.getAttribute('width');
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
function setChartHeight(classObject): number {
  let height = 300;
  let containsLettersRegex = /[a-zA-Z]/g;
  let heightAttribute = classObject.getAttribute('height');
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
function isValidNumber(str: string): boolean {
  return !isNaN(parseFloat(str));
}

/** Function for drawing the chart in table mode. */
function handleDataSeriesMode(classObject: LineChart | BarChart): void {
  try {
    const dictionaries = getDataSeriesDict(classObject);
    let width: number = setChartWidth(classObject);
    let height: number = setChartHeight(classObject);
    const attributes = handleCss();
    height = attributes[0];
    width = attributes[1];
    console.log(document.styleSheets);

    if (classObject instanceof BarChart) {
      (classObject as BarChart).drawBarChart(width, height, dictionaries);
    } else if (classObject instanceof LineChart) {
      (classObject as LineChart).drawLineChart(width, height, dictionaries);
    }
  } catch (error) {
    console.error('[Error]', error.message);
  }
}

function handleCss(): number[] {
  const styleSheet = Array.from(document.styleSheets).find((sheet) =>
    sheet.href.includes('style.css')
  ) as CSSStyleSheet;
  let attributes: number[] = [];

  if (styleSheet) {
    const rules = Array.from(styleSheet.cssRules);

    for (const rule of rules) {
      if (rule instanceof CSSStyleRule && rule.selectorText === '.chart1') {
        const styleDeclaration = rule.style;
        const chartWidth: number = parseInt(styleDeclaration.getPropertyValue('--chart-width'), 10);
        const chartHeight: number = parseInt(styleDeclaration.getPropertyValue('--chart-height'), 10);
        attributes.push(chartHeight);
        attributes.push(chartWidth);
      }
    }
  }
  return attributes;
}

/** Function for drawing the chart using data series. */
function handleTableMode(classObject: LineChart | BarChart): void {
  try {
    const dictionaries = getTableDict(classObject);
    const width = setChartWidth(classObject);
    const height = setChartHeight(classObject);

    if (classObject instanceof BarChart) {
      (classObject as BarChart).drawBarChart(width, height, dictionaries);
    } else if (classObject instanceof LineChart) {
      (classObject as LineChart).drawLineChart(width, height, dictionaries);
    }
  } catch (error) {
    console.error('[Error]', error.message);
  }
}
