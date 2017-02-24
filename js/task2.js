var index, 
length = 20; 
	
	for (index=0;index < length ; index++) {
	   (function(index) {
	       setTimeout(function(){
	       	console.log(index);
	       	
	       }, 200 * (index+1) );
	   })(index);
}
	 