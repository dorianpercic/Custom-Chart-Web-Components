import {
  scaleBand,
  scaleLinear,
  scalePoint,
  axisBottom,
  axisLeft,
  create,
  max,
  line,
} from 'd3';

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
    let width = setChartWidth(this);
    let height = setChartHeight(this);
    const attributes = handleCss(this);
    if (attributes.length !== 0) {
      height = attributes[0];
      width = attributes[1];
    }

    if (this.querySelector('table')) {
      handleTableMode(this, width, height);
    } else if (this.querySelector('dataseries')) {
      handleDataSeriesMode(this, width, height);
    } else {
      console.error(
        '[Error] Invalid chart structure: No table or data series found'
      );
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
    dictionaries: [
      { [key: string]: { [innerKey: string]: number } },
      { [key: string]: string }
    ]
  ): void {
    const margin = {
      top: height * 0.2,
      bottom: height * 0.2,
      left: width * 0.2,
      right: width * 0.2,
    };
    const dataDict = dictionaries[0];
    const headers = dictionaries[1];
    const dataSeriesKey = Object.keys(dataDict)[0];
    const dataArray = getDictValues(dataDict[dataSeriesKey]);

    console.log(dataArray);
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const barChartSvg = create('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('version', '1.1');

    const xScale = scaleBand().range([0, chartWidth]).padding(0.1);

    xScale.domain(Object.keys(dataDict[dataSeriesKey]));

    const yScale = scaleLinear()
      .domain([0, max(dataArray) || 0])
      .range([chartHeight, 0]);

    const xAxis = axisBottom(xScale);
    const yAxis = axisLeft(yScale).ticks(5);

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
      .attr(
        'x',
        (_, i) => margin.left + xScale(Object.keys(dataDict[dataSeriesKey])[i])
      )
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
      .text(headers['x-axis']);

    // Y-Axis
    barChartSvg
      .append('text')
      .attr('class', 'y-label')
      .attr('text-anchor', 'end')
      .attr('x', -margin.bottom)
      .attr('y', margin.left - 60)
      .attr('dy', '.75em')
      .attr('transform', 'rotate(-90)')
      .text(headers['y-axis']);

    this.shadowRoot?.appendChild(barChartSvg.node());
    /*
    let style = document.createElement('link');
    style.setAttribute('rel', 'stylesheet');
    style.setAttribute('href', '../css/style.css');
    this.shadowRoot.append(style);*/
  }
}

// Define the custom element "bar-chart"
customElements.define('ec-barchart', BarChart);

/** Custom type for defining datapoints for linechart */
type dataPoint = {
  x: string;
  y: number;
};

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
    let width = setChartWidth(this);
    let height = setChartHeight(this);
    const attributes = handleCss(this);
    if (attributes.length !== 0) {
      height = attributes[0];
      width = attributes[1];
    }

    if (this.querySelector('table')) {
      handleTableMode(this, width, height);
    } else if (this.querySelector('dataseries')) {
      handleDataSeriesMode(this, width, height);
    } else {
      console.error(
        '[Error] Invalid chart structure: No table or data series found'
      );
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
    dictionaries: [
      { [key: string]: { [innerKey: string]: number } },
      { [key: string]: string }
    ]
  ): void {
    const margin = {
      top: height * 0.2,
      bottom: height * 0.2,
      left: width * 0.2,
      right: width * 0.2,
    };
    const data = dictionaries[0];
    const headers = dictionaries[1];

    const xScale = scalePoint()
      .domain(
        Object.keys(data).reduce((labels, seriesKey) => {
          const seriesLabels = Object.keys(data[seriesKey]);
          return [...labels, ...seriesLabels];
        }, [])
      )
      .range([margin.left, width - margin.right]);

    const yScale = scaleLinear()
      .domain([
        0,
        max(Object.values(data).map((line) => max(Object.values(line)))),
      ])
      .range([height - margin.bottom, margin.top]);

    const lineChartSvg = create('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('version', '1.1');

    const lineGenerator = line<{ x: string; y: number }>()
      .x((d) => xScale(d.x) || 0)
      .y((d) => yScale(d.y) || 0);
    Object.entries(data).forEach(([key, lineData]) => {
      lineChartSvg
        .append('path')
        .datum(Object.entries(lineData).map(([x, y]) => ({ x, y })))
        .attr('d', lineGenerator)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue');
    });

    lineChartSvg
      .append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(axisBottom(xScale));

    lineChartSvg
      .append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(axisLeft(yScale));

    // x label
    lineChartSvg
      .append('text')
      .attr('class', 'x-label')
      .attr('text-anchor', 'end')
      .attr('x', width - margin.right)
      .attr('y', height - margin.bottom + 40)
      .text(headers['x-axis']);

    // y label
    lineChartSvg
      .append('text')
      .attr('class', 'y-label')
      .attr('text-anchor', 'end')
      .attr('x', -margin.bottom)
      .attr('y', margin.left - 60)
      .attr('dy', '.75em')
      .attr('transform', 'rotate(-90)')
      .text(headers['y-axis']);

    this.shadowRoot?.appendChild(lineChartSvg.node());
  }
}
// Define the custom element "line-chart"
customElements.define('ec-linechart', LineChart);

