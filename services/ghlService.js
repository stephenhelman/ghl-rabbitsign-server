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
  const data = await resp.json().catch((err) => ("GHL API Error", err));

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

module.exports = {
  updateOpportunityStage,
};
