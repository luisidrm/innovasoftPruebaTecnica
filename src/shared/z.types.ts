import { z } from 'zod';

export const GenderSchema = z.enum(['M', 'F']);
export type Gender = z.infer<typeof GenderSchema>;

export const InterestSchema = z.object({
  id: z.string(),
  descripcion: z.string()
});
export type Interest = z.infer<typeof InterestSchema>;

export const ClientSchema = z.object({
  id: z.string(),
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  apellidos: z.string().min(1, 'Los apellidos son obligatorios'),
  identificacion: z.string().min(1, 'La identificación es obligatoria'),
  telefonoCelular: z.string().min(5, 'Teléfono celular inválido'),
  otroTelefono: z.string().optional(),
  direccion: z.string().min(1, 'La dirección es obligatoria'),
  fNacimiento: z.string().or(z.date()),
  fAfiliacion: z.string().or(z.date()),
  sexo: GenderSchema,
  resenaPersonal: z.string().min(1, 'La reseña es obligatoria'),
  imagen: z.string().optional(),
  interesesId: z.string(),
});
export type Client = z.infer<typeof ClientSchema>;

export const CreateClientDTOSchema = z.object({
  id: z.string(),
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  apellidos: z.string().min(1, 'Los apellidos son obligatorios'),
  identificacion: z.string().min(1, 'La identificación es obligatoria'),
  telefonoCelular: z.string().min(5, 'Teléfono celular inválido'),
  otroTelefono: z.string().optional(),
  direccion: z.string().min(1, 'La dirección es obligatoria'),
  fNacimiento: z.string().or(z.date()),
  fAfiliacion: z.string().or(z.date()),
  sexo: GenderSchema,
  resennaPersonal: z.string().min(1, 'La reseña es obligatoria'),
  imagen: z.string().optional(),
  interesesId: z.string(),
  usuarioId: z.string()
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

export const GENDER_OPTIONS: Gender[] = ['M', 'F'];