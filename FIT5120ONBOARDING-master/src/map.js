import React, { useState, useRef, useCallback } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer, Autocomplete } from '@react-google-maps/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';

const containerStyle = {
    width: '100vw',
    height: '100vh'
};

const center = {
    lat: -37.8136,
    lng: 144.9631
};

const libraries = ['places'];

function Map() {
    const [directionsResult, setDirectionsResult] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [accidentCount, setAccidentCount] = useState(null);
    const [travelTime, setTravelTime] = useState('');
    const mapRef = useRef(null);
    const polylineRef = useRef(null);
    const originAutocompleteRef = useRef(null);
    const destinationAutocompleteRef = useRef(null);

    Modal.setAppElement('#root');

    const apiUrl = 'http://localhost:3000/api/accidents';

    function convertSecondsToTimeFormat(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours} hour(s) ${minutes} minute(s)`;
    }

    const directionsCallback = useCallback(async (result, status) => {
        if (status === 'OK') {
            setDirectionsResult(result);
            const route = result.routes[0];
            const bounds = route.bounds;
            const minLat = bounds.getSouthWest().lat();
            const maxLat = bounds.getNorthEast().lat();
            const minLng = bounds.getSouthWest().lng();
            const maxLng = bounds.getNorthEast().lng();

            const totalDuration = route.legs.reduce((total, leg) => total + leg.duration.value, 0); // 使用 duration.value 累加秒数
            const travelDurationText = convertSecondsToTimeFormat(totalDuration); // 转换为小时和分钟的格式

            setTravelTime(travelDurationText);

            fetch(`${apiUrl}?minLat=${minLat}&maxLat=${maxLat}&minLng=${minLng}&maxLng=${maxLng}`)
                .then(response => response.json())
                .then(data => {
                    setAccidentCount(data);
                    setModalIsOpen(true);
                })
                .catch(error => {
                    console.error('Failed to fetch accident data:', error);
                    toast.error('Failed to fetch accident data. Please try again.');
                });

            if (mapRef.current && route) {
                if (polylineRef.current) {
                    polylineRef.current.setMap(null);
                }

                const polyline = new window.google.maps.Polyline({
                    path: route.overview_path,
                    strokeColor: '#FFFFFF',
                    strokeOpacity: 0,
                    strokeWeight: 14,
                });

                polyline.setMap(mapRef.current);
                polyline.addListener('click', () => {
                    setModalIsOpen(true);
                });
                polylineRef.current = polyline;
            }
        } else {
            console.error(`Error fetching directions: ${result}`);
            toast.error('Failed to fetch directions. Please try again.');
        }
    }, []);

    const isWithinCbd = (place) => {
        if (place && place.geometry) {
            const { lat, lng } = place.geometry.location;
            return (
                lat() > -37.821 &&
                lat() < -37.807 &&
                lng() > 144.950 &&
                lng() < 144.978
            );
        }
        return false;
    };

    const handleDirectRoute = () => {
        const originPlace = originAutocompleteRef.current?.getPlace();
        const destinationPlace = destinationAutocompleteRef.current?.getPlace();

        if (originPlace && destinationPlace && isWithinCbd(originPlace) && isWithinCbd(destinationPlace)) {
            try {
                const directionsService = new window.google.maps.DirectionsService();
                directionsService.route({
                    origin: originPlace.formatted_address,
                    destination: destinationPlace.formatted_address,
                    travelMode: window.google.maps.TravelMode.BICYCLING,
                }, directionsCallback);
            } catch (error) {
                console.error('Error fetching directions:', error);
                toast.error('Failed to fetch directions. Please try again.');
            }
        } else {
            toast.error('Please enter a location within the Melbourne City');
        }
    };

    const handleRouteWithWaypoint = () => {
        const originPlace = originAutocompleteRef.current?.getPlace();
        const destinationPlace = destinationAutocompleteRef.current?.getPlace();

        if (originPlace && destinationPlace && isWithinCbd(originPlace) && isWithinCbd(destinationPlace)) {
            const origin = originPlace.geometry.location;
            const destination = destinationPlace.geometry.location;

            const latOffset = (Math.random() - 0.5) * 0.02; // Random offset
            const lngOffset = (Math.random() - 0.5) * 0.02;
            const waypoint = {
                location: {
                    lat: origin.lat() + (destination.lat() - origin.lat()) * 0.25 + latOffset,
                    lng: origin.lng() + (destination.lng() - origin.lng()) * 0.25 + lngOffset
                },
                stopover: true
            };

            try {
                const directionsService = new window.google.maps.DirectionsService();
                directionsService.route({
                    origin: originPlace.formatted_address,
                    destination: destinationPlace.formatted_address,
                    waypoints: [waypoint],
                    travelMode: window.google.maps.TravelMode.BICYCLING,
                    optimizeWaypoints: true
                }, directionsCallback);
            } catch (error) {
                console.error('Error fetching directions with waypoint:', error);
                toast.error('Failed to fetch directions with waypoint. Please try again.');
            }
        } else {
            toast.error('Please enter a location within the Melbourne City');
        }
    };

    const calculateRiskColor = () => {
        if (!accidentCount) return '#FFF';

        const { ['Fatal accident']: fatal = 0, ['Serious injury accident']: serious = 0, ['Other injury accident']: other = 0 } = accidentCount;

        const totalAccidents = fatal + serious + other;
        if (totalAccidents === 0) return '#00FF00'; // Green for no accidents

        const riskScore = (fatal * 1000 + serious * 2 + other) / totalAccidents;

        if (riskScore > 2) {
            return '#FF0000'; // Red for high risk
        } else if (riskScore > 1) {
            return '#FFFF00'; // Yellow for moderate risk
        } else {
            return '#00FF00'; // Green for low risk
        }
    };

    const textColor = calculateRiskColor() === '#FF0000' ? '#FFF' : '#000';

    return (
        <div>
            <LoadScript googleMapsApiKey="AIzaSyANZLV0u80m8vu8Fj6gvPAcz7eEwYffy64" libraries={libraries}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={14}
                    onLoad={map => mapRef.current = map}
                >
                    {directionsResult && (
                        <DirectionsRenderer directions={directionsResult} />
                    )}
                </GoogleMap>
                <div style={styles.inputContainer}>
                    <Autocomplete
                        onLoad={ref => originAutocompleteRef.current = ref}
                        onPlaceChanged={() => {
                            const place = originAutocompleteRef.current?.getPlace();
                            if (place && isWithinCbd(place)) {
                                toast.info('The starting point is set.');
                            } else {
                                toast.error('Please enter a location within the Melbourne City');
                            }
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Enter origin"
                            style={styles.input}
                        />
                    </Autocomplete>
                    <Autocomplete
                        onLoad={ref => destinationAutocompleteRef.current = ref}
                        onPlaceChanged={() => {
                            const place = destinationAutocompleteRef.current?.getPlace();
                            if (place && isWithinCbd(place)) {
                                toast.info('The end point is set.');
                            } else {
                                toast.error('Please enter a location within the Melbourne City');
                            }
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Enter destination"
                            style={styles.input}
                        />
                    </Autocomplete>
                    <button onClick={handleDirectRoute} style={styles.button}>Get Direct Route</button>
                    <button onClick={handleRouteWithWaypoint} style={styles.button}>Get Another Route</button>
                </div>
            </LoadScript>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Travel Information"
                style={modalStyles}
            >
                <h2>Accident Information</h2>
                <p>Fatal accidents: {accidentCount?.['Fatal accident'] || 0}</p>
                <p>Other injury accidents: {accidentCount?.['Other injury accident'] || 0}</p>
                <p>Serious injury accidents: {accidentCount?.['Serious injury accident'] || 0}</p>
                <p>Estimated Travel Time: {travelTime}</p>
                <div style={{
                    backgroundColor: calculateRiskColor(),
                    padding: '10px',
                    borderRadius: '4px',
                    margin: '10px 0',
                    textAlign: 'center',
                    color: textColor,
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)'
                }}>
                    Risk Assessment: {calculateRiskColor() === '#FF0000' ? 'High' : calculateRiskColor() === '#FFFF00' ? 'Moderate' : 'Low'}
                </div>
                <button onClick={() => setModalIsOpen(false)}>Close</button>
            </Modal>
            <ToastContainer />
        </div>
    );
}

const styles = {
    inputContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.7)',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    },
    input: {
        marginRight: '10px',
        padding: '5px',
        width: '200px',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    button: {
        padding: '5px 10px',
        border: 'none',
        backgroundColor: '#4285F4',
        color: 'white',
        borderRadius: '4px',
        cursor: 'pointer',
        margin: '5px 0',
    },
};

const modalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '20px',
    }
};

export default Map;