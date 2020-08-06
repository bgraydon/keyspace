lockview = {}

lockview.shallowcopy_change_vals = function(object,newvals) {
	return Object.fromEntries(Object.entries(object).concat(Object.entries(newvals)))
}
lockview.negArray = function(pos, neg) {
	ret = pos.concat();
	for(i in neg) {
		ret[-1-i] = neg[i];
	}
	return ret;
}


lockview.schlageLockspec = {
	unit: 'thou',
	pinDia: 115,
	pinTipRadius: 30,
	pinEdgeAngle: 45,
	numPins: 5,
	numDepths: 10,
	depths: [335,320,305,290,275,260,245,230,215,200,0,0,0,0],
	spaces: [231,387,543,699,855,1011,0,0,0,0,0,0,0,0],
	depthIndexOffset: 0,
	cutterWheel: {
		foreAngle: 45,
		aftAngle: 45,
		foreLen: 30,
		aftLen: 30,
		amend: function(params){return lockview.shallowcopy_change_vals(this,params);}
	},
	plugDia: 500,
	pinRestHeight: 150,
	pinSideSlop: 3,
	pinStackHeight: 450,
	driverHeight: 200,
	constantDriverHeight: false,
	plugRadiusSlop: 3,
	housingPinStackLength: 400,
	springSVG: "m 0,0 c 0.606385,-4.21073 4.834594,-4.54482 4.834594,0.98573 0,3.0346 -1.960633,3.03671 -1.960633,-0.0408 0,-5.48975 4.830256,-5.50645 4.830256,-0.0278 0,3.10738 -1.937857,3.12408 -1.937857,0.0574 0,-5.51935 4.824853,-5.53605 4.824853,-0.0305 0,3.08048 -1.9472,3.09759 -1.9472,0.01 0,-5.49855 4.926,-5.49855 4.926,0.0202 0,3.06728 -1.94725,3.06728 -1.94725,-0.0236 0,-5.49515 4.17528,-5.16106 2.39413,1.84985",
	keywayHeight: 335,
	keyBlankLength: 1060,
	totalLockHeight: 1100,
	totalLockLength: 1300,
	housingBelowKeywayThickness: 100,
	keyTipAngle: 42,
	keyTipIntercept: 150,
	keyTipClipAngle: 45,
	keyTipClipIntercept: 60,
	keyTipSVG: "",
	keyShoulderHeadSVG: " v 30 h -90 a 400 400 0 1 1 0 -445 h 90 z m -530 143.5 a 100 100 0 1 0 -200 0 a 100 100 0 1 0 200 0",
	icCollar: {
		present: false,
		pins: [2,3], // Zero-indexed! 
		depth: 3,
		amend: function(params){return lockview.shallowcopy_change_vals(this,params);}
	},
	keyBank: [],
	amend: function(params){return lockview.shallowcopy_change_vals(this,params);}
}

lockview.medecoLockspec = lockview.schlageLockspec.amend({
	pinTipRadius: 3,
	numPins: 6,
	numDepths: 6,
	depths: [0,272,247,222,197,172,147,122,97,72],
	spaces: [213,383,553,723,893,1063],
	pinRestHeight: 147,
	depthIndexOffset: 1,
	keywayHeight: 307,
	keyBlankLength: 1250,
	cutterWheel: {
		foreAngle: 44,
		aftAngle: 44,
		foreLen: 3,
		aftLen: 3,
	}
});

lockview.bestA2Lockspec = lockview.schlageLockspec.amend({
	pinTipRadius: 30,
	numPins: 7,
	numDepths: 10,
	depths: [318,305.5,293,280.5,268,255.5,243,230.5,218,205.5,193, 180.5, 168, 155.5, 143, 130.5, 118, 105.5, 93, 80.5],
	spaces: [88,238,388,538,688,838,988].map(v=>v+200),
	pinStackHeight: 500,
	keywayHeight: 318,
	keyBlankLength: 1350,
	totalLockHeight: 1100,
	totalLockLength: 1500,
	constantDriverHeight: false,
	cutterWheel: {
		foreAngle: 45,
		aftAngle: 45,
		foreLen: 25,
		aftLen: 25,
	},
	icCollar: {
		present: false,
		pins: [0,1,2,3,4,5,6], // Zero-indexed! 
		depth: 10,
		amend: function(params){return lockview.shallowcopy_change_vals(this,params);}
	},
});

lockview.bestA4Lockspec = lockview.bestA2Lockspec.amend({
	numDepths: 10,
	depths: [318,297,276,255,234,213,192,171,150,129,108,87],
	pinStackHeight: 500,
	constantDriverHeight: false,
	icCollar: {
		present: false,
		pins: [0,1,2,3,4,5,6], // Zero-indexed! 
		depth: 6,
		amend: function(params){return lockview.shallowcopy_change_vals(this,params);}
	},
});

lockview.style = {
	keyPin: {fill: "#DDDD00", stroke: 'black'},
	driverPin: {fill: "#CCCCCC", stroke: 'black'},
	masterWafer: {fill: "#FF4444", stroke: 'black'},
	unknownPins: {fill: "#FFFFFF", stroke: 'black', 'stroke-width': 3, 'stroke-dasharray': 4},
	plug: {fill: "#555555", stroke: 'black'},
	housing: {fill: "#888888", stroke: 'black'},
	icCollar: {fill: "#8888FF", stroke: 'black'}
}

