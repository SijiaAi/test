import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { scaleSequential } from 'd3-scale';
import { interpolateYlOrRd } from 'd3-scale-chromatic';

// Create a color scale
const colorScale = scaleSequential(interpolateYlOrRd).domain([0, 1000]); // Adjust domain as needed

// Convert your data to GeoJSON format
const convertToGeoJSON = (data) => {
    return {
        type: "FeatureCollection",
        features: data.map(item => ({
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: [item.geo_shape[0].map(coord => [coord.x, coord.y])]
            },
            properties: {
                id: item.id,
                loc_name: item.loc_name,
                accident_count: item.accident_count
            }
        }))
    };
};

const MapComponent = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [colorScaleDomain, setColorScaleDomain] = useState([0, 1000]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:3000/api/localities');
      const data = await response.json();
      console.log('Fetched Data:', data); 
      const processedData = convertToGeoJSON(data);
      console.log('Processed GeoJSON Data:', processedData);

      setGeoJsonData(processedData);
      console.log('GeoJsonData:',geoJsonData);
    };

    fetchData();
  }, []);

  // Function to set style for each feature
  const style = (feature) => ({
    color: 'white', // Outline color
    weight: 8,
    opacity: 1,
    fillColor: colorScale(feature.properties.accident_count),
    fillOpacity: 0.7
  });

  // Function to bind tooltip to each feature
  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      layer.bindTooltip(`<strong>${feature.properties.loc_name}</strong><br>Accidents: ${feature.properties.accident_count}`);
    }
  };

  return (
    <MapContainer center={[-37.8136, 144.9631]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {geoJsonData && <GeoJSON data={geoJsonData} style={style} onEachFeature={onEachFeature} />}
    </MapContainer>
  );
};

export default MapComponent;
