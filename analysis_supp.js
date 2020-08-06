function fileable1pin(start, end) {
	//console.log(start,end);
	seenOneLower = false;
	var i;
	for(i in start) {
		if(start[i] < end[i]) {
			if(seenOneLower) {
				return false
			}
			seenOneLower = true;
		}
		if(start[i] > end[i]) {
			return false;
		}
	}
	return seenOneLower;
}
function fileable(start, end) {
	var i;
	for(i in start) {
		if(start[i] > end[i]) {
			return false;
		}
	}
	return true;
}

var topCode;
function optimiseBlanks() {
	if(pspace)
		opspace = expandDependantKeyspace(space, 0);
	else
		opspace = space.concat();
	
	paths = [];
	while(opspace.length > 0) {
		topCodeIndx = opspace.reduce((a,v,i)=>fileable1pin(v,a.v)?{i: i, v: v}:a, {i: 0, v: opspace[0]});
		path = opspace.splice(topCodeIndx.i, 1);
		nextDescendant = topCodeIndx.v;
		while(true) {
			nextDescendant = opspace
				.filter(v=>fileable1pin(nextDescendant, v))
				.reduce((a,v,i)=>
					(v.reduce((a,b)=>a+b, 0) < a.reduce((a,b)=>a+b, 0))
						? v
						: a, 
					[1000000]
				)
			if(nextDescendant[0] == 1000000) {
				break;
			} else {
				path.push(opspace.splice(opspace.findIndex((v,i)=>v.every((e,i)=>e==nextDescendant[i])), 1)[0]);
			}
		}
		paths.push(path);
		//console.log(opspace);
		//console.log(path);
	}
	//console.log(paths);
	return paths;
	
	// {id: 1, label: 'Node 1'},
	/*var nodes = [];
	for(i in space) {
		nodes.push({id: i, label: space[i].join("")});
	}

	  // create an array with edges
	  //{from: 1, to: 3},
	var edges = [];
	var i,j;
	for(i in space) {
		for(j in space) {
			if(fileable1pin(space[j], space[i])) {
				edges.push({from: i, to: j, arrows: 'from'});
				//console.log(i,j);
			}
		}
	}*/
	  
	//graph(nodes, edges, {});
}

function optimiseBlanksReport() {
	paths = optimiseBlanks();
	s="<h4>Report: Brute Force Keyspace in Fewest Blanks</h4>";
	s+="This key space can be brute forced with <b>"+paths.length+"</b> blanks, filed a maximum of <b>"+Math.max(...paths.map(v=>v.length))+"</b> times.<br />";
	s+="This improves the brute force cost to <b>$"+bruteForceCostString(paths.length)+"</b>.<br />"
	for(i in paths) {
		s+="Blank "+(parseInt(i)+1)+": ";
		for(j in paths[i]) {
			if(j>0) s+= "&#8594;";
			s+='<div class="rule" style="background-color:#FFFF00;display:inline-block;vertical-align: middle;">'+paths[i][j].map(v=>v+1).join("")+'</div>';
		}
		s+="<br />";
	}

	return s;
}

function colouredPinReport() {
	s="<h4>Report: Coloured Pin Lengths</h4>";
	var rule = rules.find(v=>v.name == "colourPin");
	if(!rule) return s+"No rules include any limitation based on coloured pins:<br /><br />";
	s+="Keypin colours from <b>"+colourPinLists[rule.colourPinSet].name+"</b> set for a <b>"+commonKeyDepths[rule.colourPinKeySys].name+"</b> lock.";
	s+="<table class='table'><tr><th>Depth</th><th>Keypin Length</th><th>Keypin Colour</th></tr>";
	for(i in rule.cache.colourChart) {
		s+="<tr><th>"+(parseInt(i)+1)+"</th><td>"+rule.cache.colourChart[i].pinLen+"</td><td><div style='display:inline-block;width:1em;height:1em;border:1px solid black;background-color:"+rule.cache.colourChart[i].colourHTML+"'> </div> "+rule.cache.colourChart[i].colourName+"</td></tr>";
	}
	s+="</table>"
	return s;
}

