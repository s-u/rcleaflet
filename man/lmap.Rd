\name{lmap}
\alias{lmap}
\title{
  Create an interactive map
}
\description{
  \code{lmap} creates an instance of an interactive map using Leaflet.
}
\usage{
lmap(lat, lon, zoom = 10, where, width = 800, height = 600)
}
\arguments{
  \item{lat}{latitude of the center}
  \item{lon}{longitude of the center}
  \item{zoom}{zoom level}
  \item{where}{optional, string identifying the element which will
    contain the map using jQuery selector notation. If absent, a new
    \code{<div>} element is created using \code{\link{rcloud.html.out}}.}
  \item{width}{if \code{where} is missing, the width (in pixels) of the
    new map element}
  \item{height}{if \code{where} is missing, the height (in pixels) of the
    new map element}
}
\details{
  \code{lmap} creates a new instance of a Leaflet intercative map. It
  also sets the current active map to this objects such that calls to
  \code{\link{lpoints}} and other plotting functions will default to
  this instance if no map is specified explicitly.
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
