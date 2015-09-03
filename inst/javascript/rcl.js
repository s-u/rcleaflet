({
    map:function(div, lat, lon, zoom, k) {
        //LEAFLET.JS//
        var nl=document.createElement('link');
        // FIXME: de we need this or can we just use install.css?
        nl.setAttribute('rel', 'stylesheet');
        nl.setAttribute('type','text/css');
        nl.setAttribute('href','/shared.R/rcleaflet/leaflet.css');
        document.getElementsByTagName('head')[0].appendChild(nl);

        $(div).resizable({stop: function() { map.invalidateSize(); }});

        var map = L.map($(div)[0]).setView([lat,lon], zoom);
        L.tileLayer('http://gis.research.att.com/tiles-light/{z}/{x}/{y}.png', {maxZoom:18}).addTo(map);

//        setTimeout( function() { map.updateSize();}, 200);

        if (!window.rcleaflet) window.rcleaflet = {};
        window.rcleaflet[div] = { "L":L, "map":map };
        k(null, div);
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
                                                  weight: lwd.length ? lwd[i] : lwd,
                                                }).addTo(map);
        } else
            L.circle([lat, lon], rad, { color: col, fillColor: fill, fillOpacity: fillA, opacity: colA }).addTo(map);
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
        for(var i = 0; i < lat1.length; i++)
            points.push(L.LatLng(lat[i], lon[i]));
        L.polyline(points, {color: col, weight: weight}).addTo(map);
        k(null, true);
    },

    polygon:function(div, lat, lon, col, weight, k) {
        var L = window.rcleaflet[div].L;
        var map = window.rcleaflet[div].map;
        var points = [];
        for(var i = 0; i < lat1.length; i++)
            points.push(L.LatLng(lat[i], lon[i]));
        L.polygon(points, {color: col, weight: weight}).addTo(map);
        k(null, true);
    }
})
