// Make the initial metadata display
function init() {
    var selector = d3.select('#selDataset');

    // Go to samples.json file and print data to log to allow easy verification everything is there
    d3.json("samples.json").then((data)=>{
        console.log(data);

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
        // log the result to verify correct participant was chosen
        console.log(result);

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
      // 4. Create a variable that filters the samples for the object with the desired sample number.
        var sample_array = samples.filter(sampleObj => sampleObj.id == sample);
      //  5. Create a variable that holds the first sample in the array.
        var result = sample_array[0];
  
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;
  
      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 
  
      var yticks = otu_ids.sort((a,b)=>b-a).slice(0,10);
      console.log(yticks);
  
      // 8. Create the trace for the bar chart. 
      var barData = [
        
      ];
      // 9. Create the layout for the bar chart. 
      var barLayout = {
       
      };
      // 10. Use Plotly to plot the data with the layout. 
      
    });
  };
  


// Initialize the page with init function
init();