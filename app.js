function project(){
    var filePath="US_Accidents_Cleaned.csv";
    question0(filePath);
    question1(filePath);
    question2(filePath);
    question3(filePath);
    question4(filePath);
    question5(filePath);
}

var question0=function(filePath){
    d3.csv(filePath).then(function(data){
        console.log(data)
    });
}
var question1=function(filePath){
    var width=1000;
    var height=700;
    var margin=80;

    var svg = d3.select("#q1_plot")
            .append("svg").attr("width", width)
            .attr("height", height);

    d3.csv(filePath).then(function(data){
        current_zone = "US/Eastern";
        current_data = data.filter(function(d){
            if(d['Timezone']==current_zone){ 
                return d;
            } 
        });

        var xScale = d3.scaleLinear()
            .domain([0, d3.max(current_data, d => parseFloat(d['Visibility(mi)']))])
            .range([margin, width - margin]);

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(current_data, d => parseFloat(d['Severity']))])
            .range([height - margin, margin]);

        var colors = d3.scaleOrdinal()
            .domain(["US/Eastern", "US/Pacific", "US/Central", "US/Mountain"])
            .range(['steelblue','plum','mediumaquamarine','salmon']);

        var Tooltip = d3.select("#q1_plot").append("div").style("opacity", 0).attr("class", "tooltip");

        svg.selectAll('circle')
            .data(current_data)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d['Visibility(mi)']))
            .attr('cy', d => yScale(d['Severity']))
            .attr('r', 3)
            .attr('fill', colors(current_zone))
            .on("mouseover", function(e, d){
                Tooltip.transition().duration(50).style("opacity", 0.9);
                d3.select(this)
                    .style("stroke", "black")
                    .style("stroke-width", 0.2)
                    .style("opacity", 1)
                       
            })
            .on("mousemove", function (e, d) {
                Tooltip.html("The visibility is: " + d['Visibility(mi)'] + " miles" + "<br>The severity level is: " + d['Severity'])
                        .style("left", (e.pageX) + "px")
                        .style("top", (e.pageY) + "px")
            })
            .on("mouseout", function (e, d) {
                //create method chain for tooltip
                Tooltip.transition().duration(50).style("opacity", 0);
                d3.select(this)
                    .style("stroke", "none")
                    .style("opacity", 1);
            });

        // Add Axis
        const xAxis = d3.axisBottom().scale(xScale);
        const yAxis = d3.axisLeft().scale(yScale);

        // Draw x-axis and y-axis to svg  
        svg.append("g").call(xAxis).attr("class", "xAxis").attr("transform","translate(0,620)");
        svg.append("g").call(yAxis).attr("class", "yAxis").attr("transform","translate(80,0)");

        var radio = d3.select('#radio_q1')
            .attr('name', 'region').on("change", function (d) {

                current_zone = d.target.value; 
                current_data = data.filter(function(d){
                    if(d['Timezone']==current_zone){ 
                        return d;
                    } 
                });

                var circles = svg.selectAll("circle")
                    .data(current_data);

                circles.enter().append("circle")
                    .attr("cx", function(d) { return xScale(d['Visibility(mi)']); })
                    .attr("cy", function(d) { return yScale(d['Severity']); })
                    .attr("r", 0)
                    .attr("fill", function() { return colors(current_zone); })
                    .transition()
                    .duration(1000)
                    .attr("r", 3);

                circles.exit()
                    .transition()
                    .duration(1000)
                    .attr("r", 0)
                    .remove();

                circles.transition()
                    .duration(1000)
                    .attr("cx", function(d) { return xScale(d['Visibility(mi)']); })
                    .attr("cy", function(d) { return yScale(d['Severity']); })
                    .attr("fill", function() { return colors(current_zone); });
                
    
        })

            

        // Add Titles
        svg.append("text")
            .attr("x", width/2)
            .attr("y", height-10)
            .attr("text-anchor", "middle")
            .style("font-size", "15px")
            .text("Visibility(mi)");

        svg.append("text")
            .attr("x", 30)
            .attr("y", 50)
            .style("font-size", "15px")
            .text("Severity");

        svg.append("text")
            .attr("x", width/2)
            .attr("y", margin/2)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .text("Severity VS Visibility");


        });

        


}

