.cache <- new.env(FALSE, emptyenv())

lmap <- function(lat, lon, zoom=10, where, width=800, height=600) {
    if (missing(where)) {
        where <- paste0("rc_map_", as.integer(runif(1)*1e6))
        rcloud.html.out(paste0("<div id='", where,"' style='width:", width, "px;height:", height, "px'></div>"))
        where <- paste0("#", where)
    }
    if (is.null(.cache$ocaps)) {
        x <- paste(readLines(system.file("javascript", "rcl.js", package="rcleaflet"), warn=FALSE), collapse='\n')
        #l <- paste(readLines(system.file("www", "leaflet.js", package="rcleaflet"), warn=FALSE), collapse='\n')
        #x <- gsub("//LEAFLET.JS//", l, x, fixed=TRUE)
        .cache$ocaps <- rcloud.install.js.module("rcleaflet", x, TRUE)
    }
    .cache$last.map <- structure(list(div=.cache$ocaps$map(where, as.numeric(lat), as.numeric(lon), as.integer(zoom))), class="RCloudLeaflet")
}

## map R colors to RGB space, also re-cycle as needed and split off RGB and A
.mapColor <- function(col, n) {
    cc <- col2rgb(col, TRUE)
        
    l <- list(col=substr(rgb(cc[1,], cc[2,], cc[3,], cc[4,],, 255), 1, 7), alpha=as.vector(cc[4,])/255)
    if (length(l$col) > 1 && length(l$col) != n) {
        l$col <- rep(l$col, length.out=n)
        l$alpha <- rep(l$alpha, length.out=n)
    }
    l
}

lpoints <- function(lat, lon, col="black", bg="transparent", cex=1, lwd=1, ..., map=.cache$last.map) {
    if (is.null(map$div)) stop("invalid map object - not a Leaflet map")
    ls <- c(length(lat), length(lon))
    if (diff(ls)) { ## recycle
        lat <- rep(lat, length.out=max(ls))
        lon <- rep(lon, length.out=max(ls))
    }
    ## this is somewhat arbitrary - mapping between leaflet radius and cex ...
    cex <- cex * 72
    col <- .mapColor(col, ls[1])
    bg <- .mapColor(bg, ls[1])
    if (length(cex) > 1 && length(cex) != ls[1]) cex <- rep(cex, length.out=ls[1])
    if (length(lwd) > 1 && length(lwd) != ls[1]) lwd <- rep(lwd, length.out=ls[1])
    .cache$ocaps$points(map$div, lat, lon, col$col, bg$col, col$alpha, bg$alpha, cex, lwd)
    invisible(map)
}

lmarkers <- function(lat, lon, map=.cache$last.map) {
    if (is.null(map$div)) stop("invalid map object - not a Leaflet map")
    ls <- c(length(lat), length(lon))
    if (diff(ls)) { ## recycle
        lat <- rep(lat, length.out=max(ls))
        lon <- rep(lon, length.out=max(ls))
    }
    .cache$ocaps$markers(map$div, lat, lon)
    invisible(map)
}

lpolygon <- function(lat, lon, color='red', fillColor=color,
                     weight=5, map=.cache$last.map) {
    if (is.null(map$div)) stop("invalid map object - not a Leaflet map")
    ls <- c(length(lat), length(lon))

    if (diff(ls)) { ## recycle
        lat <- rep(lat, length.out=max(ls))
        lon <- rep(lon, length.out=max(ls))
    }
    
    col <- .mapColor(color, 1)
    fill <- .mapColor(fillColor, 1)
    .cache$ocaps$polygon(map$div, lat, lon, col$col,col$alpha, fill$col, fill$alpha,weight)
    invisible(map)
}
