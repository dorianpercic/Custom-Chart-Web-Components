class BarChart extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const dataSeriesElement = this.querySelector('data-series');
    if (!dataSeriesElement) {
      console.error('[Error] <data-series> element not found');
      return;
    }

    const dataPointElements = dataSeriesElement.querySelectorAll('data-point');
    if (!dataPointElements.length) {
      console.error(
        '[Error] No <data-point> elements found inside <data-series>'
      );
      return;
    }

    const dataDict = this.getChartDict(dataPointElements);
    if (dataDict === null) return null;

    console.log(dataDict);

    let width = this.setChartWidth();
    let height = this.setChartHeight();

    console.log('height = ' + height);
    console.log('width = ' + width);
    this.drawBarChart(width, height, dataDict);
  }

  /**
   *
   * @param {number} width: Width of chart
   * @param {number} height: Height of chart
   * @param {map} dataDict: Array of data points
   */
  drawBarChart(width, height, dataDict) {
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
      .domain([0, d3.max(dataArray)])
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

    // Draw rectangles of bar-chart
    barChartSvg
      .append('g')
      .selectAll('rect')
      .data(
        dataArray.sort((a, b) => {
          return a - b;
        })
      )
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
      .attr('y', height - margin.bottom + 20)
      .text('Custom title');

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

    this.shadowRoot.appendChild(barChartSvg.node());
  }

  /**
   *
   * @param {object} dataPointElements: Datapoints are stored here.
   * @returns {map}: Return map of data points: key -> label(string), value -> value(number).
   */
  getChartDict(dataPointElements) {
    let validDataPoint = true;
    let dataDict = {};

    dataPointElements.forEach((dataPoint) => {
      let dataPointInnerHtml = dataPoint.innerHTML.replace(/\s/g, '');
      let dataValues = dataPointInnerHtml.split(',');
      if (!this.isValidNumber(dataValues[0])) {
        console.error(
          `[Error] <data-point> value ${dataValues[0]} is not a valid number.`
        );
        validDataPoint = false;
        return;
      } else if (!dataValues[1]) {
        console.error(
          `<data-point> value ${dataPointInnerHtml} cannot be parsed.`
        );
        validDataPoint = false;
        return;
      }
      dataDict[dataValues[1]] = parseInt(dataValues[0]);
    });
    if (!validDataPoint) return null;
    return dataDict;
  }

  /**
   *
   * @param {map} dict: Input dictionary
   * @returns {array}: Return array of values of input dictionary.
   */
  getDictValues(dict) {
    const returnArray = [];
    for (let key in dict) {
      returnArray.push(parseInt(dict[key]));
    }
    return returnArray;
  }

  /**
   *
   *
   * @returns {number}: Return width of bar chart. Default set to 1000.
   */
  setChartWidth() {
    let width = 1000;
    let containsLettersRegex = /[a-zA-Z]/g;
    let widthAttribute = this.getAttribute('width');
    if (widthAttribute && !containsLettersRegex.test(widthAttribute)) {
      if (parseInt(widthAttribute) > 10) {
        width = parseInt(widthAttribute);
      }
    }
    return width;
  }

  /**
   *
   *
   * @returns {number}: Return height of bar chart. Default set to 250.
   */
  setChartHeight() {
    let containsLettersRegex = /[a-zA-Z]/g;
    let heighthAttribute = this.getAttribute('height');
    let height = 250;
    if (heighthAttribute && !containsLettersRegex.test(heighthAttribute)) {
      if (parseInt(heighthAttribute) > 10) {
        height = parseInt(heighthAttribute);
      }
    }
    return height;
  }

  /**
   *
   * @param {string} str: Input string to check for.
   * @returns {boolean}: Return true if string contains only numbers, else false.
   */
  isValidNumber(num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
  }
}

customElements.define('bar-chart', BarChart);