/**
 *
 * Utility Functions
 *
 *
 */

/**
 * Function, which creates the chart dictionary out of table structure.
 * @param {classObject: LineChart | BarChart}: Class object of respective chart.
 * @returns {{[key: string]: number}}: Return dictionary of data points: key -> string, value -> number.
 */
function getTableDict(
  classObject: LineChart | BarChart
): [
  { [key: string]: { [innerKey: string]: number } },
  { [key: string]: string }
] {
  const tableElement = classObject.querySelector('table');

  if (!tableElement) {
    throw new Error('<table> element not found');
  }

  // Set x and y axis using thead
  let xAxisName: any = 'x-Axis';
  let yAxisName: any = 'y-Axis';
  let headerDict: { [key: string]: string } = {
    'x-axis': xAxisName,
    'y-axis': yAxisName,
  };
  const axisTitleQuerySelector = classObject.querySelector('thead');
  if (axisTitleQuerySelector) {
    const trElement = axisTitleQuerySelector.querySelectorAll('tr');
    if (trElement) {
      let thElement = trElement[0].querySelectorAll('th');
      console.log(thElement);
      thElement.forEach((value, i) => {
        if (thElement) {
          switch (i) {
            case 0: {
              xAxisName = value.textContent?.trim();
              break;
            }
            case 1:
              yAxisName = value.textContent?.trim();
              break;
          }
        }
      });
    }
  }

  headerDict['x-axis'] = xAxisName;
  headerDict['y-axis'] = yAxisName;

  const body = tableElement.querySelector('tbody');
  const tableRows = body.querySelectorAll('tr');

  let dataDict: { [key: string]: { [innerKey: string]: number } } = {};
  let tempDict: { [innerKey: string]: number } = {};
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

    tempDict[key] = parseFloat(value);
  });
  // Setting dummy dataseries name,
  // because in table mode only single data series possible
  dataDict['dataseries1'] = tempDict;

  return [dataDict, headerDict];
}

/**
 * Function, which creates the chart dictionary out of data series.
 * @param {classObject: LineChart | BarChart}: Class object of respective chart.
 * @returns [{{[key: string]: number}}, {{[key: string]: string}}]: Return 2 dictionaries:
 * 1. Data points: key -> string, value -> number.
 * 2. X and Y Axis names: key -> string, value -> string.
 */
