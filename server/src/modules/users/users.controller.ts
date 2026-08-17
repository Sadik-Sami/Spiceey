import { Request, Response, NextFunction } from "express";
import { usersService } from "@/modules/users/users.service";
import { UpdateUserDto, UpdateUserRoleDto, FindOneUserDto } from "@/modules/users/dto/users.dto";
import { ForbiddenError } from "@/common/exceptions/app-errors";

function ensureOwnershipOrAdmin(req: Request, targetId: string) {
  const user = req.user;
  if (!user) throw new ForbiddenError("Unauthorized");
  if (user.id !== targetId && user.role !== "admin" && user.role !== "super_admin") {
    throw new ForbiddenError("You do not have permission to access this resource");
  }
}

export const usersController = {
  async findAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await usersService.findAll();
      res.json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const targetId = req.params.id as string;
      ensureOwnershipOrAdmin(req, targetId);
      
      const user = await usersService.getById(targetId);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const body = FindOneUserDto.parse(req.body);
      const user = await usersService.findOne(body);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const targetId = req.params.id as string;
      ensureOwnershipOrAdmin(req, targetId);

      const body = UpdateUserDto.parse(req.body);
      const updatedUser = await usersService.update(targetId, body);
      res.json({ success: true, data: updatedUser });
    } catch (error) {
      next(error);
    }
  },

  async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const body = UpdateUserRoleDto.parse(req.body);
      const updatedUser = await usersService.updateRole(req.params.id as string, body);
      res.json({ success: true, data: updatedUser });
    } catch (error) {
      next(error);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const deletedUser = await usersService.remove(req.params.id as string);
      res.json({ success: true, data: deletedUser });
    } catch (error) {
      next(error);
    }
  },
};
