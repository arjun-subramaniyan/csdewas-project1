var mapObj = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([25.74, 61.92]),
        zoom: 4
    })
});
$.ajax({
    url: "https://data.foli.fi/gtfs/v0/20191114-135003/routes", success: function (result) {
        $.each(result, function (key, routes) {
            $('#routeSelect').append('<option value=' + routes.route_id + '>' + routes.route_long_name + '</option');
        });

    }
});
var layerLines;
function showRoutes() {
    if (layerLines) {
        mapObj.removeLayer(layerLines);
    }
    var routeID = $('#routeSelect').val();
    var randomTrip;
    $.ajax({
        url: "http://data.foli.fi/gtfs/trips/route/" + routeID, success: function (trips) {
            randomTrip = Math.floor(Math.random() * Math.floor(trips.length - 1));
            $.ajax({
                url: "http://data.foli.fi/gtfs/shapes/" + trips[randomTrip].shape_id, success: function (shape) {
                    var coordinates = shape.map(function (obj) { return [obj.lon, obj.lat] });
                    var lineStyle = new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: '#1d75f0',
                            width: 3,
                            opacity: 0.7
                        })
                    });
                    layerLines = new ol.layer.Vector({
                        source: new ol.source.Vector({
                            features: [new ol.Feature({
                                geometry: new ol.geom.LineString(coordinates).transform('EPSG:4326', 'EPSG:3857'),
                                name: 'Line'
                            })]
                        }),
                        style: [lineStyle]
                    });
                    mapObj.addLayer(layerLines);
                    mapObj.getView().setCenter(ol.proj.transform(coordinates[Math.floor(coordinates.length / 2)], 'EPSG:4326', 'EPSG:3857'));
                    mapObj.getView().setZoom(12);
                }
            });
        }
    });
};
var markerVectorLayers = [];
function showBusPoints() {
    if (markerVectorLayers.length > 0) {
        for (var i = 0; i < markerVectorLayers.length; i++) {
            mapObj.removeLayer(markerVectorLayers[i]);
        }
    }
    var routeID = $('#routeSelect').val();
    var vehiclesCoods = [];
    $.ajax({
        url: "https://data.foli.fi/siri/vm", success: function (vmData) {
            var vehicles = vmData.result.vehicles;
            $.each(vehicles, function (key, value) {
                if (value.__routeref && value.latitude && value.longitude && routeID === value.__routeref) {
                    vehiclesCoods.push([value.longitude, value.latitude]);
                }
            });
            for (var i = 0; i < vehiclesCoods.length; i++) {
                var marker = new ol.Feature({
                    geometry: new ol.geom.Point(
                        ol.proj.fromLonLat(vehiclesCoods[i])
                    )
                });
                marker.setStyle(new ol.style.Style({
                    image: new ol.style.Icon(({
                        src: 'img/bus.png',
                        scale: 0.05
                    }))
                }));
                var vectorSource = new ol.source.Vector({
                    features: [marker]
                });
                markerVectorLayer = new ol.layer.Vector({
                    source: vectorSource,
                });
                mapObj.addLayer(markerVectorLayer);
                markerVectorLayers.push(markerVectorLayer);
            }
            if (vehiclesCoods.length > 0) {
                mapObj.getView().setCenter(ol.proj.transform(vehiclesCoods[0], 'EPSG:4326', 'EPSG:3857'));
                mapObj.getView().setZoom(12);
            }
            else {
                alert('No buses available');
            }
        }
    });
}
function resetMap() {
    if (layerLines) {
        mapObj.removeLayer(layerLines);
    }
    if (markerVectorLayers.length > 0) {
        for (var i = 0; i < markerVectorLayers.length; i++) {
            mapObj.removeLayer(markerVectorLayers[i]);
        }
    }
};