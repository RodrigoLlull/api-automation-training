import axios from "axios";

const BASE_URL = process.env["BASEURL"] ?? "";

async function seedAdopter() {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/adopters",
      {
        name: "Rodrigo",
        lastName: "Llull",
        dateOfBirth: "1998-10-29T00:00:00.000Z",
        phone: "59895000000",
        address: "My Address 1234",
      },
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    console.log("Adopter seeded:", response.data);
  } catch (error: any) {
    console.error("Seed error:", error.response?.data || error.message || error);
    process.exit(1);
  }
}

seedAdopter();
