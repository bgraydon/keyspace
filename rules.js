function expandDependantKeyspace(lspace,numAngles) {
	num=Array(numPins).fill(0);
	opts=[];
	var newSpace = [];
	for(i in lspace) {
		num[i]=lspace[i].length;
		if(num[i]==0) return [];
	}
	cur=Array(numPins).fill(0);
	toBreak=false;
	for(i=0;i<Math.pow(numAngles || numDepths,numPins);i++) {
		var toAdd=Array(numPins);
		for(j in cur) {
			toAdd[j]=lspace[j][cur[j]];
		}
		newSpace.push(toAdd);
		cur[numPins-1]++;
		for(j=numPins-1;j>=0;j--) {
			if(cur[j]>=num[j]) {
				cur[j]=0;
				if(j>0) cur[j-1]++;
				else toBreak=true;
			}
		}
		if(toBreak) break;
	}
	
	if(numAngles)
		a_pspace=false;
	else
		pspace=false;
	return newSpace;
}

function spaceSize(lspace,pinxpin) {
	if(pinxpin===undefined ? pspace : pinxpin) {
		if(lspace.length==0) return 0;
		c=1;
		for(i in lspace) {
			c*=lspace[i].length;
		}
		return c;
	} else {
		return lspace.length;
	}
}

function getFAangle(list,fa) {
	r=[];
	for(i in list) {
		if(!r.includes(list[i].substr(fa,1)))
			r.push(list[i].substr(fa,1));
	}
	return r;
}

function rule_s(rule,lspace) {
	var i,j;
	if(rule.name=="medeco_cb_angle" && a_pspace) {
		//Originate
		new_a_space=Array();
		if(lockType=="medeco") {
			for(i in medeco_cb_angles.angles) {
				var to_add=Array(Math.min(numPins,6));
				var will_add=true;
				for(j=0;j<Math.min(numPins,6);j++) {
					to_add[j]=medeco_cb_angles.angles[i].substr(j,1);
					if(!a_space[j].includes(to_add[j])) will_add=false;
				}
				if(will_add) new_a_space.push(to_add);
			}
		}
		if(lockType=="medeco2") {
			for(i in medeco_cb_angles.angles_2) {
				var to_add=Array(Math.min(numPins,6));
				var will_add=true;
				for(j=0;j<Math.min(numPins,6);j++) {
					to_add[j]=medeco_cb_angles.angles_2[i].substr(j,1).replace("B","C_").replace("D","_C").replace("K","L_").replace("M","_L").replace("Q","R_").replace("S","_R");
					if(!a_space[j].includes(to_add[j])) will_add=false;
				}
				if(will_add) new_a_space.push(to_add);
			}
		}
		a_space=new_a_space;
		a_pspace=false;

	} else {
		if (!rule.angle || rule.depth) {
			try {
				if(!pspace) throw "Handling expanded space";
				if(lspace.length > 0 && lspace[0].length > 0) {
					for(j=0;j<lspace.length;j++) {
						for(i=0;i<lspace[j].length;) {
							if(rule_1pin(rule,j,lspace[j][i])) {
								lspace[j].splice(i,1);
							} else {
								i++;
							}
						}
					}
				}
				// Else keyspace == {}
			} catch (ex) {
				if(ex=="This rule has dependant pins - must flatten first.") {
					lspace=expandDependantKeyspace(lspace);
				}
				if(ex=="This rule has dependant pins - must flatten first." || ex=="Handling expanded space") {
					for(i=0;i<lspace.length;) {
						if(rule_1(rule,lspace[i])) {
							lspace.splice(i,1);
						} else {
							i++;
						}
					}
				} else throw "Error occurred - caught at line 101.";
				space=lspace;
			}
		}
		if (rule.angle) {
			try {
				if(!a_pspace) throw "Handling expanded space";
				if(a_space.length > 0 && a_space[0].length > 0) {
					for(j=0;j<a_space.length;j++) {
						for(i=0;i<a_space[j].length;) {
							if(rule_1pin(rule,j,a_space[j][i],true)) {
								a_space[j].splice(i,1);
							} else {
								i++;
							}
						}
					}
				}
				// Else keyspace == {}
			} catch (ex) {
				if(ex=="This rule has dependant pins - must flatten first.") {
					a_space=expandDependantKeyspace(a_space,numAngles);
				}
				if(ex=="This rule has dependant pins - must flatten first." || ex=="Handling expanded space") {
					for(i=0;i<a_space.length;) {
						if(rule_1(rule,a_space[i],true)) {
							a_space.splice(i,1);
						} else {
							i++;
						}
					}
				} else throw "Error occurred - caught at line 131.";
			}
		}
	}
}





