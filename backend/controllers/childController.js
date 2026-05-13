import Child from "../models/Child.js";

const defaultChildren = [
  { name: "Alex", age: 8, avatar: "🧒" },
  { name: "Emma", age: 6, avatar: "👧" },
];

const serializeChild = (child) => ({
  id: child._id,
  name: child.name,
  age: child.age,
  avatar: child.avatar,
});

const ensureDefaultChildren = async (userId) => {
  const existing = await Child.find({ userId }).sort({ createdAt: 1 });

  if (existing.length) return existing;

  return Child.insertMany(defaultChildren.map((child) => ({ ...child, userId })));
};

export const getChildren = async (req, res) => {
  try {
    const children = await ensureDefaultChildren(req.user._id);
    res.json({ children: children.map(serializeChild) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createChild = async (req, res) => {
  try {
    const { name, age, avatar } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ error: "Child name is required" });
    }

    const child = await Child.create({
      userId: req.user._id,
      name: name.trim(),
      age: Number(age) || 8,
      avatar: avatar || "😊",
    });

    res.status(201).json({ child: serializeChild(child) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateChild = async (req, res) => {
  try {
    const { name, age, avatar } = req.body;

    const child = await Child.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        ...(name !== undefined ? { name: name.trim() } : {}),
        ...(age !== undefined ? { age: Number(age) || 8 } : {}),
        ...(avatar !== undefined ? { avatar } : {}),
      },
      { new: true }
    );

    if (!child) {
      return res.status(404).json({ error: "Child profile not found" });
    }

    res.json({ child: serializeChild(child) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
