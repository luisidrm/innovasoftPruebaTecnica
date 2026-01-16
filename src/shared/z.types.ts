import { z } from 'zod';

export const GenderSchema = z.enum(['Masculino', 'Femenino']);
export type Gender = z.infer<typeof GenderSchema>;

export const InterestSchema = z.object({
  id: z.string(),
  name: z.string()
});
export type Interest = z.infer<typeof InterestSchema>;

export const ClientSchema = z.object({
  id: z.string(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  identification: z.string().min(1, 'Identification is required'),
  cellPhone: z.string().min(10, 'Valid cell phone is required'),
  otherPhone: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  dateOfBirth: z.string().or(z.date()),
  affiliationDate: z.string().or(z.date()),
  gender: GenderSchema,
  personalBio: z.string().min(1, 'Personal bio is required'),
  image: z.string().optional(),
  interests: z.array(InterestSchema)
});
export type Client = z.infer<typeof ClientSchema>;

export const CreateClientDTOSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  identification: z.string().min(1, 'Identification is required'),
  cellPhone: z.string().min(10, 'Valid cell phone is required'),
  otherPhone: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: GenderSchema,
  personalBio: z.string().min(1, 'Personal bio is required'),
  image: z.string().optional(),
  interests: z.array(z.string()).min(1, 'At least one interest is required')
});
export type CreateClientDTO = z.infer<typeof CreateClientDTOSchema>;

export const UpdateClientDTOSchema = CreateClientDTOSchema.partial().extend({
  id: z.string()
});
export type UpdateClientDTO = z.infer<typeof UpdateClientDTOSchema>;

export const ClientResponseSchema = z.object({
  success: z.boolean(),
  data: ClientSchema,
  message: z.string().optional()
});
export type ClientResponse = z.infer<typeof ClientResponseSchema>;

export const ClientsListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(ClientSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number()
});
export type ClientsListResponse = z.infer<typeof ClientsListResponseSchema>;

export const GENDER_OPTIONS: Gender[] = ['Masculino', 'Femenino'];