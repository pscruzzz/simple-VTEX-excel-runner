const api = require('./api.js')
const data = require('./data.js')
const Excel = require('exceljs')

function populateExcelFile(data, worksheet){
  try{
    data.forEach((eachLine) => {
      worksheet.addRow({
        ...eachLine
      });
    });

    return

  } catch(e){
    console.log(e.message,'Persistencia de dados falhou')
    return e.message
  }
}

async function runner(eachSKU){
  try{
    const response = await api.get(`api/catalog/pvt/stockkeepingunit/${eachSKU}/file`)

    const responseData = await response.data

    return responseData

  } catch(e){
    console.log(e.message,'Runner falhou')
    return {
        Id: 'falhou',
        ArchiveId: 'falhou',
        SkuId: eachSKU,
        IsMain: 'falhou',
        Label: 'falhou'
    }
  }
}


async function main(){
  const skusArray = data

  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet('Response Data');

  worksheet.columns = [
    { header: 'Id', key: 'Id', width: 10 },
    { header: 'ArchiveId', key: 'ArchiveId', width: 10 },
    { header: 'SkuId', key: 'SkuId', width: 10},
    { header: 'Name', key: 'Name', width: 10 },
    { header: 'IsMain', key: 'IsMain', width: 10},
    { header: 'Label', key: 'Label', width: 10}
  ];


  await Promise.all(skusArray.map(async eachSKU => {
    const eachSKUResponseData = await runner(eachSKU)
    populateExcelFile(eachSKUResponseData, worksheet)

    return
  }))

  await workbook.xlsx.writeFile(`response-data-${+new Date()}.xlsx`);

  console.log('done :)')

  return 
}

main()