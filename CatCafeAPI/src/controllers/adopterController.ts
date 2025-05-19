import { Request, Response } from "express";
import { z } from "zod";
import { AdopterService } from "../services/adopterService.js";
import { CatService } from "../services/catService.js";
import { Adopter } from "../types/adopter.js";

const adopterService = new AdopterService();
const catService = new CatService();

const AdopterSchema = z.object({
  name: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
  phone: z
    .string()
    .trim()
    .regex(
      /^[+\d\-\s]+$/,
      "Phone number can only contain digits, +, -, and spaces"
    )
    .refine((num) => num.replace(/[^\d]/g, "").length >= 8, {
      message: "Phone number must have at least 8 digits",
    })
    .transform((val) => Number(val.replace(/[^\d]/g, "").replace(/^0+/, ""))), // Remove non-digits and leading zeros, then convert to number
  address: z.string().min(6),
});

export class AdopterController {
  async getAdopter(req: Request, res: Response) {
    const { id } = req.params;
    const includeCats =
      req.query.includeCats?.toString().toLowerCase() === "true";
    let adopter: Adopter | null = null;

    try {
      adopter = await adopterService.getAdopter(parseInt(id));
      if (!adopter) {
        return res.status(404).json({ error: "Adopter not found" });
      }
      if (!includeCats) {
        res.json(adopter);
      } else {
        const cats = await catService.getCatsByAdopterId(parseInt(id));
        res.json({ ...adopter, cats });
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: "Internal server error" + JSON.stringify(error) });
    }
  }

  async getAdopters(_req: Request, res: Response) {
    let adopters: Adopter[] | null = null;

    try {
      adopters = await adopterService.getAdopters();
      res.json(adopters);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Internal server error" + JSON.stringify(error) });
    }
  }

  async addAdopter(req: Request, res: Response) {
    try {
      const validatedAdopter = AdopterSchema.parse(req.body);
      if (!isAdult(validatedAdopter.dateOfBirth)) {
        return res.status(400).json({
          message: "The adopter must be at least 18 years old to adopt a cat",
        });
      }

      const newAdopter = await adopterService.addAdopter(validatedAdopter);
      res.status(201).json(newAdopter);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async removeAdopter(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const adoptedCats = await catService.getCatsByAdopterId(parseInt(id));
      if (adoptedCats.length >= 1) {
        return res.status(400).json({
          message:
            "Adopters can not be deleted if the adoption was carried out",
        });
      }

      const removed = await adopterService.removeAdopter(parseInt(id));
      if (!removed) {
        return res.status(404).json({ message: "Adopter not found" });
      }
      res.status(204).send();
    } catch (err) {
      res
        .status(500)
        .json({ message: "Internal server error" + JSON.stringify(err) });
    }
  }
}

function isAdult(birthDate: Date): boolean {
  const today = new Date();

  // Calculate the age
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  // Adjust the age if the birthday hasn't occurred this year yet
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age >= 18;
}