function rule_1(rule,code) {
	var violates=false;
	var i,j;
	
	if(rule.name=="MACS") {
		for(j=0;j<numPins-1;j++) {
			if(Math.abs(code[j]-code[j+1])>rule.MACS) {
				return true;
			}
		}
	}
	
	
	if(rule.name=="IC") {
		var pins=rule.pins.split(",").map(function(x) {return parseInt(x)-1;})
		
		for(j=0;j<pins.length;j++) {
			if(code[pins[j]]<rule.depth) {
				violates=true;
				break;
			}
			if(pins[j]-1>=0 && !pins.includes(pins[j]-1) && Math.abs(code[pins[j]-1]-code[pins[j]]+rule.depth)>rule.MACS) {
				violates=true;
				break;
			}
			if(pins[j]+1<numPins && !pins.includes(pins[j]+1) && Math.abs(code[pins[j]+1]-code[pins[j]]+rule.depth)>rule.MACS) {
				violates=true;
				break;
			}
		}
	}


	if(rule.name=="CMK") {
		var pins=(rule.pins.split(",").map(function(x){return parseInt(x)-1;}))
		
		for(j=0;j<pins.length;j++) {
			if(code[pins[j]]>=numDepths-rule.depth) {
				violates=true;
				break;
			}
			if(pins[j]-1>=0 && !pins.includes(pins[j]-1) && Math.abs(code[pins[j]-1]-code[pins[j]]-rule.depth)>rule.MACS) {
				violates=true;
				break;
			}
			if(pins[j]+1<numPins && !pins.includes(pins[j]+1) && Math.abs(code[pins[j]+1]-code[pins[j]]-rule.depth)>rule.MACS) {
				violates=true;
				break;
			}
		}
	}	
	
	if(rule.name=="impression") {
		if(rule.rel=="lt" && code[rule.pin-1]<rule.depth) {
			violates=true;
		}
		if(rule.rel=="neq" && code[rule.pin-1]==rule.depth-1) {
			violates=true;
		}
		if(rule.rel=="eq" && code[rule.pin-1]!=rule.depth-1) {
			violates=true;
		}
	}

	if(rule.name=="CK") {
		ckcode=codeFromString(rule.code).map(v=>v+1-labelOffset);

		nPinMatches=0;
		if(rule.rotateConst) {
			for(j=0;j<numPins;j++) {
				if(ckcode[j]==code[j]) nPinMatches++;
				/*for(k=j+1;k<numPins;k++) {
					if(ckcode[j]==code[j] && ckcode[k]==code[k]) violates=true;
				}*/
			}
			if(nPinMatches!=rule.rotateN) violates=true;
		} else {
			var onePinHigh=false;
			for(j in ckcode) {
				if(code[j]==ckcode[j] || rule.space && Math.abs(code[j]-ckcode[j])<=rule.minSpace) {
					violates=true;
				}
				if(rule.twostep && code[j] % 2 != ckcode[j] %2) {
					violates=true;
				}
				if(code[j]<ckcode[j]) {
					onePinHigh=true;
				}
			}
			if(rule.file && !onePinHigh) violates=true;
		}
	}
	
	if(rule.name=="shear") {
		if(!rule.cache)
			rule.cache={};
		if(!rule.cache.p_shears) {
			rule.cache.p_shears=[];
			for(i in rule.shears) {
				rule.cache.p_shears.push(rule.shears[i].length==0?[]:rule.shears[i].split(",").map(function(x){return parseInt(x)-labelOffset;}));
			}
		}
		var onePinHigh=false;
		for(j in rule.cache.p_shears) {
			if(isNaN(rule.cache.p_shears[j][0])) continue;
			if(!rule.cache.p_shears[j].includes(code[j])) {
				violates=true;
			}
		}
	}
	
	if(rule.name=="medeco_cb_depth") {
		/*
		// Not releasing codebooks publicly at this time. 
		if(!medeco_cb_depths.depths_5) {
			medeco_cb_depths.depths_5=medeco_cb_depths.depths.map(function(x) {return Math.floor(x/10)})
		}
	
		equivNum=0;
		for(j=0;j<numPins;j++) {
			equivNum=equivNum*10+code[j]+1;
		}
		
		if(!(code[0]>0 && code[1]>0 && code[4]>0 && (!code[5]||code[5]>0) && (numPins==6 && medeco_cb_depths.depths.includes(equivNum) || numPins==5 && medeco_cb_depths.depths_5.includes(equivNum))))
			violates=true;
		*/
	}
	
	if(rule.name=="medeco_cb_angle") {
		/*
		// Not releasing codebooks publicly at this time. 
		if(lockType=="medeco")  return !medeco_cb_angles.angles.includes(stringFromCode(false,code).replace(/ /g,""))
		if(lockType=="medeco2") return !medeco_cb_angles.angles_2.includes(stringFromCode(false,code).replace(/ /g,""))
		*/
	}
	if(rule.name=="medeco_FA") {
		for(j=0;j<numPins;j++) {
			if(rule.FAs[j]!="?" && ((code[j].substr(0,1)=="_") == (rule.FAs[j]=="F") || (code[j].substr(1,1)=="_") == (rule.FAs[j]=="A"))) {
				return true;
			}
		}
		return false;
	}

	if(rule.name=="medeco_code") {
		for(j=0;j<numPins;j++) {
			if(!(
							(rule.code.substr(j*2,1).toUpperCase() == code[j].substr(0,1) || rule.code.substr(j*2+1,1).toUpperCase() == code[j].substr(1,1)) 
					 || (rule.code.substr(j*2,1) != rule.code.substr(j*2,1).toUpperCase() && code[j].substr(0,1)=="C")
					 || (rule.code.substr(j*2+1,1) != rule.code.substr(j*2+1,1).toUpperCase() && code[j].substr(1,1)=="C")
					 )) {
				return true;
			}
		}
		return false;
	}

	if(rule.name=="medeco_MACS") {
		for(j=0;j<numPins-1;j++) {
			if(Math.abs(code[j]-code[j+1])>parseInt(rule.MACS[j])) {
				violates=true;
				break;
			}
		}
	}
	if(rule.name=="codebook") {
		/*
		// Not releasing codebooks publicly at this time. 
		
		equivNum=0;
		for(j=0;j<numPins;j++) {
			equivNum=equivNum*10+code[j]+1;
		}
		if(!codebook_ex.includes(equivNum))
			violates = true;
		*/
	}
	if(rule.name=="photoAbs") {
		for(j=0;j<numPins;j++) {
			if(code[j]<rule.ranges[j][0] || code[j]>rule.ranges[j][1]) {
				violates=true;
				break;
			}
		}
	}

	if(rule.name=="photoDelt") {
		if(code[rule.pin1]-code[rule.pin2]<rule.range[0]
		|| code[rule.pin1]-code[rule.pin2]>rule.range[1]) {
			violates=true;
		}
	}
	
	if(rule.name=="colourPin") {
		violates = code.map((v,i)=>rule_1pin(rule,i,v)).some(v=>v);
	}
	
	if(rule.name=="retain") {
		violates=true;
		for(j=0;j<numPins-1;j++) {
			if(code[j+1] != code[j] && !document.getElementById("filea_"+code[j+1]+"_"+code[j]).checked) {
				violates=false;
			}
		}
	}
	if(rule.name=="onehigh") {
		violates=true;
		for(j=0;j<numPins;j++) {
			if(code[j]<rule.within) {
				violates=false;
			}
		}
	}
	if(rule.name=="onelow") {
		violates=true;
		for(j=0;j<numPins;j++) {
			if(code[j]>=numDepths-rule.within) {
				violates=false;
			}
		}
	}
	return violates;
}




