const { v4: uuidV4 } = require("uuid");
const { safeCreateFolders, getFilesInFolder } = require("./folder");
const fs = require("fs/promises");

const FILES_TYPE = {
  ["IMG"]: ["jpeg", "jpg"],
  ["VIDEO"]: ["mp4", "3gp"],
  ["OTHER"]: [],
};

const dateRegex = /(\d{8})|(\d{4}-\d{2}-\d{2})/gi;

const extractFileYear = (fileName) => fileName.match(/\d{4}/gi).at(0);

function renameFile(fileName) {
  const fileDate = fileName.match(dateRegex).at(0)?.replace(/\D/gi, "");
  const formattedFileDate = fileDate.replace(
    /(\d{4})(\d{2})(\d{2})/gi,
    "$1-$2-$3"
  );

  const fileExtension = fileName.split(".").at(-1);

  const fileType =
    Object.keys(FILES_TYPE).find((path) =>
      FILES_TYPE[path].includes(fileExtension)
    ) || "OTHER";

  const newFileName = `${fileType}_${formattedFileDate}_${uuidV4()}.${fileExtension}`;
  return newFileName;
}

async function organizeFilesByDate(filesPath) {
  try {
    const files = await getFilesInFolder(filesPath);

    const filesInfo = files.map((oldFileName) => {
      const fileYear = extractFileYear(oldFileName);
      const newFileName = renameFile(oldFileName);

      const newPath = `${filesPath}/${fileYear}/${newFileName}`;
      const oldPath = `${filesPath}/${oldFileName}`;

      return {
        oldPath,
        newPath,
        year: fileYear,
      };
    });

    const filesYearsFolders = filesInfo.map(
      ({ year }) => `${filesPath}/${year}`
    );

    const filesYearsFoldersWithoutDuplicated = new Set(filesYearsFolders);
    const foldersToCreate = Array.from(filesYearsFoldersWithoutDuplicated);

    await safeCreateFolders(foldersToCreate);

    await Promise.all(
      filesInfo.map(async ({ oldPath, newPath }) => {
        await fs.rename(oldPath, newPath);
      })
    );
  } catch {
    throw Error("Erro ao categorizar arquivos por data");
  }
}

module.exports = {
  organizeFilesByDate,
};
