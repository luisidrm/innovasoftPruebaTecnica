import { ClientSchema, type Client } from "../shared/z.types";

export function mapClientBackendToClientSchema(data: any): Client {
  return ClientSchema.parse({
    id: data.id,
    firstName: data.nombre,
    lastName: data.apellidos,
    identification: data.identificacion,
    cellPhone: data.telefonoCelular,
    otherPhone: data.otroTelefono,
    address: data.direccion,
    dateOfBirth: data.fNacimiento,
    affiliationDate: data.fAfiliacion,
    gender: data.sexo === "M" ? "Masculino" : "Femenino",
    personalBio: data.resenaPersonal,
    image: data.imagen,
    interests: Array.isArray(data.interesesId)
      ? data.interesesId.map((i: string) => ({ id: i, descripcion: "" }))
      : [{ id: data.interesesId, descripcion: "" }],
  });
}
