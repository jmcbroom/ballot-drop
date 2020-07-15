import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import bbox from '@turf/bbox'
import locations from './drop_off_locations.json'
import district from './district.json'

const DropOffMap = ({ address, setAddress, setFiltered }) => {

    const [theMap, setTheMap] = useState(null)
    const [theGeocoder, setTheGeocoder] = useState(null)

    useEffect(() => {
        mapboxgl.accessToken =
            "pk.eyJ1Ijoiam1jYnJvb20iLCJhIjoiY2s2c3JubGd5MGFtNDNncm0yaWNmaWFpciJ9.Jmw14y-b00Q_j0UIxFmMmw";
        var map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/jmcbroom/ck7va71n90bf51jmj0r3n2a7d",
            center: [-83.03777, 42.376],
            zoom: 9
        });

        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
            countries: 'US',
            types: 'address',
            bbox: [-83.430038, 42.179439, -82.961926, 42.444748],
            flyTo: false,
            placeholder: `Enter your address`
        })

        map.addControl(geocoder, 'top-left')

        geocoder.on('result', e => {
            setAddress(e.result)
            console.log(e.result)
            let [addr, city, ...rest] = e.result.place_name.split(",")
            let filtered = locations.features.filter(l => l.properties.City === city.trim())
            setFiltered(filtered)
            map.getSource("locations").setData({ "type": "FeatureCollection", features: filtered })
            let fc = { type: "FeatureCollection", features: filtered }
            fc.features.push(e.result)
            map.fitBounds(bbox(fc), { padding: 50, maxZoom: 15 })
            map.setLayoutProperty('locations-label', 'visibility', 'visible')

        })

        map.on("load", e => {

            map.fitBounds(bbox(district), { padding: 25 })
            setTheMap(map)
            setTheGeocoder(geocoder)

            map.addSource("district", {
                type: 'geojson',
                data: district
            })

            map.addLayer({
                id: "district-line",
                source: "district",
                type: 'line',
                paint: {
                    "line-color": 'rgba(0,0,0,1)'
                }
            })

            map.addLayer({
                id: "district-fill",
                source: "district",
                type: 'fill',
                paint: {
                    "fill-color": 'rgba(0,0,0,0.05)'
                }
            }, 'road-label')


            map.addSource("locations", {
                type: "geojson",
                data: locations
            })

            map.addLayer({
                id: "locations-circle",
                type: 'circle',
                source: "locations",
                paint: {
                    "circle-radius": {
                        stops: [[9, 10], [19, 10]]
                    },
                    "circle-color": 'rgba(255,255,255,0.75)',
                    "circle-stroke-color": 'rgba(0,0,0,0.9)',
                    "circle-stroke-width": 2
                }
            })
            map.addLayer({
                id: "locations-icon",
                type: 'symbol',
                source: "locations",
                layout: {
                    "icon-image": 'town-hall-11',
                    "icon-allow-overlap": true
                }
            })

            map.addLayer({
                id: "locations-label",
                type: 'symbol',
                source: 'locations',
                layout: {
                    visibility: 'none',
                    "text-field": ["get", "Location Name"],
                    "text-font": ["Inter Regular"],
                    "text-offset": {
                        stops: [[10, [0, 2.75]], [15, [0, 1.75]]]
                    },
                    "text-letter-spacing": -0.02,
                    "text-size": {
                        stops: [[11, 10], [15, 20]]
                    }
                }
            })
        });
    }, []);

    useEffect(() => {
        if (theMap && theGeocoder && address === null) {
            theGeocoder.clear()
            theMap.getSource("locations").setData(locations)
            theMap.setLayoutProperty('locations-label', 'visibility', 'none')
            theMap.fitBounds(bbox(district), { padding: 50 })
        }
    }, [address])
    return (
        <section>
            <div id="map" style={{ width: '100vw', height: 500 }} />
        </section>
    )
}

export default DropOffMap