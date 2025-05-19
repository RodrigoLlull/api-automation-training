import { ServiceBase } from "../../base/ServiceBase";
import { Cat } from "../responses/CatResponse";

export class CatService extends ServiceBase {
  constructor() {
    super("/cats");
  }

  async getAllCats() {
    return this.get<Cat[]>(this.url);
  }

  async createCat(cat: Cat) {
    return this.post<Cat>(this.url, cat);
  }

  async getCatById(catId: number) {
    return this.get<Cat>(`${this.url}/${catId}`);
  }

  async deleteCat(catId: number) {
    return this.delete(`${this.url}/${catId}`);
  }

  async patchCat(catId: number, data: Partial<Cat>) {
    return this.patch<Cat>(`${this.url}/${catId}`, data);
  }

  async updateCat(catId: number, cat: Cat) {
    return this.put<Cat>(`${this.url}/${catId}`, cat);
  }
}
