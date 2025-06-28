// UsuarioRequest.ts
export class UsuarioRequest {
    pIdRol?: number;
    pIdLugar?: number;
    pUsername: string;
    pPassword: string;
    pNombres: string;
    pApellidos: string;
    pSexo: string;
    pCel: string;
    pEmail: string;
  
    constructor(
      pUsername: string,
      pPassword: string,
      pNombres: string,
      pApellidos: string,
      pSexo: string,
      pCel: string,
      pEmail: string
    ) { 
      this.pUsername = pUsername;
      this.pPassword = pPassword;
      this.pNombres = pNombres;
      this.pApellidos = pApellidos;
      this.pSexo = pSexo;
      this.pCel = pCel;
      this.pEmail = pEmail;
    }
  }
  