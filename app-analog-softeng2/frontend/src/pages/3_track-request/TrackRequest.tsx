import React, { useState, useEffect, useRef } from "react";
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
  Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CircleIcon from "@mui/icons-material/Circle";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// Extend Leaflet to include Routing
declare module "leaflet" {
  namespace Routing {
    function control(options: any): any;
  }
}
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import Header from "../components/Header";
import { useTracking } from "../../hooks/useTracking";
import { useLogistics } from "../../hooks/useLogistics";
import { useAuth } from "../../hooks/useAuth";
import "./TrackRequest.css";

const factoryLocations: { [key: string]: LatLngExpression } = {
  "Factory A": [14.5995, 120.9842], // Manila
  "Factory B": [10.3157, 123.8854], // Cebu
  "Factory C": [7.1907, 125.4553], // Davao
  "Factory D": [15.4826, 120.5976], // Tarlac
  "Factory E": [16.4023, 120.596], // Baguio
  "Factory F": [13.6218, 123.1948], // Naga
  "Factory G": [8.228, 124.2452], // Cagayan de Oro
  "Factory H": [6.9214, 122.079], // Zamboanga
  "Factory I": [12.8797, 121.774], // Lucena
  "Factory J": [14.676, 121.0437], // Quezon City
};

const TrackRequest = () => {
  const {
    trackingLogs,
    fetchTrackingLogs,
    updateTrackingStatus,
    loading,
    error,
  } = useTracking();
  const { requests } = useLogistics();
  const { user } = useAuth();
  const [status, setStatus] = useState("Pending");
  const [selectedFactory, setSelectedFactory] = useState("");
  const [profile, setProfile] = useState({
    firstName: "",
    profilePicture: "",
  });
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const routingControlRef = useRef<any>(null);
  const [locationCache, setLocationCache] = useState<{ [key: string]: LatLngExpression }>({});
  const getCoordinates = async (locationName: string): Promise<LatLngExpression | null> => {
    if (locationCache[locationName]) {
      console.log("Using cached coordinates for:", locationName);
      return locationCache[locationName];
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          locationName
        )}&format=json`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        const coordinates = [parseFloat(lat), parseFloat(lon)] as LatLngExpression;

        // Cache the coordinates
        setLocationCache((prev) => ({
          ...prev,
          [locationName]: coordinates,
        }));

        return coordinates;
      } else {
        console.error("No coordinates found for location:", locationName);
        return null;
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchTrackingLogs();
  }, []);

  useEffect(() => {
    console.log(trackingLogs);
    console.log(requests);
  }, [trackingLogs, requests]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const response = await fetch(
            `http://localhost:5001/api/user/${user}`
          );
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
    if (newStatus !== null) {
      setStatus(newStatus);
    }
  };

  const updateShipmentStatus = async (id: string, currentStatus: string) => {
    let newStatus = "";
    if (currentStatus === "Pending") {
      newStatus = "Completed";
    }

    console.log(`Updating status of ${id} to ${newStatus}`);

    try {
      await updateTrackingStatus(id, newStatus);
      fetchTrackingLogs(); // Refresh the tracking logs after updating
      console.log("Shipment status updated successfully.");
    } catch (error) {
      console.error("Error updating shipment status:", error);
    }
  };

  interface Shipment {
    id: string;
    moduleCode: string;
    moduleOrigin: string;
    recipient: string;
    status: string;
  }

  interface Profile {
    firstName: string;
    profilePicture: string;
  }

  const handleViewShipment = async (shipment: Shipment) => {
    console.log("Selected Shipment:", shipment);

    const map = mapRef.current;

    if (!map) {
      console.error("Map is not initialized.");
      return;
    }

    console.log("Map instance:", map);

    // Fetch coordinates for moduleOrigin
    const factoryLocation = await getCoordinates(shipment.moduleOrigin);

    // Fetch coordinates for recipient (if not already in factoryLocations)
    const recipientLocation = factoryLocations[shipment.recipient] || await getCoordinates(shipment.recipient);

    if (!factoryLocation || !recipientLocation) {
      console.error("Invalid coordinates for moduleOrigin or recipient.");
      return;
    }

    console.log("Factory Location:", factoryLocation);
    console.log("Recipient Location:", recipientLocation);

    if (routingControlRef.current) {
      console.log("Removing existing routing control.");
      map.removeControl(routingControlRef.current);
    }

    routingControlRef.current = L.Routing.control({
      waypoints: [L.latLng(factoryLocation), L.latLng(recipientLocation)],
      routeWhileDragging: true,
    }).addTo(map);

    console.log("Routing control added to map.");
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const combinedLogs = trackingLogs.map((log) => {
        return {
          ...log,
          id: log.id ?? log._id, // Ensure id is always defined
          moduleCode: log.moduleCode ?? "", // Ensure moduleCode is always a string
          moduleOrigin: log.moduleOrigin ?? "", // Ensure moduleOrigin is always a string
          recipient: log.recipient ?? "", // Ensure recipient is always a string
        };
      });

  const filteredLogs = combinedLogs.filter(
    (shipment) =>
      (status === "Completed"
        ? shipment.status === "Completed"
        : shipment.status === status) &&
      (selectedFactory === "" || shipment.recipient === selectedFactory)
  );

  return (
    <div className="main-div">
      <Header />

      <div className="map-and-card">
        <div className="shipment-side">
          <h2>Tracking</h2>
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
              value="Completed"
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
              Completed
            </ToggleButton>
          </ToggleButtonGroup>

          <Select
            value={selectedFactory}
            onChange={(e) => setSelectedFactory(e.target.value)}
            displayEmpty
            sx={{
              fontFamily: "Poppins, sans-serif",
              borderRadius: 2,
              backgroundColor: "#f8f9fc",
              boxShadow: "0px 2px 5px rgba(161, 6, 6, 0.1)",
              padding: "8px 12px",
              width: "100%",
              "& .MuiSelect-select": {
                padding: "7px",
              },
            }}
          >
            <MenuItem value="" sx={{ fontFamily: "Poppins, sans-serif" }}>
              Select Factory
            </MenuItem>
            {Object.keys(factoryLocations).map((factory) => (
              <MenuItem
                key={factory}
                value={factory}
                sx={{ fontFamily: "Poppins, sans-serif" }}
              >
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
            {filteredLogs.length > 0 ? (
              filteredLogs.map((shipment) => (
                <Card
                  key={shipment.id}
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
                          {(shipment.id?.length ?? 0) > 8
                            ? `${(shipment.id ?? "").substring(0, 8)}...`
                            : shipment.id ?? "Unknown"}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          fontFamily="Poppins, sans-serif"
                        >
                          {shipment.moduleCode}
                        </Typography>
                      </Box>

                      <LocalShippingOutlined
                        sx={{ fontSize: 90, color: "#5c011a" }}
                      />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box display="flex" alignItems="center" gap={1}>
                      <CircleIcon
                        sx={{
                          color: "#2ECC71",
                          fontSize: 14,
                          marginBottom: 2.5,
                        }}
                      />
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
                          {shipment.moduleOrigin || "Unknown"}
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                      <LocationOnIcon
                        sx={{
                          color: "#cf4a6f",
                          fontSize: 18,
                          marginBottom: 2.5,
                        }}
                      />
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
                          {shipment.recipient}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box display="flex" alignItems="center" gap={1} mt={2}>
                        <Avatar src={profile.profilePicture || ""}>
                          {profile.firstName
                            ? profile.firstName.charAt(0)
                            : "?"}
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
                          ></Typography>
                        </Box>
                      </Box>
                      <Tooltip title="View shipment location on map">
                        <span>
                          <Button
                            variant="contained"
                            sx={{
                              bgcolor: "#ad0232",
                              color: "white",
                              borderRadius: 2,
                              fontFamily: "Poppins, sans-serif",
                              textTransform: "none",
                              "&:disabled": {
                                bgcolor: "#ccc",
                                color: "#666",
                              },
                            }}
                            onClick={() => handleViewShipment(shipment)}
                            disabled={shipment.status === "Completed"}
                          >
                            <LocationOnIcon />
                          </Button>
                        </span>
                      </Tooltip>

                      <Tooltip title="Mark order as completed">
                        <span>
                          <Button
                            variant="contained"
                            sx={{
                              bgcolor: "#ad0232",
                              color: "white",
                              borderRadius: 2,
                              fontFamily: "Poppins, sans-serif",
                              textTransform: "none",
                              "&:disabled": {
                                bgcolor: "#ccc",
                                color: "#666",
                              },
                            }}
                            onClick={() =>
                              updateShipmentStatus(shipment.id, shipment.status)
                            }
                            disabled={shipment.status === "Completed"}
                          >
                            <CheckCircleIcon />
                          </Button>
                        </span>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography
                variant="body2"
                color="textSecondary"
                fontFamily="Poppins, sans-serif"
              >
                No shipments available.
              </Typography>
            )}
          </div>
        </div>

        <div className="map-side">
        <MapContainer
          center={[12.8797, 121.774]}
          zoom={6}
          style={{
            height: "100%",
            width: "100%",
            borderTopRightRadius: "20px",
            borderBottomRightRadius: "20px",
          }}
          ref={mapRef}
          whenReady={() => {
            console.log("Map is ready:", mapRef.current);
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