function rule_1pin(rule,pin,depth,angle) {
	var violates=false;
	var i,j;

	if(rule.name=="MACS") {
		throw "This rule has dependant pins - must flatten first.";
	}
	if(rule.name=="IC") {
		throw "This rule has dependant pins - must flatten first.";
		//var pins=rule.pins.split(",").map(function(x) {return parseInt(x)-1;})
		//if(code[pins[j]]<rule.depth)
	}
	if(rule.name=="CMK") {
		throw "This rule has dependant pins - must flatten first.";
		//var pins=(rule.pins.split(",").map(function(x){return parseInt(x)-1;}))
		//if(code[pins[j]]>=numDepths-rule.depth) {
	}	
	
	if(rule.name=="impression") {
		if(rule.rel=="lt" && rule.pin-1==pin && depth<=rule.depth-labelOffset) {
			return true;
		}
		if(rule.rel=="neq" && rule.pin-1==pin && depth==rule.depth-labelOffset) {
			return true;
		}
		if(rule.rel=="eq" && rule.pin-1==pin && depth!=rule.depth-labelOffset) {
			return true;
		}
	}

	if(rule.name=="CK" && !angle) {
		ckcode=codeFromString(rule.code).map(v=>v+1-labelOffset);

		var onePinHigh=false;
		if(rule.rotateConst) {
			throw "This rule has dependant pins - must flatten first.";
		} else {
			if(depth==ckcode[pin] || rule.space && Math.abs(depth-ckcode[pin])<=rule.minSpace) {
				return true;
			}
			if(rule.twostep && depth % 2 != ckcode[pin] %2) {
				return true;
			}
			if(rule.file) throw "This rule has dependant pins - must flatten first.";
		}
	}
	
	if(rule.name=="CK" && angle) {
		ckcode=anglesFromString(rule.code);
		if(ckcode.length<=1) return false;
		for(i=0;i<=1;i++) {
			if(ckcode[pin].substr(i,1)!="_")
				if(ckcode[pin].substr(i,1)!=depth.substr(i,1))
					return true;
		}
	}
	
	if(rule.name=="shear") {
		if(!rule.cache)
			rule.cache={};
		if(!rule.cache.p_shears) {
			rule.cache.p_shears=[];
			for(i in rule.shears) {
				rule.cache.p_shears.push(rule.shears[i].length==0?[]:rule.shears[i].split(",").map(function(x){return parseInt(x)-labelOffset;}));
			}
		}
		var onePinHigh=false;
		if(isNaN(rule.cache.p_shears[pin][0])) return false;
		if(!rule.cache.p_shears[pin].includes(depth)) {
			return true
		}
	}
	if(rule.name=="medeco_cb_depth") {
		throw "This rule has dependant pins - must flatten first.";
	}
	if(rule.name=="codebook") {
		throw "This rule has dependant pins - must flatten first.";
	}
	if(rule.name=="medeco_cb_angle") {
		throw "This rule has dependant pins - must flatten first.";
	}
	if(rule.name=="medeco_FA") {
		return (rule.FAs[pin]!="?" && ((depth.substr(0,1)=="_") == (rule.FAs[pin]=="F") || (depth.substr(1,1)=="_") == (rule.FAs[pin]=="A")));
	}
	if(rule.name=="medeco_code") {
		return !(
							(rule.code.substr(pin*2,1).toUpperCase() == depth.substr(0,1) || rule.code.substr(pin*2+1,1).toUpperCase() == depth.substr(1,1)) 
					 || (rule.code.substr(pin*2,1) != rule.code.substr(pin*2,1).toUpperCase() && depth.substr(0,1)=="C")
					 || (rule.code.substr(pin*2+1,1) != rule.code.substr(pin*2+1,1).toUpperCase() && depth.substr(1,1)=="C")
					 )
	}
	if(rule.name=="medeco_MACS") {
		throw "This rule has dependant pins - must flatten first.";
	}
	if(rule.name=="photoAbs") {
		if(depth<rule.ranges[pin][0] || depth>rule.ranges[pin][1]) {
			return true;
		}
	}
	if(rule.name=="colourPin") {
		if(rule.pinColours[pin] == "unknown")
			return false;
		rule.cache = {colourChart: 
			commonKeyDepths[rule.colourPinKeySys].depths
				.map(v=>commonKeyDepths[rule.colourPinKeySys].plugDia  - v)
				.map(v=>colourPinLists[rule.colourPinSet].list
					.reduce(
						(a, b) => {
							return Math.abs(b.pinLen - v) < Math.abs(a.pinLen - v) ? b : a;
						}, {pinLen: -100}
					)
				)
				.map((v,i)=>{v.i=i;return v;})
			}
		
		return !rule.cache.colourChart
			.filter(v=>v.colourName == rule.pinColours[pin])
			.map(v=>v.i)
			.includes(depth);
	}
	if(rule.name=="photoDelt") {
		throw "This rule has dependant pins - must flatten first.";
	}
	if(rule.name=="retain") {
		throw "This rule has dependant pins - must flatten first.";
	}
	if(rule.name=="onehigh") {
		throw "This rule has dependant pins - must flatten first.";
	}
	if(rule.name=="onelow") {
		throw "This rule has dependant pins - must flatten first.";
	}
	return false;
}



