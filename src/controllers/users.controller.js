import { usersService } from "../services/index.js";
import userModel from "../dao/models/User.js";
import { createHash } from "../utils/index.js";

const getAllUsers = async (req, res) => {
  const users = await usersService.getAll();
  res.send({ status: "success", payload: users });
};

const getUser = async (req, res) => {
  const userId = req.params.uid;
  const user = await usersService.getUserById(userId);
  if (!user)
    return res.status(404).send({ status: "error", error: "User not found" });
  res.send({ status: "success", payload: user });
};

const createUser = async (req, res) => {
  const { email, first_name, last_name, password } = req.body;
  if (!email || !first_name || !last_name || !password) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "El email ya está en uso" });
    }
    const hashedPassword = await createHash(password);
    const newUser = new userModel({
      email,
      first_name,
      last_name,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ payload: newUser });
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const updateUser = async (req, res) => {
  const updateBody = req.body;
  const userId = req.params.uid;
  const user = await usersService.getUserById(userId);
  if (!user)
    return res.status(404).send({ status: "error", error: "User not found" });
  const result = await usersService.update(userId, updateBody);
  res.send({ status: "success", message: "User updated" });
};

const deleteUser = async (req, res) => {
  const userId = req.params.uid;
  const result = await usersService.getUserById(userId);
  res.send({ status: "success", message: "User deleted" });
};

export default {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  createUser,
};
