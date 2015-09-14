## shapefile-ags

![npm version](https://img.shields.io/npm/v/shapefile-ags.svg)

Export an ArcGIS Server service layer as a shapefile.

### Installation

    npm install -g shapefile-ags

### Usage

    shapefile-ags <map_service_layer_url> [options]

A simple example that exports all features:

    shapefile-ags http://gis-web.co.union.nc.us/arcgis/rest/services/PWGIS_Web/Operational_Layers/MapServer/5

Add a where clause to filter your features. Any SQL supported by ArcGIS Server should work here:

    shapefile-ags http://gis-web.co.union.nc.us/arcgis/rest/services/PWGIS_Web/Operational_Layers/MapServer/5 --where='manhole_depth<6'

Specify the file name:

    shapefile-ags http://gis-web.co.union.nc.us/arcgis/rest/services/PWGIS_Web/Operational_Layers/MapServer/5 --file-name='man_holes.zip'

### Caveats

All exports will be projected to 4326 (latitude, longitude).