lockview.defaultViewOpts = {
	style: lockview.style,
	keyRemovable: true,
	width: 750,
	cutaway: true,
	unknownPinstackBinds: false,
	controls: {
		moveKey: true,
		tryTurn: true,
		impression: true,
		setCode: true,
		setShearLines: true,
		toggleCutaway: true,
		amend: function(params){return lockview.shallowcopy_change_vals(this,params);}
	},
	amend: function(params){return lockview.shallowcopy_change_vals(this,params);}
}

lockview.lockSpecFromNumPins = function(numPins, numDepths, offset) {
	offset = offset || 0;
	return lockview.schlageLockspec.amend({
		numPins: numPins,
		numDepths: numDepths,
		depthIndexOffset: offset,
		spaces: [...Array(numPins).keys()].map(x=>231+156*x),
		depths: Array(offset).fill(0).concat([...Array(numDepths).keys()].map(x=>335-x*((numDepths<4?84:135)/(numDepths-1)))),
		keyBlankLength: 156*numPins+280,
		totalLockLength: 156*numPins+520
	});
}

lockview.exampleShearLines = [
	[2],
	[2,4],
	[1,3,5],
	[3,9],
	[1,9]
];
lockview.exampleKeyCode = [2,4,5,3,1];

lockview.upperPin = function(svg, lockspec, pinIndex, height, length, styleAttrs) {
	if(length<=0) console.log("WARNING: non positive upper pin length: "+length);
	var pin = svg.group();
	pin.rect(lockspec.pinDia, length)
		.translate(lockspec.spaces[pinIndex] - lockspec.pinDia/2, -height-length)
		.attr(styleAttrs);
	return pin;
}
lockview.keyPin = function(svg, lockspec, pinIndex, height, length, styleAttrs) {
	if(length<=0) console.log("WARNING: non positive key pin length: "+length);
	pinEdgeAngleRadians = lockspec.pinEdgeAngle / 180 * Math.PI;
	edgeSlope = Math.tan(pinEdgeAngleRadians);
	halfChordLen = Math.sin(pinEdgeAngleRadians) * lockspec.pinTipRadius;
	chordOffset = lockspec.pinTipRadius * (1 - Math.cos(pinEdgeAngleRadians));
	var pin = svg.group();
	pin.path(
		  "M 0 "+length // top left corner
		+" V "+(lockspec.pinDia/2*edgeSlope-chordOffset) // bottom of left straight section
		+" L "+(lockspec.pinDia/2-halfChordLen)+" "+(chordOffset) // tip left
		+" a "+lockspec.pinTipRadius+" "+lockspec.pinTipRadius+" 0 0 1"+(2*halfChordLen)+" 0" // tip right 
		+" L "+(lockspec.pinDia)+" "+(lockspec.pinDia/2*edgeSlope-chordOffset) // bottom of right straight section
		+" V "+length // top right corner
		+" Z")
		.fill("#FFFF00")
		.attr(styleAttrs)
		.rotate(180)
		.translate(lockspec.spaces[pinIndex] - lockspec.pinDia/2, -height-length);
	return pin;
}
lockview.pinSpring = function(svg, lockspec, pinIndex, length, styleAttrs) {
	styleAttrs = styleAttrs || {fill: "none", stroke: 'black', 'stroke-width': 0.1};
	spring = svg.group();
	spring.path(lockspec.springSVG)
		.attr(styleAttrs)
		.rotate(90, 0, 0);
	spring.translate(lockspec.spaces[pinIndex], -lockspec.plugDia - lockspec.housingPinStackLength)
		.scale(lockspec.pinDia*0.152, length*0.0687, 0, 0);
	return spring;
}

lockview.getPinStackHeight = function(lockspec, pinStackShears) {
	if(lockspec.constantDriverHeight)
		return lockspec.plugDia - lockspec.depths[pinStackShears.slice(-1)] + lockspec.driverHeight;
	else
		return lockspec.pinStackHeight;
}

