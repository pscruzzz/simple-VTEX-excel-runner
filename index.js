const api = require('./api.js')
const data = require('./inputData.js')
const Excel = require('exceljs')
const inputColums = require('./inputColums.js')

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

  worksheet.columns = inputColums


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