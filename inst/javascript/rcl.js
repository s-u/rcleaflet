(function(){
    // Load CSS and JS
    var fileref=document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.5/leaflet.css');
    document.getElementsByTagName( "head" )[0].appendChild( fileref );        
    
    require.config({
        paths: {
            leaflet: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.5/leaflet'
        },
        shim: {
            leaflet: {
                exports: 'L'
            }
        }
    });      

    function initMap(div, lat, lon, zoom, k) {            
        $(div).resizable({stop: function() { map.invalidateSize(); }});
        var map = L.map($(div)[0]).setView([lat,lon], zoom);
        L.tileLayer('https://rcloud.research.att.com/tiles-light/{z}/{x}/{y}.png', {maxZoom:18}).addTo(map);
        
        if (!window.rcleaflet) window.rcleaflet = {};
        window.rcleaflet[div] = { "L":L, "map":map };
        
        k(null, div);
    }
    
    return {
        map:function(div, lat, lon, zoom, k){  // this serves as an init function as well, this works because it really blocks
            if(typeof L === 'undefined'){
                require(['leaflet'],function(L){
                    initMap(div, lat, lon, zoom, k);
                });
            }
            else{ //no need to reload leaflet
                initMap(div, lat, lon, zoom, k);
            }
        },
        points:function(div, lat, lon, col, fill, colA, fillA, rad, lwd, k) {
            var L = window.rcleaflet[div].L;
            var map = window.rcleaflet[div].map;
            if (lat.length) {
                for (var i = 0; i < lat.length; i++)
                    L.circle([lat[i], lon[i]], rad, { color: col.charAt ? col : col[i],
                                                      fillColor: fill.charAt ? fill : fill[i],
                                                      fillOpacity: fillA.length ? fillA[i] : fillA,
                                                      opacity: colA.length ? colA[i] : colA,
                                                      weight: lwd.length ? lwd[i] : lwd
                                                    }).addTo(map);
            } else
                L.circle([lat, lon], rad, { color: col, fillColor: fill, fillOpacity: fillA, opacity: colA }).addTo(map);
            k(null, true);
        },

        markers:function(div, lat, lon, k) {
            var L = window.rcleaflet[div].L;
            var map = window.rcleaflet[div].map;
            if (lat.length) {
                for (var i = 0; i < lat.length; i++)
                    L.marker([lat[i], lon[i]]).addTo(map);
            } else
                L.marker([lat, lon]).addTo(map);
            k(null, true);
        },

        segments:function(div, lat1, lon1, lat2, lon2, col, k) {
            var L = window.rcleaflet[div].L;
            var map = window.rcleaflet[div].map;
            for(var i=0; i < lat1.length; i++)
                L.polyline([[lat1[i],lon1[i]],[lat2[i],lon2[i]]], {color: col, weight:1}).addTo(map);
            k(null, true);
        },

        polyline:function(div, lat, lon, col, weight, k) {
            var L = window.rcleaflet[div].L;
            var map = window.rcleaflet[div].map;
            var points = [];
            for(var i = 0; i < lat.length; i++)
                points.push(L.latLng(lat[i], lon[i]));
            L.polyline(points, {color: col, weight: weight}).addTo(map);
            k(null, true);
        },

        polygon:function(div, lat, lon, color, opacity, 
                         fillColor, fillOpacity, weight, k) {
            var L = window.rcleaflet[div].L;
            var map = window.rcleaflet[div].map;
            var boundaries = [];
            var points = [];

            for(var i = 0; i < lat.length; i++){
                if (!isNaN(lat[i])){
                    points.push(L.latLng(lat[i], lon[i]));
                }
                else{
                    var dir = points.reduce(function(p,c,i,arr){
                        if (i >= arr.length-1){ // 
                            return p;
                        }

                        return p + (arr[i+1].lng - arr[i].lng )*
                            (arr[i+1].lat+arr[i].lat);
                    },0);
                    
                    points.pop();
                    if (dir >= 0){ //clockwise
                        boundaries.push([points.slice()]);
                    }
                    else{  //counter clockwise (hole)
                        boundaries[boundaries.length-1].push(points.slice());
                    }
                    points = [];
                }
            }
            
            //process the last set of points
            dir = points.reduce(function(p,c,i,arr){
                if (i >= arr.length-1){ // 
                    return p;
                }
                return p + (arr[i+1].lng - arr[i].lng )*
                    (arr[i+1].lat + arr[i].lat);
            },0);
            
            points.pop();
            if (dir >=  0){ //clockwise
                boundaries.push([points.slice()]);
            }
            else{  //counter clockwise (hole)
                boundaries[boundaries.length-1].push(points.slice());
            }
            
            L.multiPolygon(boundaries, {color: color, 
                                        opacity: opacity,
                                        fillColor: fillColor,
                                        fillOpacity: fillOpacity, 
                                        weight: weight }).addTo(map);
            k(null, true);
        }
    };    
})();
