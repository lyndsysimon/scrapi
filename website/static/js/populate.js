// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
$(".loader").hide();
$("#no-results").hide();
$(".buffer").hide();

var AppViewModel = new function()
{
	var count = 0;
    var article_count = 0;
    var self = this;

    self.Article = ko.observableArray();
	self.keyword = ko.observable("");

    self.keyword.subscribe(function(newValue) {
        if (0 < self.Article().length){
            //$(".loader").show();
            self.Article([]);
            count = 0;
            article_count = 0;
        }
        else{
            console.log("Empty article list!");
        }
    });

    self.populate_results = function()
    {
        //TODO universal url for live and testing
    	$.get("http://173.255.232.219/api/search?q="+self.keyword()+"&from="+count+"&size=5", function(data){
        //$.get("http://localhost/api/search?q="+self.keyword()+"&from="+count+"&size=5", function(data){
            if(data != "[]"){
                $("#no-results").hide();

                var contributors_list = "";
                var properties_list = "";

                var returnToJson = $.parseJSON(data);
                
                article_count = returnToJson.length;
                
                for(var i = 0; i < returnToJson.length; i++){
                    for (var j = 0; j < returnToJson[i]["contributors"].length-1; j++){
                        contributors_list += returnToJson[i]["contributors"][j]["full_name"]+"; ";
                    }
                    contributors_list += returnToJson[i]["contributors"][returnToJson[i]["contributors"].length-1]["full_name"];

                    for (property in returnToJson[i]["properties"]){
                        if(returnToJson[i]["properties"][property] == null || returnToJson[i]["properties"][property] == ""){
                            continue;
                        }
                        else{
                            properties_list += "<p><strong>" + property + ": </strong>" + returnToJson[i]["properties"][property]+"</p>";
                        }
                    }
                    properties_list += "<p><strong>location: </strong><a href= " + encodeURIComponent(returnToJson[i]['location']) + ">" + returnToJson[i]['location'] + "</p>";

                    $(".loader").hide();
                    $(".buffer").show();

                    self.Article.push(
                        {
                            title: returnToJson[i]["title"],
                            contributors: contributors_list,
                            article_id:returnToJson[i]["id"],
                            source:returnToJson[i]["source"],
                            properties:properties_list,
                        }
                    );

                    $('.jsonObject').addClass('animated fadeIn').css('border-color', '#39d395');

                    contributors_list = "";
                    properties_list = "";
                }
            }else{
                $(".buffer").hide();
                $(".loader").hide();
                $("#no-results").show();
            }
    	});
    }

    $(window).scroll(function(){ 
        if ($(window).scrollTop() == ($(document).height() - $(window).height())){
            //$(".loader").show();
            //count += 10;
            count += 5;
            $('.btn').click();
        }
    })

    $(".search-results").on("click", ".jsonObject", function(e){

        if ($(this).hasClass("collapsed")){
            $(this).removeClass("collapsed")
            $(this).find('.expand').text('---------- Less ----------');
        }
        else{
            $(this).addClass("collapsed")
            $(this).find('.expand').text('---------- More ----------');
        }
    });
};
// Activates knockout.js
ko.applyBindings(AppViewModel);
