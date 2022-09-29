// DropDown Menu function
function dropdownmenu() {

    let dropdown = d3.select("#selDataset");
    d3.json("samples.json").then(function (data) {
        let IDs = data.names;
        IDs.forEach(ID => {
            dropdown.append("option").text(ID).property("value", ID)
  
        });
    });
  };
  
  // Create the plotting function
  function plotting(sampleID) {
  
    // Read in samples.json
    d3.json("samples.json").then(function (data) {
        
        // Filtering the json file
        let Data = data.samples.filter(i => i.id == sampleID)[0];
  
        // Set the metrics for bar plot
        let trace1 = {
            x: Data.sample_values.slice(0, 10).reverse(),
            y: Data.otu_ids.slice(0, 10).map(otu_id => `OTU #${otu_id}`).reverse(),
            text: Data.otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",
            marker: {
              color: 'rgb(4, 189, 161',
              line: {
                 width: 3
             }
            }
        };
  
        let layoutBar = { 
          title: "<b>Top 10 OTU Individuals</b>" ,
          xaxis: {title: 'Number of Samples Collected'},
         yaxis: {title: 'OTU ID'},
         width: 480, height: 640
        };
  
        // Use plotly to plot Bar Chart
        Plotly.newPlot("bar", [trace1], layoutBar, {responsive: true});
  
  // Set the metrics for the bubble plot
        let trace2 = {
          x: Data.otu_ids,
          y: Data.sample_values,
          mode: "markers",
          marker: {
              size: Data.sample_values,
              color: Data.otu_ids
          },
          text: Data.otu_labels,
          
      };
  
      let layoutBubble = { 
          title: '<b>Bubble Chart For Each Sample</b>',
          xaxis: {title: 'OTU ID'},
          yaxis: {title: 'Number of Samples Collected'},
          height: 700,
          width: 1200
  };
  
      // Use plotly to plot bubble chart
      Plotly.newPlot("bubble", [trace2], layoutBubble);
  
  });
  };
  
  // Create the demographic information
  function demo(sampleID) {
  
  let boxData = d3.select("#sample-metadata");
  d3.json("samples.json").then(function (data) {
      let boxData = data.metadata.filter(x => x.id == sampleID)[0];
      d3.select("#sample-metadata").html("");
      Object.entries(boxData).forEach(element => {
          d3.select("#sample-metadata").append("h6").text(`${element[0]}: ${element[1]}`)
      });
  
  });
  }
  
  // Create a function for changing sampleID
  function optionChanged(sampleID) {
  plotting(sampleID);
  demo(sampleID);
  gaugeplot(sampleID)
  };
  
  // Generate the gauge plot
  function gaugeplot(sampleID) {
    d3.json("samples.json").then(function (data) {
        let sampleMetadata = data.metadata.filter(i => i.id == sampleID)[0];
  
        // Set the metrics for the gauge plot
        let Gauge = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: sampleMetadata.wfreq,
                title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs Per Week" },
                type: "indicator",
                mode: "gauge+number",
                gauge: { axis: { range: [0, 9] },
                bar: { color: "#cad9d6" },
                steps: [
                  { range: [0, 1], color: "#85D68A" },
                  { range: [1, 2], color: "#7CC195" },
                  { range: [2, 3], color: "#73ABA0" },
                  { range: [3, 4], color: "#6996AC" },
                  { range: [4, 5], color: "#6080B7" },
                  { range: [5, 6], color: "#576BC2" },
                  { range: [6, 7], color: "#576BC2" },
                  { range: [7, 8], color: "#302DD9" },
                  { range: [8, 9], color: "#360CCD" }
                        
                ], }
            }
        ];
  
        let layoutGauge = { width: 480, height: 640, margin: { t: 0, b: 0 } };
  
        // Use plotly to plot Gauge Chart
        Plotly.newPlot("gauge", Gauge, layoutGauge);
    });
  };
  
  // Populating the plots
  function createPlots() {
  
    d3.json("samples.json").then(function (data) {
        let IDs = data.names[0];
        plotting(IDs);
        demo(IDs);
        gaugeplot(IDs);
        dropdownmenu();
    });
  };
  
  createPlots();