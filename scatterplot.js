//scatterplot
// we define two variables to hold the column/category headers and the country data itself
var headers;
var countries;
var tempCountries;
var continents;
var buttonsData;

// this object is used to reference the "root" svg element that we will add graphical objects to
var root;

var margin = 50; // all margins will be 50px
var width = 700 - margin * 2;
var height = 320 - margin * 2;

var xScale = d3.scale.linear().range([0, width]);
var yScale = d3.scale.linear().range([height, 0]);
var sizeScale = d3.scale.linear().range([3, 20]);

var xAxis = d3.svg.axis().orient("bottom");
var yAxis = d3.svg.axis().orient("left");

var sizeIndex = 0, xAxisIndex = 5, yAxisIndex = 0, yAxisIndex2 = 0, continentIndex = 6, continentIndex2 = 6;

var colour = d3.scale.category10();

var div = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);

formatData(rawData);

createYButtons();
createContButtons();
createYButtons2();
createContButtons2();

createVis();
updateVis();
createVis2();
updateVis2();

createDirectedView();
createDirectedView2();
createDirectedView3();
createDirectedView4();

function formatData(data) {
	// extract the row of the data array which has the column names (indicators)
	headers = data.filter(
		function (d) {
			return d.type == "indicators";
		}
	);


	// the filter() function we called above will give us an array so we should
	// extract the first element of this array, which has the headers
	headers = headers[0].values;
	
	// do the same thing with countries, but this time filter by "country"
	countries = data.filter(
		function (d) {
			return d.type == "country";
		}
	);

	continents = [countries[0].continent];
	continents.push("Asia","Australia","Europe","North America","South America","See All");


}


function createDirectedView()  {
	
	d3.select("#buttons3")
		.on("click", changeView1);
}


function createDirectedView2()  {
	
	d3.select("#buttons4")
		.on("click", changeView2);

}

function createDirectedView3()  {
	
	d3.select("#buttons5")
		.on("click", changeView3);

}

function createDirectedView4()  {
	
	d3.select("#buttons6")
		.on("click", changeView4);

}


function changeView1()  {

	continentIndex = 0;
	continentIndex2 = 3;
	yAxisIndex = 0;
	yAxisIndex2 = 0;
	updateVis();
	updateVis2();
			

}


function changeView2()  {

	continentIndex = 0;
	continentIndex2 = 3;
	yAxisIndex = 3;
	yAxisIndex2 = 3;
	updateVis();
	updateVis2();
}

function changeView3()  {

	continentIndex = 4;
	continentIndex2 = 4;
	yAxisIndex = 0;
	yAxisIndex2 = 3;
	updateVis();
	updateVis2();
}

function changeView4()  {

	continentIndex = 1;
	continentIndex2 = 4;
	yAxisIndex = 1;
	yAxisIndex2 = 1;
	updateVis();
	updateVis2();
}

