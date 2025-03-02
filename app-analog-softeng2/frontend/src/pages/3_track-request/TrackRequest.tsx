import React, { useState } from "react";
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
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Header from "../components/Header";
import "./TrackRequest.css";

const TrackRequest = () => {
  const [status, setStatus] = useState("Pending");
  const [selectedFactory, setSelectedFactory] = useState("");
  const [shipments, setShipments] = useState([
    {
      id: "REQ123",
      moduleOrigin: "Rd. Santa Ana, Illinois 85486",
      recipient: "Rd. Inglewood, Maine 98380",
      client: "Requester",
      factory: "Factory A",
      status: "Pending",
    },
    {
      id: "REQ124",
      moduleOrigin: "Rd. Brooklyn, New York 11201",
      recipient: "Rd. Austin, Texas 73301",
      client: "Requester",
      factory: "Factory B",
      status: "In-Transit",
    },
    {
      id: "REQ125",
      moduleOrigin: "Rd. San Diego, California 92101",
      recipient: "Rd. Miami, Florida 33101",
      client: "Requester",
      factory: "Factory C",
      status: "Out-for-Delivery",
    },
    {
      id: "REQ126",
      moduleOrigin: "Rd. Seattle, Washington 98101",
      recipient: "Rd. Denver, Colorado 80201",
      client: "Requester",
      factory: "Factory D",
      status: "Delivered",
    },
    {
      id: "REQ127",
      moduleOrigin: "Rd. Dallas, Texas 75201",
      recipient: "Rd. Atlanta, Georgia 30301",
      client: "Requester",
      factory: "Factory E",
      status: "Pending",
    },
    {
      id: "REQ128",
      moduleOrigin: "Rd. San Francisco, California 94101",
      recipient: "Rd. Boston, Massachusetts 02101",
      client: "Requester",
      factory: "Factory F",
      status: "In-Transit",
    },
    {
      id: "REQ129",
      moduleOrigin: "Rd. Houston, Texas 77001",
      recipient: "Rd. Philadelphia, Pennsylvania 19101",
      client: "Requester",
      factory: "Factory G",
      status: "Out-for-Delivery",
    },
    {
      id: "REQ130",
      moduleOrigin: "Rd. Phoenix, Arizona 85001",
      recipient: "Rd. Charlotte, North Carolina 28201",
      client: "Requester",
      factory: "Factory H",
      status: "Delivered",
    },
    {
      id: "REQ131",
      moduleOrigin: "Rd. Las Vegas, Nevada 89101",
      recipient: "Rd. Chicago, Illinois 60601",
      client: "Requester",
      factory: "Factory I",
      status: "Pending",
    },
    {
      id: "REQ132",
      moduleOrigin: "Rd. Orlando, Florida 32801",
      recipient: "Rd. Detroit, Michigan 48201",
      client: "Requester",
      factory: "Factory J",
      status: "In-Transit",
    },
  ]);

  // Handle status change
  const handleStatusChange = (event, newStatus) => {
    if (newStatus !== null) setStatus(newStatus);
  };

  // Handle moving shipment to the next status
  const updateShipmentStatus = (shipmentId) => {
    const updatedShipments = shipments.map((shipment) => {
      if (shipment.id === shipmentId) {
        if (shipment.status === "Pending") {
          return { ...shipment, status: "In-Transit" };
        } else if (shipment.status === "In-Transit") {
          return { ...shipment, status: "Out-for-Delivery" };
        } else if (shipment.status === "Out-for-Delivery") {
          return { ...shipment, status: "Delivered" };
        }
      }
      return shipment;
    });

    setShipments(updatedShipments);
  };

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
            <MenuItem
              value="Factory A"
              sx={{ fontFamily: "Poppins, sans-serif" }}
            >
              Factory A
            </MenuItem>
            <MenuItem
              value="Factory B"
              sx={{ fontFamily: "Poppins, sans-serif" }}
            >
              Factory B
            </MenuItem>
            <MenuItem
              value="Factory C"
              sx={{ fontFamily: "Poppins, sans-serif" }}
            >
              Factory C
            </MenuItem>
          </Select>

          <div
            style={{
              height: "100%",
              overflowY: "auto",
              paddingRight: "5px",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            {shipments
              .filter(
                (shipment) =>
                  shipment.status === status &&
                  (selectedFactory === "" ||
                    shipment.factory === selectedFactory)
              )
              .map((shipment) => (
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
                          {shipment.id}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          fontFamily="Poppins, sans-serif"
                        >
                          Camera Modules
                        </Typography>
                      </Box>

                      <LocalShippingOutlined

                        sx={{ fontSize: 90, color: "#5c011a",  }}

                      />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Module Origin */}
                    <Box display="flex" alignItems="center" gap={1}>
                      <CircleIcon sx={{ color: "#2ECC71", fontSize: 14 }} />
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
                          {shipment.moduleOrigin}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Recipient */}
                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                      <LocationOnIcon sx={{ color: "#cf4a6f", fontSize: 18 }} />
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

                    {/* Requester */}
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box display="flex" alignItems="center" gap={1} mt={2}>
                        <Avatar

                          sx={{ bgcolor: "#f23a68", width: 32, height: 32, p: 3, mr: 2}}

                        >
                          {shipment.client.charAt(0)}
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
                            {shipment.client}
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
                          onClick={() => updateShipmentStatus(shipment.id)}
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
            center={[14.6091, 120.9892]} // Sampaloc, Manila
            zoom={13}
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
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default TrackRequest;
