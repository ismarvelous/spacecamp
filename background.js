
(function() { 
	
	var calculate = function () {
		$("article.todolist").each(function( index ) {
			
			var done = 0;
			var todo = 0;
			
			$(this).find("ul.todos span.content:visible").each(function( index ) {
				var regExp = /\(([^)]+)\)/;
				var matches = regExp.exec($(this).text());
				
				if(matches)
				{
					matches.forEach(function(entry) {
						if(parseInt(entry)){
							todo = todo + parseInt(entry);
						}
					});
				}
			});
			
			
			$(this).find("ul.completed span.content").each(function (index) {
				var regExp = /\(([^)]+)\)/;
				var matches = regExp.exec($(this).text());
				
				if(matches)
				{
					matches.forEach(function(entry) {
						if(parseInt(entry)){
							done = done + parseInt(entry);
						}
					});
				}
			});
			
			//todo: cleanup previous calculation.. $(this).find("h3").text().replace(/\(*\)/g, ""); 
			$(this).find("h3").append(" ("+ todo +"/"+ done +")");
		});
	};
	
	var init = function()
	{
		//todo: check if you are in basecamp, other wise ignore complete initialization.
		$(":checkbox").change(function(){
			//todo: only fired once, not when click the checkbox twice..
			calculate();
		});
	
		calculate(); //run calculate onload..	
	};
	
	init();
})();