function createVis() {
	// this uses d3 to select the #chart element (which is a div)
	// and underneath that select all svg elements, which there is one of
	root = d3.select("#graphics")
		.attr("width", width + margin * 2)
		.attr("height", height + margin * 2);

	/*var tooltip = root.append("div")
	.attr("class","tooltip")
	.style("opacity",0);*/

	// first thing we should do is to create a group element inside the <svg>
	// this will position our scatterplot so that there are margins separating it from the edge of the <svg> canvas
	// we will also redefine our root variable to be this new <g> html object instead of the <svg #graphics> html object that we previous defined it as
	root = root.append("g")

		//.attr("x", margin).attr("y", margin) won't work since the <g> tag does not have x and y properties
		// we must set the position using the transform property
		.attr("transform", "translate(" + margin + "," + margin + ")"); // we are creating this string: translate(50,50)

	// now we will add two <g> tags, each will contain a scale
	root.append("g")
		.attr("class", "xAxis")
		.attr("transform", "translate(0," + height + ")")
		// this is what creates the axis, tick marks, and text inside of this <g> element
		.call(xAxis)
			// and we also add a <text> element under this <group> with class "label"
			// note that the .attr() calls are only affected the <text> element, not the <g> parent element
			.append("text")
			// by giving this <text> element a class, it allows us to change what the axis text will say in updateVis()
			.attr("class", "label")
			.attr("x", width)
			.attr("y", -6)
			.style("text-anchor", "end");

	root.append("g")
		.attr("class", "yAxis")
		.call(yAxis)
			.append("text")
			.attr("class", "label")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end");
		
	root.selectAll(".country").data(countries)
		// we enter the selection and add a <g> for each piece of data
		.enter()
		// the <g> tag will contain a circle
		// we will position the circle by changing the "transform" property of the <g>, NOT the x and y coordinates of the circle
		// this way, if we want to add a label to the circle, we only need to add it to this parent <g> tag and it will take care of positioning the label along 			with the circle
		.append("g")
		.attr("class", "country")
			.append("circle")
			//each circle, representative of a country will be coloured based on the continent in which the belong
			.style("fill",function (d)  { return colour(d.continent);})
			.style("opacity", 1) 
			.style("stroke", "#000000") // would be better to put this in the stylesheet
			.style("stroke-width", 1)   
       			.attr(function(d) { return (d.name); })        
        		
			//produces the country name when viewer hovers over each circle
			.on("mouseover", function(d) {      
            		div.transition()        
                	.duration(200)      
                	.style("opacity", .9);      
            		div.html("Country: " + "<br/>"  + d.name)  
            	    	.style("left", (d3.event.pageX) + "px")     
                	.style("top", (d3.event.pageY - 28) + "px")
			d3.select(this).style("fill", "yellow")

			d3.select("#graphics2").selectAll("circle")
          		.filter(function(f) {
                			return f.name === d.name;
				})
			.style("fill",function (d)  {return "yellow"})
			  
            		})
                  
        		.on("mouseout", function(d) {       
            		div.transition()        
                	.duration(500)      
                	.style("opacity", 0); 
			d3.select(this).style("fill", colour(d.continent));  
			d3.select("#graphics2").selectAll("circle").style("fill",function (d)  { return colour(d.continent);});
       			 });

}




// we give the updateVis function a flag to tell it whether or not to animate
function updateVis(animate) {
	// compute the max value for the x and y and size scales
	var maxValX = d3.max(countries, function (d) { return d.values[xAxisIndex];});
	var maxValY = d3.max(countries, function (d) { return d.values[yAxisIndex];});
	var maxValSize = d3.max(countries, function (d) { return d.values[sizeIndex];});
	// and recompute the domain for each axis based on these max values
	// note that we are making the assumption that our measures are starting at 0 (no negative values)
	xScale.domain([0, maxValX]);
	yScale.domain([0, maxValY]);
	sizeScale.domain([0, maxValSize]);

	sizeScale.domain([0, d3.max(countries, function(d){return d.values[sizeIndex]})]);


		root.selectAll(".country").data(countries)
		// we enter the selection and add a <g> for each piece of data
		.enter()
		// the <g> tag will contain a circle
		// we will position the circle by changing the "transform" property of the <g>, NOT the x and y coordinates of the circle
		// this way, if we want to add a label to the circle, we only need to add it to this parent <g> tag and it will take care of positioning the label along 			with the circle
		.append("g")
		.attr("class", "country")
			.append("circle")
			//each circle, representative of a country will be coloured based on the continent in which the belong
			.style("fill",function (d)  { return colour(d.continent);})
			.style("opacity", 1) 
			.style("stroke", "#000000") // would be better to put this in the stylesheet
			.style("stroke-width", 1)   
       			.attr(function(d) { return (d.name); })        
			.on("mouseover", function(d) {      
            		div.transition()        
                	.duration(200)      
                	.style("opacity", .9);      
            		div.html("Country: " + "<br/>"  + d.name)  
            	    	.style("left", (d3.event.pageX) + "px")     
                	.style("top", (d3.event.pageY - 28) + "px")
			d3.select(this).style("fill", "yellow")

			d3.select("#graphics2").selectAll("circle")
          		.filter(function(f) {
                			return f.name === d.name;
				})
			.style("fill",function (d)  {return "yellow"})
			  
            		})
                  
        		.on("mouseout", function(d) {       
            		div.transition()        
                	.duration(500)      
                	.style("opacity", 0); 
			d3.select(this).style("fill", colour(d.continent));  
			d3.select("#graphics2").selectAll("circle").style("fill",function (d)  { return colour(d.continent);});
       			 });


	// this is the animation duration in ms
	// if animate is true then 500ms, otherwise 0ms (no animation)
	var duration = animate ? 500 : 0;


	tempCountries = countries;

	if (continentIndex == 0) {
	
	tempCountries = tempCountries.slice(0, 26);	//Africa

	}
	
	else if (continentIndex == 1)  {

	tempCountries = tempCountries.slice(26, 56);	//Asia

	}

	else if (continentIndex == 2)  {

	tempCountries = tempCountries.slice(56, 63);	//Australia
	}

	else if (continentIndex == 3)  {

	tempCountries = tempCountries.slice(63, 103);	//Europe
	}

	else if (continentIndex == 4)  {
	
	tempCountries = tempCountries.slice(103, 121);	//NA
	}

	else if (continentIndex == 5)  {

	tempCountries = tempCountries.slice(122, 130);	//SA

	}
	else if (continentIndex == 6)  {

	tempCountries = tempCountries.slice(0, 130);

	}



	var selection = root.selectAll(".country").data(tempCountries);

	selection
		.transition()
		.duration(duration)
		
		//.delay(1000) will delay every point (ie. no anonymous function)
		//delays movement of each data point one after another, the greater the value you
		//multiply i with, the slower the staggering (delays each data point!)
		.delay(function(d, i) {
			if (animate) {
				return i * 10;			
			} else {
				return 0
			};
		})
		
		// lets not forget that this selection is actually giving us the <g> element that contains the <circle> element
		// (see createVis() for how this is constructed)
		.attr("transform", function(d) {
			// we change the transform property to position the <g>
			// using our scales, we give it the value and it will give us screen coordinates
			// similar to the map() function from processing
			var xValue = xScale(d.values[xAxisIndex]);
			var yValue = yScale(d.values[yAxisIndex]);
			// once again we construct this string translate(x,y)
			return "translate(" +
				xValue + "," + 
				yValue + ")";
		})

	// we also want to change the radius of the circle, first we must select the circle that sits inside of our <g> tag
	.select("circle")
	// change the radius similar to how we changed the transform property
	.attr("r", function(d) {
		// here we return an integer, not a string as above
		return sizeScale(d.values[sizeIndex]);
	    });

	//for removing and filtering data you want to remove
	selection.exit().remove();


	//recreate variable holding the circle so we can maintain a continent colour coding
	//even after we have removed a selection of our code
	var selection2 = root.selectAll(".country").data(tempCountries)
	selection2.selectAll("circle")       
	.style("fill",function (d)  { return colour(d.continent);});


	// update the scales for the x and y axes
	xAxis.scale(xScale);
	yAxis.scale(yScale);
	
	// this will redraw the axis, ticks, and labels
	root.select(".xAxis").call(xAxis)
		// here is where the axis label is changed!
		// by using the class "label", we can select the <text> tag under the <g class="xAxis"> element
		// and change it's text based on the headers array
		.select(".label").text(headers[xAxisIndex]);
	root.select(".yAxis").call(yAxis)
		.select(".label").text(headers[yAxisIndex]);

}



