(function($) {

    var MAX_ZOOM = 20;

    /* __INIT__ **/
    $(document).ready(function() {
        init();

    });

    function init() {
        initialize_map();
    }


    /*********** Creating custom Map Type **************/
    var graphTypeOptions = {
        getTileUrl: function(coord, zoom) {
            return "./images/maps_background.jpg";
        },
        tileSize: new google.maps.Size(256, 256),
        maxZoom: MAX_ZOOM,
        minZoom: 0,
        radius: 1738000,
        name: 'Graph'
    };
    var graphMapType = new google.maps.ImageMapType(graphTypeOptions);

    /****** Initialize map ******/
    function initialize_map() {
        var myLatlng = new google.maps.LatLng(0, 0);
        var mapOptions = {
            center: myLatlng,
            zoom: MAX_ZOOM,
            streetViewControl: false,
            mapTypeControlOptions: {
                mapTypeIds: ['graph']
            }
        };
        var map = new google.maps.Map(document.getElementById('map-canvas'),
                mapOptions);
        map.mapTypes.set('graph', graphMapType);
        map.setMapTypeId('graph');
        
        var node = drawNode(myLatlng, 20, 'Hello', '#e74c3c', map);
        var node2 = drawNode(new google.maps.LatLng(0, 0.002), 20, 'Hello', '#174c3c', map);
        drawEdge(node, node2, map);
        //drawTextOverlay(myLatlng, 'hello', map);
        //drawCircle(myLatlng, 20, '#e74c3c', map);
        //drawCircle(myLatlng, 20, '#3498db', map);

        drawCirclesAround(8, myLatlng, 0.001, 20, '#d35400', map);
    }

    
    /******* Drawing function ****/
    
    /**
     * Draw the circle of the node
     * 
     * @param {google.maps.LngLat} center Centre du cercle
     * @param {int} rad Rayon
     * @param {string} color Couleur de fond et de contour
     * @param {google.maps.Map} map Map sur laquelle déssiner
     * @returns {google.maps.Circle} Le cercle créé
     * 
     */
    function drawCircle(center, rad, color, map) {
        var CircleOptions = {
            strokeWeight: 0,
            fillColor: color ,
            fillOpacity: 1,
            map: map,
            center: center,
            radius: rad
        };
        return new google.maps.Circle(CircleOptions);
    }
    
    
    /**
     * 
     * @param {google.maps.LatLng} center
     * @param {string} string
     * @param {google.maps.Map} map
     * @returns {void}
     */
    function drawTextOverlay(center, string, map) {
        
        var mapLabelOption = {
            fontSize : map.getZoom(),
            fontColor : "#FFFFFF",
            fontFamily : 'verdana',
            minZoom : 10,
            maxZoom : MAX_ZOOM,
            text : string,
            position : center,
            strokeWeight : 2
            
        };
        
        var label = new MapLabel(mapLabelOption);         
        label.setMap(map);
    }
    
    function drawNode(center, rad, string, color, map){
        drawCircle(center, rad, color, map);
        drawTextOverlay(center, string, map);
        
        return {
            center : center,
            text : string
        };
            
        }
    

    function drawCirclesAround(numberOfCircles, center, globalRadius, circleRadius, circleColor, map) {

        var maxAngle = (3/2) * Math.PI,
            angularOffset = ((2*Math.PI) - maxAngle) / 2 - Math.PI / 2;

        // On va décrire un grand cercle,
        // et placer les marqueurs à intervalle régulier
        for (var i = 0; i < numberOfCircles; i++) {
            var progress = 0.5;
            if (numberOfCircles > 1)
                progress = i / (numberOfCircles - 1);
            var lat = center.lat(),
                lng = center.lng(),
                dLat = globalRadius * Math.sin(progress * maxAngle + angularOffset),
                dLng = globalRadius * Math.cos(progress * maxAngle + angularOffset);
            var thisCenter = new google.maps.LatLng(lat + dLat, lng + dLng);
            drawCircle(thisCenter, circleRadius, circleColor, map)
        }

        // On dézoom la map afin de voir au moins globalRadius
        // TODO : zoom intelligent ? Ou bien zoom statique bien choisi
        map.setZoom(MAX_ZOOM - 2);
    }
    
    function drawEdge(node1, node2, map) {
        
        var polyLineOption = {
            path : [node1.center, node2.center],
            map : map,
            strokeWeight : 2,
            strokeColor : '#FFFFFF',
            strokeOpacity : 1.0,
            zIndex : -1
        };
        
        return new google.maps.Polyline(polyLineOption);
        
    }
    
    


})(jQuery);
