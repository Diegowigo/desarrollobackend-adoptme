import { expect } from "chai";
import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import Adoption from "../src/dao/Adoption.dao.js";
import adoptionModel from "../src/dao/models/Adoption.js";
import userModel from "../src/dao/models/User.js";
import petModel from "../src/dao/models/Pet.js";
import { connDB } from "../src/connDB.js";

let adoptionsDAO;

before(async () => {
  await connDB();
  adoptionsDAO = new Adoption();
});

after(async () => {
  await mongoose.disconnect();
});

beforeEach(async () => {
  await adoptionModel.deleteMany({});
  await userModel.deleteMany({});
  await petModel.deleteMany({});
});

describe("Pruebas Unitarias de Adoptions DAO", () => {
  it("Debe crear una nueva adopción", async () => {
    const user = await userModel.create({
      first_name: "Carlos",
      last_name: "Pérez",
      email: "carlos@example.com",
      password: "123456",
    });

    const pet = await petModel.create({
      name: "Max",
      specie: "Dog",
      birthDate: new Date(),
      adopted: false,
    });

    const adoptionData = {
      owner: user._id,
      pet: pet._id,
    };

    const adoption = await adoptionsDAO.save(adoptionData);
    expect(adoption).to.have.property("_id");
  });

  it("Debe obtener una adopción por ID", async () => {
    const user = await userModel.create({
      first_name: "Ana",
      last_name: "Gómez",
      email: "ana@example.com",
      password: "123456",
    });

    const pet = await petModel.create({
      name: "Bella",
      specie: "Cat",
      birthDate: new Date(),
      adopted: false,
    });

    const adoptionData = {
      owner: user._id,
      pet: pet._id,
    };

    const createdAdoption = await adoptionsDAO.save(adoptionData);
    const adoption = await adoptionsDAO.getBy({ _id: createdAdoption._id });

    expect(adoption.owner.toString()).to.equal(user._id.toString());
    expect(adoption.pet.toString()).to.equal(pet._id.toString());
  });

  it("Debe actualizar una adopción", async () => {
    const user = await userModel.create({
      first_name: "Pedro",
      last_name: "López",
      email: "pedro@example.com",
      password: "123456",
    });

    const pet = await petModel.create({
      name: "Rex",
      specie: "Dog",
      birthDate: new Date(),
      adopted: false,
    });

    const adoptionData = {
      owner: user._id,
      pet: pet._id,
    };

    const createdAdoption = await adoptionsDAO.save(adoptionData);
    const updatedAdoption = await adoptionsDAO.update(createdAdoption._id, {
      owner: user._id,
      pet: pet._id,
    });

    expect(updatedAdoption.owner.toString()).to.equal(user._id.toString());
    expect(updatedAdoption.pet.toString()).to.equal(pet._id.toString());
  });

  it("Debe eliminar una adopción", async () => {
    const user = await userModel.create({
      first_name: "Lucía",
      last_name: "Ramírez",
      email: "lucia@example.com",
      password: "123456",
    });

    const pet = await petModel.create({
      name: "Luna",
      specie: "Cat",
      birthDate: new Date(),
      adopted: false,
    });

    const adoptionData = {
      owner: user._id,
      pet: pet._id,
    };

    const createdAdoption = await adoptionsDAO.save(adoptionData);
    await adoptionsDAO.delete(createdAdoption._id);
    const adoption = await adoptionsDAO.getBy({ _id: createdAdoption._id });
    expect(adoption).to.be.null;
  });

  it("Debe obtener todas las adopciones", async () => {
    const user = await userModel.create({
      first_name: "Carlos",
      last_name: "Pérez",
      email: "carlos@example.com",
      password: "123456",
    });

    const pet1 = await petModel.create({
      name: "Max",
      specie: "Dog",
      birthDate: new Date(),
      adopted: false,
    });

    const pet2 = await petModel.create({
      name: "Bella",
      specie: "Cat",
      birthDate: new Date(),
      adopted: false,
    });

    await adoptionsDAO.save({ owner: user._id, pet: pet1._id });
    await adoptionsDAO.save({ owner: user._id, pet: pet2._id });

    const adoptions = await adoptionsDAO.get();
    expect(adoptions).to.be.an("array").with.lengthOf(2);
  });

  it("Debe devolver null si se intenta actualizar con datos inválidos", async () => {
    const user = await userModel.create({
      first_name: "Pedro",
      last_name: "López",
      email: "pedro@example.com",
      password: "123456",
    });

    const pet = await petModel.create({
      name: "Rex",
      specie: "Dog",
      birthDate: new Date(),
      adopted: false,
    });

    const adoptionData = {
      owner: user._id,
      pet: pet._id,
    };

    const createdAdoption = await adoptionsDAO.save(adoptionData);
    const nonExistentOwnerId = mongoose.Types.ObjectId();
    const updatedAdoption = await adoptionsDAO.update(createdAdoption._id, {
      owner: nonExistentOwnerId,
    });

    expect(updatedAdoption).to.be.null;
  });
});