//BUTTON SPANS FOR FIRST TOP CHART
// this function is to demonstrate how we can bind anything to html elements, not just data!
function createContButtons() {
	// this array will be the list of dropdown menus
	// each element will have a name (for labeling) and the target measure it will change
	buttonsData = [
		{name:"continents", target: "c"}
	];

	// we don't use root here!
	// select the #buttons div and create a <span> for each button we have defined in the buttonsData array above
	var buttonGroups = d3.select("#buttons").selectAll(".buttonGroup")
		.data(buttonsData).enter()
		.append("span").attr("class", "buttonGroup");


	// add a label to each <span> and set the text to be the name of the dropdown (e.g. "x axis")
	// this name is defined in the array above
	buttonGroups.append("label").html(function(d){return d.name;});

	// add a <select> dropdown tag to the <span> tag
	buttonGroups.append("select")
		// when the dropdown selection changes, this event handler is called
		.on("change", function(d) {
			// find the index of the selection
			var selectedIndex = d3.select(this).property('selectedIndex');
			// here is where the target comes into play.

			if (d.target == "c") {
				continentIndex = selectedIndex;

			}
			

			// and update the vis, this will change the scales, labels, and reposition/resize the circles
			//creates the animation
			updateVis(true);

		})



		// add options to each <select> tag.
		// these options are coming from the countries array and are bound the same way as above
			.selectAll("option")
			.data(continents).enter()
			.append("option")
			// set the text of each option to the data elements from the headers array (these are only strings)
			.text(function(d) { return d; });  


}


