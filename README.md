# EasyCharts: HTML Chart Elements with Web Components

Custom web components for creating SVG charts. The project includes three types of charts: line chart, multiline chart and bar chart.

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
    <!--Other HTML-->
  </tbody>
</table>
```

The first `<td>` inside `<tbody>` represents the label of the data point and the following `<td>` elements are the values of the data point.

The following attributes are present in a `<th>` element:
| Attribute | Description |
|--------------|---------------------------|
| id | Unique id for data series represented in `<th>`. Used for CSS in linechart for the line color. |
| class | Class attribute of data series in `<th>`. Used for CSS in linechart for the line color. |

The following attributes are present in a `<td>` element:
| Attribute | Description |
|--------------|---------------------------|
| id | Unique id for data point represented in `<td>`. Used for CSS in barchart for the bar color. |
| class | Class attribute of data point in `<td>`. Used for CSS in barchart for the bar color. |

#### Data Series

If HTML tables seem too complicated, data series can be used. Basic example:

```html
<dataseries name="dataseries1">
  <datapoint> 1960,3.03 </datapoint>
  <datapoint> 1970,3.70 </datapoint>
  <!--Other HTML-->
</dataseries>
```

The label is on the left of the comma seperator (`,`) and on the right of the comma seperator there is the value of the data point. Furthermore, each data series has to have a name, using the `name` attribute.

The following attributes are present in a `<dataseries>` element:
| Attribute | Description |
|--------------|---------------------------|
| name | Name of the data series. Necessary for the internal data structure. In multiline chart it represents the line name. |
| id | Unique id for data series. Used for CSS in linechart for the line color. |
| class | Class attribute of the data series. Used for CSS in linechart for the line color. |

The following attributes are present in a `<datapoint>` element:
| Attribute | Description |
|--------------|---------------------------|
| id | Unique id for data point. Used for CSS in barchart for the bar color. |
| class | Class attribute of the data point. Used for CSS in barchart for the bar color. |

### Line Chart

To add a single series line chart to the HTML file, using data series, the following structure has to be used:

```html
<ec-linechart chart-title="ChartTitle">
  <x-axis-title>X Axis Title</x-axis-title>
  <y-axis-title>Y Axis Title</y-axis-title>
  <dataseries name="dataseries1">
    <datapoint> Label1,1 </datapoint>
    <datapoint> Label2,2 </datapoint>
    <!--Other HTML-->
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
      <!--Other HTML-->
    </tbody>
  </table>
</ec-linechart>
```

The possible attributes of `<ec-linechart>` are the following:
| Attribute | Description |
|--------------|---------------------------|
| height | Height of the chart. |
| width | Width of the chart. |
| id | Unique id for the chart. Used for setting the height and width of the chart, or specifying if the x axis ticks should be shown, through CSS. |
| class | Class attribute of the chart. Used for setting the height and width of the chart, or specifying if the x axis ticks should be shown, through CSS. |
| chart-title | Title of the chart. |

### Multiline Chart

To create a multiline chart with data series, the following structure has to be used:

```html
<ec-linechart chart-title="ChartTitle">
  <x-axis-title>X Axis Title</x-axis-title>
  <y-axis-title>Y Axis Title</y-axis-title>
  <dataseries name="dataseries1">
    <datapoint> Label1,1 </datapoint>
    <datapoint> Label2,2 </datapoint>
    <!--Other HTML-->
  </dataseries>
  <dataseries name="dataseries2">
    <datapoint> Label1,3 </datapoint>
    <datapoint> Label2,4 </datapoint>
    <!--Other HTML-->
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
      <!--Other HTML-->
    </tbody>
  </table>
</ec-linechart>
```

The attributes of this type of chart are of course the same as in the previous section (see [Line Chart](#line-chart)), as these 2 types are using the same HTML element.

### Bar Chart

To add a bar chart to the HTML file, the structure shown in the Line Chart chapter (see [Line Chart](#line-chart)) has to be used.
but with the

```html
<ec-barchart>
  <!--Other HTML-->
</ec-barchart>
```

HTML tags. To see full list of attributes, please again refer to the [Line Chart](#line-chart) section, because the attributes are exactly the same.

### Styling With CSS

There are 2 ways to style the components in CSS:

- Through id's (`#id`)
- Through class attributes (`.class`)

To see which CSS property belongs to which element look for the tables in the previous chapters.

Table showing all currently available CSS properties:
| Property | Description |
|--------------|---------------------------|
| --color | Set color of data series/data point. |
| --chart-height | Set height of the chart. |
| --chart-width | Set width of the chart. |
| --show-ticks | Flag either `true` or `false` for specifying if x axis ticks should be shown. Default is `true`. |

Example usage:

```html
<!--Other HTML-->
<style>
  .mlinechart1 {
    --chart-width: 500;
    --chart-height: 300;
    --show-ticks: false;
  }
  #samsung {
    --color: blue;
  }
  #apple {
    --color: green;
  }
</style>
<!--Other HTML-->
<ec-linechart class="mlinechart1">
  <table>
    <thead>
      <tr>
        <th id="samsung">Samsung</th>
        <th id="apple">Apple</th>
      </tr>
    </thead>
    <!--Other HTML-->
  </table>
</ec-linechart>
```

### Other HTML Elements

There are 2 additional HTML elements, which are needed for setting the x and y axis titles:

- `<x-axis-title> X Axis Title </x-axis-title>`
- `<y-axis-title> Y Axis Title </y-axis-title>`

These are valid when using the table mode, as well as when using the data series mode.

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

This will execute a series of commands:

1. Copies the `src/examples` folder into `dist/` to provide some examples to the user.
2. Transpiles the source file `easycharts.mts` and it generates the JavaScript file `easycharts.js` into the `dist/` directory. The transpiliation works using Rollup, whereas it bundles the `easycharts.mts` with components of the D3 library.
3. Executes the `npm run serve` command creating a local server serving local project files, enabling the user to avoid the Cross Origin Policy. So the user can e.g. input a external CSS file.

## Project File-Structure

```
EasyCharts
├─ .gitignore
├─ LICENSE
├─ README.md
├─ dist
│  ├─ easycharts.js
│  └─ examples
│     ├─ barchart
│     │  ├─ barchart-table.html
│     │  ├─ easycharts.js
│     │  └─ style.css
│     ├─ linechart
│     │  ├─ easycharts.js
│     │  ├─ linechart-dataseries.html
│     │  ├─ linechart-table.html
│     │  └─ style.css
│     └─ multilinechart
│        ├─ easycharts.js
│        ├─ multilinechart-dataseries.html
│        ├─ multilinechart-table.html
│        └─ style.css
├─ gulpfile.mjs
├─ package-lock.json
├─ package.json
├─ rollup.config.mjs
├─ src
│  ├─ easycharts.mts
│  └─ examples
│     ├─ barchart
│     │  ├─ barchart-table.html
│     │  ├─ easycharts.js
│     │  └─ style.css
│     ├─ linechart
│     │  ├─ easycharts.js
│     │  ├─ linechart-dataseries.html
│     │  ├─ linechart-table.html
│     │  └─ style.css
│     └─ multilinechart
│        ├─ easycharts.js
│        ├─ multilinechart-dataseries.html
│        ├─ multilinechart-table.html
│        └─ style.css
└─ tsconfig.json
```

## License

This project is licensed under the `MIT License`.
