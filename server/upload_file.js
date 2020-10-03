const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const md5 = require("md5");

const _UPLOAD_PATH = "./upload_file";

fs.mkdirSync(_UPLOAD_PATH, { recursive: true });

const upload_file = async (ctx) => {
  const file = ctx.request.files.upload;
  const buf = await fs.promises.readFile(file.path);
  const hash = md5(buf);

  let uploadFolder = _.get(ctx, ["request", "header", "upload-folder"]);
  let editor = _.get(ctx, ["request", "header", "upload-editor"]);
  editor = editor.length > 0 ? editor : "none"
  uploadFolder = path.join(uploadFolder === "root" ? "" : uploadFolder, editor, hash);

  const folderPath = path.join(_UPLOAD_PATH, uploadFolder);
  await fs.promises.mkdir(folderPath, { recursive: true });
  await fs.promises.writeFile(path.join(folderPath, file.name), buf);

  return {
    file: path.join(uploadFolder, file.name),
    editor: editor
  };
};

module.exports = {
  upload_file,
  _UPLOAD_PATH,
};
