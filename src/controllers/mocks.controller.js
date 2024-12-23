import { generatePets } from "../utils/mocks.js";
import { generateUsers } from "../utils/mocks.js";
import Pets from "../dao/models/Pet.js";
import Users from "../dao/models/User.js";

class MockingController {
  static async getMockPets(req, res) {
    try {
      const pets = generatePets(100);

      res.status(200).json({
        message: "100 fake pets generated successfully!",
        pets,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error generating pets",
        error: error.message,
      });
    }
  }

  static async getMockUsers(req, res) {
    try {
      const users = await generateUsers(50);

      res.status(200).json({
        message: "50 fake users generated successfully!",
        users,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error generating users",
        error: error.message,
      });
    }
  }

  static async generateData(req, res) {
    try {
      const { users, pets } = req.body;

      const generatedPets = generatePets(pets);
      const generatedUsers = await generateUsers(users);

      const insertedPets = await Pets.insertMany(generatedPets);
      const insertedUsers = await Users.insertMany(generatedUsers);

      res.status(200).json({
        message: `${insertedUsers.length} users and ${insertedPets.length} pets generated and saved successfully!`,
        users: insertedUsers,
        pets: insertedPets,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error generating and saving data",
        error: error.message,
      });
    }
  }
}

export default MockingController;
