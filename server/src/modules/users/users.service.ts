import { db } from "@/db";
import { user } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { UpdateUserDto, UpdateUserRoleDto, FindOneUserDto } from "@/modules/users/dto/users.dto";
import { NotFoundError } from "@/common/exceptions/app-errors";

export const usersService = {
  async findAll() {
    return db.query.user.findMany();
  },

  async getById(id: string) {
    const foundUser = await db.query.user.findFirst({
      where: eq(user.id, id),
    });

    if (!foundUser) {
      throw new NotFoundError("User not found");
    }

    return foundUser;
  },

  async findOne(data: FindOneUserDto) {
    const conditions = [];
    if (data.email) conditions.push(eq(user.email, data.email));
    if (data.phone) conditions.push(eq(user.phone, data.phone));

    const foundUser = await db.query.user.findFirst({
      where: or(...conditions),
    });

    if (!foundUser) {
      throw new NotFoundError("User not found matching the given criteria");
    }

    return foundUser;
  },

  async update(id: string, data: UpdateUserDto) {
    const [updated] = await db
      .update(user)
      .set(data)
      .where(eq(user.id, id))
      .returning();

    if (!updated) {
      throw new NotFoundError("User not found");
    }

    return updated;
  },

  async updateRole(id: string, data: UpdateUserRoleDto) {
    const [updated] = await db
      .update(user)
      .set({ role: data.role })
      .where(eq(user.id, id))
      .returning();

    if (!updated) {
      throw new NotFoundError("User not found");
    }

    return updated;
  },

  async remove(id: string) {
    const [deleted] = await db
      .delete(user)
      .where(eq(user.id, id))
      .returning();

    if (!deleted) {
      throw new NotFoundError("User not found");
    }

    return deleted;
  },
};
