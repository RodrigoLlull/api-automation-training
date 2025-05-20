import { ServiceBase } from "../../base/ServiceBase";
import { Cat } from "../responses/CatResponse";

export class CatService extends ServiceBase {
  constructor() {
    super("/cats");
  }

  async getAllCats() {
    return await this.get<Cat[]>(this.url);
  }

  async createCat(cat: Cat) {
    return await this.post<Cat>(this.url, cat);
  }

  async getCatById(catId: number) {
    return await this.get<Cat>(`${this.url}/${catId}`);
  }

  async deleteCat(catId: number) {
    return await this.delete(`${this.url}/${catId}`);
  }

  async patchCat(catId: number, data: Partial<Cat>) {
    return await this.patch<Cat>(`${this.url}/${catId}`, data);
  }

  async updateCat(catId: number, cat: Cat) {
    return await this.put<Cat>(`${this.url}/${catId}`, cat);
  }
}