describe("Pruebas de Integración de Adoptions API", () => {
  it("Debe devolver todas las adopciones", async () => {
    const response = await request(app).get("/api/adoptions");
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("payload").that.is.an("array");
  });

  it("Debe obtener una adopción por ID", async () => {
    const user = await userModel.create({
      first_name: "Luis",
      last_name: "Martínez",
      email: "luis@example.com",
      password: "123456",
    });

    const pet = await petModel.create({
      name: "Rocky",
      specie: "Dog",
      birthDate: new Date(),
      adopted: false,
    });

    const adoptionData = {
      owner: user._id,
      pet: pet._id,
    };

    const adoption = await adoptionsDAO.save(adoptionData);
    const response = await request(app).get(`/api/adoptions/${adoption._id}`);
    expect(response.status).to.equal(200);
    expect(response.body.payload).to.have.property(
      "owner",
      user._id.toString()
    );
    expect(response.body.payload).to.have.property("pet", pet._id.toString());
  });

  it("Debe crear una nueva adopción", async () => {
    const user = await userModel.create({
      first_name: "Sofía",
      last_name: "Díaz",
      email: "sofia@example.com",
      password: "123456",
    });

    const pet = await petModel.create({
      name: "Milo",
      specie: "Dog",
      birthDate: new Date(),
      adopted: false,
    });

    const response = await request(app)
      .post(`/api/adoptions/${user._id}/${pet._id}`)
      .send();

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("message", "Pet adopted");
  });

  it("Debe devolver un error 404 si el usuario no existe al crear una adopción", async () => {
    const nonExistentUserId = mongoose.Types.ObjectId();
    const pet = await petModel.create({
      name: "Charlie",
      specie: "Dog",
      birthDate: new Date(),
      adopted: false,
    });

    const response = await request(app)
      .post(`/api/adoptions/${nonExistentUserId}/${pet._id}`)
      .send();

    expect(response.status).to.equal(404);
    expect(response.body.error).to.equal("User not found");
  });

  it("Debe devolver un error 404 si la mascota no existe al crear una adopción", async () => {
    const user = await userModel.create({
      first_name: "Elena",
      last_name: "Castro",
      email: "elena@example.com",
      password: "123456",
    });

    const nonExistentPetId = mongoose.Types.ObjectId();

    const response = await request(app)
      .post(`/api/adoptions/${user._id}/${nonExistentPetId}`)
      .send();

    expect(response.status).to.equal(404);
    expect(response.body.error).to.equal("Pet not found");
  });

  it("Debe devolver un error 400 si la mascota ya está adoptada", async () => {
    const user = await userModel.create({
      first_name: "Marta",
      last_name: "Jiménez",
      email: "marta@example.com",
      password: "123456",
    });

    const pet = await petModel.create({
      name: "Buddy",
      specie: "Dog",
      birthDate: new Date(),
      adopted: true,
    });

    const response = await request(app)
      .post(`/api/adoptions/${user._id}/${pet._id}`)
      .send();

    expect(response.status).to.equal(400);
    expect(response.body.error).to.equal("Pet is already adopted");
  });

  it("Debe eliminar una adopción", async () => {
    const user = await userModel.create({
      first_name: "Lucía",
      last_name: "Ramírez",
      email: "lucia@example.com",
      password: "123456",
    });

    const pet = await petModel.create({
      name: "Luna",
      specie: "Cat",
      birthDate: new Date(),
      adopted: false,
    });

    const adoptionData = {
      owner: user._id,
      pet: pet._id,
    };

    const createdAdoption = await adoptionsDAO.save(adoptionData);
    const response = await request(app).delete(
      `/api/adoptions/${createdAdoption._id}`
    );

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("message", "Adoption deleted");
  });

  it("Debe devolver un error 404 si la adopción no existe al eliminar", async () => {
    const nonExistentAdoptionId = mongoose.Types.ObjectId();
    const response = await request(app).delete(
      `/api/adoptions/${nonExistentAdoptionId}`
    );

    expect(response.status).to.equal(404);
    expect(response.body.error).to.equal("Adoption not found");
  });

  it("Debe devolver un error 404 si la adopción no existe al actualizar", async () => {
    const nonExistentAdoptionId = mongoose.Types.ObjectId();
    const response = await request(app)
      .put(`/api/adoptions/${nonExistentAdoptionId}`)
      .send({
        owner: mongoose.Types.ObjectId(),
        pet: mongoose.Types.ObjectId(),
      });

    expect(response.status).to.equal(404);
    expect(response.body.error).to.equal("Adoption not found");
  });
});
