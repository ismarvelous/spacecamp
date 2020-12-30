(function($, global, document) {

	const timeUrlPattern = "https://app.timechimp.com/?text={labels}%20|%20{title}%20|%20Opmerkingen%3A#/registration/time/day";

	var appendLabel = function(html, labels)
	{
		var re = /(#(\w+)([-](\w+))*)/g;

		var match = null;
		while (match = re.exec(html.replace(/<[^>]*>?/gm, ''))) {
			if(!match[1].startsWith("#updateLinkRel"))
			{
				labels.push(match[1]);
			}
		}
		
		//console.log(labels);
	}

	var calculate = function () { // progress calculation..

		$("article.todolist").each(function (index) {

			if(!$(this).find("h3 a.todolist__permalink").text().endsWith(")")) {

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

				$(this).find("h3 a.todolist__permalink").append(" (" + todo + "/" + done + ")");
			}
		});
	};

	var labelit = function() { // label its

		var labels = [];

		$("div.thread-entry__content").each(function (index){
			//console.log($(this).html());
			appendLabel($(this).html(), labels);
		});

		var render = function()
		{
			
			//console.log("Finished!");

			var jLabels = labels.join(", ");
			var url = timeUrlPattern;
			url = url.replace("{labels}", jLabels.replaceAll("#", "%23").replaceAll(",", "%2C").replaceAll(" ", "%20"));
			url = url.replace("{title}", $(document).find("title").text().replaceAll("#", "%23").replaceAll(",", "%2C").replaceAll(" ", "%20").replaceAll("&", "and"));

			var html = `
				<div id="spcamp-labels" class="todos-form__field">
					<div class="todos-form__field-label">
						<strong>Labels</strong>
					</div>
					<div class="todos-form__field-content">
							<div>`+ jLabels + `</div>
						</div>
					</div>
				</div>
			`;

			//var html = html + `
			//	<div class="todos-form__field">
			//		<div class="todos-form__field-label todos-form__field-label--notes">
			//			<strong>Track time</strong>
			//		</div>
			//		<div class="todos-form__field-content">
			//				<div><a href="` + url + `" target="time"><img src="`+ chrome.extension.getURL("icon.png") + `" style="width: 25px; margin-top:10px"/></a></div>
			//			</div>
			//		</div>
			//	</div>
			//`;

			var menuitm = `
				<li id="spcamp-time" class="nav__item nav-menu">
					<a href="` + url + `" target="time" class="nav__link nav__link--activity">Time</a>
				</li>
			`;

			if($("#spcamp-labels").length > 0)
			{
				$("#spcamp-labels").replaceWith(html);
			}
			else
			{
				$("section.todo-perma__details").append(html);
			}

			if($("#spcamp-time").length > 0)
			{
				$("#spcamp-time").replaceWith(menuitm);
			}
			else
			{
				$("#my_navigation .nav__main").append(menuitm);
			}

		}

		var listUrl = $("a[href*='todolists']").first().attr('href');

		if(listUrl !== undefined)
		{
			$.get(listUrl, function( data ) {
				var dom = $(data);
				dom.find("div.thread-entry__content").each(function (index){
					//console.log($(this).html());
					appendLabel($(this).html(), labels);
					//console.log(labels);
				});
			})
			.always(function(){
				render();
			});
		}
		else
		{
			render();
		}
	}

	var labelitTicket = function() { // label its
		
		var labels = [];

		$(".messageBody").each(function (index){
			//console.log($(this).html());
			appendLabel($(this).html(), labels);
		});

		var render = function()
		{
			
			//console.log("Finished!");

			var jLabels = labels.join(", ");
			var url = timeUrlPattern;
			url = url.replace("{labels}", jLabels.replaceAll("#", "%23").replaceAll(",", "%2C").replaceAll(" ", "%20"));
			url = url.replace("{title}", $(document).find("title").text().replaceAll("#", "%23").replaceAll(",", "%2C").replaceAll(" ", "%20").replaceAll("&", "and"));

			var menuitm = `
				<span id="spcamp-time" class="badge">
					<a href="` + url + `">Time</a>
				</span>
			`;

			if($("#spcamp-time").length > 0)
			{
				$("#spcamp-time").replaceWith(menuitm);
			}
			else
			{
				$("#tkHeader > hgroup > p").append(menuitm);
			}

		}

		render();
	}

	var addDescription = function(){ //timechimp automatic description

		var urlParams = new URLSearchParams(window.location.search);

		if(urlParams === undefined && !urlParams.has("text"))
			return;

		$("textarea[ng-model='vm.time.notes']").val(urlParams.get("text"));
		$("textarea[ng-model='vm.time.notes']")[0].dispatchEvent(new Event("change",  { bubbles: true }));
		
	}
	
	global.initializeSpaceCamp = function()
	{
		if(window.location.hostname.toLowerCase() === "app.timechimp.com")
		{
			addDescription();
		}
		else if(window.location.hostname.toLowerCase() === "3.basecamp.com") //basecamp
		{
			calculate(); //run calculate onload..
			labelit();
		}
		else if(window.location.hostname.toLowerCase() === "secure.helpscout.net")
		{
			labelitTicket();
		}
	};

})(jQuery, window, document);

$(document).ready(function() {
	console.log("initialize");
	window.initializeSpaceCamp();
});

$(document).on('turbolinks:load', function() {
	console.log("re-loaded");
	window.initializeSpaceCamp();
});