lockview.pinsFromShears = function(svg, lockspec, knownShears, tipHeights) {
	tipHeights = tipHeights || Array(lockspec.numPins).fill(lockspec.pinRestHeight);
	var pinStacks = [];
	for(var i in knownShears) {
		var pinStack = [];
		sortedShears = knownShears[i].sort((a,b)=>a-b);
		if(sortedShears.length > 0 && !isNaN(sortedShears[0])) {
			pinStack.push(lockview.keyPin(svg, lockspec, i, tipHeights[i], lockspec.plugDia - lockspec.depths[sortedShears[0]], lockview.style.keyPin));
			for(j in sortedShears) {
				if(j == 0) continue;
				pinStack.push(
					lockview.upperPin(svg, lockspec, i, 
						tipHeights[i] + lockspec.plugDia - lockspec.depths[sortedShears[j-1]], 
						lockspec.depths[sortedShears[j-1]] - lockspec.depths[sortedShears[j]], 
						lockview.style.masterWafer
					)
				);
			}
			pinStack.push(
				lockview.upperPin(svg, lockspec, i, 
					tipHeights[i] + lockspec.plugDia - lockspec.depths[sortedShears[sortedShears.length-1]], 
					lockspec.constantDriverHeight
						? lockspec.driverHeight
						: lockspec.pinStackHeight - lockspec.plugDia + lockspec.depths[sortedShears[sortedShears.length-1]]
					, 
					lockview.style.driverPin
				)
			);
			pinStack.push(lockview.pinSpring(svg, lockspec, i, lockspec.plugDia + lockspec.housingPinStackLength - lockview.getPinStackHeight(lockspec, sortedShears) - tipHeights[i]));
		} else {
			pinStack.push(lockview.keyPin(svg, lockspec, i, -lockspec.pinStackHeight, lockspec.pinStackHeight, lockview.style.unknownPins));
			//pinStack.push(svg.rect().attr({visibility: "hidden"}));
			pinStack.push(svg.rect().attr({visibility: "hidden"}));
			/*pinStack.push(svg
				.text("?")
				.translate(lockspec.spaces[i] - lockspec.pinDia/2, lockspec.plugDia)
			);*/
			pinStack.push(lockview.pinSpring(svg, lockspec, i, lockspec.plugDia + lockspec.housingPinStackLength));
		}
		pinStacks.push(pinStack);
	}
	return pinStacks;
}
lockview.lockPlug = function(svg, lockspec) {
	plug = svg.group();
	plug.rect(
			lockspec.spaces[0] - lockspec.pinDia/2 - lockspec.pinSideSlop, 
			lockspec.plugDia-lockspec.keywayHeight
		).translate(0, 0)
		.attr(lockview.style.plug);
	var i;
	for(i=1;i<lockspec.numPins;i++) {
		plug.rect(
				lockspec.spaces[i]-lockspec.spaces[i-1]-lockspec.pinDia-2*lockspec.pinSideSlop, 
				lockspec.plugDia-lockspec.keywayHeight
			).translate(
				lockspec.spaces[i-1]+lockspec.pinDia/2+lockspec.pinSideSlop, 
				0
			).attr(lockview.style.plug)
	}
	plug.rect(
			lockspec.keyBlankLength - lockspec.spaces[i-1] - lockspec.pinDia/2 - lockspec.pinSideSlop, 
			lockspec.plugDia-lockspec.keywayHeight
		).translate(
			lockspec.spaces[i-1] + lockspec.pinDia/2 + lockspec.pinSideSlop,
			0
		).attr(lockview.style.plug);
	plug.translate(0, -lockspec.plugDia);
}
lockview.lockHousing = function(svg, lockspec) {
	housing = svg.group();
	housing.path(
		  "M 0 "+lockspec.plugRadiusSlop
		+" h "+lockspec.keyBlankLength
		+" v -"+(lockspec.plugDia+2*lockspec.plugRadiusSlop)
		+lockspec.spaces.slice(0,lockspec.numPins).reverse().reduce(
			(a,v)=>a+
			 " H "+(v+lockspec.pinDia/2+lockspec.pinSideSlop)
			+" v -"+lockspec.housingPinStackLength
			+" h -"+(lockspec.pinDia+2*lockspec.pinSideSlop)
			+" v "+lockspec.housingPinStackLength
		,"")
		+" H 0"
		+" V -"+(lockspec.totalLockHeight-lockspec.housingBelowKeywayThickness)
		+" H "+lockspec.totalLockLength
		+" V "+lockspec.housingBelowKeywayThickness
		+" H 0"
		+" Z"
	).attr(lockview.style.housing);
}
lockview.ICCollar = function(svg, lockspec, styleAttrs) {
	if(!lockspec.icCollar.present) return;
	if(lockspec.icCollar.depth<=0) return;
	if(lockspec.icCollar.pins.length<=0) return;
	
	
	icStart = Math.min(...lockspec.icCollar.pins);
	icEnd = Math.max(...lockspec.icCollar.pins);
	spacesAugmented = [2*lockspec.spaces[0]-lockspec.spaces[1]].concat(lockspec.spaces.slice(0,lockspec.numPins)).concat([2*lockspec.spaces[lockspec.numPins-1]-lockspec.spaces[lockspec.numPins-2]]);
	collarThickness = lockspec.icCollar.depth*(lockspec.depths[1]-lockspec.depths[2]);
	collar = svg.group();
	
	collar.rect( // Top of collar, start
		(spacesAugmented[icStart+1]-spacesAugmented[icStart]-lockspec.pinDia)/2-lockspec.pinSideSlop, 
		collarThickness
	).translate(
		lockspec.spaces[icStart] - (spacesAugmented[icStart+1]-spacesAugmented[icStart])/2,
		-lockspec.plugDia - collarThickness - lockspec.pinSideSlop
	).attr(styleAttrs);
	for(var i=icStart;i<icEnd;i++) {
		collar.rect( // Top of collar, between pins
			spacesAugmented[i+1] - spacesAugmented[i] - lockspec.pinDia - 2*lockspec.pinSideSlop, 
			collarThickness
		).translate(
			lockspec.spaces[i] + lockspec.pinDia/2 + lockspec.pinSideSlop,
			-lockspec.plugDia - collarThickness - lockspec.pinSideSlop
		).attr(styleAttrs);
	}
	collar.rect( // Top of collar, end
		(spacesAugmented[icEnd+1]-spacesAugmented[icEnd]-lockspec.pinDia)/2-lockspec.pinSideSlop, 
		collarThickness
	).translate(
		lockspec.spaces[icEnd] + lockspec.pinDia/2 + lockspec.pinSideSlop,
		-lockspec.plugDia - collarThickness - lockspec.pinSideSlop
	).attr(styleAttrs);
	collar.rect( // Bottom of Collar
		-spacesAugmented[icStart]*1.5+(spacesAugmented[icStart+1]-lockspec.pinDia+spacesAugmented[icEnd+1]+spacesAugmented[icEnd]+lockspec.pinDia)/2,
		collarThickness > lockspec.housingBelowKeywayThickness ? lockspec.housingBelowKeywayThickness / 2 : collarThickness
	).translate(
		lockspec.spaces[icStart]-(spacesAugmented[icStart+1]-spacesAugmented[icStart])/2,
		lockspec.pinSideSlop
	).attr(styleAttrs);
	
	
	/*var inGroup = false; 
	var lastGroupStart = -1;
	for(var i=0; i<lockspec.numPins; i++) {
		if(lockspec.icCollar.pins.includes(i)) {
			if(inGroup) {
				console.log("Continue collar top "+(i-1)+"-"+i);
			} else {
				inGroup = true;
				lastGroupStart = i;
			}
		} else {
			if(inGroup) {
			
			}
		}
	}*/ // Maybe one day I'll make it support broken collars, but it is not this day. 
}

