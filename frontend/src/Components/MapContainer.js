import './MapContainer.css'
import { useRef, useState, useEffect } from 'react'
import routes from "./routes.json";

import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  DirectionsRenderer
} from '@react-google-maps/api'

// define literals to avoid lots of rerendering
const libraries = ["places"]; 

const center = {
  lat: 43.6532,
  lng: -79.3832
}

export default function MapContainer (props) {
  let {isDisplaying} = props
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAeufE-n5QFRUQU3TlBoKXxqNHmmCl-oEw',
    libraries
  })

  const [map, setMap] = useState(/** @type google.maps.Map */ null)
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef()
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef()
 
  const routesCopy = routes.map(route => { //get a json file and map it out into an array of objects 
    return {
      location: { lat: route.location.lat, lng: route.location.lng },
      stopover: true
    };
  });

  console.log(routesCopy);

  useEffect(() => {
    // console.log(loadError);
    console.log("isloaded", isLoaded);
    if(isLoaded){
      calculateRoute();
    }
  }, [isLoaded, loadError]);

  useEffect(() => {
    console.log(map);
  }, [map]);

  // if(loadError) return "Error loading map";
  // if(!isLoaded) return "Loading Maps";

  async function calculateRoute () {
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: {
        lat: 43.6532,
        lng: -79.3832
      },
      destination: {
        lat: 43.6532,
        lng: -79.3838
      },
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING, 
      waypoints: routesCopy,
    })
    console.log(results);
    setDirectionsResponse(results)
    // setDistance(results.routes[0].legs[0].distance.text)
    // setDuration(results.routes[0].legs[0].duration.text)
  }

  function displayRoutes(){

  }

  function clearRoute () {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    originRef.current.value = ''
    destiantionRef.current.value = ''
  }

  return (
    <div className="map-container" style={{display:(isDisplaying?"flex":"none")}}>
        <span className="map-top-text">Next Appointment:</span>
    {isLoaded ? (
      <div style={{ height: "300px", width: "100%" }}>
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            mapId:"a8adcd4aada0b50f",
          }}
          onLoad={map => setMap(map)}
        >
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </div>
    ) : (<div><h1>test</h1></div>)}
    </div>
  )
}
