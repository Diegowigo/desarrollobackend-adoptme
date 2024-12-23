import { fakerES as faker } from "@faker-js/faker";
import { createHash } from "./index.js";

export const generatePets = (count = 1) => {
  return Array.from({ length: count }, () => {
    let _id = faker.database.mongodbObjectId();
    let name = faker.animal.petName();
    let specie = faker.animal.type();
    let birthDate = faker.date.between({
      from: "2010-01-01",
      to: "2023-12-31",
    });
    let adopted = false;
    let owner = null;
    let image = faker.image.url({
      category: "animals",
      width: 640,
      height: 480,
    });
    let __v = 0;
    let createdAt = new Date().toISOString();

    return {
      _id,
      name,
      specie,
      birthDate,
      adopted,
      owner,
      image,
      __v,
      createdAt,
    };
  });
};

export const generateUsers = (count = 1) => {
  return Array.from({ length: count }, () => {
    let first_name = faker.person.firstName();
    let last_name = faker.person.lastName();
    let email = faker.internet.email();
    let password = createHash("coder123");
    let role = faker.helpers.arrayElement(["user", "admin"]);
    let pets = [];
    let _id = faker.database.mongodbObjectId();
    let __v = 0;

    return {
      _id,
      first_name,
      last_name,
      email,
      password,
      role,
      pets,
      __v,
      createdAt: new Date().toISOString(),
    };
  });
};
