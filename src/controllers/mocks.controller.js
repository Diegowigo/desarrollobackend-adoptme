import { generatePets } from "../utils/mocks.js";
import { generateUsers } from "../utils/mocks.js";

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
      const users = generateUsers(50);

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
}

export default MockingController;
