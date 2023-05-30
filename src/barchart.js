class BarChart extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    if (this.querySelector('table')) {
      this.handleTableMode();
    } else if (this.querySelector('data-series')) {
      this.handleDataSeriesMode();
    } else {
      console.error('Invalid structure: No table or data series found');
    }
  }

  /**
   * Function for drawing the bar chart usind data series.
   *
   *
   *
   */
  handleTableMode() {
    try {
      const dataDict = this.getTableDict();
      const width = this.setChartWidth();
      const height = this.setChartHeight();
      this.drawBarChart(width, height, dataDict);
    } catch (error) {
      console.error('[Error]', error.message);
    }
  }

  /**
   * Function for drawing the bar chart in table mode.
   *
   *
   *
   */
  handleDataSeriesMode() {
    try {
      const dataDict = this.getDataSeriesDict();
      const width = this.setChartWidth();
      const height = this.setChartHeight();
      this.drawBarChart(width, height, dataDict);
    } catch (error) {
      console.error('[Error]', error.message);
    }
  }

  /**
   * Function drawing the bar chart and adding to the Shadow DOM.
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
   * Function, which creates the chart dictionary.
   * @param {object} dataPointElements: Datapoints are stored here.
   * @returns {map}: Return map of data points: key -> label(string), value -> value(number).
   */
  getDataSeriesDict() {
    const isValidStructure = Array.from(this.children).every(
      (child) =>
        child.nodeName.toLowerCase() === 'data-series' &&
        Array.from(child.children).every(
          (grandchild) => grandchild.nodeName.toLowerCase() === 'data-point'
        )
    );

    if (!isValidStructure) {
      throw new Error(
        'Invalid structure: The correct structure is: <bar-chart> <data-series> <data-point>...</data-point> </data-series> </bar-chart>'
      );
    }

    const dataSeriesElement = this.querySelector('data-series');

    if (!dataSeriesElement) {
      throw new Error('<data-series> element not found');
    }

    const dataPointElements = dataSeriesElement.querySelectorAll('data-point');
    if (!dataPointElements.length) {
      throw new Error('No <data-point> elements found inside <data-series>');
    }
    let dataDict = {};

    dataPointElements.forEach((dataPoint) => {
      let dataPointInnerHtml = dataPoint.innerHTML.replace(/\s/g, '');
      let dataValues = dataPointInnerHtml.split(',');
      if (!dataValues[0] || !dataValues[1]) {
        throw new Error(
          `<data-point> value ${dataPointInnerHtml}cannot be parsed`
        );
      } else if (!this.isValidNumber(dataValues[0])) {
        throw new Error(
          `<data-point> value ${dataValues[0]}is not a valid input for bar chart`
        );
      }
      dataDict[dataValues[1]] = parseFloat(dataValues[0]);
    });
    return dataDict;
  }

  /**
   * Function returning an array of the values of the input dictionary.
   * @param {map} dict: Input dictionary
   * @returns {array}: Return array of values of input dictionary.
   */
  getDictValues(dict) {
    const returnArray = [];
    for (let key in dict) {
      returnArray.push(parseFloat(dict[key]));
    }
    return returnArray;
  }

  /**
   * Function setting the chart width.
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
   * Function setting the chart height.
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
   * Function, which cheks if the input number is a valid number.
   * @param {string} str: Input string to check for.
   * @returns {boolean}: Return true if string contains only numbers, else false.
   */
  isValidNumber(num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
  }

  getTableDict() {
    return null;
  }
}

customElements.define('bar-chart', BarChart);