// this function is to demonstrate how we can bind anything to html elements, not just data!
function createYButtons() {
	// this array will be the list of dropdown menus
	// each element will have a name (for labeling) and the target measure it will change
	buttonsData2 = [
		{name:"y axis", target: "y"}
	];

	// we don't use root here!
	// select the #buttons div and create a <span> for each button we have defined in the buttonsData array above
	var buttonGroups2 = d3.select("#buttons").selectAll(".buttonGroup2")
		.data(buttonsData2).enter()
		.append("span").attr("class", "buttonGroup2");


	// add a label to each <span> and set the text to be the name of the dropdown (e.g. "x axis")
	// this name is defined in the array above
	buttonGroups2.append("label").html(function(d){return d.name;});

	// add a <select> dropdown tag to the <span> tag
	buttonGroups2.append("select")
		// when the dropdown selection changes, this event handler is called
		.on("change", function(d) {
			// find the index of the selection
			var selectedIndex = d3.select(this).property('selectedIndex');
			// here is where the target comes into play.

			if (d.target == "y") {
				yAxisIndex = selectedIndex;
			}
			

			// and update the vis, this will change the scales, labels, and reposition/resize the circles
			//creates the animation
			updateVis(true);
		})



		// add options to each <select> tag.
		// these options are coming from the countries array and are bound the same way as above

			//root = d3.selectAll("option")
			.selectAll("option")
			
			.data(headers).enter()
			.append("option")
			// set the text of each option to the data elements from the headers array (these are only strings)
			.text(function(d) { return d; })
			//.attr("transform", function(d, i) {return "translate(0," + i * 20 + ")";});

}



/*------------------------------------------------------------SECOND SCATTERPLOT------------------------------------------*/

function createVis2() {
	// this uses d3 to select the #chart element (which is a div)
	// and underneath that select all svg elements, which there is one of
	root2 = d3.select("#graphics2")
		.attr("width", width + margin * 2)
		.attr("height", height + margin * 2);


	// first thing we should do is to create a group element inside the <svg>
	// this will position our scatterplot so that there are margins separating it from the edge of the <svg> canvas
	// we will also redefine our root variable to be this new <g> html object instead of the <svg #graphics> html object that we previous defined it as
	root2 = root2.append("g")

		// we must set the position using the transform property
		.attr("transform", "translate(" + margin + "," + margin + ")"); // we are creating this string: translate(50,50)

	// now we will add two <g> tags, each will contain a scale
	root2.append("g")
		.attr("class", "xAxis")
		.attr("transform", "translate(0," + height + ")")
		// this is what creates the axis, tick marks, and text inside of this <g> element
		.call(xAxis)
			// and we also add a <text> element under this <group> with class "label"
			// note that the .attr() calls are only affected the <text> element, not the <g> parent element
			.append("text")
			// by giving this <text> element a class, it allows us to change what the axis text will say in updateVis()
			.attr("class", "label")
			.attr("x", width)
			.attr("y", -6)
			.style("text-anchor", "end");

	root2.append("g")
		.attr("class", "yAxis")
		.call(yAxis)
			.append("text")
			.attr("class", "label")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end");
		
	root2.selectAll(".country").data(countries)
		// we enter the selection and add a <g> for each piece of data
		.enter()
		// the <g> tag will contain a circle
		// we will position the circle by changing the "transform" property of the <g>, NOT the x and y coordinates of the circle
		// this way, if we want to add a label to the circle, we only need to add it to this parent <g> tag and it will take care of positioning the label along 			with the circle
		.append("g")
		.attr("class", "country")
			.append("circle")
			.style("fill",function (d)  { return colour(d.continent);})
			.style("stroke", "#000000") // would be better to put this in the stylesheet
			.style("stroke-width", 1)   
       			.attr(function(d) { return (d.name); })        
        		
			.on("mouseover", function(d) {      
            		div.transition()        
                	.duration(200)      
                	.style("opacity", .9);      
            		div.html("Country: " + "<br/>"  + d.name)  
            	    	.style("left", (d3.event.pageX) + "px")     
                	.style("top", (d3.event.pageY - 28) + "px")  
			d3.select(this).style("fill", "yellow")

			d3.select("#graphics").selectAll("circle")
          		.filter(function(f) {
                			return f.name === d.name;
				})
			.style("fill",function (d)  {return "yellow"})
			  
             		})		
                  

  
        		.on("mouseout", function(d) {      
            		div.transition()        
                	.duration(500)      
                	.style("opacity", 0)
			d3.select(this).style("fill", colour(d.continent))
			d3.select("#graphics").selectAll("circle").style("fill",function (d)  { return colour(d.continent);});

       			 })


		var legend = root2.selectAll(".legend")
		.data(colour.domain())
		.enter().append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) {return "translate(0," + i * 20 + ")";});

		legend.append("rect")
		.attr("x", width - 18)
		.attr("width", 18)
		.attr("height", 18)
		.style("fill", colour);
		
		legend.append("text")
		.attr("x", width - 24)
		.attr("y", 9)
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		.text(function(d) {return d;});

}



