import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { AuthContext } from "../AuthContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_URL = "/api/v1";

export default function Dashboard() {
  const { token } = useContext(AuthContext);
  const headers = { Authorization: `Bearer ${token}` };

  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/dashboard/stock-movement`, { headers });
        setChartData(res.data);
      } catch (err) {
        console.error("Error fetching stock data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", color: "#2d4c74", marginBottom: "20px" }}>
        Dashboard - Pergerakan Stok Barang (Bar Chart)
      </h2>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : !chartData ? (
        <p style={{ textAlign: "center" }}>Tidak ada data</p>
      ) : (
        <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
          <Bar
            data={{
              labels: chartData.labels,
              datasets: chartData.datasets,
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "bottom" },
                title: { display: true, text: "Pergerakan Mingguan Semua Barang" },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: { display: true, text: "Jumlah Barang" },
                },
                x: { title: { display: true, text: "Minggu" } },
              },
            }}
            height={300}
          />
        </div>
      )}
    </div>
  );
}
