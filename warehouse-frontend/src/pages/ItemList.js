import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../AuthContext"; // path ke file AuthContext.js
import axios from "axios";
import Swal from "sweetalert2";

const API_URL_ITEMS = "/items";
const API_URL_TRANSACTIONS = "/transactions";

export default function ItemList() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ nama_barang: "", sku: "", stok: 0, lokasi_rak: "" });
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // simpan role saat login
  const { user, token } = useContext(AuthContext);

  console.log("Role login 2:", user?.role); // sekarang harus muncul "admin"
  // console.log("Role login:", localStorage.getItem("role"));
  const headers = { Authorization: `Bearer ${token}` };

  // Fetch items
  const fetchItems = async () => {
    try {
      const res = await axios.get(API_URL_ITEMS, { headers });
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching items:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // ===== ADMIN CRUD ITEM =====
  // const handleAdd = async () => {
  //   // hanya admin dan staff yang boleh tambah item
  //   if (user?.role !== "admin" && user?.role !== "staff") {
  //     alert("Hanya admin dan staff yang boleh menambah barang!");
  //     return;
  //   }

  //   if (!newItem.nama_barang || !newItem.sku) {
  //     alert("Isi nama dan SKU terlebih dahulu!");
  //     return;
  //   }

  //   try {
  //     await axios.post(API_URL_ITEMS, newItem, { headers });
  //     setNewItem({ nama_barang: "", sku: "", stok: 0, lokasi_rak: "" });
  //     fetchItems();
  //   } catch (err) {
  //     console.error("Error adding item:", err.response?.data || err.message);
  //   }
  // };

  const handleAdd = async () => {
    // hanya admin dan staff yang boleh tambah item
    if (user?.role !== "admin" && user?.role !== "staff") {
      Swal.fire({
        icon: "warning",
        title: "Akses Ditolak!",
        text: "Hanya admin dan staff yang boleh menambah barang!",
        confirmButtonColor: "#2d4c74",
      });
      return;
    }

    if (!newItem.nama_barang || !newItem.sku) {
      Swal.fire({
        icon: "warning",
        title: "Data belum lengkap",
        text: "Isi nama barang dan SKU terlebih dahulu!",
        confirmButtonColor: "#2d4c74",
      });
      return;
    }

    try {
      await axios.post(API_URL_ITEMS, newItem, { headers });
      setNewItem({ nama_barang: "", sku: "", stok: 0, lokasi_rak: "" });
      fetchItems();

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Barang berhasil ditambahkan.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error adding item:", err.response?.data || err.message);

      const msg =
        err.response?.data?.errors?.sku?.[0] ||
        err.response?.data?.message ||
        "Terjadi kesalahan saat menambahkan item.";

      Swal.fire({
        icon: "error",
        title: "Gagal Menambahkan Barang",
        text: msg,
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleEdit = (item) => {
    if (user?.role !== "admin") return;
    setEditingItem(item);
  };

  const handleUpdate = async () => {
    if (user?.role !== "admin") return;
    try {
      await axios.put(`${API_URL_ITEMS}/${editingItem.id}`, editingItem, { headers });
      setEditingItem(null);
      fetchItems();
    } catch (err) {
      console.error("Error updating item:", err.response?.data || err.message);
    }
  };

  const confirmDelete = (item) => {
    if (user?.role !== "admin") return;
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  // const handleDelete = async () => {
  //   if (user?.role !== "admin") return;
  //   if (!itemToDelete) return;
  //   try {
  //     await axios.delete(`${API_URL_ITEMS}/${itemToDelete.id}`, { headers });
  //     setShowDeleteModal(false);
  //     setItemToDelete(null);
  //     fetchItems();
  //   } catch (err) {
  //     console.error("Error deleting item:", err.response?.data || err.message);
  //   }
  // };
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data barang ini akan dihapus secara permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL_ITEMS}/${id}`, { headers });
          fetchItems();

          Swal.fire({
            icon: "success",
            title: "Berhasil dihapus!",
            text: "Barang telah dihapus dari daftar.",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (err) {
          console.error("Error deleting item:", err.response?.data || err.message);
          Swal.fire({
            icon: "error",
            title: "Gagal Menghapus",
            text:
              err.response?.data?.message ||
              "Terjadi kesalahan saat menghapus barang.",
            confirmButtonColor: "#d33",
          });
        }
      }
    });
  };


  // ===== TRANSAKSI (ADMIN + STAFF) =====
  const handleAddTransaction = async (itemId, qty) => {
    try {
      await axios.post(API_URL_TRANSACTIONS, { item_id: itemId, qty }, { headers });
      fetchItems(); // update stok
    } catch (err) {
      console.error("Error adding transaction:", err.response?.data || err.message);
    }
  };

  // ===== SORT & SEARCH =====
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key] ?? "";
        let bValue = b[sortConfig.key] ?? "";
        if (typeof aValue === "string") aValue = aValue.toLowerCase();
        if (typeof bValue === "string") bValue = bValue.toLowerCase();
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const filteredItems = sortedItems.filter((item) => {
    const nama = item.nama_barang?.toLowerCase() || "";
    const sku = item.sku?.toLowerCase() || "";
    return nama.includes(searchTerm.toLowerCase()) || sku.includes(searchTerm.toLowerCase());
  });

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) return sortConfig.direction === "asc" ? " ▲" : " ▼";
    return "";
  };

  // ===== RENDER =====
  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif", maxWidth: "1000px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#2d4c74" }}>Daftar Barang</h2>

      {/* Form tambah item hanya admin */}
      {(user?.role === "admin" || user?.role === "staff") && (
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px", background: "#f5f5f5", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
          <input type="text" placeholder="Nama Barang" value={newItem.nama_barang} onChange={(e) => setNewItem({ ...newItem, nama_barang: e.target.value })} style={{ flex: "1", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
          <input type="text" placeholder="SKU" value={newItem.sku} onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })} style={{ flex: "1", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
          <input type="number" placeholder="Stok" value={newItem.stok} onChange={(e) => setNewItem({ ...newItem, stok: parseInt(e.target.value) })} style={{ width: "100px", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
          <input type="text" placeholder="Lokasi Rak" value={newItem.lokasi_rak} onChange={(e) => setNewItem({ ...newItem, lokasi_rak: e.target.value })} style={{ width: "150px", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
          <button onClick={handleAdd} style={{ background: "#2d4c74", color: "#fff", border: "none", padding: "8px 15px", borderRadius: "4px", cursor: "pointer" }}>Tambah</button>
        </div>
      )}

      {/* Search bar */}
      <div style={{ marginBottom: "15px", display: "flex", justifyContent: "flex-end" }}>
        <input type="text" placeholder="Cari nama barang atau SKU..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", width: "250px" }} />
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#2d4c74", color: "#fff", cursor: "pointer" }}>
            <tr>
              <th style={{ padding: "10px", textAlign: "left" }} onClick={() => requestSort("id")}>ID{getSortIndicator("id")}</th>
              <th style={{ padding: "10px", textAlign: "left" }} onClick={() => requestSort("nama_barang")}>Nama Barang{getSortIndicator("nama_barang")}</th>
              <th style={{ padding: "10px", textAlign: "left" }} onClick={() => requestSort("sku")}>SKU{getSortIndicator("sku")}</th>
              <th style={{ padding: "10px", textAlign: "left" }} onClick={() => requestSort("stok")}>Stok{getSortIndicator("stok")}</th>
              <th style={{ padding: "10px", textAlign: "left" }} onClick={() => requestSort("lokasi_rak")}>Lokasi Rak{getSortIndicator("lokasi_rak")}</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "8px" }}>{item.id}</td>
                  <td style={{ padding: "8px" }}>{editingItem?.id === item.id && user?.role === "admin" ? (
                    <input value={editingItem.nama_barang} onChange={(e) => setEditingItem({ ...editingItem, nama_barang: e.target.value })} style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }} />
                  ) : item.nama_barang}</td>
                  <td style={{ padding: "8px" }}>{editingItem?.id === item.id && user?.role === "admin" ? (
                    <input value={editingItem.sku} onChange={(e) => setEditingItem({ ...editingItem, sku: e.target.value })} style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }} />
                  ) : item.sku}</td>
                  <td style={{ padding: "8px" }}>{editingItem?.id === item.id && user?.role === "admin" ? (
                    <input type="number" value={editingItem.stok} onChange={(e) => setEditingItem({ ...editingItem, stok: parseInt(e.target.value) })} style={{ width: "80px", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }} />
                  ) : item.stok}</td>
                  <td style={{ padding: "8px" }}>{editingItem?.id === item.id && user?.role === "admin" ? (
                    <input value={editingItem.lokasi_rak} onChange={(e) => setEditingItem({ ...editingItem, lokasi_rak: e.target.value })} style={{ width: "120px", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }} />
                  ) : item.lokasi_rak}</td>
                  <td style={{ padding: "8px", display: "flex", gap: "5px" }}>
                    {user?.role === "admin" ? (
                      editingItem?.id === item.id ? (
                        <>
                          <button onClick={handleUpdate} style={{ background: "#4caf50", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>Simpan</button>
                          <button onClick={() => setEditingItem(null)} style={{ background: "#f44336", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>Batal</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(item)} style={{ background: "#2196f3", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>Edit</button>
                          <button onClick={() => handleDelete(item.id)} style={{ background: "#f44336", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>Hapus</button>
                        </>
                      )
                    ) : 
                    (
                      <></>
                      // <button onClick={() => handleAddTransaction(item.id, 1)} style={{ background: "#4caf50", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>Tambah Transaksi</button>
                    )
                    }
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" align="center" style={{ padding: "10px" }}>Tidak ada data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