var question2=function(filePath){
    var width=950;
    var height=800;
    var margin = {
        top: 60, bottom: 50, left: 120, right: 20
    }

    var svg = d3.select("#q2_plot")
            .append("svg").attr("width", width)
            .attr("height", height);

    d3.csv(filePath).then(function(data){
        var sum_by_weather = d3.rollup(data,
            v => v.length,
            d => d['Weather_Condition']
        );

        var sum_data = []
        sum_by_weather.forEach(function(d, i) {
            if(d > 20){
                var temp = {}
                temp["Weather"] = i
                temp["Num"] = Math.log(d)
                sum_data.push(temp);
            }
            
        });
        var weathers = sum_data.map(d => d['Weather']); 

        var yScale = d3.scaleBand()
            .domain(d3.range(sum_data.length))
            .range([margin.top, height - margin.bottom])
            .paddingInner(0.1);
            
        var xScale = d3.scaleLinear()
            .domain([0, d3.max(sum_data, function(d){ return parseInt(d.Num);})])
            .range([width - margin.right, margin.left]);

        var Tooltip = d3.select("#q2_plot").append("div").style("opacity", 0).attr("class", "tooltip");

        svg.selectAll(".bar")
            .data(sum_data).enter()
            .append('rect')
            .attr("class", "bar")
            .on("mouseover", function(event, d){	  		
                d3.select(this)
                    .attr("fill", "cornflowerblue");
                Tooltip.transition().duration(50).style("opacity", 0.9);
                d3.select(this)
                    .style("stroke", "black")
                    .style("stroke-width", 0.2)
                    .style("opacity", 1);	
            })
            .on("mousemove", function (e, d) {
                Tooltip.html("The log number of accidents is: " + d.Num)
                        .style("left", (e.pageX) + "px")
                        .style("top", (e.pageY) + "px")
            })
            .on("mouseout", function(event, d){
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr("fill", "black")	
                Tooltip.transition().duration(50).style("opacity", 0);
                d3.select(this)
                    .style("stroke", "none")
                    .style("opacity", 1);	  		

            })
            .attr("x", margin.left)
            .attr("y", function(d, i) {return yScale(i)})
            .attr("width", function(d){return width- margin.right - xScale(d.Num)})
            .attr("height", yScale.bandwidth());

        const xAxis = d3.axisBottom().scale(
            d3.scaleLinear()
                .domain([0, d3.max(sum_data, function(d){ return parseInt(d.Num);})])
                .range([margin.left, width - margin.right])
        );
        const yAxis = d3.axisLeft().scale(
            d3.scaleBand()
                .domain(weathers)
                .range([margin.top, height - margin.bottom])
                .paddingInner(0.1)
        );

        svg.append("g").call(xAxis).attr("class", "x_axis").attr("transform","translate(2,752)");

        svg.append("g").call(yAxis).attr("class", "y_axis")
            .attr("transform","translate(118,0)")
            .selectAll("text")	
            .attr("transform", "translate(-10,-10)rotate(-45)")
            .style("text-anchor", "end")
            .style("font-size", "10px");

        // Add Sort Button
        var isDescending = false;
        const sortBars = function(){
            svg.selectAll('.bar')
                .sort((a, b) => {
                    return isDescending?d3.descending(a.Num, b.Num):d3.ascending(a.Num, b.Num);
                })
                .transition("sorting")
                .duration(1000)
                .attr('y', (d, i) => {
                    return yScale(i)
                })
                sorted_data = sum_data.sort((a, b) => {
                    return isDescending?d3.descending(a.Num, b.Num):d3.ascending(a.Num, b.Num);
                });

            var weathers = Array.from(sorted_data.map(d => d.Weather))
            const yAxis = d3.axisLeft().scale(
                d3.scaleBand()
                    .domain(weathers)
                    .range([margin.top, height - margin.bottom])
                    .paddingInner(0.1)
            );

            d3.select("g.y_axis")
                .transition()
                .duration(1000)
                .call(yAxis);

            isDescending = !isDescending

                
        }
        
        d3.select('.my_button')
                .on('click', function(){
                    sortBars();
                }); 

        


        // Add Titles
        svg.append("text")
            .attr("x", width/2)
            .attr("y", height-10)
            .style("font-size", "15px")
            .text("Log Number of Accidents");

        svg.append("text")
            .attr("x", 35)
            .attr("y", 35)
            .style("font-size", "15px")
            .text("Weather Conditions");

        svg.append("text")
            .attr("x", width/3 - margin.left/2)
            .attr("y", margin.top/3)
            .style("font-size", "20px")
            .text("Log Number of Accidents in Each Weather Condition");



    });
    


}