function getDataSeriesDict(
  classObject
): [
  { [key: string]: { [innerKey: string]: number } },
  { [key: string]: string }
] {
  const dataSeriesElement = classObject.querySelectorAll('dataseries');

  if (!dataSeriesElement) {
    throw new Error('<dataseries> element not found');
  }
  // Set x and y axis
  let xAxisName: string = 'x-Axis';
  let yAxisName: string = 'y-Axis';
  const xAxisQuerySelector = classObject.querySelector('x-axis-title');
  xAxisName =
    xAxisQuerySelector && xAxisQuerySelector.innerHTML !== ''
      ? xAxisQuerySelector.innerHTML
      : xAxisName;
  const yAxisQuerySelector = classObject.querySelector('y-axis-title');
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
  let dataDict: { [key: string]: { [innerKey: string]: number } } = {};

  dataSeriesElement.forEach(function (value) {
    const dataPointElements = value.querySelectorAll('datapoint');
    console.log(dataSeriesElement);
    let dataSeriesName: string = value.getAttribute('name');
    if (!dataSeriesName) {
      throw new Error('No "name" attribute in dataseries');
    }
    if (!dataPointElements.length) {
      throw new Error('No <datapoint> elements found inside <dataseries>');
    }
    let dataPointsDict = {};
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
      dataPointsDict[dataValues[0]] = parseFloat(dataValues[1]);
    });
    dataDict[dataSeriesName] = dataPointsDict;
  });

  console.log(dataDict);
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
 * @param {classObject: LineChart | BarChart}: Class object of respective chart.
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
 * @param {classObject: LineChart | BarChart}: Class object of respective chart.
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

/** Function for drawing the chart in dataseries mode.
 * @param {classObject: LineChart | BarChart}: Class object of respective chart.
 */
function handleDataSeriesMode(
  classObject: LineChart | BarChart,
  chartWidth: number,
  chartHeight: number
): void {
  try {
    const dictionaries = getDataSeriesDict(classObject);

    if (classObject instanceof BarChart) {
      (classObject as BarChart).drawBarChart(
        chartWidth,
        chartHeight,
        dictionaries
      );
    } else if (classObject instanceof LineChart) {
      (classObject as LineChart).drawLineChart(
        chartWidth,
        chartHeight,
        dictionaries
      );
    }
  } catch (error) {
    console.error('[Error]', error.message);
  }
}

/**
 * Function checking if input is a valid number.
 * @param {classObject: LineChart | BarChart}: Class object of respective chart.
 * @returns {number[]}: Return array of numbers: [0] -> height, [1] -> width.
 */
function handleCss(classObject: LineChart | BarChart): number[] {
  const styleSheet = Array.from(document.styleSheets).find(
    (sheet) => sheet.ownerNode instanceof HTMLStyleElement
  ) as CSSStyleSheet;
  let attributes: number[] = [];
  if (styleSheet) {
    const rules = Array.from(styleSheet.cssRules);
    let classAttr = classObject.getAttribute('class');
    for (const rule of rules) {
      if (
        rule instanceof CSSStyleRule &&
        rule.selectorText === `.${classAttr}`
      ) {
        const styleDeclaration = rule.style;
        const chartWidth: number = parseInt(
          styleDeclaration.getPropertyValue('--chart-width'),
          10
        );
        const chartHeight: number = parseInt(
          styleDeclaration.getPropertyValue('--chart-height'),
          10
        );
        attributes.push(chartHeight);
        attributes.push(chartWidth);
      }
    }
  }
  return attributes;
}

/** Function for drawing the chart using HTML table.
 * @param {classObject: LineChart | BarChart}: Class object of respective chart.
 */
function handleTableMode(
  classObject: LineChart | BarChart,
  chartWidth: number,
  chartHeight: number
): void {
  try {
    const dictionaries = getTableDict(classObject);

    if (classObject instanceof BarChart) {
      (classObject as BarChart).drawBarChart(
        chartWidth,
        chartHeight,
        dictionaries
      );
    } else if (classObject instanceof LineChart) {
      (classObject as LineChart).drawLineChart(
        chartWidth,
        chartHeight,
        dictionaries
      );
    }
  } catch (error) {
    console.error('[Error]', error.message);
  }
}
