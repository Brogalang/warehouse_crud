import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { AuthContext } from "../AuthContext";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const API_URL = "http://127.0.0.1:8000/api/v1";

export default function Dashboard() {
  const { token } = useContext(AuthContext);
  const headers = { Authorization: `Bearer ${token}` };

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      { label: "Barang Masuk", data: [], borderColor: "green", backgroundColor: "rgba(0,128,0,0.2)" },
      { label: "Barang Keluar", data: [], borderColor: "red", backgroundColor: "rgba(255,0,0,0.2)" },
    ]
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Contoh endpoint: pergerakan stok per minggu
        const res = await axios.get(`${API_URL}/dashboard/stock-movement`, { headers });

        // Format data dari API
        // API harus mengirim array minggu + jumlah masuk & keluar
        // misal: { week: "2025-10-14", in: 20, out: 5 }
        const labels = res.data.map(d => d.week);
        const masuk = res.data.map(d => d.in);
        const keluar = res.data.map(d => d.out);

        setChartData({
          labels,
          datasets: [
            { label: "Barang Masuk", data: masuk, borderColor: "green", backgroundColor: "rgba(0,128,0,0.2)" },
            { label: "Barang Keluar", data: keluar, borderColor: "red", backgroundColor: "rgba(255,0,0,0.2)" },
          ]
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching stock data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", color: "#2d4c74", marginBottom: "20px" }}>Dashboard - Pergerakan Stok</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: { legend: { position: "top" }, title: { display: true, text: "Pergerakan Stok per Minggu" } },
            scales: { y: { beginAtZero: true } }
          }}
        />
      )}
    </div>
  );
}
