
(function() {

	var calculate = function () { // progress calculation..

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

	var labelit = function() { // label it

		const timeChimpUrl = "https://app.timechimp.com/?text={text}#/registration/time/day";

		var labels = "";

		var appendLabel = function(html)
		{
			var re = /(#(\w+)([-](\w+))*)/g, match, matches = [];
			
			while (match = re.exec(html)) {
  				matches.push(match[1]);
			}

			for(i=0; i<matches.length; i++)
			{
				if(timeChimpUrl.length > 0)
				{
					var url = timeChimpUrl.replace("{text}", matches[i].replace("#", "%23"));
					labels = labels +  "<a href='"+ url +"'>" + matches[i] + "</a>";
				}
				else
				{
					labels = labels + matches[i];
				}
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

	var addDescription = function(){ //timechimp automatic description

		var urlParams = new URLSearchParams(window.location.search);

		if(urlParams === undefined && !urlParams.has("text"))
			return;

		$("textarea[ng-model='vm.time.notes']").val(urlParams.get("text"));
	}
	
	var init = function()
	{
		var isBasecamp = window.location.hostname.toLowerCase() !== "app.timechimp.com";

		if(isBasecamp) //basecamp
		{
			calculate(); //run calculate onload..
			labelit();
		}
		else //timechimp
		{
			addDescription();
		}
	};



	$(document).ready(function() {
		init();
	});

})();


