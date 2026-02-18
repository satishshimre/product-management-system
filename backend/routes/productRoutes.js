const express = require('express');
const router = express.Router();
const { getConnection } = require('../db');

// GET all products
router.get('/', async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.execute("SELECT * FROM PRODUCTS ORDER BY ID");
    await connection.close();
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ADD product
router.post('/', async (req, res) => {
  const { name, price, description } = req.body;

  try {
    const connection = await getConnection();

    await connection.execute(
      `INSERT INTO PRODUCTS (NAME, PRICE, DESCRIPTION)
       VALUES (:name, :price, :description)`,
      { name, price, description },
      { autoCommit: true }
    );

    await connection.close();
    res.json({ message: "Product Added" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE product
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { name, price, description } = req.body;

  try {
    const connection = await getConnection();

    await connection.execute(
      `UPDATE PRODUCTS 
       SET NAME = :name, PRICE = :price, DESCRIPTION = :description
       WHERE ID = :id`,
      { name, price, description, id },
      { autoCommit: true }
    );

    await connection.close();
    res.json({ message: "Product Updated" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);

  try {
    const connection = await getConnection();

    await connection.execute(
      `DELETE FROM PRODUCTS WHERE ID = :id`,
      { id },
      { autoCommit: true }
    );

    await connection.close();
    res.json({ message: "Product Deleted" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
