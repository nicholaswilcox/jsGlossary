var Glossary = (function() {	
	
	//set the plugin default values
	defaults = {
		dataSource: 'glossary.json', /* The source of the glossary data file */	
		linkSelector: 'a.glossaryTerm', /* The DOM selector(s) for assigning the click events to activate the glossary plugin  */
		dataLoadErrorMessage: 'There was an error retrieving the data file: ', /* Error message for when the glossary data file doesn't load */
		definitionLookupErrorMessage: 'error: no definition found', /* Error message for when the term/defintion is not found in the glossary data file */
		hoverTitleMessage: 'click to expand this term\'s definition', /* Sets the 'title' hover tooltip to show on the link */
		closeTitleMessage: 'click to close this term\'s definition' /*Sets the 'title' hover tooltip on the definition close button */
	}	
	
	return {
		init: function() {
			//set up a reference to 'this' for the init options, since 'this' is used for other purposes further within the functionality and would be lost
			var base = this;
			
			//extend the default parameters with any passed in arugments			
			//used a helpful article from Ken Wheeler (@ken_wheeler) to put the first part of this 'if statement' together for additional validation on the arguments
		    	if (arguments[0] && typeof arguments[0] === "object") {
		    		//if arguments exist, execute a function to update and return a merged object (of defaults and passed arguments) 
		      		base.options = extendTheDefaults(defaults, arguments[0]);
		    	} else {
		    		//if there are no arguments, just set options to the defaults
		    		base.options = defaults;
		    	}
		    	
		    	//modified a function found here for extending an object's properties: http://stackoverflow.com/questions/11197247/javascript-equivalent-of-jquerys-extend-method
			function extendTheDefaults(defaults, args) {
			    	for (var arg in args) {	
			    		//determine if the arg has a property/value		      		
			      		if (args.hasOwnProperty(arg)) {
			        		//update the property in the defaults object to that of the argument property
			        		defaults[arg] = args[arg];
			      		}
			    	}
			    	//return back the object with all the updated properties passed into the init() public method
			    	return defaults;
			}
						
			//create the XHR rqeuest to load the JSON data
			var request = new XMLHttpRequest();
			//use a GET request and the file path passed into the init()
		        request.open("GET", base.options.dataSource);
		        //on the onreadstatechange event, execute an anonymouse function
		        request.onreadystatechange = function(response) {
		            //proceed if the rqeuest is finished and the status is good and returns a 200 status
		            if (this.readyState == this.DONE && this.status == 200) {
		                //if there is responseText, continue
		                if (this.responseText != null) {	                	
		                	
		                	//transform the glossary data from responseText into a new object for parsing
					var glossaryData = JSON.parse(this.responseText);				
					//setup event listener for glossary links
					var glossaryLinks = document.querySelectorAll(base.options.linkSelector);
					//loop over each anchor with the passed in selector
					for (i = 0; i < glossaryLinks.length; i++) {
						//update the title on each link
						glossaryLinks[i].title = base.options.hoverTitleMessage;
						
						//build the click event for the link item within return query/loop of anchors
						glossaryLinks[i].onclick = function(e) {
							//add the term definition and close button ONLY if it doesn't yet displayed
						 	if (this.className.indexOf("opened") == -1) {
						 	
							 	//prevent the default click action
								e.preventDefault();								
								
								//set the glossary name from the link data-term attribute
						                var glossName = this.getAttribute("data-term");

								//clear the title as we are in the detail now						             
						                this.title = "";
						                
						                //retrieve the glossary defintion 'value' from the JSON 'name'
						                var glossDefinition = "";
						                //do a truthy check on the lookup
						                if (glossaryData.glossary[glossName]) {
						                	//valid defintion found in the JSON object
						                	glossDefinition = glossaryData.glossary[glossName];
						                } else {
						                	//the definition is missing so return an error message
						                	glossDefinition = base.options.definitionLookupErrorMessage;
						                }
						                //add a class to prevent repeat click events and to add style the link
						                this.className += " opened";
						                
						                //add the HTML to render definition
						                this.innerHTML += ' <span class=\"glossaryDefinition\">(' + glossDefinition + ')</span>';
						                
						                //add a close button after the term						                 
						                //create the close button as an anchor
						                var closeButton = document.createElement("a");
						                closeButton.className = "closeGlossaryTerm";
						                closeButton.href = "#";
						                closeButton.title = base.options.closeTitleMessage;
						                closeButton.innerHTML = "&nbsp;";
						                //append it to the glossary link
						                //this.appendChild(closeButton);								
								this.parentNode.insertBefore(closeButton, this.nextSibling);
								
								//initialize the close click event now the close button has been added to the DOM 
								initCloseButton(this.nextSibling);
							}
						}
		                	}
		                	
		                	//click event listener for the glossary close buttons (utilizies a refernce to the active link)				
					function initCloseButton(linkObj) {				
						//setup an onclick event to collapse of the glossary item
						linkObj.onclick = function(e) {
						
							//prevent the default click action
						 	e.preventDefault();		 	
						 	
						 	//remove the defintion span tag
		            				//this.previousSibling.querySelector("span").remove();
		            				//to get around remove() issue above with the IE browser I'm using this approach instead below
		            				this.previousSibling.removeChild(this.previousSibling.querySelector("span"));
		            				
		            				//clean up using the new trim method
		            				this.previousSibling.innerHTML = this.previousSibling.innerHTML.trim();

		            				//reset the title back to the original hover
		            				this.previousSibling.title = base.options.hoverTitleMessage;
		            				
		            				//remove class from the glossary term link so the definition trigger will work again
						 	this.previousSibling.className = this.previousSibling.className.replace(" opened","");				 	
						 	
						 	//remove the close button from the DOM
						 	//this.remove();
						 	//to get around remove() issue above with the IE browser I'm using this approach instead below
						 	this.parentNode.removeChild(this);
						}
					}		                			                	
		                } 	
		                	            	   	
			    } else if (this.status == 404) {
			    	//if the file could not be found, log an error to the console
			    	console.log(base.options.dataLoadErrorMessage + this.status + " status");
			    }
			    
			}
			//send the XHR request
			request.send();
			
		} //end init		
	}; //end the return
    })(); //end the IIFE