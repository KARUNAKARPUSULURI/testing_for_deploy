import express from 'express';
const router = express.Router();
import InventoryItem from '../models/InventoryItem.js';

// Get all inventory items
router.get('/', async (req, res) => {
  try {
    const items = await InventoryItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single inventory item by ID
router.get('/:id', getItem, (req, res) => {
  res.json(res.item);
});

// Create a new inventory item
router.post('/', async (req, res) => {
  const { name, quantity, price, description } = req.body;
  const item = new InventoryItem({
    name,
    quantity,
    price,
    description,
  });

  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an inventory item
router.put('/:id', getItem, async (req, res) => {
  const { name, quantity, price, description } = req.body;

  if (name != null) res.item.name = name;
  if (quantity != null) res.item.quantity = quantity;
  if (price != null) res.item.price = price;
  if (description != null) res.item.description = description;

  try {
    const updatedItem = await res.item.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an inventory item
router.delete('/:id', getItem, async (req, res) => {
  try {
    await res.item.remove();
    res.json({ message: 'Deleted Inventory Item' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get item by ID
async function getItem(req, res, next) {
  let item;
  try {
    item = await InventoryItem.findById(req.params.id);
    if (item == null) {
      return res.status(404).json({ message: 'Cannot find inventory item' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.item = item;
  next();
}

export default router;
