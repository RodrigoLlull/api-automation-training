import axios from "axios";

const BASE_URL = process.env["BASEURL"] ?? "http://localhost:3000/api";

async function seedAdopter() {
  try {
    await axios.post(
      `${BASE_URL}/adopters`,
      {
        name: "Rodrigo",
        lastName: "Llull",
        dateOfBirth: "1998-10-29T00:00:00.000Z",
        phone: "59895000000",
        address: "My Address 1234",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error: any) {
    if (error.response) {
      console.error("Seed error status:", error.response.status);
      console.error("Seed error data:", error.response.data);
    } else {
      console.error("Seed error:", error.message);
    }
    process.exit(1);
  }
}

seedAdopter();