function exportReport() {
	s="<h4>Report: JSON of Rules for Exporting</h4>";
	s+='<textarea class="form-control" style="width:100%;height:150px;font-family:monospace;">{"numPins":'+numPins+',"numDepths":'+numDepths+',"lockType":"'+lockType+'","labelOffset":"'+labelOffset+'","rules":'+JSON.stringify(rules)+'}</textarea>';
	s+="Save this text to file, and you can import it later to pick up where you left off.";
	return s;
}

function importTask() {
	s="<h4>Task: Import Rules and System from JSON</h4>";
	s+='<textarea id="IO_'+analysisID+'" class="form-control" style="width:100%;height:150px;font-family:monospace;"></textarea>';
	s+="<button class='btn btn-primary' onclick='Import(document.getElementById(\"IO_"+analysisID+"\").value); recalcSpace();'>Paste JSON data above and press this button to import it.</button>";
	return s;
}

function createTestLockReport() {
	s="<h4>Report: Interactive Test Lock for System</h4>";
	s+='<div id="testLockDiv_'+analysisID+'"></div>';
	return s;
}
function populateTestLockReport() {
	if(pspace || space.length > 50) {
		keyBank = [];
	} else {
		keyBank = space.map(v=>{return {
			code: v.map(u=>u+labelOffset), 
			stamp: v.map(u=>u+labelOffset == 10 ? 0 : u+labelOffset).join(""), 
			name: v.map(u=>u+labelOffset == 10 ? 0 : u+labelOffset).join("")};
		});
	}
	l0 = lockview.addLock('testLockDiv_'+(analysisID-1), 
		lockview.lockSpecFromNumPins(numPins, numDepths, labelOffset).amend({
		}), 
		lockview.defaultViewOpts.amend({
			keyBank: keyBank,
			width: window.innerWidth - 150
		}), 
		Array(numPins).fill(labelOffset), 
		pinFreq().map(
			v=>v
				.map((u,i)=>{return {u:u,i:i}})
				.filter(u=>u.u>0)
				.map(u=>u.i+labelOffset)
			), 
		"");
}

function createRulesLockReport() {
	s="<h4>Report: Interactive Test for Known Locks and Keys on System</h4>";
	if(rules.filter(v=>v.name=="shear").length==0) {
		s+="No known locks on system.  Add a \"known shear lines\" rule to view that lock here.";
	}
	for(i in rules.filter(v=>v.name=="shear")) {
		s+='<div id="testRuleDiv_'+analysisID+'_'+i+'"></div>';
	}
	return s;
}
function populateRulesLockReport() {
	rules.filter(v=>v.name=="shear").map(v=>v.cache.p_shears).forEach((v,i)=>{
		lockview.addLock('testRuleDiv_'+(analysisID-1)+'_'+i, 
			lockview.lockSpecFromNumPins(numPins, numDepths, labelOffset).amend({
			}), 
			lockview.defaultViewOpts.amend({
				keyBank: [],
				width: window.innerWidth - 150
			}), 
			Array(numPins).fill(0), 
			v, 
			"");
	});
}

