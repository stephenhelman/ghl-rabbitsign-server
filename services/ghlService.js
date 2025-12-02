const { initializeGHL } = require("../utils/ghlUtil");
const { decryptSecret } = require("../utils/cryptoUtil");

//updateOpportunityStage highLevel.opportunities.updateOpportunity.
const updateOpportunityStage = async (
  tenant,
  opportunityId,
  stageId,
  folderId
) => {
  const ghl = initializeGHL(tenant);

  const resp = await ghl.opportunities.updateOpportunity(
    {
      id: opportunityId,
    },
    {
      pipelineStageId: stageId,
      customFields: [
        {
          id: "05fp6qozdrXUpPa6dlFD",
          field_value: folderId,
        },
      ],
    }
  );

  console.log("GHL Response", {
    status: resp.status,
    ok: resp.ok,
    data: resp,
  });

  return {
    data: resp,
  };
};

const createSignedDocument = async (tenant, title, pdfUrl) => {
  const ghl = initializeGHL(tenant);
  const resp = await ghl.objects.createObjectRecord(
    {
      schemaKey: "custom_objects.signed_documents",
    },
    {
      locationId: tenant.ghlLocationId,
      properties: {
        name: title,
        pdf: [
          {
            url: pdfUrl,
          },
        ],
      },
    }
  );
  return {
    data: resp,
  };
};

const uploadPdf = async (tenant, fileName, pdfBuffer) => {
  const apiKey = decryptSecret(tenant.ghlApiKey);
  const locationId = tenant.ghlLocationId;

  const url = `https://services.leadconnectorhq.com/medias/upload-file?locationId=${encodeURIComponent(
    locationId
  )}`;

  const form = new FormData();
  const pdfBlob = new Blob([pdfBuffer], { type: "application/pdf" });
  form.append("file", pdfBlob, fileName);

  // These fields are optional but recommended
  form.append("fileName", fileName || "signed-document.pdf");
  form.append("mimeType", "application/pdf");

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Version: "2021-07-28",
      Accept: "application/json",
    },
    body: form,
  });

  const text = await resp.text();

  if (!resp.ok) {
    throw new Error(`GHL media upload failed ${resp.status}: ${text}`);
  }

  let json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    console.error("Upload returned non-JSON:", text);
    throw new Error("Upload did not return valid JSON");
  }

  // Log once to confirm shape
  console.log("GHL medias/upload-file JSON:", json);

  // Normalize – handle both flat and nested shapes just in case
  const fileId = json.fileId || json.id;
  const fileUrl = json.url || json.fileUrl;
  const traceId = json.traceId;

  if (!fileUrl) {
    throw new Error(
      `Upload response did not contain a URL. JSON: ${JSON.stringify(json)}`
    );
  }

  return {
    fileId,
    url: fileUrl,
    traceId,
    raw: json,
  };
};

const relateSignedDocToContact = async (tenant, contactId, documentId) => {
  const ghl = initializeGHL(tenant);

  const response = await ghl.associations.createRelation({
    locationId: tenant.ghlLocationId,
    associationId: "692341f73f5c3b5f70064b2b",
    firstRecordId: contactId,
    secondRecordId: documentId,
  });

  console.log("Add relation for contact", response);
};

const relateSignedDocToOpportunity = async (
  tenant,
  opportunityId,
  documentId
) => {
  const ghl = initializeGHL(tenant);

  const response = await ghl.associations.createRelation({
    locationId: tenant.ghlLocationId,
    associationId: "69234225c81992910e445276",
    firstRecordId: documentId,
    secondRecordId: opportunityId,
  });

  console.log("Add relation for opportunity", response);
};

module.exports = {
  updateOpportunityStage,
  createSignedDocument,
  uploadPdf,
  relateSignedDocToContact,
  relateSignedDocToOpportunity,
};
