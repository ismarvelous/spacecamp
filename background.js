
(function() {

	var calculate = function () {
		$("article.todolist").each(function (index) {

			var done = 0;
			var todo = 0;
			var regExp = /\(([^)]+)\)/;

			$(this).find("ul.todos a:visible").each(function (index) {

				var matches = regExp.exec($(this).text());

				if (matches) {
					matches.forEach(function (entry) {
						if (parseInt(entry)) {
							todo = todo + parseInt(entry);
						}
					});
				}
			});


			$(this).find("ul.completed a").each(function (index) {

				var matches = regExp.exec($(this).text());

				if (matches) {
					matches.forEach(function (entry) {
						if (parseInt(entry)) {
							done = done + parseInt(entry);
						}
					});
				}
			});

			$(this).find("h3 a").append(" (" + todo + "/" + done + ")");
		});
	};

	var labelit = function() {

		var labels = "";

		var appendLabel = function(html)
		{
			var re = /(#(\w+)([-](\w+))*)/g, match, matches = [];
			
			while (match = re.exec(html)) {
  				matches.push(match[1]);
			}

			for(i=0; i<matches.length; i++)
			{
				labels = labels + matches[i] + " "
			}
			console.log(labels);
		}

		$("div.thread-entry__content").each(function (index){
			//console.log($(this).html());
			appendLabel($(this).html());
		});

		var listUrl = $("a[href*='todolists']").first().attr('href');

		$.get(listUrl, function( data ) {
			var dom = $(data);
			dom.find("div.thread-entry__content").each(function (index){
				//console.log($(this).html());
				appendLabel($(this).html());
				console.log(labels);
			});
		})
		.always(function(){
			
			console.log("Finished!");

			var html = `
				<div class="todos-form__field">
					<div class="todos-form__field-label">
						<strong>Labels</strong>
					</div>
					<div class="todos-form__field-content">
							<div>`+ labels +`</div>
						</div>
					</div>
				</div>
			`;
		
			$("section.todo-perma__details").append(html);
		});

		
		
	}
	
	var init = function()
	{
		calculate(); //run calculate onload..
		labelit();
	};



	$(document).ready(function() {
		init();
	});

})();


