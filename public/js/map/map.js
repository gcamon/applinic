"use strict";
/* global document */
jQuery(document).ready(function () {
    /***
     Adding Google Map.
     ***/

    /* Calling goMap() function, initializing map and adding markers. */
    jQuery('#map_canvas').goMap({
        maptype: 'ROADMAP',
        latitude: 40.760651,
        longitude: -73.930635,
        zoom: 6,
        scaleControl: true,
        scrollwheel: false,
//        group: 'category',
        markers: [
//            Markers for Doctor Search
            {latitude: 40.735323, longitude: -71.993807, group: 'doctor', icon: '/assets/images/map/01.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 40.759590, longitude: -72.918619, group: 'doctor', icon: '/assets/images/map/01.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 40.750698, longitude: -73.004278, group: 'doctor', icon: '/assets/images/map/01.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 40.7146, longitude: -73.948317, group: 'doctor', icon: '/assets/images/map/01.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 40.716818, longitude: -73.983164, group: 'doctor', icon: '/assets/images/map/01.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 40.759090, longitude: -73.918619, group: 'doctor', icon: '/assets/images/map/01.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 40.750898, longitude: -74.004278, group: 'doctor', icon: '/assets/images/map/01.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 40.739323, longitude: -73.993807, group: 'doctor', icon: '/assets/images/map/01.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 40.714216, longitude: -73.948317, group: 'doctor', icon: '/assets/images/map/01.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 41.716818, longitude: -73.983164, group: 'doctor', icon: '/assets/images/map/01.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 40.714216, longitude: -74.948317, group: 'pharmacy', icon: '/assets/images/map/02.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 43.735323, longitude: -72.993807, group: 'doctor', icon: '/assets/images/map/01.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 45.759590, longitude: -72.918619, group: 'doctor', icon: '/assets/images/map/01.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 46.750698, longitude: -83.004278, group: 'doctor', icon: '/assets/images/map/01.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 42.7146, longitude: -63.948317, group: 'doctor', icon: '/assets/images/map/01.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 44.716818, longitude: -73.983164, group: 'doctor', icon: '/assets/images/map/01.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 45.759090, longitude: -73.918619, group: 'doctor', icon: '/assets/images/map/01.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 46.750898, longitude: -74.004278, group: 'doctor', icon: '/assets/images/map/01.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 45.739323, longitude: -82.993807, group: 'doctor', icon: '/assets/images/map/01.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 40.714216, longitude: -81.948317, group: 'doctor', icon: '/assets/images/map/01.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 39.716818, longitude: -81.983164, group: 'doctor', icon: '/assets/images/map/01.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 47.714216, longitude: -73.948317, group: 'pharmacy', icon: '/assets/images/map/02.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
//            Markers for Pharmacy
            {latitude: 42.716818, longitude: -68.983164, group: 'pharmacy', icon: '/assets/images/map/02.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 38.714216, longitude: -73.948317, group: 'pharmacy', icon: '/assets/images/map/02.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 37.733210, longitude: -75.062300, group: 'pharmacy', icon: '/assets/images/map/02.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 49.714216, longitude: -73.948317, group: 'pharmacy', icon: '/assets/images/map/02.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 37.733410, longitude: -75.062350, group: 'pharmacy', icon: '/assets/images/map/02.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 39.716818, longitude: -80.986164, group: 'pharmacy', icon: '/assets/images/map/02.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 49.719216, longitude: -79.948317, group: 'pharmacy', icon: '/assets/images/map/02.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 37.733210, longitude: -74.062300, group: 'pharmacy', icon: '/assets/images/map/02.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 36.733210, longitude: -76.069500, group: 'pharmacy', icon: '/assets/images/map/02.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 39.716818, longitude: -75.983164, group: 'pharmacy', icon: '/assets/images/map/02.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 38.714216, longitude: -74.948317, group: 'pharmacy', icon: '/assets/images/map/02.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 37.733210, longitude: -76.062300, group: 'pharmacy', icon: '/assets/images/map/02.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 35.714216, longitude: -69.948317, group: 'pharmacy', icon: '/assets/images/map/02.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 40.733410, longitude: -69.062350, group: 'pharmacy', icon: '/assets/images/map/02.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 41.716818, longitude: -70.986164, group: 'pharmacy', icon: '/assets/images/map/02.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 42.719216, longitude: -83.948317, group: 'pharmacy', icon: '/assets/images/map/02.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 45.733210, longitude: -80.062300, group: 'pharmacy', icon: '/assets/images/map/02.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 38.733210, longitude: -50.069500, group: 'pharmacy', icon: '/assets/images/map/02.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
//            Markers for Hospitals
            {latitude: 43.739363, longitude: -73.985807, group: 'hospital', icon: '/assets/images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 40.759090, longitude: -73.918619, group: 'hospital', icon: '/assets/images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 40.750898, longitude: -74.004278, group: 'hospital', icon: '/assets/images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 40.733210, longitude: -74.062300, group: 'hospital', icon: '/assets/images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 40.716818, longitude: -73.983164, group: 'hospital', icon: '/assets/images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 40.739323, longitude: -73.993807, group: 'hospital', icon: '/assets/images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 40.759090, longitude: -73.918619, group: 'hospital', icon: '/assets/images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 40.714216, longitude: -73.946517, group: 'hospital', icon: '/assets/images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 40.759598, longitude: -74.004278, group: 'hospital', icon: '/assets/images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 40.714216, longitude: -73.948317, group: 'hospital', icon: '/assets/images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 40.739323, longitude: -73.993807, group: 'hospital', icon: '/assets/images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 40.759090, longitude: -73.918619, group: 'hospital', icon: '/assets/images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 40.750898, longitude: -74.004278, group: 'hospital', icon: '/assets/images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 40.733210, longitude: -74.062300, group: 'hospital', icon: '/assets/images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 40.716818, longitude: -73.983164, group: 'hospital', icon: 'images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 40.739323, longitude: -73.993807, group: 'hospital', icon: 'images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 40.759090, longitude: -73.918619, group: 'hospital', icon: 'images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 41.714216, longitude: -73.948317, group: 'hospital', icon: 'images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 41.750898, longitude: -74.104278, group: 'hospital', icon: 'images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 35.739363, longitude: -73.985807, group: 'hospital', icon: 'images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 36.759090, longitude: -73.918619, group: 'hospital', icon: 'images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 37.750898, longitude: -76.004278, group: 'hospital', icon: 'images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 38.733210, longitude: -85.062300, group: 'hospital', icon: 'images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 40.716818, longitude: -85.983164, group: 'hospital', icon: 'images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 38.739323, longitude: -83.993807, group: 'hospital', icon: 'images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 40.759090, longitude: -82.918619, group: 'hospital', icon: 'images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 35.714216, longitude: -73.946517, group: 'hospital', icon: 'images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 36.759598, longitude: -74.004278, group: 'hospital', icon: 'images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 38.714216, longitude: -83.948317, group: 'hospital', icon: 'images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 39.739323, longitude: -73.993807, group: 'hospital', icon: 'images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 40.759090, longitude: -73.918619, group: 'hospital', icon: 'images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 41.750898, longitude: -85.004278, group: 'hospital', icon: 'images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 42.733210, longitude: -80.062300, group: 'hospital', icon: 'images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 41.716818, longitude: -80.983164, group: 'hospital', icon: 'images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 42.739323, longitude: -79.993807, group: 'hospital', icon: 'images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 45.759090, longitude: -79.918619, group: 'hospital', icon: 'images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 39.714216, longitude: -85.948317, group: 'hospital', icon: 'images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 38.750898, longitude: -76.104278, group: 'hospital', icon: 'images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }},
            {latitude: 47.714216, longitude: -87.948317, group: 'hospital', icon: 'images/map/03.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }}
        ]

    });
    jQuery('#doctor-location').goMap({
        maptype: 'ROADMAP',
        latitude: 40.760651,
        longitude: -73.930635,
        zoom: 6,
        scaleControl: true,
        scrollwheel: false,
        markers: [
            {latitude: 40.716818, longitude: -73.983164, group: 'doctor', icon: 'images/map/01.png', html: {
                    content: 'Lorem ipsum dolor sit amet.<br /><a href="company-page.html">Read More</a>'
                }}
        ]
    });
    $.goMap.ready(function () {
        var bounds = $.goMap.getBounds();
        var southWest = bounds.getSouthWest();
        var northEast = bounds.getNorthEast();
        var lngSpan = northEast.lng() - southWest.lng();
        var latSpan = northEast.lat() - southWest.lat();


        var markers = [];

        for (var i in $.goMap.markers) {
            var temp = $($.goMap.mapId).data($.goMap.markers[i]);
            markers.push(temp);
        }


        var markerclusterer = new MarkerClusterer($.goMap.map, markers);

    });
    /* Hiding all the markers on the map. */
    $(".group").change(function () {
        var group = $(this).val();

        if (group == 'all')
            for (var i in $.goMap.markers) {
                $.goMap.showHideMarker($.goMap.markers[i], true);
            }
        else {
            for (var i in $.goMap.markers) {
                $.goMap.showHideMarker($.goMap.markers[i], false);
            }

            $.goMap.showHideMarkerByGroup(group, true);
        }

    });
//    Click Function for Map Banner
    $(".search_banner").on('click', function (event) {
        event.preventDefault();
        $('.tg-banner-content').hide('slide', {direction: 'left'}, 1000);
        $('.show-search').show('slide', {direction: 'right'}, 2000);
    });
    $(".show-search").on('click', function (event) {
        event.preventDefault();
        $('.tg-banner-content').show('slide', {direction: 'left'}, 2000);
        $(this).hide('slide', {direction: 'right'}, 1000);
    });
});