//--> Main data source
const url =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

//--> Constants
const width = 1000;
const height = 660;
const fontSize = 11;

const svg = d3
  .select(".content")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const tooltip = d3.select(".content").append("div").attr("id", "tooltip");

//--> Helper functions
const formatSales = d3.format(",d");

const wrapText = selection => {
  selection.each(function () {
    const node = d3.select(this);
    const rectWidth = +node.attr("data-width");
    let word;
    const words = node.text().split(" ").reverse();
    let line = [];
    const x = node.attr("x");
    const y = node.attr("y");
    let tspan = node.text("").append("tspan").attr("x", x).attr("y", y);
    let lineNumber = 0;
    while (words.length > 0) {
      word = words.pop();
      line.push(word);
      tspan.text(line.join(" "));
      const tspanLength = tspan.node().getComputedTextLength();
      if (tspanLength > rectWidth && line.length !== 1) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = addTspan(word);
      }
    }

    addTspan(words.pop());

    function addTspan(text) {
      lineNumber += 1;
      return node
        .append("tspan")
        .attr("x", x)
        .attr("y", y)
        .attr("dy", `${lineNumber * fontSize}px`)
        .text(text);
    }
  });
};

function showTooltip(e) {
  const genre = this.getAttribute("data-category");
  const title = this.getAttribute("data-name");
  const sales = this.getAttribute("data-value");

  const titleLine = `<h3>${title}</h3>`;
  const genreLine = `<p>${genre}</p>`;
  const salesLine = `<p>$${formatSales(sales)}</p>`;
  const content = `<div>${titleLine}${genreLine}${salesLine}</div>`;

  tooltip
    .style("opacity", 0.9)
    .style("left", `${e.clientX + 10}px`)
    .style("top", `${e.clientY + 5}px`)
    .attr("data-value", sales)
    .html(content);
}

const hideTooltip = e => {
  tooltip.style("opacity", 0);
};

//--> Add description
d3.select("header")
  .append("h4")
  .text("Top 100 Best-Selling Movies")
  .attr("id", "description");

//--> Load & display data
d3.json(url).then(data => {
  const hierarchy = d3
    .hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value);

  const treemap = d3.treemap().size([width, height]).padding(1);

  const root = treemap(hierarchy);

  //--> Color scale
  const categories = data.children.map(d => d.name);
  const colorScale = d3
    .scaleOrdinal()
    .domain(categories)
    .range(d3.schemeCategory10);

  //--> Show rectangles and color them accordingly
  svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0)
    .attr("fill", d => colorScale(d.data.category))
    .attr("class", "tile")
    .attr("data-name", d => d.data.name)
    .attr("data-category", d => d.data.category)
    .attr("data-value", d => d.data.value)
    .on("mouseover", showTooltip)
    .on("mouseout", hideTooltip);

  //--> Add movie titles
  svg
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
    .classed("movie-title", true)
    .attr("data-width", d => d.x1 - d.x0 - 5)
    .attr("font-size", `${fontSize}px`)
    .attr("x", d => d.x0 + 5)
    .attr("y", d => d.y0 + 15)
    .text(d => d.data.name)
    .call(wrapText);
});
