//find document in database -> get folder from rabbitsign -> download pdf -> upload to ghl
const documentService = require("../services/documentService");
const ghlService = require("../services/ghlService");
const downloadService = require("../services/downloadService");

const finalizeController = async (req, res, next) => {
  const tenant = req.tenant;
  const tenantId = tenant._id;
  const folderId = req.body.customData.folderId;
  //1. get pdf formdata. Download PDF from Rabbitsign, pick out the correct pdf, return that data
  const pdfDataFromRabbitSign = await downloadService.buildPdfFromRabbitFolder(
    tenant,
    folderId
  );

  const { fileName, pdfBuffer, title } = pdfDataFromRabbitSign;

  //2. Upload the pdf to storage to get the file url
  const pdfUpload = await ghlService.uploadPdf(tenant, fileName, pdfBuffer);

  const { url } = pdfUpload;

  //3. create the signed document record
  const newSignedDoc = await ghlService.createSignedDocument(
    tenant,
    title,
    url
  );
  const { id: signedDocId } = newSignedDoc.data.record;

  //4. Get document from database to get relation info
  const documentFromDatabase = await documentService.getDocumentsByFolder(
    tenantId,
    folderId
  );

  const { contactId, opportunityId } = documentFromDatabase[0].relations;
  //5. associate the contact and record

  await ghlService.relateSignedDocToContact(tenant, contactId, signedDocId);

  //6. associate the opp and the record
  await ghlService.relateSignedDocToOpportunity(
    tenant,
    opportunityId,
    signedDocId
  );

  return res.status(201).json({ message: "All items complete" });
};

module.exports = { finalizeController };