var question3=function(filePath){

    let width = 1000
    let height = 800
    var margin = {
        top: 60, bottom: 50, left: 80, right: 20
    }

    var svg = d3.select("#q3_plot").append("svg")
        .attr("width", width)
        .attr("height", height);

    // Load the Data
    d3.csv(filePath).then(function(data){
        var top_15 = d3.rollup(data,
            v => v.length,
            d => d.State
        );
        var top_15 = new Map(
            Array.from(top_15)
              .sort((a, b) => {
                return b[1] - a[1];
            })
        )
        var top_states = Array.from(top_15.keys()).slice(0, 15)
        console.log(top_states)

        var avg_by_state = d3.rollup(data.filter(function(d){
            if(top_states.indexOf(d.State)!=-1){ 
                return d;
            } 
            }),
            v => ({
                Wind_Speed: d3.mean(v, d => parseFloat(d['Wind_Speed(mph)'])),
                Precipitation: d3.mean(v, d => parseFloat(d['Precipitation(in)'])*100)
            }),
        
            d => d.State
        );
    

        //define scaling
        var keys = ['Wind_Speed', 'Precipitation']
        
        var xScale = d3.scaleBand()
            .domain(Array.from(avg_by_state.keys()))
            .range([margin.left, width-margin.right]);

        var yScale = d3.scaleLinear()
            .domain([0, 15])
            .range([ height - margin.bottom, margin.top]);

        var colors = d3.scaleOrdinal()
            .domain(keys)
            .range(['lightsteelblue','indigo']);

        // Convert internmap to an array of Objects
        var avg_data = []
        avg_by_state.forEach(function(d, i) {
            var temp = {}
            temp["State"] = i
            temp["Wind_Speed"] = d['Wind_Speed']
            temp["Precipitation"] = d['Precipitation'];
            avg_data.push(temp);
        });

        //Stack the data
        var series = d3.stack().keys(keys)
        var stacked = series(avg_data)

        var areas = d3.area()
            .x(function(d, i) { return xScale(d.data.State); })
            .y0(function(d) { return yScale(d[0]); })
            .y1(function(d) { return yScale(d[1]); })

        svg.selectAll("mylayers")
            .data(stacked)
            .enter()
            .append("path")
            .attr("d", areas)
            .style("fill", function(d) { 
                return colors(d.key); 
            })


        // Add the code which defines xAxis and yAxis 
        const xAxis = d3.axisBottom().scale(xScale);
        const yAxis = d3.axisLeft().scale(yScale);

        // Draw x-axis and y-axis to svg  
        svg.append("g").call(xAxis).attr("class", "xAxis")
            .attr("transform","translate(-30,750)")
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(30)")
            .style("text-anchor", "start");

        svg.append("g").call(yAxis).attr("class", "yAxis").attr("transform","translate(50,0)");
        // Add titles
        svg.append("text")
            .attr("class", "xtext")
            .attr("x",  width/2)
            .attr("y", height)
            .text('State Name')
            .style("font-size", "15px");

        svg.append("text")
            .attr("class", "ytext")
            .attr("text-anchor", "end")
            .attr("y", 0)
            .attr("dy", "0.8em")
            .attr("transform", "rotate(-90)")
            .text("Sum Wind Speed and Precipitation for Each State")
            .style("font-size", "15px");

        svg.append("text")
            .attr("x", width/2)
            .attr("y", margin.top/2)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .text("Wind Speed and Precipitation Streamgraph");

        // Add Legends
        
        svg.selectAll("mydots")
            .data(keys)
            .enter()
            .append("circle")
            .attr("cx", width - 150)
            .attr("cy", function(d,i){ return 100 + i*25}) 
            .attr("r", 6)
            .style("fill", function(d){ return colors(d)})
        
        svg.selectAll("mylabels")
            .data(keys)
            .enter()
            .append("text")
            .attr("x", width - 120)
            .attr("y", function(d,i){ return 100 + i*25}) 
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            
        })
}

