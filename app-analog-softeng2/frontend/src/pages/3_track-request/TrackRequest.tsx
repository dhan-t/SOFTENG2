import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Divider,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  MenuItem,
  Select,
} from "@mui/material";
import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CircleIcon from "@mui/icons-material/Circle";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import Header from "../components/Header";
import { useTracking } from "../../hooks/useTracking";
import { useLogistics } from "../../hooks/useLogistics";
import { useAuth } from "../../hooks/useAuth"; // Import useAuth hook and User type
import "./TrackRequest.css";

const factoryLocations: { [key: string]: LatLngExpression } = {
  "Factory A": [14.5995, 120.9842], // Manila
  "Factory B": [10.3157, 123.8854], // Cebu
  "Factory C": [7.1907, 125.4553], // Davao
  "Factory D": [15.4826, 120.5976], // Tarlac
  "Factory E": [16.4023, 120.5960], // Baguio
  "Factory F": [13.6218, 123.1948], // Naga
  "Factory G": [8.2280, 124.2452], // Cagayan de Oro
  "Factory H": [6.9214, 122.0790], // Zamboanga
  "Factory I": [12.8797, 121.7740], // Lucena
  "Factory J": [14.6760, 121.0437], // Quezon City
};

const TrackRequest = () => {
  const { trackingLogs, fetchTrackingLogs, updateTrackingStatus, loading, error } = useTracking();
  const { requests } = useLogistics();
  const { user } = useAuth(); // Get the logged-in user's information
  const [status, setStatus] = useState("Pending");
  const [selectedFactory, setSelectedFactory] = useState("");
  const [profile, setProfile] = useState({
    firstName: "",
    profilePicture: "",
  });

  useEffect(() => {
    fetchTrackingLogs();
  }, []);
  
  useEffect(() => {
    console.log(trackingLogs); // Log the tracking logs to verify the data
    console.log(requests); // Log the logistics requests to verify the data
  }, [trackingLogs, requests]);

  useEffect(() => {
    // Fetch user profile from the backend
    const fetchProfile = async () => {
      if (user) {
        try {
          const response = await fetch(`http://localhost:5001/api/user/${user}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setProfile(data);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };

    fetchProfile();
  }, [user]);

  const handleStatusChange = (
    event: React.MouseEvent<HTMLElement>,
    newStatus: string | null
  ) => {
    if (newStatus !== null) setStatus(newStatus);
  };

  const updateShipmentStatus = async (shipmentId: string, currentStatus: string) => {
    let newStatus = "";
    if (currentStatus === "Pending") {
      newStatus = "In-Transit";
    } else if (currentStatus === "In-Transit") {
      newStatus = "Out-for-Delivery";
    } else if (currentStatus === "Out-for-Delivery") {
      newStatus = "Delivered";
    }
    console.log(`Updating status of ${shipmentId} to ${newStatus}`); // Debugging statement
    await updateTrackingStatus(shipmentId, newStatus);
    fetchTrackingLogs(); // Re-fetch tracking logs to update the UI
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  // Combine tracking logs with logistics requests
  const combinedLogs = trackingLogs.map((log) => {
    const request = requests.find((req) => req._id === log.logId);
    return {
      ...log,
      recipient: request ? request.recipient : "Unknown"
    };
  });

    // Filter combinedLogs based on selectedFactory
    const filteredLogs = combinedLogs.filter(
      (shipment) =>
        shipment.status === status &&
        (selectedFactory === "" || shipment.recipient === selectedFactory)
    );

  return (
    <div className="main-div">
      <Header />

      <div className="map-and-card">
        {/* Left Panel - Shipment List */}
        <div className="shipment-side">
          <h2>Tracking</h2>
          {/* Status Toggle */}
          <ToggleButtonGroup
            value={status}
            exclusive
            onChange={handleStatusChange}
            sx={{
              fontWeight: 600,
              fontFamily: "'Poppins', sans-serif",
              borderRadius: "17px!important",
              fontSize: "0.8rem",
              transition: "all 0.2s ease-in-out",
              display: "flex",
              width: "100%",
              gap: "1rem",
              "&.Mui-selected, &.Mui-focusVisible": {
                backgroundColor: "#261cc9",
                color: "white",
              },
            }}
          >
            <ToggleButton
              value="Pending"
              sx={{
                color: "#444",
                fontWeight: 600,
                fontFamily: "'Poppins', sans-serif",
                borderRadius: "17px!important",
                backgroundColor: "#f8f9fa",
                fontSize: "0.7rem",
                padding: "1rem",
                height: "2rem",
                overflow: "hidden",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "#e2e6ea",
                },
                "&.Mui-selected, &.Mui-focusVisible": {
                  backgroundColor: "#ad0232",
                  color: "white",
                },
              }}
            >
              Pending
            </ToggleButton>
            <ToggleButton
              value="In-Transit"
              sx={{
                color: "#444",
                fontWeight: 600,
                fontFamily: "'Poppins', sans-serif",
                borderRadius: "17px!important",
                backgroundColor: "#f8f9fa",
                fontSize: "0.7rem",
                padding: "1rem",
                height: "2rem",
                overflow: "hidden",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "#e2e6ea",
                },
                "&.Mui-selected, &.Mui-focusVisible": {
                  backgroundColor: "#ad0232",
                  color: "white",
                },
              }}
            >
              In-Transit
            </ToggleButton>
            <ToggleButton
              value="Out-for-Delivery"
              sx={{
                color: "#444",
                fontWeight: 600,
                fontFamily: "'Poppins', sans-serif",
                borderRadius: "17px!important",
                backgroundColor: "#f8f9fa",
                fontSize: "0.7rem",
                padding: "1rem",
                height: "2rem",
                overflow: "hidden",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "#e2e6ea",
                },
                "&.Mui-selected, &.Mui-focusVisible": {
                  backgroundColor: "#ad0232",
                  color: "white",
                },
              }}
            >
              Out-For-Delivery
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Factory Filter */}
          <Select
            value={selectedFactory}
            onChange={(e) => setSelectedFactory(e.target.value)}
            displayEmpty
            sx={{
              fontFamily: "Poppins, sans-serif",
              borderRadius: 2, // Soft rounded corners
              backgroundColor: "#f8f9fc", // Light background for a softer feel
              boxShadow: "0px 2px 5px rgba(161, 6, 6, 0.1)", // Subtle shadow
              padding: "8px 12px", // More comfortable padding
              width: "100%", // Adjust width
              "& .MuiSelect-select": {
                padding: "7px",
              },
            }}
          >
            <MenuItem value="" sx={{ fontFamily: "Poppins, sans-serif" }}>
              Select Factory
            </MenuItem>
            {Object.keys(factoryLocations).map((factory) => (
              <MenuItem key={factory} value={factory} sx={{ fontFamily: "Poppins, sans-serif" }}>
                {factory}
              </MenuItem>
            ))}
          </Select>

          <div
            style={{
              height: "100%",
              overflowY: "auto",
              paddingRight: "5px",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            {filteredLogs.map((shipment) => (
              <Card
                key={shipment.logId}
                sx={{
                  height: "fit-content",
                  borderRadius: 3,
                  width: "100%",
                  padding: 2,
                  mb: 2,
                  backgroundColor: "#f8f9fc",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                  <CardContent sx={{ fontFamily: "Poppins, sans-serif" }}>
                    {/* Shipment Header */}
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography
                          variant="subtitle2"
                          color="textSecondary"
                          fontFamily="Poppins, sans-serif"
                        >
                          Shipment number
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          fontFamily="Poppins, sans-serif"
                        >
                          {shipment.logId.length > 8
                            ? `${shipment.logId.substring(0, 8)}...`
                            : shipment.logId}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          fontFamily="Poppins, sans-serif"
                        >
                          {shipment.module}
                        </Typography>
                      </Box>

                      <LocalShippingOutlined
                        sx={{ fontSize: 90, color: "#5c011a" }}
                      />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Module Origin */}
                    <Box display="flex" alignItems="center" gap={1}>
                      <CircleIcon sx={{ color: "#2ECC71", fontSize: 14, marginBottom: 2.5 }} />
                      <Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          fontFamily="Poppins, sans-serif"
                        >
                          Module Origin
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          fontFamily="Poppins, sans-serif"
                        >
                          {shipment.moduleOrigin || "Tokyo, Japan"}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Recipient */}
                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                      <LocationOnIcon sx={{ color: "#cf4a6f", fontSize: 18, marginBottom: 2.5 }} />
                      <Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          fontFamily="Poppins, sans-serif"
                        >
                          Recipient
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          fontFamily="Poppins, sans-serif"
                        >
                          {shipment.recipient || "Unknown"}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Requester */}
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box display="flex" alignItems="center" gap={1} mt={2}>
                        <Avatar
                          src={profile.profilePicture || ""}
                        >
                          {profile.firstName ? profile.firstName.charAt(0) : "?"}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="textSecondary"
                            fontFamily="Poppins, sans-serif"
                          >
                            Client
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            fontFamily="Poppins, sans-serif"
                          >
                            {profile.firstName || "Unknown"}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            fontFamily="Poppins, sans-serif"
                          >
                            {shipment.factory}
                          </Typography>
                        </Box>
                      </Box>
                      {shipment.status !== "Delivered" && (
                        <Button
                          variant="contained"
                          sx={{
                            bgcolor: "#ad0232",
                            color: "white",
                            borderRadius: 2,
                            fontFamily: "Poppins, sans-serif",
                            textTransform: "none",
                            paddingX: 3,
                            paddingY: 1,
                          }}
                          onClick={() => updateShipmentStatus(shipment.logId, shipment.status)}
                        >
                          {shipment.status === "Pending"
                            ? "Transit"
                            : shipment.status === "In-Transit"
                            ? "Deliver"
                            : "Complete"}
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* Right Panel - Map */}
        <div className="map-side">
          <MapContainer
            center={[12.8797, 121.7740]} // Center of the Philippines
            zoom={6}
            style={{
              height: "100%",
              width: "100%",
              borderTopRightRadius: "20px",
              borderBottomRightRadius: "20px",
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {Object.entries(factoryLocations).map(([factory, position]) => (
              <Marker key={factory} position={position}>
                <Popup>{factory}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default TrackRequest;