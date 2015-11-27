/*global $ L require */

(function(){
    // Load CSS and JS
    var fileref=document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/leaflet.css');
    document.getElementsByTagName( "head" )[0].appendChild( fileref );

    require.config({
        paths: {
            leaflet: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/leaflet'
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
        L.tileLayer('https://rcloud.research.att.com/tiles-light/{z}/{x}/{y}.png',
                    {maxZoom:18}).addTo(map);

        if (!window.rcleaflet) window.rcleaflet = {};
        window.rcleaflet[div] = { "L":L, "map":map };

        k(null, div);
    }

    return {
        map:function(div, lat, lon, zoom, k){
            // this serves as an init function,
            // it works because it really blocks
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
                for (var i = 0; i < lat.length; i++){
                    var opts =  {
                        color: col.charAt ? col : col[i],
                        fillColor: fill.charAt ? fill : fill[i],
                        fillOpacity: fillA.length ? fillA[i] : fillA,
                        opacity: colA.length ? colA[i] : colA,
                        weight: lwd.length ? lwd[i] : lwd
                    };
                    L.circle([lat[i], lon[i]], rad, opts).addTo(map);
                }
            }
            else{
                opts= {
                    color: col,
                    fillColor: fill,
                    fillOpacity: fillA,
                    opacity: colA
                };                
                L.circle([lat, lon], rad, opts).addTo(map);
            }
            k(null, true);
        },
        
        segments:function(div, lat1, lon1, lat2, lon2, col, lty, lwd, k) {
            var L = window.rcleaflet[div].L;
            var map = window.rcleaflet[div].map;

            if(!lat1.length && !lon1.length &&
               !lat2.length && !lon2.length && !lwd.length){
                //special case for a single element
                lat1 = [lat1];
                lon1 = [lon1];
                lat2 = [lat2];
                lon2 = [lon2];
                lwd = [lwd];
            }
            for(var i=0; i < lat1.length; i++){
                var opts={
                    color: col.charAt ? col : col[i],
                    dashArray: lty.charAt ? lty : lty[i],
                    weight: lwd.length ? lwd[i] : lwd
                };                
                L.polyline([[lat1[i],lon1[i]],
                            [lat2[i],lon2[i]]],opts).addTo(map);
            }
            k(null, true);
        },
        
        markers:function(div, lat, lon, k) {
            var L = window.rcleaflet[div].L;
            var map = window.rcleaflet[div].map;
            if (lat.length) {
                for (var i = 0; i < lat.length; i++){
                    L.marker([lat[i], lon[i]]).addTo(map);
                }
            }
            else{
                L.marker([lat, lon]).addTo(map);
            }
            k(null, true);
        },

        polyline:function(div, lat, lon, col, weight, k) {
            var L = window.rcleaflet[div].L;
            var map = window.rcleaflet[div].map;
            var points = [];

            for(var i = 0; i < lat.length; i++){
                points.push(L.latLng(lat[i], lon[i]));
            }
            
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
        },

        animatedPolyline: function(div,lat, lon, durations,stepsize,delay,k){
            stepsize = stepsize || 1000.0/30;
            delay = delay || 1000;

            var L = window.rcleaflet[div].L;
            var map = window.rcleaflet[div].map;
            var pl = L.polyline([[lat[0],lon[0]]]);
            pl.addTo(map);

            var s = this._genSteps(lat,lon,durations,stepsize);

            var start = window.performance.now();
            var ll = pl.getLatLngs();
            var lastp = ll[ll.length-1];
            ll.push(lastp);
            pl.setLatLngs(ll); //dup the last point
            var op = window.performance.now()-start;

            //estimate the required time for setting the polyline
            stepsize -= op;
            stepsize = Math.max(stepsize,0);
            console.log(stepsize);

            window.setTimeout(function(){
                var timer = window.setInterval(function(){
                    var ll = pl.getLatLngs();
                    ll[ll.length-1]=s[0].shift();

                    if (s[0].length < 1) { //last pt of the current interval
                        ll.push(ll[ll.length-1]); //repeat the last pt;
                        s.shift(); //remove the empty list
                    }
                    //set the new latlng
                    pl.setLatLngs(ll);

                    if (s.length < 1){
                        window.clearInterval(timer);
                        ll = pl.getLatLngs();
                        ll.pop();
                        pl.setLatLngs(ll);
                        console.log(pl.getLatLngs());
                    }
                },stepsize);
            },delay);
            k(null, true);
        },

        animatedMarker: function (div,lat, lon, durations,stepsize,delay,k){
            stepsize = stepsize || 1000.0/30;
            delay = delay || 1000;

            var L = window.rcleaflet[div].L;
            var map = window.rcleaflet[div].map;
            var m = L.marker([lat[0],lon[0]]);
            m.addTo(map);

            var s = this._genSteps(lat,lon,durations,stepsize);

            var start = window.performance.now();
            var ll = m.getLatLng();
            m.setLatLng(ll); //set position
            var op = window.performance.now()-start;

            //estimate the required time for setting the marker
            stepsize -= op;
            stepsize = Math.max(stepsize,0);
            console.log(stepsize);

            window.setTimeout(function(){
                var timer = window.setInterval(function(){
                    m.setLatLng(s[0].shift());

                    if (s[0].length < 1) { //last pt of the current interval
                        s.shift(); //remove the empty list
                    }
                    if (s.length < 1){
                        window.clearInterval(timer);
                    }
                },stepsize);
            },delay);
            k(null, true);
        },

        _genSteps: function (lat, lon, durations, stepsize) {
            var allsteps = [];
            for(var i=0; i< lat.length-1; i++){
                var s = Math.ceil(durations[i]/stepsize);
                var d = L.latLng(lat[i+1]-lat[i],lon[i+1]-lon[i]);
                d = L.latLng(d.lat/s,d.lng/s);
                var steps = new Array(s);
                for(var j=0; j < s-1; j++){
                    steps[j] = L.latLng(lat[i]+d.lat*(j+1),lon[i]+d.lng*(j+1));
                }
                steps[s-1] = L.latLng(lat[i+1],lon[i+1]);
                allsteps[i] = steps;
            }
            return allsteps;
        }
    };
})();