var question4=function(filePath){

    d3.csv(filePath).then(function(data){
    var width = 960;
    var height = 500;
    var margin=50;

    var svg = d3.select("#q4_plot")
        .append("svg").attr("width", width)
        .attr("height", height);

    var accidents_by_state = d3.rollup(data.filter(function(d){
        if(d['Severity'] == '4'){ 
            return d;
        } 
        }),
        v => v.length,
        d => d.State
    );
    var accidents_by_state = new Map([...accidents_by_state.entries()].sort())

    var mapData = {};

    accidents_by_state.forEach(function(d, i) {
        mapData[i] = Math.log(d)

    });

    color = d3.scaleSequential(d3.interpolateGnBu)
        .domain([0, Math.max(...Object.values(mapData))])

    
    
    const projection  = d3.geoAlbersUsa()
                            .scale(1000)
                            .translate([width / 2, height / 2]);
    

    const path = d3.geoPath()
                    .projection(projection);


    const statesmap = d3.json("us-states.json");

    canvas = svg.append('g')
    canvas.call(d3.zoom());

    statesmap.then(function(map){

        canvas.selectAll("path")
            .data(map.features)
            .enter().append("path").attr("d", path)
            .style("fill", function(d) {
                return color(mapData[d.properties.name] || 0);
              }
            )
            .style("stroke", "black")
            .style("stroke-width", 0.2);
    });

    

    var zoom = d3.zoom()
        .on('zoom', function() {
        canvas.attr('transform', d3.zoomTransform(this));
    })

    d3.select('#zoom-in').on('click', function() {
        zoom.scaleBy(canvas.transition().duration(750), 1.3);
    });
    
    d3.select('#zoom-out').on('click', function() {
        zoom.scaleBy(canvas.transition().duration(750), 1 / 1.3);
    });

    
    

    // Add title
    svg.append("text")
            .attr("x", width/2)
            .attr("y", margin/3)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .text("Choropleth Map of Number of Severe Accidents by State");


    // Add legends
    var legendWidth = 20;
    var legendHeight = 15;
    
    log_value_range = [...Array(Math.ceil(Math.max(...Object.values(mapData)))).keys()];

    var legendRects = svg.selectAll("rect")
        .data(log_value_range)
        .enter()
        .append("rect")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .attr("x", width-2*margin)
        .attr("y", function(d, i) { return i * legendHeight; })
        .attr("fill", function(d) { return color(d); });
    
    var legendLabels = svg.selectAll("text")
        .data(log_value_range)
        .enter()
        .append("text")
        .attr("x", width-margin)
        .attr("y", function(d, i) { return i * legendHeight + legendHeight/2; })
        .style("font-size", "12px")
        .text(function(d) { return d; });


    });
      
}


