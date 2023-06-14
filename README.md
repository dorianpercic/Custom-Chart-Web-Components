# EasyCharts: HTML Chart Elements with Web Components

Custom web components for creating SVG charts. The project includes two types of charts: line chart and bar chart.

## Usage

To use the custom web components in your HTML files, include the compiled JavaScript files, located in the ```dist/``` directory, in your project and use the custom elements in your HTML markup.

### Line Chart

To add a line chart to your HTML file, use the following custom element:

```html 
<ec-linechart></ec-linechart>
```

### Bar Chart

To add a bar chart to your HTML file, use the following custom element:

```html
<ec-barchart></ec-barchart>
```

## For Developers

### Installation

To install the custom EasyCharts web components, follow these steps:

1. Clone or download the project repository.
2. Install and use the minimum NodeJS version ```v14.18.1 (npm v6.14.15)```.
3. Install the required dependencies by running the following command in the project root directory:

>```npm install```

### Building the Project

The project uses Gulp as a build tool. To build the project, run the following command in the project root directory:

>```npx gulp```

This will transpile the source files and generate the compiled JavaScript files for the line chart and bar chart. They can then be located in the repsective folder in the ```dist/``` directory.

## File Structure

The source files for the web components are located in the `src/` directory, named ```easycharts.ts```. The compiled JavaScript files are generated in the dist directory.


```
EasyCharts
├─ gulpfile.js
├─ package-lock.json
├─ package.json
├─ rollup.config.mjs
├─ dist
├─ src
│  ├─ barchart.ts
│  ├─ css
│  │  └─ style.css
│  ├─ data
│  │  └─ fmi.csv
│  ├─ html
│  │  ├─ barchart-table.html
│  │  └─ linechart-dataseries.html
│  ├─ libs
│  │  ├─ d3.js
│  │  └─ d3.min.js
│  └─ linechart.ts
└─ tsconfig.json
```

## License

This project is licensed under the ```MIT License```.