function updateVis2(animate) {
	// compute the max value for the x and y and size scales
	var maxValX = d3.max(countries, function (d) { return d.values[xAxisIndex];});
	var maxValY = d3.max(countries, function (d) { return d.values[yAxisIndex2];});
	var maxValSize = d3.max(countries, function (d) { return d.values[sizeIndex];});
	// and recompute the domain for each axis based on these max values
	// note that we are making the assumption that our measures are starting at 0 (no negative values)
	xScale.domain([0, maxValX]);
	yScale.domain([0, maxValY]);
	sizeScale.domain([0, maxValSize]);

	sizeScale.domain([0, d3.max(countries, function(d){return d.values[sizeIndex]})]);

	//append a second scatterplot chart onto the page
	var tooltip = root2.append("div")
	.attr("class","tooltip")
	.style("opacity",0);


		root2.selectAll(".country").data(countries)
		// we enter the selection and add a <g> for each piece of data
		.enter()
		// the <g> tag will contain a circle
		// we will position the circle by changing the "transform" property of the <g>, NOT the x and y coordinates of the circle
		// this way, if we want to add a label to the circle, we only need to add it to this parent <g> tag and it will take care of positioning the label along 			with the circle
		.append("g")
		.attr("class", "country")
			.append("circle")
			//each circle, representative of a country will be coloured based on the continent in which the belong
			.style("fill",function (d)  { return colour(d.continent);})
			.style("opacity", 1) 
			.style("stroke", "#000000") // would be better to put this in the stylesheet
			.style("stroke-width", 1)   
       			.attr(function(d) { return (d.name); }) 

			.on("mouseover", function(d) {      
            		div.transition()        
                	.duration(200)      
                	.style("opacity", .9);      
            		div.html("Country: " + "<br/>"  + d.name)  
            	    	.style("left", (d3.event.pageX) + "px")     
                	.style("top", (d3.event.pageY - 28) + "px")
			d3.select(this).style("fill", "yellow")

			d3.select("#graphics").selectAll("circle")
          		.filter(function(f) {
                			return f.name === d.name;
				})
			.style("fill",function (d)  {return "yellow"})
			  
            		})
                  
        		.on("mouseout", function(d) {       
            		div.transition()        
                	.duration(500)      
                	.style("opacity", 0); 
			d3.select(this).style("fill", colour(d.continent));  
			d3.select("#graphics").selectAll("circle").style("fill",function (d)  { return colour(d.continent);});
       			 });    

	// this is the animation duration in ms
	// if animate is true then 500ms, otherwise 0ms (no animation)
	var duration = animate ? 500 : 0;


	tempCountries = countries;

	if (continentIndex2 == 0) {
	
	tempCountries = tempCountries.slice(0, 26);

	}
	
	else if (continentIndex2 == 1)  {

	tempCountries = tempCountries.slice(26, 56);

	}

	else if (continentIndex2 == 2)  {

	tempCountries = tempCountries.slice(56, 63);
	}

	else if (continentIndex2 == 3)  {

	tempCountries = countries.slice(63, 103);
	}

	else if (continentIndex2 == 4)  {
	
	tempCountries = countries.slice(103, 121);
	}

	else if (continentIndex2 == 5)  {

	tempCountries = countries.slice(121, 130);

	}
	else if (continentIndex2 == 6)  {

	tempCountries = countries.slice(0, 130);

	}

	var selection = root2.selectAll(".country").data(tempCountries);

	selection
		.transition()
		.duration(duration)
		
		//.delay(1000) will delay every point (ie. no anonymous function)
		//delays movement of each data point one after another, the greater the value you
		//multiply i with, the slower the staggering (delays each data point!)
		.delay(function(d, i) {
			if (animate) {
				return i * 10;			
			} else {
				return 0
			};
		})
		
		// lets not forget that this selection is actually giving us the <g> element that contains the <circle> element
		// (see createVis() for how this is constructed)
		.attr("transform", function(d) {
			// we change the transform property to position the <g>
			// using our scales, we give it the value and it will give us screen coordinates
			// similar to the map() function from processing
			var xValue = xScale(d.values[xAxisIndex]);
			var yValue = yScale(d.values[yAxisIndex2]);
			// once again we construct this string translate(x,y)
			return "translate(" +
				xValue + "," + 
				yValue + ")";
		})
    


	// we also want to change the radius of the circle, first we must select the circle that sits inside of our <g> tag
	.select("circle")
	// change the radius similar to how we changed the transform property
	.attr("r", function(d) {
		// here we return an integer, not a string as above
		return sizeScale(d.values[sizeIndex]);
	    });

	//for removing and filtering data you want to remove
	selection.exit().remove();


	//recreate variable holding the circle so we can maintain a continent colour coding
	//even after we have removed a selection of our code
	var selection = root2.selectAll(".country").data(tempCountries);
	selection.select("circle")
	.style("fill",function (d)  { return colour(d.continent);});

	// update the scales for the x and y axes
	xAxis.scale(xScale);
	yAxis.scale(yScale);
	
	// this will redraw the axis, ticks, and labels
	root2.select(".xAxis").call(xAxis)
		// here is where the axis label is changed!
		// by using the class "label", we can select the <text> tag under the <g class="xAxis"> element
		// and change it's text based on the headers array
		.select(".label").text(headers[xAxisIndex]);
	root2.select(".yAxis").call(yAxis)
		.select(".label").text(headers[yAxisIndex2]);
}


