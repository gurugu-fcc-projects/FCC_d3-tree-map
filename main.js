//--> Main data source
const url =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

//--> Constants
const width = 1000;
const height = 800;

const svg = d3
  .select(".content")
  .append("svg")
  .attr("viewbox", [0, 0, width, height]);

//--> Load & display data
d3.json(url).then(data => {
  console.log(data);
});