lockview.keyProfile = function(lockspec, code) {
	points=[[0,0]];
	
	leadingM = -Math.tan(lockspec.cutterWheel.aftAngle / 180 * Math.PI);
	laggingM = Math.tan(lockspec.cutterWheel.foreAngle / 180 * Math.PI);
	
	cutCoords = code
		.map((v,i)=>[lockspec.spaces[i],lockspec.depths[v]])
		.concat([[lockspec.keyBlankLength + lockspec.cutterWheel.foreLen, lockspec.keyTipIntercept]]);
	
	for(var i in cutCoords) {
		if(i == cutCoords.length - 1) {
			laggingM = Math.tan(lockspec.keyTipAngle / 180 * Math.PI);
		}
	
		prevPoint = points[points.length - 1];
		point0 = ([cutCoords[i][0] - lockspec.cutterWheel.foreLen, lockspec.keywayHeight - cutCoords[i][1]]);
		point1 = ([cutCoords[i][0] + lockspec.cutterWheel.aftLen, lockspec.keywayHeight - cutCoords[i][1]]);
		intersectionX = (prevPoint[1] - point0[1] - leadingM*prevPoint[0] + laggingM*point0[0]) / (laggingM - leadingM);
		if(intersectionX >= prevPoint[0] && intersectionX <= point0[0]) {
			intersectionY = leadingM*(intersectionX - prevPoint[0]) + prevPoint[1];
			if(intersectionY < 0) {
				if(prevPoint[0] !== 0)
					points.push([-prevPoint[1]/leadingM + prevPoint[0], 0]);
				points.push([-point0[1]/laggingM + point0[0], 0]);
			} else {
				points.push([intersectionX, intersectionY]);
			}
			points.push(point0);
		} else if(intersectionX <= point0[0]) {
			prevPoint[0] = (prevPoint[1] - point0[1])/laggingM + point0[0];
			points.push(point0);
		} else {
			points.push([(point0[1] - prevPoint[1])/leadingM + prevPoint[0], point0[1]]);
		}
		points.push(point1);
	}
	points.pop();
	return points;
}
lockview.pinHeightAtPosition = function(lockspec, code, position) {
	profile = lockview.keyProfile(lockspec, code);
	return lockspec.keywayHeight - profile
		.slice(0, profile.length-1) // remove last element to prep for pairing
		.sort((a,b)=>a[0]>b[0]) 
		.map((v,i)=>[profile[i],profile[i+1]]) // get pairs of coords (line segments)
		.filter(v=> v[0][0]-lockspec.pinTipRadius < position && v[1][0]+lockspec.pinTipRadius > position) // only look at nearby line segments
		.map(function(points){
			slope = (points[0][1] - points[1][1]) / (points[0][0] - points[1][0]);
			angle = Math.atan2((points[0][1] - points[1][1]), (points[0][0] - points[1][0]));
			if(points[1][1] == points[1][1]
				&& points[0][0]<=position+Math.sin(angle)*lockspec.pinTipRadius
				&& points[1][0]>=position+Math.sin(angle)*lockspec.pinTipRadius) {
				return slope*(position - points[0][0]) + points[0][1] + lockspec.pinTipRadius + 1/Math.cos(angle)*lockspec.pinTipRadius;
				//return 100;
			} else if(points[0][0]<=position && points[0][0]>position+Math.sin(angle)*lockspec.pinTipRadius) {
				return points[0][1] - Math.sqrt(lockspec.pinTipRadius**2 - (points[0][0] - position)**2) + lockspec.pinTipRadius;
			} else if(points[1][0]>=position && points[1][0]<position+Math.sin(angle)*lockspec.pinTipRadius) {
				return points[1][1] - Math.sqrt(lockspec.pinTipRadius**2 - (position - points[1][0])**2) + lockspec.pinTipRadius;
			}
			return lockspec.keywayHeight;
		})
		.reduce((v,a)=>Math.min(v,a), lockspec.keywayHeight - lockspec.pinRestHeight);
}
lockview.drawKey = function(svg, lockspec, code, text) {
	key = svg.group();
	key.path(
		lockview.keyProfile(lockspec, code).map(
			(v,i)=>
			" "+(i?"L":"M")+" "+v[0]+" "+v[1]
		)
		.join("")
		.concat(" V "+(lockspec.keywayHeight - lockspec.keyTipClipIntercept))
		.concat(" L "+(lockspec.keyBlankLength - lockspec.keyTipClipIntercept * Math.tan(lockspec.keyTipClipAngle / 180 * Math.PI))+" "+lockspec.keywayHeight)
		.concat(" H 0")
		.concat(lockspec.keyShoulderHeadSVG)
	)
	.stroke("black")
	.fill("yellow")
	.attr({"fill-rule":"nonzero"});
	
	text = text || "";
	key.text(text)
		.font({ fill: '#000000', family: 'sans-serif', size: '140pt', anchor: 'middle'})
		.rotate(-90)
		.translate(-350, -30)
		
	key.translate(0, -lockspec.keywayHeight);
	//key.polyline([...Array(lockspec.keyBlankLength+100).keys()].map(v=>v+","+(2*335-lockview.pinHeightAtPosition(lockspec, code,v))).join(" ")).fill('none').stroke({width: 2, color:'green'}).translate(0,-lockspec.keywayHeight);
	return key;
}

