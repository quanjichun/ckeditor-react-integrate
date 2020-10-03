import _ from "lodash";

import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import imageIcon from "@ckeditor/ckeditor5-core/theme/icons/image.svg";
import FileDialogButtonView from "@ckeditor/ckeditor5-upload/src/ui/filedialogbuttonview";
import FileRepository from "@ckeditor/ckeditor5-upload/src/filerepository";
import Notification from "@ckeditor/ckeditor5-ui/src/notification/notification";
import Command from "@ckeditor/ckeditor5-core/src/command";
import { findOptimalInsertionPosition } from '@ckeditor/ckeditor5-widget/src/utils';

const _UPLOAD_FILE_LIMIT = 50000000;

const createImageTypeRegExp = (types) => {
  // Sanitize the MIME type name which may include: "+", "-" or ".".
  const regExpSafeNames = types.map((type) => type.replace("+", "\\+"));

  return new RegExp(`^image\\/(${regExpSafeNames.join("|")})$`);
};

class FileUploadCommand extends Command {
  /**
   * Executes the command.
   *
   * @fires execute
   * @param {Object} options Options for the executed command.
   * @param {File|Array.<File>} options.file The image file or an array of image files to upload.
   */
  execute(options) {
    const editor = this.editor;
    const model = editor.model;

    const fileRepository = editor.plugins.get(FileRepository);
    const notification = editor.plugins.get(Notification);

    model.change((writer) => {
      const filesToUpload = Array.isArray(options.file)
        ? options.file
        : [options.file];

      for (const file of filesToUpload) {
        console.log(file);
        if (file.size > _UPLOAD_FILE_LIMIT) {
          notification.showWarning("Can not upload files larger than 50MB");
          return;
        }
        uploadFile(writer, model, fileRepository, file);
      }
    });
  }
}

// Handles uploading single file.
//
// @param {module:engine/model/writer~writer} writer
// @param {module:engine/model/model~Model} model
// @param {File} file
function uploadFile(writer, model, fileRepository, file) {
  const loader = fileRepository.createLoader(file);

  if (!loader) {
    return;
  }

  loader
    .read()
    .then(() => loader.upload())
    .then((data) => {
      const attributes = {
        linkHref: data.default,
        titleTarget: data.editor ? data.editor : ""
      }

      console.log(data.default);

      const fileElement = writer.createText(file.name, attributes);

      const insertAtSelection = findOptimalInsertionPosition(
        model.document.selection,
        model
      );

      model.insertContent(fileElement, insertAtSelection);
    });
}

class Uploader extends Plugin {
  init() {
    const editor = this.editor;
    editor.commands.add("fileUpload", new FileUploadCommand(editor));

    editor.ui.componentFactory.add("insertFileAndImage", (locale) => {
      const view = new FileDialogButtonView(locale);
      const imageTypes = editor.config.get("image.upload.types");
      const imageTypesRegExp = createImageTypeRegExp(imageTypes);

      view.buttonView.set({
        label: "Insert image and file",
        icon: imageIcon,
        tooltip: true,
      });

      view.on("done", (evt, files) => {
        const [imagesToUpload, filesToUpload] = _.partition(files, (file) =>
          imageTypesRegExp.test(file.type)
        );

        if (imagesToUpload.length) {
          editor.execute("imageUpload", { file: imagesToUpload });
        }

        if (filesToUpload.length) {
          editor.execute("fileUpload", { file: filesToUpload });
        }
      });

      return view;
    });
  }
}

export default Uploader;
