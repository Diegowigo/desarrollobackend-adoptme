import { expect } from "chai";
import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import Users from "../src/dao/Users.dao.js";
import userModel from "../src/dao/models/User.js";
import { connDB } from "../src/connDB.js";
import bcrypt from "bcrypt";

let usersDAO;

before(async () => {
  await connDB();
  usersDAO = new Users();
});

after(async () => {
  await mongoose.disconnect();
});

beforeEach(async () => {
  await userModel.deleteMany({});
});

describe("Pruebas Unitarias de Users DAO", () => {
  it("Debe crear un nuevo usuario", async () => {
    const userData = {
      first_name: "Carlos",
      last_name: "Pérez",
      email: "carlos@example.com",
      password: "123456",
    };
    const user = await usersDAO.save(userData);
    expect(user).to.have.property("_id");
  });

  it("Debe crear un nuevo usuario con contraseña hasheada", async () => {
    const userData = {
      first_name: "Carlos",
      last_name: "Pérez",
      email: "carlos@example.com",
      password: "123456",
    };
    const user = await usersDAO.save(userData);
    expect(user).to.have.property("_id");
    const passwordMatches = await bcrypt.compare(
      userData.password,
      user.password
    );
    expect(passwordMatches).to.be.false;
  });

  it("Debe obtener un usuario por email", async () => {
    const userData = {
      first_name: "Ana",
      last_name: "Gómez",
      email: "ana@example.com",
      password: "123456",
    };
    await usersDAO.save(userData);
    const user = await usersDAO.getBy({ email: "ana@example.com" });
    expect(user).to.have.property("email", "ana@example.com");
  });

  it("Debe devolver un error 404 si el usuario no existe", async () => {
    const nonExistentUserId = mongoose.Types.ObjectId();
    const response = await request(app).get(`/api/users/${nonExistentUserId}`);
    expect(response.status).to.equal(404);
    expect(response.body.error).to.equal("User not found");
  });

  it("Debe actualizar un usuario", async () => {
    const userData = {
      first_name: "Pedro",
      last_name: "López",
      email: "pedro@example.com",
      password: "123456",
    };
    const createdUser = await usersDAO.save(userData);
    const updatedUser = await usersDAO.update(createdUser._id, {
      first_name: "Pablo",
    });
    expect(updatedUser).to.have.property("first_name", "Pablo");
  });

  it("Debe eliminar un usuario", async () => {
    const userData = {
      first_name: "Lucía",
      last_name: "Ramírez",
      email: "lucia@example.com",
      password: "123456",
    };
    const createdUser = await usersDAO.save(userData);
    await usersDAO.delete(createdUser._id);
    const user = await usersDAO.getBy({ _id: createdUser._id });
    expect(user).to.be.null;
  });
});

describe("Pruebas de Integración de Users API", () => {
  it("Debe devolver todos los usuarios", async () => {
    const response = await request(app).get("/api/users");
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("payload").that.is.an("array");
  });

  it("Debe obtener un usuario por ID", async () => {
    const userData = {
      first_name: "Luis",
      last_name: "Martínez",
      email: "luis@example.com",
      password: "123456",
    };
    const user = await usersDAO.save(userData);
    const response = await request(app).get(`/api/users/${user._id}`);
    expect(response.status).to.equal(200);
    expect(response.body.payload).to.have.property("email", "luis@example.com");
  });

  it("Debe actualizar un usuario", async () => {
    const userData = {
      first_name: "Sofía",
      last_name: "Díaz",
      email: "sofia@example.com",
      password: "123456",
    };
    const user = await usersDAO.save(userData);
    const response = await request(app)
      .put(`/api/users/${user._id}`)
      .send({ first_name: "Mariana" });
    expect(response.status).to.equal(200);
  });

  it("Debe eliminar un usuario", async () => {
    const userData = {
      first_name: "Elena",
      last_name: "Castro",
      email: "elena@example.com",
      password: "123456",
    };
    const user = await usersDAO.save(userData);
    const response = await request(app).delete(`/api/users/${user._id}`);
    expect(response.status).to.equal(200);
  });

  it("No debe permitir emails duplicados", async () => {
    const userData = {
      first_name: "Marta",
      last_name: "Jiménez",
      email: "marta@example.com",
      password: "123456",
    };
    await usersDAO.save(userData);
    const response = await request(app).post("/api/users").send(userData);
    expect(response.status).to.equal(400);
  });

  it("No debe permitir crear usuario sin email", async () => {
    const userData = {
      first_name: "Marta",
      last_name: "Jiménez",
      password: "123456",
    };
    const response = await request(app).post("/api/users").send(userData);
    expect(response.status).to.equal(400);
    expect(response.body.error).to.equal("Faltan campos requeridos");
  });
});
