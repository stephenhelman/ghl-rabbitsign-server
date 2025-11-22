const { initializeGHL } = require("../utils/ghlUtil");

//updateOpportunityStage highLevel.opportunities.updateOpportunity.
const updateOpportunityStage = async (tenant, opportunityId, stageId) => {
  const ghl = initializeGHL(tenant);

  const resp = await ghl.opportunities.updateOpportunity(
    {
      id: opportunityId,
    },
    {
      pipelineStageId: stageId,
    }
  );
  const data = await resp.json().catch((err) => ("rabbit sign API error", err));

  console.log("GHL Response", {
    path,
    status: resp.status,
    ok: resp.ok,
    data,
  });

  return {
    ok: resp.ok,
    status: resp.status,
    data,
  };
};

//createCustomObject(signed_document) highLevel.objects.createObjectRecord

//relateCustomObject(signed_document => contact && signed_document => opportunity) highLevel.associations.createRelation

module.exports = { updateOpportunityStage };