function ruleText(rule) {
	if(rule.name=="MACS") {
		return "MACS of " + rule.MACS;
	}
	if(rule.name=="IC") {
		return "IC system in pins "+rule.pins+" at depth "+rule.depth+" with master control key MACS "+rule.MACS;
	}
	if(rule.name=="CMK") {
		return "Construction keying in pin "+rule.pins+" at depth "+rule.depth+" with master control key MACS "+rule.MACS;
	}
	if(rule.name=="impression") {
		return "Pin "+rule.pin+" impressioned, "
			+(rule.rel=="neq"?"no shear at":"")
			+(rule.rel=="eq"?"shear at":"")
			+(rule.rel=="lt"?"no shear above or at":"")
			+" depth "+rule.depth;
	}
	if(rule.name=="CK") {
		return "Known change key, code "+rule.code;
	}
	if(rule.name=="shear") {
		return "Known shear lines: "+rule.shears.map((v,i)=>" Pin "+(parseInt(i)+1)+": ["+rule.shears[i]+"]");
	}	
	if(rule.name=="medeco_cb_depth") {
		return "Key depths must be in Medeco codebooks";
	}	
	if(rule.name=="medeco_cb_angle") {
		return "Key angles must be in Medeco codebooks";
	}
	if(rule.name=="medeco_FA") {
		return "F/A known: "+rule.FAs.map((v,i)=>" Pin "+(parseInt(i)+1)+": "+rule.FAs[i]+"");
	}
	if(rule.name=="medeco_code") {
		return "On medeco sidebar system: "+rule.code;
	}
	if(rule.name=="medeco_MACS") {
		return "Pin-by-pin MACS of: "+rule.MACS.map((v,i)=>" Pin "+(parseInt(i)+1)+"-"+(parseInt(i)+2)+": "+rule.MACS[i]);
	}
	if(rule.name=="photoAbs") {
		return "Photographed positions: "+rule.ranges.map((v,i)=>" "+(rule.ranges[i][0]+labelOffset)+"&le;Pin "+(parseInt(i)+1)+"&le;"+(rule.ranges[i][1]+labelOffset));
	}
	if(rule.name=="photoDelt") {
		return "Delta from pin "+(rule.pin1+1)+" to "+(rule.pin2+1)+" is within ["+(rule.range[0])+", "+(rule.range[1])+"]";
	}
	if(rule.name=="codebook") {
		return "In codebook: "+(rule.book);
	}
	if(rule.name=="colourPin") {
		return "Coloured pins in otoscope: "+rule.pinColours.map((v,i)=>" Pin "+(parseInt(i)+1)+": "+rule.pinColours[i]);
	}
	if(rule.name=="retain") {
		return "Key-retaining";
	}
	if(rule.name=="onehigh") {
		return "One pin is in the highest "+(rule.within);
	}
	if(rule.name=="onelow") {
		return "One pin is in the lowest "+(rule.within);
	}
}

