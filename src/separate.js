const { safeCreateFolders, getFilesInFolder } = require("./folder");
const fs = require("fs/promises");

const EXTENSIONS = {
  ["imgs"]: ["jpeg", "jpg"],
  ["videos"]: ["mp4", "3gp"],
  ["others"]: [],
};

function getFileFolder(fileName) {
  const fileExtension = fileName.split(".").at(-1);
  const folder = Object.keys(EXTENSIONS).find((path) =>
    EXTENSIONS[path].includes(fileExtension)
  );
  return folder || "others";
}

async function separateFileByType(filesPath) {
  try {
    const files = await getFilesInFolder(filesPath);

    const filesInfo = files.map((fileName) => {
      const fileFolder = getFileFolder(fileName);
      const oldPath = `${filesPath}/${fileName}`;
      const newPath = `${filesPath}/${fileFolder}/${fileName}`;

      return { folder: fileFolder, oldPath, newPath };
    });

    const filesFolders = filesInfo.map(
      ({ folder }) => `${filesPath}/${folder}`
    );
    const filesFoldersWithoutDuplicated = new Set(filesFolders);

    const foldersToCreate = Array.from(filesFoldersWithoutDuplicated);
    await safeCreateFolders(foldersToCreate);

    await Promise.all(
      filesInfo.map(async ({ oldPath, newPath }) => {
        await fs.rename(oldPath, newPath);
      })
    );
  } catch {
    throw Error("Erro ao separar arquivos");
  }
}

module.exports = {
  separateFileByType,
};