function conditionalEntropyReport() {
	s="<h4>Report: Mutual Information Between Rules</h4>";
	s+="<div style='display:block;'>Select up to three rules to compare:<br />"
	s+="<ol>"+rules
		.map((v,i)=>"<li><label><input type='checkbox' onchange='calculateConditionalEntropy("+analysisID+")' id='selectRule_"+analysisID+"_"+i+"' /><div style='display:inline-block;border:1px solid #888888;border-radius:10px;padding:4px;background-color:"+document.getElementById('rule_'+i).style.backgroundColor+"'>"+ruleText(v)+"</div></label></li>")
		.join("")
		+"</ol></div>";
	s+="<div id='entropyResult_"+analysisID+"' style='display:inline-block;margin:10px;'></div>";
	s+="<div id='entropyResultJoints_"+analysisID+"' style='display:inline-block;margin:10px;'></div>";
	return s;
}
function calculateConditionalEntropy(analysisID) {
	ruleSubset = rules.filter((v,i)=>document.getElementById("selectRule_"+analysisID+"_"+i).checked).slice(0,3);
	indxSubset = [...new Array(rules.length).keys()].filter((v,i)=>document.getElementById("selectRule_"+analysisID+"_"+i).checked).slice(0,3);
	
	prevSpace = space;
	prevPSpace = pspace;
	
	powSet = powerSet(ruleSubset);
	powIdx = powerSet(indxSubset);
	powSpace = [];
	
	for(ruleSet_i in powSet) {
		space=[];	
		for(j=0;j<numPins;j++) {
			space.push([]);
			for(k=0;k<numDepths;k++) {
				space[j].push(k);
			}
		}
		
		pspace=true;
		// Calculate space
		for(ruleNum in powSet[ruleSet_i]) {
			rule_s(powSet[ruleSet_i][parseInt(ruleNum)],space);
		}
		
		powSpace.push(spaceSize(space));
		console.log(powIdx[ruleSet_i], Math.log2(powSpace[0]-powSpace[ruleSet_i]));
		
		//Math.log2(spaceSize(space))
	}
	var styleAttrs = {"fill":"none", "stroke":"black"};
	var labelStyle = {anchor: 'middle', family: 'serif', size: '12pt'};
	var entropyStyle = {anchor: 'middle', family: 'serif', size: '18pt'};
	document.getElementById("entropyResult_"+analysisID).innerHTML = "";
	document.getElementById("entropyResultJoints_"+analysisID).innerHTML = "";

	if(indxSubset.length == 2) {
		draw = SVG().addTo("#entropyResult_"+analysisID).size(300, 220);
		draw.rect(300,220).attr(styleAttrs);
		draw.circle(200).attr(styleAttrs).translate(10,10);
		draw.circle(200).attr(styleAttrs).translate(90,10);

		var JAB = Math.log2(powSpace[0])-Math.log2(powSpace[3]);
		var JA =  Math.log2(powSpace[0])-Math.log2(powSpace[1]);
		var JB =  Math.log2(powSpace[0])-Math.log2(powSpace[2]);
		
		draw.text("H("+(indxSubset[0]+1)+"|"+(indxSubset[1]+1)+")").font(labelStyle).translate(50,90);
		draw.text("H("+(indxSubset[1]+1)+"|"+(indxSubset[0]+1)+")").font(labelStyle).translate(250,90);
		draw.text("I("+(indxSubset[0]+1)+";"+(indxSubset[1]+1)+")").font(labelStyle).translate(150,90);
		draw.text((JAB-JB).toFixed(2)).font(entropyStyle).translate(50,105);
		draw.text((JAB-JA).toFixed(2)).font(entropyStyle).translate(250,105);
		draw.text(Math.max(0,JB+JA-JAB).toFixed(2)).font(entropyStyle).translate(150,105);
		draw.style.display = "inline-block";
		/*document.getElementById("entropyResultJoints_"+analysisID).innerHTML+="<table class='table'>"
			+"<tr><th>Value</th><th>Bits</th></tr>"
			+"<tr><th>H("+(indxSubset[0]+1)+","+(indxSubset[1]+1)+")</th><td>"+JAB.toFixed(3)+"</td></tr>"
			+"<tr><th>H("+(indxSubset[0]+1)+")</th><td>"+JA.toFixed(3)+"</td></tr>"
			+"<tr><th>H("+(indxSubset[1]+1)+")</th><td>"+JB.toFixed(3)+"</td></tr>"
			+"</table>";*/
			
		/*var JAB = (powSpace[3]);
		var JA =  (powSpace[1]);
		var JB =  (powSpace[2]);
		
		draw.text("H("+(indxSubset[0]+1)+"|"+(indxSubset[1]+1)+")").font(labelStyle).translate(50,90);
		draw.text("H("+(indxSubset[1]+1)+"|"+(indxSubset[0]+1)+")").font(labelStyle).translate(250,90);
		draw.text("I("+(indxSubset[0]+1)+";"+(indxSubset[1]+1)+")").font(labelStyle).translate(150,90);
		draw.text((JAB-JB).toFixed(2)).font(entropyStyle).translate(50,105);
		draw.text((JAB-JA).toFixed(2)).font(entropyStyle).translate(250,105);
		draw.text(Math.abs(JB+JA-JAB).toFixed(2)).font(entropyStyle).translate(150,105);
		draw.style.display = "inline-block";
		document.getElementById("entropyResultJoints_"+analysisID).innerHTML+="<table class='table'>"
			+"<tr><th>Value</th><th>Bits</th></tr>"
			+"<tr><th>H("+(indxSubset[0]+1)+","+(indxSubset[1]+1)+")</th><td>"+JAB.toFixed(3)+"</td></tr>"
			+"<tr><th>H("+(indxSubset[0]+1)+")</th><td>"+JA.toFixed(3)+"</td></tr>"
			+"<tr><th>H("+(indxSubset[1]+1)+")</th><td>"+JB.toFixed(3)+"</td></tr>"
			+"</table>";*/
	}
	if(indxSubset.length == 3) {
		draw = SVG().addTo("#entropyResult_"+analysisID).size(300, 300);
		draw.rect(300,300).attr(styleAttrs);
		draw.circle(200).attr(styleAttrs).translate(50,10);
		draw.circle(200).attr(styleAttrs).translate(10,90);
		draw.circle(200).attr(styleAttrs).translate(90,90);

		var JABC = Math.log2(powSpace[0])-Math.log2(powSpace[7]);
		var JAB  = Math.log2(powSpace[0])-Math.log2(powSpace[3]);
		var JAC  = Math.log2(powSpace[0])-Math.log2(powSpace[5]);
		var JBC  = Math.log2(powSpace[0])-Math.log2(powSpace[6]);
		var JA   = Math.log2(powSpace[0])-Math.log2(powSpace[1]);
		var JB   = Math.log2(powSpace[0])-Math.log2(powSpace[2]);
		var JC   = Math.log2(powSpace[0])-Math.log2(powSpace[4]);
		
		draw.text("H("+(indxSubset[0]+1)+"|"+(indxSubset[1]+1)+","+(indxSubset[2]+1)+")").font(labelStyle).translate(150,30);
		draw.text(Math.max(0,JABC-JBC).toFixed(1)).font(entropyStyle).translate(150,45);
		draw.text("H("+(indxSubset[1]+1)+"|"+(indxSubset[0]+1)+","+(indxSubset[2]+1)+")").font(labelStyle).translate(50,180);
		draw.text(Math.max(0,JABC-JAC).toFixed(1)).font(entropyStyle).translate(50,195);
		draw.text("H("+(indxSubset[2]+1)+"|"+(indxSubset[0]+1)+","+(indxSubset[1]+1)+")").font(labelStyle).translate(250,180);
		draw.text(Math.max(0,JABC-JAB).toFixed(1)).font(entropyStyle).translate(250,195);
		draw.text("I("+(indxSubset[1]+1)+";"+(indxSubset[2]+1)+"|"+(indxSubset[0]+1)+")").font(labelStyle).translate(150,210);
		draw.text(Math.max(0,JAC+JAB-JA-JABC).toFixed(1)).font(entropyStyle).translate(150,225);
		draw.text("I("+(indxSubset[0]+1)+";"+(indxSubset[1]+1)+"|"+(indxSubset[2]+1)+")").font(labelStyle).translate(95,92);
		draw.text(Math.max(0,JAC+JBC-JC-JABC).toFixed(1)).font(entropyStyle).translate(80,107);
		draw.text("I("+(indxSubset[0]+1)+";"+(indxSubset[2]+1)+"|"+(indxSubset[1]+1)+")").font(labelStyle).translate(205,92);
		draw.text(Math.max(0,JAB+JBC-JB-JABC).toFixed(1)).font(entropyStyle).translate(220,107);
		draw.text("I("+(indxSubset[0]+1)+";"+(indxSubset[1]+1)+";"+(indxSubset[2]+1)+")").font(labelStyle).translate(150,125);
		draw.text(Math.max(0,JA+JB+JC-JAB-JAC-JBC+JABC).toFixed(1)).font(entropyStyle).translate(150,140);
		draw.style.display = "inline-block";
	}
	
	space = prevSpace;
	pspace = prevPSpace;
}

