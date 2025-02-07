import adoptionModel from "./models/Adoption.js";
import userModel from "./models/User.js";
import petModel from "./models/Pet.js";

export default class Adoption {
  get = (params) => {
    return adoptionModel.find(params);
  };

  getBy = (params) => {
    return adoptionModel.findOne(params);
  };

  save = (doc) => {
    return adoptionModel.create(doc);
  };

  update = async (id, doc) => {
    if (doc.owner) {
      const ownerExists = await userModel.findById(doc.owner);
      if (!ownerExists) {
        return null;
      }
    }
    if (doc.pet) {
      const petExists = await petModel.findById(doc.pet);
      if (!petExists) {
        return null;
      }
    }
    const updatedAdoption = await adoptionModel.findByIdAndUpdate(
      id,
      { $set: doc },
      { new: true }
    );
    return updatedAdoption;
  };

  delete = async (id) => {
    const result = await adoptionModel.findByIdAndDelete(id);
    return result;
  };
}