lockview.raisePins = function(drawingInfo, heights) {
	//lockspec.pinStackHeight
	for(var i in drawingInfo.svgElements.pins) {
		var spring = drawingInfo.svgElements.pins[i][drawingInfo.svgElements.pins[i].length-1];
		var driver = drawingInfo.svgElements.pins[i][drawingInfo.svgElements.pins[i].length-2];
			
		pinStackHeight = lockview.getPinStackHeight(drawingInfo.lockspec, drawingInfo.lockShears[i]);
		
		heightDiff = heights[i] + driver.y() + pinStackHeight;
		var pins = drawingInfo.svgElements.pins[i].slice(0, drawingInfo.svgElements.pins[i].length - 2);
		for(j in pins) {
			pins[j].translate(0, -heightDiff);
		}
		if(heights[i]<500) { // Why does this work???
			spring.scale(1, (drawingInfo.lockspec.plugDia + drawingInfo.lockspec.housingPinStackLength - pinStackHeight - heights[i]) / (drawingInfo.lockspec.plugDia + drawingInfo.lockspec.housingPinStackLength + driver.y()), 0, 0);
		}
		driver.y(-heights[i] - pinStackHeight);
	}
}
lockview.raisePinsByKey = function(drawingInfo, keyPos) {
	lockview.raisePins(drawingInfo, drawingInfo.lockspec.spaces.slice(0, drawingInfo.lockspec.numPins).map(v=>lockview.pinHeightAtPosition(drawingInfo.lockspec, drawingInfo.keyCode, v+keyPos)));
}
lockview.keyIn = function(drawingInfo) {
	slider = document.getElementById(drawingInfo.containerId+"_slider");
	drawingInfo.activeIntervals.forEach(v=>clearInterval(v));
	drawingInfo.activeIntervals = [];
	drawingInfo.activeIntervals.push(intervalKeyIn = setInterval(() => {
		slider.value=parseInt(slider.value)+10;
		slider.dispatchEvent(new Event("input")); 
		if(slider.value >= parseInt(slider.max)) {
			clearInterval(intervalKeyIn);
			if(drawingInfo.activeIntervals.includes(intervalKeyIn)) drawingInfo.activeIntervals.splice(drawingInfo.activeIntervals.indexOf(intervalKeyIn), 1);
		}
	}, 10));
}
lockview.keyOut = function(drawingInfo) {
	slider = document.getElementById(drawingInfo.containerId+"_slider");
	drawingInfo.activeIntervals.forEach(v=>clearInterval(v));
	drawingInfo.activeIntervals = [];
	drawingInfo.activeIntervals.push(intervalKeyOut = setInterval(() => {
		slider.value=parseInt(slider.value)-10;
		slider.dispatchEvent(new Event("input")); 
		if(slider.value <= 0) {
			clearInterval(intervalKeyOut);
			if(drawingInfo.activeIntervals.includes(intervalKeyOut)) drawingInfo.activeIntervals.splice(drawingInfo.activeIntervals.indexOf(intervalKeyOut), 1);
		}
	}, 10));
}
lockview.redrawKey = function(newCode, newStamp) {
	keyX = this.svgElements.key.x();
	this.svgElements.key.remove();
	this.svgElements.key = lockview.drawKey(this.svgElements.scaled, this.lockspec, newCode, newStamp);
	this.svgElements.key.x(keyX);
	this.keyCode = newCode;
	this.keyStamp = newStamp;
	this.moveKey(this.keyPosition); 
	this.svgElements.side.front();
	if(this.viewopts.controls.setCode) {
		[...Array(this.lockspec.numPins).keys()].forEach(j=>document.getElementById(this.containerId+"_cut_"+j).value = newCode[j]);
	}

}
lockview.redrawPins = function(newShears) {
	if(newShears)
		this.lockShears = newShears;
	this.svgElements.pins.forEach(stack=>stack.forEach(pin=>pin.remove()));
	this.svgElements.pins = lockview.pinsFromShears(this.svgElements.scaled, this.lockspec, this.lockShears, Array(this.lockspec.numPins).fill(this.lockspec.pinRestHeight));
	this.moveKey(this.keyPosition); 
}
lockview.calcBinding = function(code, shears, unknownPinstackBinds) {
	return [...code.keys()].filter(i=>!shears[i].includes(code[i]) && ((shears[i].length > 0 && !isNaN(shears[i][0])) || unknownPinstackBinds));
}
lockview.calcICBinding = function(code, shears, collarPins, collarDepth) {
	return [...code.keys()].filter(i=>collarPins.includes(i) && !shears[i].includes(code[i]+collarDepth) && ((shears[i].length > 0 && !isNaN(shears[i][0])) || unknownPinstackBinds));
}
lockview.tryTurn = function(drawingInfo) {
	drawingInfo = drawingInfo || this;
	binding = lockview.calcBinding(drawingInfo.keyCode, drawingInfo.lockShears, drawingInfo.viewopts.unknownPinstackBinds);
	drawingInfo.clearShearMarks();
	if(Math.abs(drawingInfo.svgElements.key.x() + drawingInfo.svgElements.key.width() - drawingInfo.lockspec.keyBlankLength) > 5) {
		document.getElementById(drawingInfo.containerId+"_txtTryTurn").innerHTML = "Key not inserted.";
		return [];
	}
	textStatus = "Key does not turn.";
	for(var i in binding) {
		drawingInfo.bindingSVGLines.push(drawingInfo.svgElements.scaled
			.line(0, 0, drawingInfo.lockspec.pinDia, 0)
			.translate(drawingInfo.lockspec.spaces[binding[i]] - drawingInfo.lockspec.pinDia/2, -drawingInfo.lockspec.plugDia)
			.stroke({color: "#FFAA00", width: 30, linecap:'round'})
			.attr({'stroke-opacity':"75%"}));
	}
	if(binding.length == 0) {
		drawingInfo.bindingSVGLines.push(drawingInfo.svgElements.scaled
			.line(0, 0, drawingInfo.lockspec.spaces[drawingInfo.lockspec.numPins-1] - drawingInfo.lockspec.spaces[0] + drawingInfo.lockspec.pinDia, 0)
			.translate(drawingInfo.lockspec.spaces[0] - drawingInfo.lockspec.pinDia/2, -drawingInfo.lockspec.plugDia)
			.stroke({color: "#88FF00", width: 30, linecap:'round'})
			.attr({'stroke-opacity':"70%"}));
		textStatus = "Lock opens."
	}
	if(drawingInfo.lockspec.icCollar.present) {
		icbinding = lockview.calcICBinding(drawingInfo.keyCode, drawingInfo.lockShears, drawingInfo.lockspec.icCollar.pins, drawingInfo.lockspec.icCollar.depth);
		collarThickness = drawingInfo.lockspec.icCollar.depth*(drawingInfo.lockspec.depths[1]-drawingInfo.lockspec.depths[2]);
		for(var i in icbinding) {
		drawingInfo.bindingSVGLines.push(drawingInfo.svgElements.scaled
			.line(0, 0, drawingInfo.lockspec.pinDia, 0)
			.translate(drawingInfo.lockspec.spaces[icbinding[i]] - drawingInfo.lockspec.pinDia/2, -drawingInfo.lockspec.plugDia - collarThickness)
			.stroke({color: "#FFAA00", width: 30, linecap:'round'})
			.attr({'stroke-opacity':"75%"}));
		}
		if(icbinding.length == 0 && binding.filter(v=>!drawingInfo.lockspec.icCollar.pins.includes(v)).length == 0) {
			drawingInfo.bindingSVGLines.push(drawingInfo.svgElements.scaled
				.line(0, 0, drawingInfo.lockspec.spaces[Math.max(...drawingInfo.lockspec.icCollar.pins)] - drawingInfo.lockspec.spaces[Math.min(...drawingInfo.lockspec.icCollar.pins)] + drawingInfo.lockspec.pinDia, 0)
				.translate(drawingInfo.lockspec.spaces[Math.min(...drawingInfo.lockspec.icCollar.pins)] - drawingInfo.lockspec.pinDia/2, -drawingInfo.lockspec.plugDia - collarThickness)
				.stroke({color: "#88FF00", width: 30, linecap:'round'})
				.attr({'stroke-opacity':"70%"}));
			textStatus = (binding.length == 0) ? "IC Collar spins freely" : "IC Core Released";
		}
	}
	document.getElementById(drawingInfo.containerId+"_txtTryTurn").innerHTML = textStatus;
	if(!drawingInfo.viewopts.cutaway) {
		drawingInfo.clearShearMarks();
	}
	return drawingInfo.bindingSVGLines;
}
lockview.impression = function(drawingInfo) {
	drawingInfo = drawingInfo || this;
	lockview.tryTurn(drawingInfo);
	if(Math.abs(drawingInfo.svgElements.key.x() + drawingInfo.svgElements.key.width() - drawingInfo.lockspec.keyBlankLength) > 5) {
		return;
	}

	binding = lockview.calcBinding(drawingInfo.keyCode, drawingInfo.lockShears);
	if(binding.length == 0) return;
	bindingPin = binding[0];
	return drawingInfo.svgElements.key
		.line(0, 0, drawingInfo.lockspec.pinTipRadius, 0)
		.translate(
			drawingInfo.lockspec.spaces[bindingPin] - drawingInfo.lockspec.pinTipRadius/2, 
			drawingInfo.lockspec.keywayHeight - drawingInfo.lockspec.depths[drawingInfo.keyCode[bindingPin]] + 6
		)
		.stroke({color: "#77EE00", width: 12, linecap:'round'});
}
lockview.codeFromString = function(str) {
	candidate=str.split(",");
	if(candidate.length<2) {
		candidate=str.split(" ");
		if(candidate.length<2) {
			candidate=str.split("");
		}
	}
	return candidate.map(function(x) {return parseInt(x)-1;});
}
lockview.clearMarks = function(drawingInfo) {
	drawingInfo.clearShearMarks();
}

