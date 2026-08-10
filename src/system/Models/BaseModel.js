import Logger from "@/lib/Logger";
import prisma from "@/lib/prisma";

export class BaseModel {
  static get model() {
    if (!BaseModel.modelName) throw new Error("modelName not defined in child class");
    return prisma[BaseModel.modelName];
  }

  static async create(data) {
    return await BaseModel.model.create({ data });
  }

  static async createMany(data) {
    return await BaseModel.model.createMany(data);
  }

  static async upsert({ where, create, update }) {
    try {
      return await BaseModel.model.upsert({
        where,
        create,
        update,
      });
    } catch (error) {
      Logger.error(error.message, `Upsert failed`);
      throw error;
    }
  }

  static async update({ where, data }) {
    return await BaseModel.model.update({
      where,
      data,
    });
  }

  static async updateMany({ where, data }) {
    return await BaseModel.model.updateMany({ where, data });
  }

  static async delete({ where }) {
    return await BaseModel.model.delete({ where });
  }

  static async deleteMany({ where }) {
    return await BaseModel.model.deleteMany({ where });
  }

  static async findUnique({ where, select, include }) {
    return await BaseModel.model.findUnique({
      where,
      ...(select && { select }),
      ...(include && { include }),
    });
  }

  static async findMany({ where, select, orderBy = { createdAt: "desc" }, include }) {
    return await BaseModel.model.findMany({
      ...(where && { where }),
      ...(select && { select }),
      ...(include && { include }),
      orderBy,
    });
  }

  static async findFirst({ where, include = {} }) {
    return await BaseModel.model.findFirst({
      ...(where && { where }),
      ...(include && { include }),
    });
  }

  static async count({ where }) {
    return await BaseModel.model.count({ ...(where && { where }) });
  }
}
