import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Route, Routes } from "react-router-dom";
import axios from "axios";
import './App.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

import Hospitalinfo from './Components/Hospitalinfo'

import logo from '../src/assets/logomed.png'

function App() {
    const location = useLocation();
    const navigate = useNavigate();
    const { name, formatted } = location.state || { name: "", formatted: "" };
    const [latLng, setLatLng] = useState({});
    const [hospitals, setHospitals] = useState([]);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLatLng({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            });
        }
    }, []);

    useEffect(() => {
      if (latLng.lat && latLng.lng) {
          const API_URL = `https://api.geoapify.com/v2/places?categories=healthcare.hospital&filter=circle:${latLng.lng},${latLng.lat},5000&bias=proximity:${latLng.lng},${latLng.lat}&limit=30&apiKey=531ac8f784eb4dd89eeb5246d176b7aa`;
          axios
              .get(API_URL)
              .then((res) => {
                  const featuresArr = res.data.features;
                  const hospitalsData = featuresArr.map((feature) => ({
                      name: feature.properties.name,
                      formatted: feature.properties.formatted,
                      address_line2: feature.properties.address_line2,
                      website: feature.properties.website,
                      state: feature.properties.state,
                      district: feature.properties.district,
                      latitude: feature.geometry.coordinates[1],
                      longitude: feature.geometry.coordinates[0]
                  }));
                  setHospitals(hospitalsData); 
              })
              .catch((error) => {
                  console.error("Error fetching hospitals:", error);
              });
      }
  }, [latLng]);

  return (
    <div>
    <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            Med Care
          </Navbar.Brand>
        </Container>
      </Navbar>
      <div className="hospitals">
        <div className="name">
            <h1>{name}</h1>
        </div>
        <p>{formatted}</p>
        {hospitals.map((hospital, index) => (
            <div 
                key={index} 
                className="hospital-card" 
                onClick={() => navigate('/details', { state: { hospital } })}
            >
                <h2 className="hospital-name">{hospital.name}</h2>
                <p className="hospital-address">{hospital.formatted}</p>
                <p className="hospital-address">{hospital.address_line2}</p>
                <p className="hospital-website" style={{color:'blue'}}>{hospital.website}</p>
            </div>
        ))}

        <Routes>
          <Route path="/details" element={<Hospitalinfo />} />
        </Routes>
    </div>
    </div>
  );
}

export default App;
