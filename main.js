//--> Main data source
const url =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

//--> Load & display data
d3.json(url).then(data => {
  console.log(data);
});
