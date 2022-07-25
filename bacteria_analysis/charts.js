// Make the initial metadata display
function init() {
    var selector = d3.select('#selDataset');

    // Go to samples.json file and print data to log to allow easy verification everything is there
    d3.json("samples.json").then((data)=>{
        // console.log(data);

        // Save all of the participant IDs ("names" in the json) to a variable to be displayed in a dropdown menu
        var sampleNames = data.names;

        // Setup the dropdown menu displaying each "name" from the json
        sampleNames.forEach((sample)=>{
            selector
            .append("option")
            .text(sample)
            .property("value",sample);
        });
        // Use the first sample from the list to build the initial plots
        var firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });

};

// Every time the dropdown option is changed, this function will activate and build new Metadata and Chart from corresponding functions
function optionChanged(newSample) {
    console.log(newSample);
    buildMetadata(newSample);
    buildCharts(newSample);
};

// build Metadata (demographics) from participant ID
function buildMetadata(sample) {
    // Go into the samples.json and find the metadata for that participant chosen in the 'selector'
    d3.json("samples.json").then((data)=>{
        // the metadata array (1st level)
        var metadata = data.metadata;
        // filter all 153 metadatas to find only the one with an 'id' key/value where the value matches the participant chosen in the 'selector'
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        // chose the first (and hopefully only) metadata array that matches the filter above
        var result = resultArray[0];
        // // log the result to verify correct participant was chosen
        // console.log(result);

        // set a new variable to find the '#sample-metadata' div in the .html file -- this is the div where metadata info will be displayed
        var PANEL = d3.select("#sample-metadata");
        
        // clear any previously selected data
        PANEL.html("");
        
        // for each key/value pair in the 'result' array:
        Object.entries(result).forEach(([key,value])=>{
            // append text to the #sample-metadata div -- this text USES BACKTICKS NOT APOSTROPHES to act as an f-string referencing the key+value
            PANEL.append("h6").text(`${key}: ${value}`);
        });
    });
};

// 1. Create the buildCharts function.
function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
      // 3. Create a variable that holds the samples array. 
        var samples = data.samples;
      // 1. Create a variable that filters the metadata array for the object with the desired sample number.
        var metadata = data.metadata;
        
      // 2. Create a variable that holds the first sample in the metadata array.
        var metadata_array = metadata.filter(sampleObj => sampleObj.id == sample);
        var metadata_result = metadata_array[0];
        var wash_freq = parseFloat(metadata_result.wfreq);
        console.log(wash_freq);

      // 4. Create a variable that filters the samples for the object with the desired sample number.
        var sample_array = samples.filter(sampleObj => sampleObj.id == sample);
      //  5. Create a variable that holds the first sample in the array.
        var result = sample_array[0];
  
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;
  
      // 7. Create the yticks for the bar chart.

      // ***Somehow need to pair the otu_ids to the sample values, sort by sample values and then display the filtered otu_ids that were in correpsonding index spots as the sample values? And then do the same for bacteria type?????
        var yticks = otu_ids.map(obj => `OTU ${obj}`).slice(0,10);
        console.log(yticks);
        var reversed_data = yticks.reverse();

        // console.log(yticks);
        // console.log(top10_yticks);
        // console.log('Sample Values',sample_values);
        // console.log('Reversed Data',reversed_data);

        // 8. Create the trace for the bar chart. 
        var trace = {
            x: sample_values.sort((a,b)=>b-a).slice(0,10).reverse(),
            y: reversed_data,
            text: reversed_data,
            name: "Bacteria",
            type: 'bar',
            orientation: 'h'
        };

        var bar_data = [trace]

        // 9. Create the layout for the bar chart. 
        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
        };
        // 10. Use Plotly to plot the data with the layout. 
        Plotly.newPlot("bar",bar_data,barLayout);

        // 1. Create the trace for the bubble chart.
        var bubbleData = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size:sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }];

        // 2. Create the layout for the bubble chart.
        var bubbleLayout = {
            title: "Bacteria Culture Per Sample",
            xaxis: {title: "OTU ID"},
            hovermode: "x unified"
        };

        // 3. Use Plotly to plot the data with the layout.
        Plotly.newPlot("bubble",bubbleData,bubbleLayout);
        
   
        // 4. Create the trace for the gauge chart.
        var gaugeData = [{
            value: wash_freq,
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: {range: [0, 10], dtick: 2},
                bar: { color: "black"},
                steps: [
                    {range: [0,2], color: "red"},
                    {range: [2,4], color: "orange"},
                    {range: [4,6], color: "yellow"},
                    {range: [6,8], color: "lightgreen"},
                    {range: [8,10], color: "green"}
                ]
            }
        }];
        
        // 5. Create the layout for the gauge chart.
        var gaugeLayout = { 
            title: "<b>Belly Button Washing Frequency</b><br>Scrubs Per Week"
        };

        // 6. Use Plotly to plot the gauge data and layout.
        Plotly.newPlot("gauge",gaugeData,gaugeLayout);
    });
};
  

// Initialize the page with init function
init();

  