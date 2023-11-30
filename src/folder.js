const fs = require("fs/promises");
const path = require("path");

async function safeCreateFolders(foldersPath) {
  await Promise.all(
    foldersPath.map(async (folderPath) => {
      try {
        await fs.mkdir(folderPath);
      } catch {
        return;
      }
    })
  );
}

async function getFilesInFolder(folderPath) {
  try {
    const filesAndFolders = await fs.readdir(folderPath);

    const files = filesAndFolders.filter(
      (fileOrFolderName) => !!path.extname(fileOrFolderName)
    );

    return files;
  } catch {
    throw Error(`Erro ao obter arquivos da pasta ${folderPath}`);
  }
}

async function getFoldersInFolder(folderPath) {
  try {
    const filesAndFolders = await fs.readdir(folderPath);

    const folders = filesAndFolders.filter(
      (fileOrFolderName) => !path.extname(fileOrFolderName)
    );

    return folders;
  } catch {
    throw Error(`Erro ao obter arquivos da pasta ${folderPath}`);
  }
}

module.exports = {
  safeCreateFolders,
  getFilesInFolder,
  getFoldersInFolder,
};
