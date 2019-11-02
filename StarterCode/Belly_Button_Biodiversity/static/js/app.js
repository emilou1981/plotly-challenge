function buildMetadata(sample) {

  // Use `d3.json` to fetch the metadata for a sample
  var metaData = `/metadata/${sample}`;
  
  // d3.json(url).then(function(data) {
  //   console.log(data);
  // });

  // Use d3 to select the panel with id of `#sample-metadata`
  d3.json(metaData).then(function (sample) {
    var sampleMetaData = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    sampleMetaData.html("");
 

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    

    Object.entries(sample).forEach(function ([key, value]) {
      console.log(key, value);
      // Append a cell to the row for each value
      // in the weather report object
      var row = sampleMetaData.append("p");
      row.text(`${key}:${value}`);
    })
  });
}



// // BONUS: Build the Gauge Chart
// buildGauge(data.WFREQ);
// var data = [
// 	{
// 		domain: { x: [0, 1], y: [0, 1] },
// 		value: 270,
// 		title: { text: "Speed" },
// 		type: "indicator",
// 		mode: "gauge+number"
// 	}
// ];

// var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
// Plotly.newPlot(gd, data, layout);

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var plottingData = `/samples/${sample}`;
  // @TODO: Build a Bubble Chart using the sample data
  d3.json(plottingData).then(function (data) {

    // Grab values from the data json object to build the plots
    var xAxis = data.otu_ids;
    var yAxis = data.sample_values;
    var size = data.sample_values;
    var color = data.otu_ids;
    var labels = data.otu_labels;


    var bubble = {
      x: xAxis,
      y: yAxis,
      labels: labels,
      mode: "markers",
      marker: {
        size: size,
        color: color
      }
    };

    var bubbleData = [bubble];
    var layout = {
      xaxis: { title: "OTU ID"}
    };
    Plotly.newPlot("bubble", bubbleData, layout);

    // @TODO: Build a Pie Chart


    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

//     // Slices first two names
// const left = names.slice(0, 2);
// console.log(left);

    // d3.json(plottingData).then(function(data){
      console.log(data);
      var sampleValues = data.sample_values.slice(0,10);
      var labels = data.otu_ids.slice(0,10);
      var display = data.otu_labels.slice(0,10);


      var pie_chart = [{
        values: sampleValues,
        labels: labels,
        hovertext: display,
        type: "pie"
      }];
      Plotly.newPlot('pie',pie_chart);
    });
  // });
};



  function init() {
      // Grab a reference to the dropdown select element
      var selector = d3.select("#selDataset");

      // Use the list of sample names to populate the select options
      d3.json("/names").then((sampleNames) => {
        sampleNames.forEach((sample) => {
          selector
            .append("option")
            .text(sample)
            .property("value", sample);
        });

        // Use the first sample from the list to build the initial plots
        const firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
      });
    }
  
  function optionChanged(newSample) {
      // Fetch new data each time a new sample is selected
      buildCharts(newSample);
      buildMetadata(newSample);
    }

  // Initialize the dashboard
  init();
