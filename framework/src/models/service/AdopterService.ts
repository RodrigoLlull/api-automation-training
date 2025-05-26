import { ServiceBase } from "../../base/ServiceBase";
import { Adopter } from "../Adopter";
import { Response } from "../responses/Response";

export class AdopterService extends ServiceBase {
  constructor() {
    super("/adopters");
  }

  async getAllAdopters(): Promise<Response<Adopter[]>> {
    return await this.get<Adopter[]>(this.url);
  }

  async createAdopter(adopter: Adopter): Promise<Response<Adopter>> {
    return await this.post<Adopter>(this.url, adopter);
  }

  async getAdopterById(adopterId: number): Promise<Response<Adopter>> {
    return await this.get<Adopter>(`${this.url}/${adopterId}`);
  }

  async deleteAdopter(adopterId: number): Promise<Response<null>> {
    return await this.delete(`${this.url}/${adopterId}`);
  }
}
