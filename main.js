//--> Main data source
const url =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

//--> Constants
const width = 1000;
const height = 620;

const svg = d3
  .select(".content")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

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
  const tile = svg
    .selectAll("g")
    .data(root.leaves())
    .enter()
    .append("g")
    .attr("transform", d => `translate(${d.x0}, ${d.y0})`);

  tile
    .append("rect")
    .classed("tile", true)
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0)
    .attr("fill", d => colorScale(d.data.category))
    .attr("data-name", d => d.data.name)
    .attr("data-category", d => d.data.category)
    .attr("data-value", d => d.data.value);

  //--> Add movie titles
  tile
    .append("text")
    .classed("movie-title", true)
    .selectAll("tspan")
    .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .enter()
    .append("tspan")
    .attr("x", 5)
    .attr("y", (d, i) => 15 + 10 * i)
    .text(d => d);
});
