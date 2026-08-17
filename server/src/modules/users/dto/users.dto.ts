import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { user } from '@/db/schema';
import { z } from 'zod';

export const CreateUserDto = createInsertSchema(user).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	emailVerified: true,
	role: true,
});
export type CreateUserDto = z.infer<typeof CreateUserDto>;

export const UpdateUserDto = createUpdateSchema(user).omit({
	id: true,
	email: true,
	emailVerified: true,
	createdAt: true,
	updatedAt: true,
	role: true,
});
export type UpdateUserDto = z.infer<typeof UpdateUserDto>;

export const UpdateUserRoleDto = z.object({
	role: z.enum(['customer', 'admin', 'super_admin']),
});
export type UpdateUserRoleDto = z.infer<typeof UpdateUserRoleDto>;

export const FindOneUserDto = z
	.object({
		email: z.email().optional(),
		phone: z.string().optional(),
	})
	.refine((data) => data.email || data.phone, {
		message: 'Either email or phone must be provided to search for a user.',
	});
export type FindOneUserDto = z.infer<typeof FindOneUserDto>;
