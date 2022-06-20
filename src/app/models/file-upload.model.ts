import { FileInterface } from "../interfaces/file.interface";

export class FileUpload implements FileInterface {
  public key!: string;
  public name!: string;
  public url!: string;

  constructor(public file: File) {}
}