function rule_html(rule,ruleNum) {
	var violates=false;

	if(rule.name=="MACS") {
		list+=makeRuleHTML("#FFBB00","MACS of <input onchange=\"propertyBind('"+ruleNum+"','MACS',this.value)\" type='number' min='1' max='12' value='"+rule.MACS+"' class='form-control' style='width:70px;display:inline-block;' />",spaceSize(space),ruleNum);
	}
	if(rule.name=="IC") {
		list+=makeRuleHTML("#8888FF","IC system in <span class='tpin'>pin</span>s <input onchange=\"propertyBind('"+ruleNum+"','pins',this.value)\" type='text' value='"+rule.pins+"' class='form-control' style='width:auto;display:inline-block;' />"
					+" at depth <input onchange=\"propertyBind('"+ruleNum+"','depth',this.value)\" type='number' min='1' max='8' value='"+rule.depth+"' class='form-control' style='width:60px;display:inline-block;' />"
					+"<div class='rule' style='background-color:#FFBB00'>MACS for master control key: "
					+"<input onchange=\"propertyBind('"+ruleNum+"','MACS',this.value)\" type='number' min='1' max='11' value='"+rule.MACS+"' class='form-control' style='width:60px;display:inline-block;' /></div>"
					,spaceSize(space),ruleNum);
	}
	if(rule.name=="CMK") {
		list+=makeRuleHTML("#8888FF","Construction keying in <span class='tpin'>pin</span>s <input onchange=\"propertyBind('"+ruleNum+"','pins',this.value)\" type='text' value='"+rule.pins+"' class='form-control' style='width:auto;display:inline-block;' />"
					+" at depth <input onchange=\"propertyBind('"+ruleNum+"','depth',this.value)\" type='number' min='1' max='8' value='"+rule.depth+"' class='form-control' style='width:60px;display:inline-block;' />"
					+"<div class='rule' style='background-color:#FFBB00'>MACS for construction master key: "
					+"<input onchange=\"propertyBind('"+ruleNum+"','MACS',this.value)\" type='number' min='1' max='11' value='"+rule.MACS+"' class='form-control' style='width:60px;display:inline-block;' /></div>"
					,spaceSize(space),ruleNum);	
	}
	if(rule.name=="impression") {
		noOpen =ruleNum>0              && rules[ruleNum-1].name=="impression" && rule.rel!="eq" && rules[ruleNum-1].rel=="eq";
		noClose=ruleNum<rules.length-1 && rules[ruleNum+1].name=="impression" && rule.rel=="eq" && rules[ruleNum+1].rel!="eq";
		list+=makeRuleHTML("#FF4444","<span class='tupin'>Pin</span> <input onchange=\"propertyBind('"+ruleNum+"','pin',this.value)\" type='number' min='1' max='12' value='"+rule.pin+"' class='form-control' style='width:60px;display:inline-block;' /> impressioned; "
																	+"<select onchange=\"propertyBind('"+ruleNum+"','rel',this.value)\"  class='form-control' style='width:auto;display:inline-block;'>"
																	+"<option value='neq'"+(rule.rel=="neq"?" selected":"")+">no shear at</option>"
																	+"<option value='eq'"+(rule.rel=="eq"?" selected":"")+">shear at</option>"
																	+"<option value='lt'"+(rule.rel=="lt"?" selected":"")+">no shear above or at</option></select> depth "
																	+"<input onchange=\"propertyBind('"+ruleNum+"','depth',this.value)\" type='number' min='0' max='12' value='"+rule.depth+"' class='form-control' style='width:60px;display:inline-block;' />"
																	+(noClose?"<hr style='margin:0;background-color:#111111;' />":"")
																	,spaceSize(space),ruleNum,noOpen,noClose);
	}
	if(rule.name=="CK") {
		a_space_notif="";
		if(typeof anglesFromString === "function" && anglesFromString(rule.code).length>1) 
			a_space_notif="; Angle Space: "+spaceSize(a_space,a_pspace)+"";
	
		list+=makeRuleHTML("#FFFF00","Known change key, code "
		+"<input onchange=\"propertyBind('"+ruleNum+"','code',this.value)\" type='text' value='"+rule.code+"' class='form-control' style='width:auto;display:inline-block;' />, "
		+"<label><input onchange=\"propertyBind('"+ruleNum+"','file',this.checked)\" type='checkbox' "+(rule.file?" checked":"")+" /> No-file</label> "
		+"<label><input onchange=\"propertyBind('"+ruleNum+"','twostep',this.checked)\" type='checkbox' "+(rule.twostep?" checked":"")+" /> 2-step</label> "
		+"<label><input onchange=\"propertyBind('"+ruleNum+"','rotateConst',this.checked)\" type='checkbox' "+(rule.rotateConst?" checked":"")+" /> rotating-constant system</label> "
		+"<label><input onchange=\"propertyBind('"+ruleNum+"','space',this.checked)\" type='checkbox' "+(rule.space?" checked":"")+" /> Min spacer size</label> "
		+(rule.space?("<div class='rule' style='background-color:#FFBB00'>No spacers size <input onchange=\"propertyBind('"+ruleNum+"','minSpace',this.value)\" type='number' min='1' max='11' value='"+rule.minSpace+"' class='form-control' style='width:60px;display:inline-block;' /></div>"):"")
		+(rule.rotateConst?("<div class='rule' style='background-color:#FFBB00'>System has <input onchange=\"propertyBind('"+ruleNum+"','rotateN',this.value)\" type='number' min='1' max='11' value='"+rule.rotateN+"' class='form-control' style='width:60px;display:inline-block;' /> rotating constants</div>"):"")
		,spaceSize(space)+a_space_notif,ruleNum);
	}
	if(rule.name=="shear") {
		s="Known shear lines: "
		for(i in rule.shears) {
			s+="<span class='tupin'>Pin</span> "+(parseInt(i)+1)+":<input class='form-control' style='width:60px;display:inline-block;' onchange=\"propertyBind('"+ruleNum+"','shears',this.value,"+i+")\" value='"+rule.shears[i]+"' /> ";
		}
		list+=makeRuleHTML("#FF4444",s
		+"<label><input onchange=\"propertyBind('"+ruleNum+"','nonMK',this.checked)\" type='checkbox' "+(rule.nonMK?" checked":"")+" /> Non-MK possible</label>",spaceSize(space),ruleNum);
	}	
	if(rule.name=="medeco_cb_depth") {
		list+=makeRuleHTML("#8888FF","Key depths must be in Medeco codebooks",spaceSize(space),ruleNum);
	}	
	if(rule.name=="codebook") {
		list+=makeRuleHTML("#8888FF","Key depths must be in codebook: <select><option>FORD ####X Fleet</option></select>",spaceSize(space),ruleNum);
	}	
	if(rule.name=="medeco_cb_angle") {
		list+=makeRuleHTML("#8888FF","Key angles must be in Medeco codebooks",spaceSize(a_space,a_pspace),ruleNum,false,false,true);
	}
	if(rule.name=="medeco_FA") {
		s="F/A known: "
		for(i in rule.FAs) {
			s+="<span class='tupin'>Pin</span> "+(parseInt(i)+1)+":<select class='form-control' style='width:auto;display:inline-block;' onchange=\"propertyBind('"+ruleNum+"','FAs',this.value,"+i+")\"><option "+(rule.FAs[i]=="F"?"selected ":"")+"value='F'>F</option><option "+(rule.FAs[i]=="A"?"selected ":"")+"value='A'>A</option><option "+(rule.FAs[i]=="?"?"selected ":"")+"value='?'>?</option></select> ";
		}
		list+=makeRuleHTML("#FF4444",s,spaceSize(a_space,a_pspace),ruleNum,false,false,true);
	}
	if(rule.name=="medeco_code") {
		s="On medeco sidebar system: <input class='form-control' style='width:auto;display:inline-block;' type='text' onchange=\"propertyBind('"+ruleNum+"','code',this.value)\" value=\""+rule.code+"\">"
		//for(i in rule.FAs) {
		//	s+="Pin "+(parseInt(i)+1)+":<select onchange=\"propertyBind('"+ruleNum+"','FAs',this.value,"+i+")\"><option "+(rule.FAs[i]=="F"?"selected ":"")+"value='F'>F</option><option "+(rule.FAs[i]=="A"?"selected ":"")+"value='A'>A</option><option "+(rule.FAs[i]=="?"?"selected ":"")+"value='?'>?</option></select> ";
		//}
		list+=makeRuleHTML("#FF4444",s,spaceSize(a_space,a_pspace),ruleNum,false,false,true);
	}
	if(rule.name=="medeco_MACS") {
		s="<span class='tupin'>Pin</span>-by-<span class='tpin'>pin</span> MACS of: "
		for(i in rule.MACS) {
			s+="<span class='tupin'>Pin</span>s "+(parseInt(i)+1)+"-"+(parseInt(i)+2)+":<input class='form-control' style='width:60px;display:inline-block;' type='number' onchange=\"propertyBind('"+ruleNum+"','MACS',this.value,"+i+")\" value='"+rule.MACS[i]+"' /> ";
		}
		list+=makeRuleHTML("#FFBB00",s+"",spaceSize(space),ruleNum);
	}
	if(rule.name=="photoAbs") {
		s="Photographed positions: "
		for(i in rule.ranges) {
			s+="<div style='display:inline-block;border:1px solid #888888;margin:3px;border-radius:10px;background-color:#FF4444;padding:6px;'><span class='tupin'>Pin</span> "+(parseInt(i)+1)+":<br/>"
			+"&ge;<input class='form-control' style='width:60px;display:inline-block;' type='number' min='"+labelOffset+"' max='"+(numDepths-1+labelOffset)+"' value='"+(rule.ranges[i][0]+labelOffset)+"' onchange=\"propertyBind('"+ruleNum+"','ranges',parseInt(this.value)-labelOffset,["+i+",0])\" /> <br/>"
			+"&le;<input class='form-control' style='width:60px;display:inline-block;' type='number' min='"+labelOffset+"' max='"+(numDepths-1+labelOffset)+"' value='"+(rule.ranges[i][1]+labelOffset)+"' onchange=\"propertyBind('"+ruleNum+"','ranges',parseInt(this.value)-labelOffset,["+i+",1])\" /> </div>"
		}
		list+=makeRuleHTML("#AAAAAA",s+"",spaceSize(space),ruleNum);
	}
	if(rule.name=="photoDelt") {
		s="Delta from <span class='tpin'>pin</span> <input class='form-control' style='width:60px;display:inline-block' type='number' onchange=\"propertyBind('"+ruleNum+"','pin1',parseInt(this.value)-1)\" value='"+(rule.pin1+1)+"' />"
		+" to <span class='tpin'>pin</span> <input class='form-control' style='width:60px;display:inline-block;' type='number' onchange=\"propertyBind('"+ruleNum+"','pin2',parseInt(this.value)-1)\" value='"+(rule.pin2+1)+"' /> is within "
		+"[<input class='form-control' style='width:60px;display:inline-block;' type='number' min='"+(1-numDepths)+"' max='"+(numDepths-1)+"' onchange=\"propertyBind('"+ruleNum+"','range',parseInt(this.value),0)\" value='"+(rule.range[0])+"' /> "
		+",<input class='form-control' style='width:60px;display:inline-block;' type='number' min='"+(1-numDepths)+"' max='"+(numDepths-1)+"' onchange=\"propertyBind('"+ruleNum+"','range',parseInt(this.value),1)\" value='"+(rule.range[1])+"' />]"
		list+=makeRuleHTML("#AAAAAA",s+"",spaceSize(space),ruleNum);
	}
	if(rule.name=="colourPin") {
		list+=makeRuleHTML("#AAAAAA",
			 "Coloured pins in otoscope; system: <select class='form-control' style='width:auto;display:inline-block;' onchange=\"propertyBind('"+ruleNum+"','colourPinKeySys',this.selectedIndex)\">"
			+commonKeyDepthsOpts(rule.colourPinKeySys)
			+"</select>, pin set: <select class='form-control' style='width:auto;display:inline-block;' onchange=\"propertyBind('"+ruleNum+"','colourPinSet',this.selectedIndex)\">"
			+colouredPinSetOpts(rule.colourPinSet)
			+"</select> colours observed: "
			+rule.pinColours.map( 
				(v,i)=>
				 "Pin "+(i+1)+":"
				+"<select onchange=\"propertyBind('"+ruleNum+"','pinColours',this.value,"+i+")\"  class='form-control' style='width:40px;display:inline-block;background-color:"+(v=="unknown"?"none":colourPinLists[rule.colourPinSet].list.find(u=>u.colourName==v).colourHTML)+"'>"
				+colouredPinColoursOpts(colourPinLists[rule.colourPinSet].list, v)
				+"</select>"
			)
			,spaceSize(space),ruleNum);
	}
	if(rule.name=="retain") {
		list+=makeRuleHTML("#FFBB00","Key-retaining",spaceSize(space),ruleNum);
	}
	if(rule.name=="onehigh") {
		list+=makeRuleHTML("#FFBB00","One pin is in the highest <input class='form-control' style='width:60px;display:inline-block;' type='number' min=1 max='"+numDepths+"' value='"+(rule.within)+"' onchange=\"propertyBind('"+ruleNum+"','within',parseInt(this.value))\" />",spaceSize(space),ruleNum);
	}
	if(rule.name=="onelow") {
		list+=makeRuleHTML("#FFBB00","One pin is in the lowest <input class='form-control' style='width:60px;display:inline-block;' type='number' min=1 max='"+numDepths+"' value='"+(rule.within)+"' onchange=\"propertyBind('"+ruleNum+"','within',parseInt(this.value))\" />",spaceSize(space),ruleNum);
	}

}



