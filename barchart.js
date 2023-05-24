class BarChart extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    import('https://cdn.skypack.dev/d3@7.1.1').then((d3) => {
      const data = [1, 2, 4, 34, 40, 60];
      const labels = [
        'Label a',
        'Label b',
        'Label c',
        'Label d',
        'Label e',
        'Label f',
      ];
      const width = 200;
      const height = 100;
      const margin = { top: 40, bottom: 40, left: 30, right: 30 };
      const barChartSvg = d3
        .create('svg')
        .attr('viewBox', [0, 0, width, height])
        .attr('version', '1.1');

      const xAxis = d3
        .scaleBand()
        .domain(d3.range(data.length))
        .range([margin.left, width - margin.right])
        .padding(0.1);

      const yAxis = d3
        .scaleLinear()
        .domain([0, d3.max(data)])
        .range([height - margin.bottom, margin.top]);

      barChartSvg
        .append('g')
        .selectAll('rect')
        .data(data.sort(comparator))
        .join('rect')
        .attr('x', (_, i) => xAxis(i))
        .attr('y', (d) => yAxis(d))
        .attr('width', xAxis.bandwidth())
        .attr('height', (d) => yAxis(0) - yAxis(d))
        .attr('fill', 'red');

      this.shadowRoot.appendChild(barChartSvg.node());
    });
  }
}

function comparator(a, b) {
  return a - b;
}

customElements.define('bar-chart', BarChart);
