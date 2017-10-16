"use strict";
/*--------------------------------------------------------------------------
		Google Analytics change UA-XXXXX-X to be your site's ID.
--------------------------------------------------------------------------*/
(function (b, o, i, l, e, r) {
	b.GoogleAnalyticsObject = l;
	b[l] || (b[l] =
			function () {
				(b[l].q = b[l].q || []).push(arguments)
			});
	b[l].l = +new Date;
	e = o.createElement(i);
	r = o.getElementsByTagName(i)[0];
	e.src = '//www.google-analytics.com/analytics.js';
	r.parentNode.insertBefore(e, r)
}(window, document, 'script', 'ga'));
ga('create', 'UA-XXXXX-X', 'auto');
ga('send', 'pageview');
/*--------------------------------------
			CUSTOM FUNCTION WRITE HERE
--------------------------------------*/
$(document).ready(function (e) {
	/*--------------------------------------
			COMMING SOON COUNTER
	--------------------------------------*/
	$('#comming-countdown').countdown({
		date: '10/5/2017 13:41:59',
		offset: -100,
		day: 'Day',
		days: 'Days'
	},function () {
		alert('Done!');
	});
	/*--------------------------------------
			DOCTOR'S GALLERY
	--------------------------------------*/
	$("#tg-photosgallery").owlCarousel({
		autoPlay: true,
		items: 3,
		itemsDesktop: [1199, 3],
		itemsDesktopSmall: [991, 2],
		itemsTabletSmall: [568, 1],
		slideSpeed: 300,
		paginationSpeed: 400,
		pagination: false,
		navigation: true,
		navigationText: [
			"<i class='tg-prev fa fa-angle-left'></i>",
			"<i class='tg-next fa fa-angle-right'></i>"
		]
	});
	/*--------------------------------------
			PRETTY PHOTO GALLERY
	--------------------------------------*/
	$(document).ready(function(){
	   	 $("a[data-rel]").each(function () {
			$(this).attr("rel", $(this).data("rel"));
		});
		$("a[data-rel^='prettyPhoto']").prettyPhoto({
			animation_speed: 'normal',
			theme: 'dark_square',
			slideshow: 3000,
			autoplay_slideshow: false,
			social_tools: false
		});
 	 });
	
	/* -------------------------------------
			THEME ACCORDION
	 -------------------------------------- */
	/*$('#accordion .tg-panel-heading').on('click',function () {
		$('.tg-panel-heading').removeClass('.active');
		$(this).parents('.tg-panel-heading').addClass('.active');
		$('.panel').removeClass('.active');
		$(this).parent().addClass('.active');
	});*/
//	/* -------------------------------------
//			THEME ACCORDION
//	 -------------------------------------- */
//	$('#accordion .tg-panel-heading').on('click',function () {
//		$('.tg-panel-heading').removeClass('.active');
//		$(this).parents('.tg-panel-heading').addClass('.active');
//		$('.panel').removeClass('.active');
//		$(this).parent().addClass('.active');
//	});
	/*--------------------------------------
			NICE SCROLL
	--------------------------------------*/
	 $("#tg-reviewscrol").niceScroll({
		cursorcolor:"#7dbb00",
		background: "#ddd",
		autohidemode: false,
		cursorborder: false
	 });
	/*--------------------------------------
			NICE SCROLL
	--------------------------------------*/
	 $("#tg-photoscroll").niceScroll({
		cursorwidth: "4px",
		cursorcolor:"#7dbb00",
		background: "#ddd",
		autohidemode: false,
		cursorborder: false
	 });
	 
    
	/*--------------------------------------
			GRAPH
	--------------------------------------*/
	
	/*--------------------------------------
			THEME ACCORDION
	--------------------------------------*/
	$('#accordion .tg-panel-heading').on('click',function () {
		$('.tg-panel-heading').removeClass('active');
		$(this).parents('.tg-panel-heading').addClass('active');
		$('.panel').removeClass('active');
		$(this).parent().addClass('active');
	});
});

	/*---------------------------------------
			 AUTO COMPLETE 
	-----------------------------------------*/

	 $(function() {
		 var location = {}
		 $.get("/users/cities", function(data, status){
			 if(data)
			 console.log(data)
			 	getData(data);
				$("#no-of-specialists").html(data.total_doctors + " Specialists");
				$("#no-of-hospitals").html(data.total_hospitals);
				$("#no-of-clinics").html(data.total_clinics);
				$("#no-of-laboratories").html(data.total_laboratory);
				$("#no-of-radiology").html(data.total_radiology);
				$("#no-of-phamarcies").html(data.total_pharmarcy);
				$("#no-of-fitness").html(data.total_fitness);
    	});

		function getData(data){
			location.cities = data.cities;
			$( "#autocom" ).autocomplete({
			source: location.cities,
			autoFocus:true
		});
		}
            
		
    });


	/************************
			nice scroll
	****************************/

	$(document).ready(

        function() {

        } );


	 /*******************************************
	 			twilio video
	 *******************************************/
	    


		/*---------------------------------------
				FORM SUBMIT 
		-----------------------------------------*/
		
		/*$("#ajaxform").submit(function(e)
{
    var postData = $(this).serializeArray();
    var formURL = $(this).attr("action");
    $.ajax(
    {
        url : formURL,
        type: "POST",
        data : postData,
        success:function(data, textStatus, jqXHR) 
        {
            console.log(data)//data: return data from server
			
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            //if fails      
        }
    });
    e.preventDefault();//STOP default action
    e.unbind(); //unbind. to stop multiple form submit.
});
 
$("#ajaxform").submit(); //Submit  the FORM*/


		/*$( "#searchForm" ).submit(function( event ) {
 
		// Stop form from submitting normally
		event.preventDefault();
		
		// Get some values from elements on the page:
		var $form = $( this ),
			term = $form.find( "input[name='s']" ).val(),
			url = $form.attr( "action" );
		
		// Send the data using post
		var posting = $.post( url, { s: term } );
		
		// Put the results in a div
		posting.done(function( data ) {
			var content = $( data ).find( "#content" );
			$( "#result" ).empty().append( content );
		});*/

		