// Contains all mappings relating to ShareObjects

export const ICON_MAP = Object.freeze({
    Consortium: 'fa-users',
    Institution: 'fa-university',
    Organization: 'fa-building',
    Person: 'fa-user-circle-o',
});

export const RELATION_MAP = Object.freeze({
    Creator: 'contributor',
    Contributor: 'contributor',
    Publisher: 'publisher',
});

export const CONTROLLER_MAP = Object.freeze({
    Agent: 'agent',
    'Creative Work': 'work',
    // Person: 'person',
});

export const PAGE_FRAGMENT_MAP = Object.freeze({
    AbstractAgent: {
        relatedWorks: (offset) => `
          relatedWorks(offset:${offset | 0}) {
            type: __typename
            creativeWork { id, type: __typename, title }
          }
        `,
        incomingAgentRelations: (offset) => `
          incomingAgentRelations(offset:${offset | 0}) {
            type: __typename
            subject { id, type: __typename, name }
          }
        `,
        outgoingAgentRelations: (offset) => `
          outgoingAgentRelations(offset:${offset | 0}) {
            type: __typename
            related { id, type: __typename, name }
          }
        `,
    },
    AbstractCreativeWork: {
        incomingWorkRelations: (offset) => `
          incomingWorkRelations(offset:${offset | 0}) {
            type: __typename
            subject { id, type: __typename, title }
          }
        `,
        outgoingWorkRelations: (offset) => `
          outgoingWorkRelations(offset:${offset | 0}) {
            type: __typename
            related { id, type: __typename, title }
          }
        `,
        relatedAgents: (offset) => `
          relatedAgents(offset:${offset | 0}) {
            type: __typename,
            citedAs,
            agent { id, type: __typename, name }
          }
        `
    }
});

// GraphQL fragments that dictate the default attributes
// loaded for a given type in the detail route
export const FRAGMENT_MAP = Object.freeze({
    AbstractCreativeWork: `{
      title,
      description,

      tags { name },
      identifiers { scheme, host, uri },

      ${PAGE_FRAGMENT_MAP.AbstractCreativeWork.relatedAgents()},
      ${PAGE_FRAGMENT_MAP.AbstractCreativeWork.incomingWorkRelations()},
      ${PAGE_FRAGMENT_MAP.AbstractCreativeWork.outgoingWorkRelations()},
    }`,

    AbstractAgent: `{
      name,
      identifiers { scheme, host, uri },
      totalRelatedWorks,
      ${PAGE_FRAGMENT_MAP.AbstractAgent.relatedWorks()},
      ${PAGE_FRAGMENT_MAP.AbstractAgent.outgoingAgentRelations()},
    }`,
});
