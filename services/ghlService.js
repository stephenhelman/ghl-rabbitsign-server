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

  console.log("GHL Response", {
    status: resp.status,
    ok: resp.ok,
    data: resp,
  });

  return {
    ok: resp.ok,
    status: resp.status,
    data: resp,
  };
};

module.exports = {
  updateOpportunityStage,
};