var question5=function(filePath){
    var rowConverter = function(d){
        return{
            Temperature: parseFloat(d['Temperature(F)']),
            Wind_Speed: parseFloat(d['Wind_Speed(mph)'])
        }
        
    }
    let width = 1000
    let height = 800
    var margin = {
        top: 60, bottom: 100, left: 80, right: 20
    }

    var svg = d3.select("#q5_plot").append("svg")
        .attr("width", width)
        .attr("height", height);

    d3.csv(filePath, rowConverter).then(function(data){

        keys = ['Temperature', 'Wind_Speed']
        colors = ['lightskyblue', 'lavender']
        var colorScale = d3.scaleOrdinal()
            .domain(keys)
            .range(colors);

        for (const i of [0, 1]) {
            var key = keys[i]
            
            const data_sorted = data.map(d => d[key]).sort((a,b) => {return a-b});
            // console.log(key)
            // console.log(values)
            var q1 = d3.quantile(data_sorted, .25)
            var median = d3.quantile(data_sorted, .5)
            var q3 = d3.quantile(data_sorted, .75)
            var iqr = q3 - q1
            var min = q1 - 1.5 * iqr
            var max = q1 + 1.5 * iqr
            console.log(q1)
            console.log(median)
            console.log(q3)
            var yScale = d3.scaleLinear()
                .domain([d3.min(data_sorted)-5, d3.max(data_sorted)])
                .range([height-margin.bottom, margin.top]);

            // a few features for the box
            var center = 260*(i+1)
            var box_width = 100

            // Show the main vertical line
            svg.append("line")
            .attr("x1", center)
            .attr("x2", center)
            .attr("y1", yScale(min) )
            .attr("y2", yScale(max) )
            .attr("stroke", "black")

            // Show the box
            svg.append("rect")
            .attr("x", center - box_width/2)
            .attr("y", yScale(q3) )
            .attr("height", (yScale(q1)-yScale(q3)) )
            .attr("width", box_width )
            .attr("stroke", "black")
            .style("fill", colorScale(key))

            // show median, min and max horizontal lines
            svg.selectAll("toto")
            .data([min, median, max])
            .enter()
            .append("line")
            .attr("x1", center-box_width/2)
            .attr("x2", center+box_width/2)
            .attr("y1", function(d){ return(yScale(d))} )
            .attr("y2", function(d){ return(yScale(d))} )
            .attr("stroke", "black")
            }

            var y_axis = d3.axisLeft(yScale);
            svg.append("g")
                .attr('transform', `translate(${margin.left},${margin.top/2})`)
                .attr("class","y_axis")
                .call(y_axis)
                .append("text")
                .attr("dx", "-.1em")
                .attr("dy", "0.71em")
                .attr("text-anchor", "end")


            // Add titles
            svg.append("text")
                .attr("class", "ytext")
                .attr("text-anchor", "end")
                .attr("y", 25)
                .attr("dy", "0.8em")
                .attr("transform", "rotate(-90)")
                .text("Temperature/Wind Speed")
                .style("font-size", "15px");
            
            svg.append("text")
                .attr("x", width/3)
                .attr("y", margin.top/2)
                .style("font-size", "20px")
                .text("Temperature and Speed Distributions");

            // Add Legends
            
            svg.selectAll("mydots")
                .data(keys)
                .enter()
                .append("circle")
                .attr("cx", width - 200)
                .attr("cy", function(d,i){ return 100 + i*25}) 
                .attr("r", 6)
                .style("fill", function(d){ return colorScale(d)})
            
            svg.selectAll("mylabels")
                .data(keys)
                .enter()
                .append("text")
                .attr("x", width - 180)
                .attr("y", function(d,i){ return 100 + i*25}) 
                .text(function(d){ return d})
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")

                    
                
    });

    
    
     
 
}