function powerSet(set) {
	var i,j;
	pSet = [];
	binVal = new Array(set.length).fill(0);
	for(i=0;i<2**set.length;i++) {
		for(j=binVal.length-1;j>0;j--) {
			if(binVal[j]>1) {
				binVal[j]=0;
				binVal[j-1]++;
			}
		}
		pSet.push(set.filter((v,i)=>binVal[set.length-1-i]>0));
		binVal[binVal.length-1]++;
	}
	return pSet;
}

function graph(nodeArr, edgeArr, options) {
	  var nodes = new vis.DataSet(nodeArr);

	  // create an array with edges
	  var edges = new vis.DataSet(edgeArr);

	  // create a network
	  var container = document.getElementById('graph');
	  var data = {
		nodes: nodes,
		edges: edges
	  };
	  var network = new vis.Network(container, data, options);

}

function halfHeightsOneStack(stack) {
	var i;
	var halfStack = [];
	var added2=true;
	while(added2) {
		var added2=false;
		for(i in stack) {
			if(i==0) continue;
			if(stack[i]-stack[i-1]==1) {
				halfStack.push(stack[i] - 0.5);
				stack.splice(i-1,2);
				added2 = true;
				break;
			}
		}
	}
	halfStack = halfStack.concat(stack);
	halfStack.sort((a,b)=>a-b);
	return halfStack;
}
function halveCode(code, halfStack) {
	halfCode = [];
	var i,j;
	for(i in code) {
		for(j in halfStack) {
			if(Math.abs(code[i]-halfStack[j]) <= 0.5) {
				halfCode.push(halfStack[j]);
				break;
			}
		}
	}
	return halfCode;
}
function halveKeyspace(forPinFreqCalc) {
	var halfSpace = [];
	if(pspace) {
		for(i in space) {
			if(forPinFreqCalc)
				halfSpace.push(halfHeightsOneStack([...Array(numDepths).keys()]).filter(v=>space[i].some(u=>Math.abs(u-v)<=0.5)));
			else
				halfSpace.push(halfHeightsOneStack(space[i]));
		}
		return halfSpace;
	}
	halfSpaceHashes = [];
	halfStack = halfHeightsOneStack([...Array(numDepths).keys()]);
	for(var i in space) {
		halfCode = halveCode(space[i], halfStack);
		halfCodeHash = halfCode.join(",");
		if(!halfSpaceHashes.includes(halfCodeHash)) {
			halfSpaceHashes.push(halfCodeHash);
			halfSpace.push(halfCode);
		}
	}
	return halfSpace;
}

analysisID = 0;
function addAnalysis(html) {
	analysisHTML.innerHTML += "<div style='border:1px solid black;box-shadow: 0 0 3px blue;border-radius:10px;margin:10px;padding:10px;' id='analysis_"+(analysisID)+"'><button onclick='divRef=document.getElementById(\"analysis_"+(analysisID++)+"\");divRef.parentNode.removeChild(divRef);' style='float:right;'>X</button>"+html+"</div>";
}