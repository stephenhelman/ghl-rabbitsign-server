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
  console.log(resp);

  console.log("GHL Response", {
    path,
    status: resp.status,
    ok: resp.ok,
    data,
  });

  return {
    ok: resp.ok,
    status: resp.status,
  };
};

module.exports = {
  updateOpportunityStage,
};
