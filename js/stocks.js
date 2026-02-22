// ============================================================================
// STOCK PRICE VISUALIZATION ASSIGNMENT
// ============================================================================
// Your task: Complete this script to create a multi-line chart showing
// stock prices for Apple (AAPL), Google (GOOG), and Amazon (AMZN)
// 
// Follow the TODO comments and refer to demo.js Section 5 for guidance
// ============================================================================


// ============================================================================
// DATA LOADING
// ============================================================================
// Load CSV files for three stocks in parallel
// Pattern: d3.csv("filename").then(data => ({name: "SYMBOL", values: data}))

let stocks = await Promise.all([
    d3.csv("data/AAPL.csv").then(data => ({ name: "AAPL", values: data })),
    // TODO: Load GOOG.csv with name "GOOG"
    d3.csv("data/GOOG.csv").then(data => ({ name: "GOOG", values: data })),
    // TODO: Load AMZN.csv with name "AMZN"
    d3.csv("data/AMZN.csv").then(data => ({ name: "AMZN", values: data })), 
    d3.csv("data/IBM.csv").then(data => ({ name: "IBM", values: data })),
    d3.csv("data/MSFT.csv").then(data => ({ name: "MSFT", values: data }))
]);

console.log("Loaded stocks:", stocks);


// ============================================================================
// DATA PROCESSING
// ============================================================================
// Convert string values to proper types (dates and numbers)
// Remember: CSV data loads as strings!

stocks.forEach(stock => {
    stock.values.forEach(d => {
        // TODO: Convert d.Date from string to Date object
        d.Date = new Date(d.Date);
        // Hint: new Date(d.Date)
        
        // TODO: Convert d.Close from string to number
        // Hint: Use the + operator like +d.Close
        d.Close = +d.Close;

        // TODO: Convert these additional fields to numbers
        // d.Open, d.High, d.Low, d.Volume
        d.Open = +d.Open;
        d.High = +d.High;
        d.Low = +d.Low;
        d.Volume = +d.Volume;
    });

    // TODO: Sort stock.values by date (oldest to newest)
    stock.values.sort((a, b) => a.Date - b.Date);
});

console.log("Processed first stock:", stocks[0].values[0]);


// ============================================================================
// CHART DIMENSIONS
// ============================================================================
// Set up the size and margins for the chart
// This is provided - the margin convention is standard D3 practice

const margin = { top: 50, right: 160, bottom: 50, left: 100 };
const width = 1000 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;


// ============================================================================
// SVG SETUP
// ============================================================================
// Create the SVG container and add a group for margins
// This is provided - focus on the scales and drawing instead

const svg = d3.select('#chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);


// ============================================================================
// CREATE SCALES
// ============================================================================
// Scales map data values to pixel positions

// Get all data points from all stocks (we need this for the domains)
const allValues = stocks.flatMap(s => s.values);

// X Scale - Maps dates to horizontal positions
// TODO: Create a time scale using d3.scaleUtc()
const xScale = d3.scaleUtc()
  .domain([
    d3.min(stocks, s => d3.min(s.values, d => d.Date)),
    d3.max(stocks, s => d3.max(s.values, d => d.Date))
  ])
  .range([0, width]);
// Hint: Look at demo.js Section 5 for the pattern

// Y Scale - Maps prices to vertical positions
// TODO: Create a linear scale using d3.scaleLinear()
const y = d3.scaleLinear()
    .domain([
        // TODO: Get minimum Close price from all stocks
    d3.min(stocks, s => d3.min(s.values, d => d.Close)), 
        // TODO: Get maximum Close price from all stocks
    d3.max(stocks, s => d3.max(s.values, d => d.Close))
    ])
    .range([height, 0]);

// Color Scale - Maps stock names to colors
// TODO: Create an ordinal color scale
// Hint: d3.scaleOrdinal(d3.schemeCategory10).domain(mapping goes here)
const color = d3.scaleOrdinal(d3.schemeCategory10)
    .domain(stocks.map(s => s.name));


// ============================================================================
// ADD AXES
// ============================================================================
// Create and position the x and y axes

// X Axis - Shows years along the bottom
const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.timeFormat("%Y")); // Format ticks to show only years

svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis)
    .selectAll('text')
    .style('font-size', '12px');

// Y Axis - Shows prices along the left side
const yAxis = d3.axisLeft(y)
    .tickFormat(d => `$${d.toLocaleString()}`); // Format ticks to show $ sign

svg.append('g')
    .attr('class', 'y-axis')
    .call(yAxis)
    .selectAll('text')
    .style('font-size', '12px');


// ============================================================================
// DRAW LINES
// ============================================================================
// Create a line for each stock

// TODO: Create a line generator using d3.line()
const line = d3.line()
    .x(d => xScale(d.Date))
    .y(d => y(d.Close))
    .curve(d3.curveMonotoneX); 

// TODO: Loop through each stock and draw a line
stocks.forEach(stock => {
    // TODO: Append a 'path' element
    svg.append('path')
    // TODO: Bind the stock.values data using .datum(stock.values)
    .datum(stock.values)
    // TODO: Set attributes:
    .attr('fill', 'none') // No fill under the line
    .attr('stroke', color(stock.name)) // Use color scale for stroke
    .attr('stroke-width', 2) // Set stroke width
    .attr('d', line); // Use line generator to create path
    //   - fill: 'none' (we don't want to fill under the line)
    //   - stroke: use the color scale to get the color for this stock 
    //   - stroke-width: 2
    //   - d: line (this uses the line generator to create the path)
});

// ============================================================================
// ADD LABELS
// ============================================================================
// Add title and axis labels to make the chart readable

// Chart Title
// TODO: Add a text element for the title
svg.append('text')
    .attr('class', 'chart-title')
    .attr('x',width/2)
    .attr('y', 10)
    .attr('text-anchor', 'middle')
    .style('font-size', '18px')
    .style('font-weight', 'bold')
    .text("Stock Prices Over Time");

// X Axis Label
// TODO: Add a label below the x-axis
svg.append('text')
    .attr('class', 'x-axis-label')
    .attr('x', width/2)
    .attr('y', height+40) // Position it below the x-axis 
    .attr('text-anchor', 'middle')
    .style('font-size', '14px')
    .text("Date");

// Y Axis Label
// TODO: Add a label to the left of the y-axis (rotated)
svg.append('text')
    .attr('class', 'y-axis-label')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height/2)
    .attr('y', -40) // Position it to the left of the y-axis
    .attr('text-anchor', 'middle')
    .style('font-size', '14px')
    .text("Price ($)");


// ============================================================================
// ADD LEGEND
// ============================================================================
// Create a legend showing which color represents which stock

const legend = svg.append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(${width + 20}, 0)`);

// TODO: For each stock, create a legend entry
stocks.forEach((stock, i) => {
    const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 20})`);

    // TODO: Add a colored line showing the stock's color
    legendRow.append('line')
        .attr('x1',0)
        .attr('y1', 10)
        .attr('x2', 20)
        .attr('y2', 10)
        .attr('stroke', color(stock.name))
        .attr('stroke-width', 2);

    // TODO: Add text label with the stock name
    legendRow.append('text')
        .attr('x', 25)
        .attr('y', 14)
        .attr('text-anchor', 'start')
        .style('font-size', '12px')
        .text(stock.name);
});

// ============================================================================
// BONUS
// ============================================================================

/**
 * Edit the code above to also add IBM and MSFT stock price visualization
 */


