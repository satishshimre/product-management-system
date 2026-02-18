import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: ""
  });
  const [editId, setEditId] = useState(null);

  // ================= LOAD PRODUCTS =================
  const loadProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // ================= INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= ADD / UPDATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await fetch(`http://localhost:5000/api/products/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        });

        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Product updated successfully",
          timer: 1500,
          showConfirmButton: false
        });

      } else {
        await fetch("http://localhost:5000/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        });

        Swal.fire({
          icon: "success",
          title: "Added!",
          text: "Product added successfully",
          timer: 1500,
          showConfirmButton: false
        });
      }

      setForm({ name: "", price: "", description: "" });
      setEditId(null);
      loadProducts();

    } catch (error) {
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  // ================= DELETE =================
  const deleteProduct = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This product will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!"
    });

    if (!result.isConfirmed) return;

    try {
      await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE"
      });

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Product deleted successfully",
        timer: 1500,
        showConfirmButton: false
      });

      loadProducts();

    } catch (error) {
      Swal.fire("Error", "Delete failed!", "error");
    }
  };

  // ================= EDIT =================
  const editProduct = (product) => {
    setEditId(product.ID);
    setForm({
      name: product.NAME,
      price: product.PRICE,
      description: product.DESCRIPTION
    });
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <h2 className="text-center mb-4">Product Management System</h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="row g-3 mb-4">
          <div className="col-md-4">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Product Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-3">
            <input
              type="number"
              name="price"
              className="form-control"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-3">
            <input
              type="text"
              name="description"
              className="form-control"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-2">
            <button className="btn btn-primary w-100">
              {editId ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>

        {/* TABLE */}
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.ID}>
                <td>{p.ID}</td>
                <td>{p.NAME}</td>
                <td>₹ {p.PRICE}</td>
                <td>{p.DESCRIPTION}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => editProduct(p)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteProduct(p.ID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default App;
