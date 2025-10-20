import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext"; // pastikan path benar

const API_URL = "http://127.0.0.1:8000/api/v1";

export default function ItemTransactions() {
  const { user, token } = useContext(AuthContext);
  const headers = { Authorization: `Bearer ${token}` };

  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [newTx, setNewTx] = useState({ type: "in", quantity: 0, reference: "", note: "" });
  const [editingTx, setEditingTx] = useState(null);
  const [deleteTxId, setDeleteTxId] = useState(null);

  // Load items
  useEffect(() => {
    axios
      .get(`${API_URL}/items`, { headers })
      .then(res => setItems(res.data.data || res.data))
      .catch(err => console.error("Error loading items:", err));
  }, [token]);

  // Load transaksi saat item dipilih
  useEffect(() => {
    if (!selectedItemId) return setTransactions([]);
    axios
      .get(`${API_URL}/items/${selectedItemId}/transactions`, { headers })
      .then(res => setTransactions(res.data.data || []))
      .catch(err => console.error("Error fetching transactions:", err));
  }, [selectedItemId, token]);

  // Tambah transaksi (admin & staff)
  const handleAddTransaction = async () => {
    if (!selectedItemId || newTx.quantity <= 0) {
      alert("Pilih item dan masukkan jumlah valid!");
      return;
    }
    try {
      await axios.post(`${API_URL}/items/${selectedItemId}/transactions`, newTx, { headers });
      setNewTx({ type: "in", quantity: 0, reference: "", note: "" });
      const res = await axios.get(`${API_URL}/items/${selectedItemId}/transactions`, { headers });
      setTransactions(res.data.data || []);
    } catch (err) {
      console.error("Error adding transaction:", err.response?.data || err);
      alert(err.response?.data?.message || "Gagal menambah transaksi");
    }
  };

  // Update transaksi (admin only)
  const handleUpdateTransaction = async () => {
    if (user?.role !== "admin") return;
    try {
      await axios.put(`${API_URL}/transactions/${editingTx.id}`, editingTx, { headers });
      setEditingTx(null);
      const res = await axios.get(`${API_URL}/items/${selectedItemId}/transactions`, { headers });
      setTransactions(res.data.data || []);
    } catch (err) {
      console.error("Error updating transaction:", err.response?.data || err);
      alert(err.response?.data?.message || "Gagal update transaksi");
    }
  };

  // Delete transaksi (admin only)
  const handleDeleteTransaction = async () => {
    if (user?.role !== "admin") return;
    if (!deleteTxId) return;
    try {
      await axios.delete(`${API_URL}/transactions/${deleteTxId}`, { headers });
      setTransactions(transactions.filter(tx => tx.id !== deleteTxId));
      setDeleteTxId(null);
    } catch (err) {
      console.error("Error deleting transaction:", err.response?.data || err);
      alert(err.response?.data?.message || "Gagal menghapus transaksi");
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", color: "#2d4c74", marginBottom: "20px" }}>Item Transactions</h2>

      {/* Select Item */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", alignItems: "center" }}>
        <select
          value={selectedItemId}
          onChange={(e) => setSelectedItemId(e.target.value)}
          style={{ flex: "1", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        >
          <option value="">Select item</option>
          {items.map(item => (
            <option key={item.id} value={item.id}>{item.nama_barang}</option>
          ))}
        </select>
      </div>

      {/* Tambah transaksi (admin & staff) */}
      {selectedItemId && (
        <div style={{
          marginBottom: "25px",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          background: "#f5f5f5",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          alignItems: "center"
        }}>
          <select
            value={newTx.type}
            onChange={e => setNewTx({ ...newTx, type: e.target.value })}
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="in">IN (Masuk)</option>
            <option value="out">OUT (Keluar)</option>
          </select>
          <input
            type="number"
            placeholder="Quantity"
            value={newTx.quantity}
            onChange={e => setNewTx({ ...newTx, quantity: parseInt(e.target.value) })}
            style={{ width: "100px", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          <input
            type="text"
            placeholder="Reference"
            value={newTx.reference}
            onChange={e => setNewTx({ ...newTx, reference: e.target.value })}
            style={{ flex: "1", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          <input
            type="text"
            placeholder="Note"
            value={newTx.note}
            onChange={e => setNewTx({ ...newTx, note: e.target.value })}
            style={{ flex: "1", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          <button
            onClick={handleAddTransaction}
            style={{ padding: "8px 15px", borderRadius: "4px", border: "none", background: "#4caf50", color: "#fff", cursor: "pointer" }}
          >
            Add Transaction
          </button>
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#2d4c74", color: "#fff" }}>
            <tr>
              <th style={{ padding: "10px", textAlign: "left" }}>ID</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Type</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Quantity</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Reference</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Note</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Date</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map(tx => (
                <tr key={tx.id} style={{ borderBottom: "1px solid #ddd" }}>
                  {editingTx?.id === tx.id ? (
                    <>
                      <td>{tx.id}</td>
                      <td>
                        <select value={editingTx.type} onChange={e => setEditingTx({ ...editingTx, type: e.target.value })}>
                          <option value="in">IN</option>
                          <option value="out">OUT</option>
                        </select>
                      </td>
                      <td>
                        <input type="number" value={editingTx.quantity} onChange={e => setEditingTx({ ...editingTx, quantity: parseInt(e.target.value) })} style={{ width: "80px" }} />
                      </td>
                      <td><input type="text" value={editingTx.reference || ""} onChange={e => setEditingTx({ ...editingTx, reference: e.target.value })} /></td>
                      <td><input type="text" value={editingTx.note || ""} onChange={e => setEditingTx({ ...editingTx, note: e.target.value })} /></td>
                      <td>{new Date(tx.created_at).toLocaleString()}</td>
                      <td>
                        {user?.role === "admin" && (
                          <>
                            <button onClick={handleUpdateTransaction} style={{ marginRight: "5px", background: "#4caf50", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px" }}>Simpan</button>
                            <button onClick={() => setEditingTx(null)} style={{ background: "#f44336", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px" }}>Batal</button>
                          </>
                        )}
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{tx.id}</td>
                      <td>{tx.type}</td>
                      <td>{tx.quantity}</td>
                      <td>{tx.reference || "-"}</td>
                      <td>{tx.note || "-"}</td>
                      <td>{new Date(tx.created_at).toLocaleString()}</td>
                      <td>
                        {user?.role === "admin" ? (
                          <>
                            <button onClick={() => setEditingTx(tx)} style={{ marginRight: "5px", background: "#2196f3", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px" }}>Edit</button>
                            <button onClick={() => setDeleteTxId(tx.id)} style={{ background: "#f44336", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px" }}>Hapus</button>
                          </>
                        ) : null}
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" align="center" style={{ padding: "10px" }}>Tidak ada transaksi</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal konfirmasi hapus */}
      {deleteTxId && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999
        }}>
          <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", width: "300px", textAlign: "center" }}>
            <p>Yakin ingin hapus transaksi ini?</p>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "15px" }}>
              <button onClick={() => setDeleteTxId(null)} style={{ padding: "6px 12px", borderRadius: "4px", border: "1px solid #ccc", cursor: "pointer" }}>Batal</button>
              <button onClick={handleDeleteTransaction} style={{ padding: "6px 12px", borderRadius: "4px", border: "none", background: "#f44336", color: "#fff", cursor: "pointer" }}>Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
