\name{lmap}
\alias{lmap}
\title{
  Create an interactive map
}
\description{
  \code{lmap} creates an instance of an interactive map using Leaflet.
}
\usage{
lmap(x = NULL, y = NULL, zoom = NULL, where, xlim = NULL, 
    ylim = NULL, width = 800, height = 600,
    tilepath = "https://rcloud.research.att.com/tiles-light/{z}/{x}/{y}.png", 
    eventfunc = NULL, lat = y, lon = x)
}
\arguments{
  \item{x}{convenience positional shortcut for \code{lon}}
  \item{y}{convenience positional shortcut for \code{lat}}
  \item{zoom}{zoom level}
  \item{lat}{latitude of the center or points to base the center on}
  \item{lon}{longitude of the center or points to base the center on}
  \item{where}{optional, string identifying the element which will
    contain the map using jQuery selector notation. If absent, a new
    \code{<div>} element is created using \code{\link{rcloud.html.out}}.}
  \item{width}{if \code{where} is missing, the width (in pixels) of the
    new map element}
  \item{height}{if \code{where} is missing, the height (in pixels) of the
    new map element}
  \item{xlim}{range of longitudes to show}
  \item{ylim}{range of latitudes to show}
  \item{tilepath}{specification for tiles URLs}
  \item{eventfunc}{named list of callback functions to register}
}
\details{
  \code{lmap} creates a new instance of a Leaflet intercative map. It
  also sets the current active map to this objects such that calls to
  \code{\link{lpoints}} and other plotting functions will default to
  this instance if no map is specified explicitly.

  Callback functions should generally have the signature
  \code{function(i, ...)} where \code{i} is the index of the element
  that triggered the callback (for \code{lpoints}, \code{lmarkers}
  etc). For \code{lmap} it is always 0.  
}
\value{
  Returns an object of the class \code{RCloudLeaflet} representing the
  map.
}
\author{
  Simon Urbanek
}
\seealso{
  \code{\link{lpoints}}
}
%\examples{
%}
\keyword{hplot}
