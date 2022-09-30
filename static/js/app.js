function buildChart(patientID) {

    d3.json('samples.json').then((data => {

        var samples = data.samples
        var metadata = data.metadata
        var filteredMetadata = metadata.filter(bacteriaInfo => bacteriaInfo.id == patientID)[0]

        var filteredSample = samples.filter(bacteriaInfo => bacteriaInfo.id == patientID) [0]

        var sample_values = filteredSample.sample_values
        var otu_ids = filteredSample.otu_ids
        var otu_labels = filteredSample.otu_labels

        var bar_data = [{

            x:sample_values.slice(0,10).reverse(),
            y:otu_ids.slice(0,10).map(otu_id => `OTU ${otu_id}`).reverse(),

            text: otu_labels.slice(0,10).reverse(),
            type:'bar',
            orientation:'h',
            marker: {
                color: 'rgb(242, 113, 102)'
            },
        }]

        var bar_layout = {
            title: "Top 10 Microbial Species in Belly Buttons",
            xaxis: {title:"Bacteria Sample Values"},
            yaxis: {title:"OTU IDs"}
        };

        Plotly.newPlot('bar', bar_data, bar_layout)

        var bubble_data = [{

            x: otu_ids,

            y: sample_values,

            text: otu_labels,
            mode: 'markers',
            marker: {
                color: otu_ids,
                size: sample_values,
                colorscale: 'Yl0rRd'
            }
        }];

        var layout = {
            title: 'Belly Button Samples',
            xaxis: { title: "OTU IDs"},
            yaxis: { title: "Sample Values"}
        };

        Plotly.newPlot('bubble', bubble_data, layout)

        var washFreq = filteredMetadata.wfreq

        var gauge_data = [
            {
                domain: { x: [0,1], y: [0,1]},
                value: washFreq,
                title: { text: "Washing Frequency (Times per Week)"},
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    bar: {color:'white'},
                    axis: {range: [0, 9]},
                    steps: [ 
                        {range:[0,3], color:'rgb(253,162,73)'},
                        {range: [3,6], color: 'rgb(242, 113, 102)'},
                        {range: [6,9], color: 'rgb(166, 77, 104)'},
                    ],
                    threshold : { line : { color : 'white'}}
                }
            }
        ];

        var gauge_layout = { width:500, height: 400, margin: { t: 0 , b: 0 }};

        Plotly.newPlot('gauge', gauge_data, gauge_layout, );
    }))
};

function populateDemoInfo(patientID) {
    
    var demographicInfoBox = d3.select('#sample-metadata');

    d3.json("samples.json").then(data => {

        var metadata = data.metadata
        var filteredMetadata = metadata.filter(bacteriaInfo => bacteriaInfo.id == patientID)[0]

        console.log(filteredMetadata)
        Object.entries(filteredMetadata).forEach(([key, value]) => {
            demographicInfoBox.append('p').text(`${key}: ${value}`)
        })
    })
}

function optionChanged(patientID) {
    console.log(patientID);
    buildChart(patientID);
    populateDemoInfo(patientID);
}

function initDashboard() {
    let dropDown  = d3.select('#selDataset')
    d3.json('samples.json').then(data => {

        var patientIDs = data.names;
        patientIDs.forEach(patientID => {
            dropDown.append("option").text(patientID).property('value', patientID);
        });
        buildChart(patientIDs[0]);
        populateDemoInfo(patientIDs[0]);
    });
};

initDashboard();