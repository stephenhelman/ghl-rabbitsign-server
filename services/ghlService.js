//all GoHighLevel API calls (using SDK)

const { HighLevel } = require("@gohighlevel/api-client");

const highLevel = new HighLevel({
  clientId: "",
  clientSecret: "",
});

//updateOpportunityStage highLevel.opportunities.updateOpportunity.

//createCustomObject(signed_document) highLevel.objects.createObjectRecord

//relateCustomObject(signed_document => contact && signed_document => opportunity) highLevel.associations.createRelation
