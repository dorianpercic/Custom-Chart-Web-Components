# EasyCharts: HTML Chart Elements with Web Components

Custom web components for creating SVG charts. The project includes two types of charts: line chart, multiline chart and bar chart.

## Usage

To use the custom web components in HTML files, the transpiled JavaScript file named `easycharts.js`, located in the `dist/` directory, has to be included in the HTML file. There are multiple examples in the `examples/` directory of `dist/`.

### Data Input Modes

There are basically 2 modes, which are accepted for adding chart data for both of the charts and in the following they get discussed in more detail.

#### HTML Table

EasyCharts offers a way to input data in HTML table format inside the bar or line chart. Basic example:

```html
<table>
  <thead>
    <tr>
      <th>Party Results</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>SPÖ</td>
      <td>29.29</td>
    </tr>
    <tr>
      <td>ÖVP</td>
      <td>28.45</td>
    </tr>
    [...]
  </tbody>
</table>
```

The first `<td>` inside `<tbody>` represents the label of the datapoint and the following `<td>` elements are the values of the datapoint.

#### Dataseries

If HTML tables are too complicated, dataseries can be used. Basic example:

```html
<dataseries name="dataseries1">
  <datapoint> 1960,3.03 </datapoint>
  <datapoint> 1970,3.70 </datapoint>
  [...]
</dataseries>
```

The label is on the left of the comma seperator (`,`) and on the right of the comma seperator there is the value of the datapoint. Furthermore, each dataseries has to have a name, using the `name` attribute.

### Line Chart

To add a single series line chart to the HTML file, using dataseries, the following structure has to be used:

```html
<ec-linechart chart-title="ChartTitle">
  <x-axis-title>X Axis Title</x-axis-title>
  <y-axis-title>Y Axis Title</y-axis-title>
  <dataseries name="dataseries1">
    <datapoint> Label1,1 </datapoint>
    <datapoint> Label2,2 </datapoint>
    [...]
  </dataseries>
</ec-linechart>
```

To add a single series line chart to the HTML file, using HTML table format, the following structure has to be used:

```html
<ec-linechart chart-title="ChartTitle">
  <x-axis-title>X Axis Title</x-axis-title>
  <y-axis-title>Y Axis Title</y-axis-title>
  <table>
    <thead>
      <tr>
        <th>dataseries1</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Label1</td>
        <td>1</td>
      </tr>
      <tr>
        <td>Label2</td>
        <td>2</td>
      </tr>
      [...]
    </tbody>
  </table>
</ec-linechart>
```

### Multiline Chart

To create a multiline chart with dataseries, the following structure has to be used:

```html
<ec-linechart chart-title="ChartTitle">
  <x-axis-title>X Axis Title</x-axis-title>
  <y-axis-title>Y Axis Title</y-axis-title>
  <dataseries name="dataseries1">
    <datapoint> Label1,1 </datapoint>
    <datapoint> Label2,2 </datapoint>
    [...]
  </dataseries>
  <dataseries name="dataseries2">
    <datapoint> Label1,3 </datapoint>
    <datapoint> Label2,4 </datapoint>
    [...]
  </dataseries>
</ec-linechart>
```

To create a multiline chart with HTML table format, the following structure has to be used:

```html
<ec-linechart chart-title="ChartTitle">
  <x-axis-title>X Axis Title</x-axis-title>
  <y-axis-title>Y Axis Title</y-axis-title>
  <table>
    <thead>
      <tr>
        <th>dataseries1</th>
        <th>dataseries2</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Label1</td>
        <td>1</td>
        <td>3</td>
      </tr>
      <tr>
        <td>Label2</td>
        <td>2</td>
        <td>4</td>
      </tr>
      [...]
    </tbody>
  </table>
</ec-linechart>
```

### Bar Chart

To add a bar chart to the HTML file, the structure shown in the Line Chart chapter (see [Line Chart](#line-chart)) has to be used.
but with the

```html
<ec-barchart> [...] </ec-barchart>
```

HTML tags.

## For Developers

### Installation

To install the custom EasyCharts web components, follow these steps:

1. Clone or download the project repository.
2. Install and use the minimum NodeJS version `v14.18.1 (npm v6.14.15)`.
3. Install the required dependencies by running the following command in the project root directory:

> `npm install`

### Building the Project

The project uses Gulp as a build tool. To build the project, run the following command in the project root directory:

> `npx gulp`

This will transpile the source files and generate the compiled JavaScript files for the line chart and bar chart. They can then be located in the repsective folder in the `dist/` directory.

## File Structure

The source files for the web components are located in the `src/` directory, named `easycharts.ts`. The compiled JavaScript files are generated in the dist directory.

```

```

## License

This project is licensed under the `MIT License`.