lockview.addLock = function(containerId, lockspec, viewopts, keyCode, lockShears, keyStamp) {
	if(keyCode.length !== lockspec.numPins) console.log("WARNING: key code length does not match number of pins.");
	if(lockShears.length !== lockspec.numPins) console.log("WARNING: lock shears array length does not match number of pins.");
	if(!document.getElementById(containerId)) console.log("WARNING: ID '"+containerId+"' not found in the document.");
	document.getElementById(containerId).style.padding = "20px";
	document.getElementById(containerId).innerHTML = 
		 ((viewopts.keyBank && viewopts.keyBank.length) ? (
			 "<div id='"+containerId+"_keyBank' style='border: 1px solid black;margin: 3px;padding: 3px;'></div>"
		 ) : "")
		+((viewopts.controls.setCode) ? (
			 "<div style='background-color:#FFFF00;border: 1px solid #888888;border-radius: 5px;margin: 3px;padding: 3px;display:inline-block'>"
			+"Key Code: "+(keyCode.map((v,i)=>"Cut "+(i+1)+": <input type='number' id='"+containerId+"_cut_"+i+"' value='"+v+"' min='"+lockspec.depthIndexOffset+"' max='"+(lockspec.numDepths-1+lockspec.depthIndexOffset)+"' style='width:40px;' /> ").join(""))+"</div>"
		 ) : "")
		+((viewopts.controls.setShearLines) ? (
			 "<div style='background-color:#FF8866;border: 1px solid #888888;border-radius: 5px;margin: 3px;padding: 3px;display:inline-block'>"
			+"Shear Lines: "+(lockShears.map((v,i)=>"Pin "+(i+1)+": <input id='"+containerId+"_shear_"+i+"' value='"+v.join()+"' style='width:40px;' /> ").join(""))+"</div><br />"
		 ) : "")
		+((viewopts.controls.moveKey && viewopts.keyRemovable) ? (
			 "<button id='"+containerId+"_btnKeyIn'>Key in</button>"
			+"<button id='"+containerId+"_btnKeyOut'>Key out</button> | "
		 ) : "")
		+((viewopts.controls.tryTurn) ? ("<button id='"+containerId+"_btnTryTurn'>Try Turning Key</button> ") : "")
		+((viewopts.controls.impression) ? ("<button id='"+containerId+"_btnImpression'>Impression</button> ") : "")
		+((viewopts.controls.tryTurn || viewopts.controls.impression) ? ("<span id='"+containerId+"_txtTryTurn'></span>") : "")
		+((viewopts.controls.toggleCutaway) ? (" | <label><input type='checkbox' id='"+containerId+"_chkCutaway' "+(viewopts.cutaway?"checked":"")+" style=''>Cutaway Lock</label><br />") : "")
		+((viewopts.controls.moveKey && viewopts.keyRemovable) ? ("<input type='range' id='"+containerId+"_slider' style='width:"+viewopts.width+"px;'>") : "")
		;
	var draw = SVG().addTo('#'+containerId).size(viewopts.width, viewopts.width*0.55);
	var scaled = draw.group();
	
	var drawingInfo = {
		containerId: containerId,
		lockspec: lockspec,
		viewopts: viewopts,
		keyCode: keyCode,
		lockShears: lockShears,
		keyStamp: keyStamp,
		svgElements: {
			top: draw,
			scaled: scaled
		},
		redrawKey: lockview.redrawKey,
		redrawPins: lockview.redrawPins,
		bindingSVGLines: [],
		tryTurn: lockview.tryTurn,
		impression: lockview.impression,
		clearShearMarks: function(){this.bindingSVGLines.map(v=>v.remove()); this.bindingSVGLines=[];},
		keyPosition: 0,
		moveKey: function(position) {
			this.keyPosition = position;
			lockview.raisePinsByKey(drawingInfo, position);
			drawingInfo.svgElements.key.x(lockspec.keyBlankLength - position - drawingInfo.svgElements.key.width());
			drawingInfo.clearShearMarks();
		},
		activeIntervals: []
	};
	document.getElementById(containerId).dataset.drawingInfo = drawingInfo;

	lockview.lockPlug(scaled, lockspec);
	lockview.lockHousing(scaled, lockspec);
	lockview.ICCollar(scaled, lockspec, viewopts.style.icCollar);
	drawingInfo.svgElements.pins = lockview.pinsFromShears(scaled, lockspec, lockShears, Array(lockspec.numPins).fill(lockspec.pinRestHeight));
	drawingInfo.svgElements.key = lockview.drawKey(scaled, lockspec, keyCode, keyStamp);
	drawingInfo.svgElements.side = scaled
		.rect(lockspec.totalLockLength, lockspec.totalLockHeight)
		.translate(0, lockspec.housingBelowKeywayThickness - lockspec.totalLockHeight)
		.attr(lockview.shallowcopy_change_vals(viewopts.style.housing, {visibility: viewopts.cutaway ? "hidden" : "visible"}));

	if(viewopts.keyRemovable) {
		drawingInfo.scale = viewopts.width / (drawingInfo.svgElements.key.width() + lockspec.totalLockLength);
		scaled.scale(drawingInfo.scale, 0, 0).translate(drawingInfo.svgElements.key.width() * drawingInfo.scale, lockspec.totalLockHeight * drawingInfo.scale);
		draw.size(viewopts.width, Math.max(lockspec.totalLockHeight + lockspec.housingBelowKeywayThickness, lockspec.keywayHeight - drawingInfo.svgElements.key.y()+drawingInfo.svgElements.key.height()) * drawingInfo.scale);
	} else {
		drawingInfo.scale = viewopts.width / (drawingInfo.svgElements.key.width() - lockspec.keyBlankLength + lockspec.totalLockLength);
		scaled.scale(drawingInfo.scale, 0, 0).translate((drawingInfo.svgElements.key.width() - lockspec.keyBlankLength) * drawingInfo.scale, lockspec.totalLockHeight * drawingInfo.scale);
		draw.size(viewopts.width, Math.max(lockspec.totalLockHeight + lockspec.housingBelowKeywayThickness, lockspec.keywayHeight - drawingInfo.svgElements.key.y()+drawingInfo.svgElements.key.height()) * drawingInfo.scale);
	}
	
	if(viewopts.controls.tryTurn) document.getElementById(containerId+"_btnTryTurn").addEventListener("click", function() {drawingInfo.tryTurn()});
	if(viewopts.controls.impression) document.getElementById(containerId+"_btnImpression").addEventListener("click", function() {drawingInfo.impression()});
	if(viewopts.controls.toggleCutaway) document.getElementById(containerId+"_chkCutaway").addEventListener("change", function() {
		drawingInfo.svgElements.side.attr({visibility: this.checked ? "hidden" : "visible"});
		drawingInfo.viewopts.cutaway = this.checked;
	});
	
	for(var i=0; i<lockspec.numPins; i++) {
		if(viewopts.controls.setCode) document.getElementById(containerId+"_cut_"+i).addEventListener("input", function() {drawingInfo.redrawKey([...new Array(lockspec.numPins).keys()].map(i=>parseInt(document.getElementById(containerId+"_cut_"+i).value)), drawingInfo.keyStamp)});
		if(viewopts.controls.setShearLines) document.getElementById(containerId+"_shear_"+i).addEventListener("input", function() {drawingInfo.redrawPins([...new Array(lockspec.numPins).keys()].map(i=>document.getElementById(containerId+"_shear_"+i).value.split(",").map(v=>parseInt(v))))});
	}
	if(viewopts.controls.moveKey && viewopts.keyRemovable) {
		document.getElementById(containerId+"_btnKeyOut").addEventListener("click", function() {lockview.keyOut(drawingInfo)});
		document.getElementById(containerId+"_btnKeyIn").addEventListener("click", function() {lockview.keyIn(drawingInfo)});
		document.getElementById(containerId+"_slider").max = lockspec.keyBlankLength;
		document.getElementById(containerId+"_slider").addEventListener("input", function() {drawingInfo.moveKey(lockspec.keyBlankLength - this.value)});
		document.getElementById(containerId+"_slider").value=0;
		document.getElementById(containerId+"_slider").dispatchEvent(new Event("input")); 
	} else {
		drawingInfo.moveKey(0);
	}
	
	if(viewopts.keyBank && viewopts.keyBank.length) {
		var kbDiv = document.getElementById(containerId+"_keyBank");
		for(var i in viewopts.keyBank) {
			kbDiv.innerHTML += "<button id='"+containerId+"_keyBank_"+i+"'><div id='"+containerId+"_keyBank_SVGContainer_"+i+"'></div>"+viewopts.keyBank[i].name+"</button>";
		}
		for(var i in viewopts.keyBank) {
			viewopts.keyBank[i].SVGNode = SVG().addTo('#'+containerId+"_keyBank_SVGContainer_"+i).size(100, 60);
			viewopts.keyBank[i].SVGGroup = viewopts.keyBank[i].SVGNode.group()
			viewopts.keyBank[i].SVGKey = lockview.drawKey(viewopts.keyBank[i].SVGGroup, lockspec, viewopts.keyBank[i].code, viewopts.keyBank[i].stamp)
			viewopts.keyBank[i].SVGKey
				.translate(
					viewopts.keyBank[i].SVGGroup.width() - lockspec.keyBlankLength,
					viewopts.keyBank[i].SVGGroup.height() + viewopts.keyBank[i].SVGKey.y() + 100
				)
			viewopts.keyBank[i].SVGGroup.scale(100/viewopts.keyBank[i].SVGGroup.width(), 0, 0);
			document.getElementById(containerId+"_keyBank_"+i).dataset.stamp = viewopts.keyBank[i].stamp;
			document.getElementById(containerId+"_keyBank_"+i).dataset.code = JSON.stringify(viewopts.keyBank[i].code);
			document.getElementById(containerId+"_keyBank_"+i).addEventListener("click", function() {
				var code = JSON.parse(this.dataset.code);
				drawingInfo.redrawKey(code, this.dataset.stamp);
			});
		}
	}
	
	return drawingInfo;
}