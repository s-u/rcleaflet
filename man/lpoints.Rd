\name{lpoints}
\alias{lpoints}
\title{
  Add objects to an interactive Leaflet map
}
\description{
  \code{lpoints} adds points (circles) to an interactive leaflet map.
}
\usage{
lpoints(lat, lon, col = "black", bg = "transparent", cex = 1, lwd = 1, ..., map = .cache$last.map)
}
%- maybe also 'usage' for other objects documented here.
\arguments{
  \item{lat}{numeric vector of latitudes}
  \item{lon}{numeric vector of longitudes}
  \item{col}{color (border) of the points}
  \item{bg}{background (fill) of the points}
  \item{cex}{expansion of the points}
  \item{lwd}{line width of the border}
  \item{\dots}{further arguments for future use}
  \item{map}{object of the class \code{RCloudLeaflet} representing the
    map to add to (as returned by \code{\link{lmap}}}
}
\details{
  \code{lpoints} adds points to the map. Although the syntax is
  mimicking the well-known \code{points} method, is always behaves as if
  `pch=21` was specified. All arguments can be vectors and will be
  re-cycled accordingly.
}
\value{
  Returns the \code{map} obejct.
}
\author{
  Simon Urbanek
}
\seealso{
  \code{\link{lmap}}
}
%\examples{
%}
\keyword{aplot}
