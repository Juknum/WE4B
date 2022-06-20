import { Injectable } from "@angular/core";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/compat/database";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { finalize } from 'rxjs';
import { FileUpload } from "../models/file-upload.model";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  basePath: string = 'uploads';

  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage,
  ) {}

  setBasePath(basePath: string): void {
    this.basePath = basePath;
  }

  pushFileToStorage(fileUpload: FileUpload, callback?: () => void) {
    const path = `${this.basePath}/${fileUpload.file.name}`;
    const ref = this.storage.ref(path);
    const task = this.storage.upload(path, fileUpload.file);

    task.snapshotChanges().pipe(finalize(() => {
      ref.getDownloadURL().subscribe((url) => {
        fileUpload.url = url;
        fileUpload.name = fileUpload.file.name;
        this.saveFileData(fileUpload);
        if (callback) callback();
      });
    })).subscribe();

    return task.percentageChanges();
  }

  private saveFileData(fileUpload: FileUpload): void {
    this.db.list(this.basePath).push(fileUpload);
  }

  getFiles(numberItems: number): AngularFireList<FileUpload> {
    return this.db.list(this.basePath, ref => ref.limitToLast(numberItems));
  }

  deleteFile(fileUpload: FileUpload): void {
    this.deleteFileDatabase(fileUpload.key)
      .then(() => this.deleteFileStorage(fileUpload.name))
      .catch(console.error);
  }

  private async deleteFileDatabase(key: string): Promise<void> {
    return this.db.list(this.basePath).remove(key);
  }

  private deleteFileStorage(name: string): void {
    const ref = this.storage.ref(this.basePath);
    ref.child(name).delete();
  }
}