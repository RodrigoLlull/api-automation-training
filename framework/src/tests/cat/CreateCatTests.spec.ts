import { expect } from "chai";
import { CatService } from "../../models/service/CatService";
import { Cat } from "../../models/Cat";

describe("@API POST cats", () => {
  let catService: CatService;

  it("@Smoke - User should be able to create a cat and get status code 201", async () => {
    catService = new CatService();
    const newCat: Cat = {
      name: "Sol",
      age: 1,
      breed: "NA",
      dateJoined: new Date().toISOString(),
      vaccinated: true,
      temperament: ["Playful", "Curious"],
      staffInCharge: "00000000-0000-0000-0000-000000000000",
      isAdopted: false,
    };

    const response = await catService.createCat(newCat);
    const createdCatId = response.data.id;

    console.log(createdCatId);
    console.log(response);

    if (!createdCatId) {
      throw new Error("Expected created cat to have an id");
    }

    expect(response.status).to.equal(201);
    expect(response.data).to.have.property("id").that.is.a("number");

    expect(response.data.name).to.include(newCat.name);
    expect(response.data.age).to.equal(newCat.age);
    expect(response.data.breed).to.include(newCat.breed);
    expect(response.data.dateJoined).to.include(newCat.dateJoined);
    expect(response.data.vaccinated).to.equal(newCat.vaccinated);
    expect(response.data.temperament ?? []).to.have.members(newCat.temperament ?? []);
    expect(response.data.isAdopted).to.equal(newCat.isAdopted);

    await catService.deleteCat(createdCatId);
  });

  it("@Regression - Should fail with 400 when required fields are missing", async () => {
    const incompleteCat: Partial<Cat> = {
      name: "Rumualdo",
      breed: "Tabby",
    };

    const response = await catService.createCat(incompleteCat as Cat);

    expect(response.status).to.equal(400);
    expect(response.data).to.have.property("message");
  });

  it("@Regression - Should fail with 404 when staffInCharge and adopterId is invalid", async () => {
    const newCat: Cat = {
      name: "Sol",
      age: 1,
      breed: "NA",
      dateJoined: new Date().toISOString(),
      vaccinated: true,
      temperament: ["Playful", "Curious"],
      staffInCharge: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      isAdopted: true,
      adopterId: 999999999,
    };

    const response = await catService.createCat(newCat);
    expect(response.status).to.equal(404);
    expect(response.data).to.have.property("message");
  });
});
