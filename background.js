
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
	
	var init = function()
	{
		calculate(); //run calculate onload..
	};



	$(document).ready(function() {
		init();
	});

})();


