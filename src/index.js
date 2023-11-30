const { getFoldersInFolder } = require("./folder");
const { organizeFilesByDate } = require("./organize");
const { separateFileByType } = require("./separate");

const filesPath = `${__dirname}/../arquivos`;

async function init() {
  try {
    await separateFileByType(filesPath);

    const foldersToOrganize = await getFoldersInFolder(filesPath);

    await Promise.all(
      foldersToOrganize.map(async (folderName) => {
        const folderPath = `${filesPath}/${folderName}`;

        await organizeFilesByDate(folderPath);
      })
    );

    console.log("Sucesso ao organizar arquivos");
  } catch (error) {
    console.log(error.message);
  }
}

init();