function propertyBind(ruleNum,propName,val,index,list) {
	list=list || rules;
	list[ruleNum].cache=undefined;
	if(!index && index !==0) {
		list[ruleNum][propName]=val;
	} else {
		try {
			if(index.length==2) {
				list[ruleNum][propName][index[0]][index[1]]=val;
			} else {
				list[ruleNum][propName][index]=val;
			}
		} catch (e) {
			list[ruleNum][propName][index]=val;
		}
	}
	recalcSpace();
}
function makeRuleHTML(colour,HTML,size,ruleNum,noOpen,noClose,angleSpace) {
	s="";
	if(!noOpen) s+="<div "+(ruleNum>=0?("id='rule_"+ruleNum+"'"):"")+" style='background-color:"+colour+";'>"
	s+="<div style='float:right'>"+(angleSpace?"Angle ":"")+"Space: "+size
	if(ruleNum>=0)
		s+="<button class='btn' onclick='removeRule("+ruleNum+")'>X</button>";
	s+="</div>"+HTML;
	if(!noClose) s+="</div>";
	return s;
}


function stringFromCode(code,angles) {
	codebookStr = "";
	if(rules.find(r=>r.name=='codebook') && !halfSpace) {
		equivNum=0;
		for(j=0;j<numPins;j++) {
			equivNum=equivNum*10+code[j]+1;
		}
		var indx = codebook_ex.indexOf(equivNum);
		if(indx>=0)
			codebookStr = " (" + ("0000" + (indx+1)).substr(-4,4) + "X)"
	}
	
	var i;
	if(code) { // Just depths
		code=code.map(function(x) {return (parseFloat(x)+labelOffset).toString();});
		/*if(s.length>numPins)
			s=code.map(function(x) {return parseInt(x)+1;}).join('-');*/
	} 
	if(angles) { // Just angles
		angles=angles.map(function(x) {return x.replace("L_","K").replace("C_","B").replace("R_","Q").replace("_L","M").replace("_C","D").replace("_R","S").replace("LL","KM").replace("LC","KD").replace("LR","KS").replace("CL","BM").replace("CC","BD").replace("CR","BS").replace("RL","QM").replace("RC","QD").replace("RR","QS")});
	}
	var s="";
	sep=angles || code&&Math.max(...code.map(x => x.length))>1 || halfSpace ? "-":"";
	for(i in code?code:angles) {
		if(code) s+=code[i];
		if(angles) s+=angles[i];
		if(i<(code?code:angles).length-1) s+=sep;
	}
	return s+codebookStr;
}

function colouredPinSetOpts(selected) {
	return colourPinLists.map((v,i)=>"<option "+(selected==i?"selected":"")+">"+v.name+"</option>").join("");
}
function commonKeyDepthsOpts(selected) {
	return commonKeyDepths.map((v,i)=>"<option "+(selected==i?"selected":"")+">"+v.name+"</option>").join("");
}
function colouredPinColoursOpts(colouredPinList,selected) {
	return [...new Set(colouredPinList.map(v=>v.colourName))]
		.map(v=>colouredPinList.find(u=>u.colourName==v))
		.concat({colourHTML: "none", colourName: "unknown"})
		.map(v=>"<option style='background-color:"+v.colourHTML+"' "+(selected==v.colourName?"selected":"")+">"+v.colourName+"</option>")
		.join("");
}