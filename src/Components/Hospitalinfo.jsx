import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";

export default function Hospitalinfo() {
  const { state } = useLocation();
  const hospitalData = state?.hospital || {};

  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          getAddress(latitude, longitude).then((address) => {
            setAddress(address);
          });

          if (hospitalData.latitude && hospitalData.longitude) {
            fetchDirections(latitude, longitude, hospitalData.latitude, hospitalData.longitude);
          }
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [hospitalData]);

  function getAddress(lat, lon) {
    return fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&type=city&lang=en&limit=20&format=json&apiKey=531ac8f784eb4dd89eeb5246d176b7aa`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data.results.length) {
          return data.results[0].formatted;
        }
        return null;
      });
  }

  function fetchDirections(fromLat, fromLon, toLat, toLon) {
    const API_URL = `https://api.geoapify.com/v1/routing?waypoints=${fromLat},${fromLon}|${toLat},${toLon}&mode=drive&details=instruction_details&apiKey=531ac8f784eb4dd89eeb5246d176b7aa`;
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        if (data.features && data.features.length > 0) {
          const steps = data.features[0].properties.legs[0].steps.map((step, index) => ({
            instruction: step.instruction.text,
            distance: step.distance,
            duration: step.time
          }));
          setDirections(steps);
        }
      })
      .catch((error) => {
        console.error("Error fetching directions:", error);
      });
  }

  return (
    <Row>
      <Col>
        <div className="Card">
          <h2>{hospitalData.name}</h2>
          <hr />
          {location && (
            <p>
              Your Latitude: Lat {location.latitude} <br />
              Your Longitude: Lon {location.longitude}
            </p>
          )}
          <hr />
          {address && <p>Address: {address}</p>}
          <hr />
          <div>
            {hospitalData.latitude && hospitalData.longitude && (
              <div>
                <p>
                  Hospital Latitude: {hospitalData.latitude} <br />
                  Hospital Longitude: {hospitalData.longitude}
                </p>
                <hr />
                <p>Hospital Address: {hospitalData.formatted}</p> <br/>
                <hr/>
               {hospitalData.website &&  <p>Website: {hospitalData.website}</p>} <br/>
               {hospitalData.state && <p>State: {hospitalData.state}</p>}
               {hospitalData.district && <p>District:{hospitalData.district}</p>}
              </div>
            )}
          </div>
        </div>
      </Col>
      <Col>
      <div className="Directions">
        <h2>Directions to {hospitalData.name}</h2>
        <hr />
        {directions ? (
        <ol>
        {directions.map((step, index) => (

          <li key={index}>
            <p>{step.instruction}</p>
            <p>
              Distance: {(step.distance / 1000).toFixed(2)} km | Time: {(step.duration / 60).toFixed(2)} min
            </p>
         </li>
         ))}
        </ol>
        ) : null}
     </div>

      </Col>
    </Row>
  );
}