//continent dropdown menu
function createContButtons2() {
	// this array will be the list of dropdown menus
	// each element will have a name (for labeling) and the target measure it will change
	buttonsData3 = [
		{name:"continents", target: "c"}
	];

	// we don't use root here!
	// select the #buttons div and create a <span> for each button we have defined in the buttonsData array above
	var buttonGroups = d3.select("#buttons2").selectAll(".buttonGroup3")
		.data(buttonsData3).enter()
		.append("span").attr("class", "buttonGroup3");


	// add a label to each <span> and set the text to be the name of the dropdown (e.g. "x axis")
	// this name is defined in the array above
	buttonGroups.append("label").html(function(d){return d.name;});

	// add a <select> dropdown tag to the <span> tag
	buttonGroups.append("select")
		// when the dropdown selection changes, this event handler is called
		.on("change", function(d) {
			// find the index of the selection
			var selectedIndex = d3.select(this).property('selectedIndex');
			// here is where the target comes into play.

			if (d.target == "c") {
				continentIndex2 = selectedIndex;
			}
			

			// and update the vis, this will change the scales, labels, and reposition/resize the circles
			//creates the animation
			updateVis2(true);
		})



		// add options to each <select> tag.
		// these options are coming from the countries array and are bound the same way as above
			.selectAll("option")
			.data(continents).enter()
			.append("option")
			// set the text of each option to the data elements from the headers array (these are only strings)
			.text(function(d) { return d; });  


}


//y-axis change drop down menu
// this function is to demonstrate how we can bind anything to html elements, not just data!
function createYButtons2() {
	// this array will be the list of dropdown menus
	// each element will have a name (for labeling) and the target measure it will change
	buttonsData4 = [
		{name:"y axis", target: "y"}
	];

	// we don't use root here!
	// select the #buttons div and create a <span> for each button we have defined in the buttonsData array above
	var buttonGroups2 = d3.select("#buttons2").selectAll(".buttonGroup4")
		.data(buttonsData4).enter()
		.append("span").attr("class", "buttonGroup4");


	// add a label to each <span> and set the text to be the name of the dropdown (e.g. "x axis")
	// this name is defined in the array above
	buttonGroups2.append("label").html(function(d){return d.name;});

	// add a <select> dropdown tag to the <span> tag
	buttonGroups2.append("select")
		// when the dropdown selection changes, this event handler is called
		.on("change", function(d) {
			// find the index of the selection
			var selectedIndex = d3.select(this).property('selectedIndex');
			// here is where the target comes into play.

			if (d.target == "y") {
				yAxisIndex2 = selectedIndex;
			}
			

			// and update the vis, this will change the scales, labels, and reposition/resize the circles
			//creates the animation
			updateVis2(true);

		})



		// add options to each <select> tag.
		// these options are coming from the countries array and are bound the same way as above
			.selectAll("option")
			.data(headers).enter()
			.append("option")
			// set the text of each option to the data elements from the headers array (these are only strings)
			.text(function(d) { return d; });  


}

