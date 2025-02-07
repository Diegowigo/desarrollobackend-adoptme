import {
  adoptionsService,
  petsService,
  usersService,
} from "../services/index.js";

const getAllAdoptions = async (req, res) => {
  const result = await adoptionsService.getAll();
  res.send({ status: "success", payload: result });
};

const getAdoption = async (req, res) => {
  const adoptionId = req.params.aid;
  const adoption = await adoptionsService.getBy({ _id: adoptionId });
  if (!adoption)
    return res
      .status(404)
      .send({ status: "error", error: "Adoption not found" });
  res.send({ status: "success", payload: adoption });
};

const createAdoption = async (req, res) => {
  const { uid, pid } = req.params;
  if (!uid || !pid) {
    return res
      .status(400)
      .send({ status: "error", error: "Missing required fields" });
  }
  const user = await usersService.getUserById(uid);
  if (!user) {
    return res.status(404).send({ status: "error", error: "User not found" });
  }
  const pet = await petsService.getBy({ _id: pid });
  if (!pet) {
    return res.status(404).send({ status: "error", error: "Pet not found" });
  }
  if (pet.adopted) {
    return res
      .status(400)
      .send({ status: "error", error: "Pet is already adopted" });
  }
  await adoptionsService.create({ owner: user._id, pet: pet._id });
  res.status(200).send({ status: "success", message: "Pet adopted" });
};

const updateAdoption = async (req, res) => {
  const adoptionId = req.params.aid;

  const adoption = await adoptionsService.getBy({ _id: adoptionId });
  if (!adoption) {
    return res
      .status(404)
      .send({ status: "error", error: "Adoption not found" });
  }
  const updatedAdoption = await adoptionsService.update(adoptionId, req.body);
  res.status(200).send({ status: "success", payload: updatedAdoption });
};

const deleteAdoption = async (req, res) => {
  const adoptionId = req.params.aid;
  const adoption = await adoptionsService.getBy({ _id: adoptionId });
  if (!adoption) {
    return res
      .status(404)
      .send({ status: "error", error: "Adoption not found" });
  }
  await adoptionsService.delete(adoptionId);
  res.status(200).send({ status: "success", message: "Adoption deleted" });
};

export default {
  createAdoption,
  getAllAdoptions,
  getAdoption,
  deleteAdoption,
  updateAdoption,
};
