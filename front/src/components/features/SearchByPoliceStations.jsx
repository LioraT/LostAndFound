import { useState, useEffect } from "react";
import { Marker, Popup } from "react-leaflet";
import api from "../../api/axios";
import { mapIcons } from "../../utils/mapIcons";
import styles from "../../styles/theme.module.css";

export default function SearchByPoliceStations() {
  const [policeStations, setPoliceStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);

  useEffect(() => {
    const fetchPoliceStations = async () => {
      try {
        setLoading(true);
        const response = await api.get("/policestations/all");
        setPoliceStations(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching police stations:", err);
        setError(`Failed to load police stations: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPoliceStations();
  }, []);

  if (loading) {
    return <div className={styles.loadingOverlay}>Loading police stations...</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  return (
    <>
      {policeStations.map((station) => (
        <Marker
          key={station._id}
          position={[station.geometry.coordinates[1], station.geometry.coordinates[0]]}
          icon={selectedStation === station._id ? mapIcons.policeHighlighted : mapIcons.policeIcon}
          eventHandlers={{
            click: () => setSelectedStation(station._id),
            mouseover: () => setSelectedStation(station._id),
            mouseout: () => setSelectedStation(null),
          }}
        >
          <Popup>
            <div className={styles.policeStationPopup}>
              <h3>{station.name}</h3>
              <p><strong>Address:</strong> {station.address}</p>
              {station.phone && <p><strong>Phone:</strong> {station.phone}</p>}
              {station.district && <p><strong>District:</strong> {station.district}</p>}
              <button 
                className={styles.directionButton}
                onClick={() => {
                  const url = `https://www.google.com/maps/dir/?api=1&destination=${station.geometry.coordinates[1]},${station.geometry.coordinates[0]}`;
                  window.open(url, '_blank');
                }}
              >
                Get Directions
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
