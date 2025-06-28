// UsuarioEditarRequest.ts
export class UsuarioEditarRequest {
  pId: number;
  pIdRol: number;
  pIdLugar: number;
  pUsername: string;
  pPassword: string;
  pNombres: string;
  pApellidos: string;
  pSexo: string;
  pCel: string;
  pEmail: string;

  constructor(
    pId: number,
    pIdRol: number,
    pIdLugar: number,
    pUsername: string,
    pPassword: string,
    pNombres: string,
    pApellidos: string,
    pSexo: string,
    pCel: string,
    pEmail: string
  ) {
    this.pId = pId;
    this.pIdRol = pIdRol;
    this.pIdLugar = pIdLugar;
    this.pUsername = pUsername;
    this.pPassword = pPassword;
    this.pNombres = pNombres;
    this.pApellidos = pApellidos;
    this.pSexo = pSexo;
    this.pCel = pCel;
    this.pEmail = pEmail;
  }
}
