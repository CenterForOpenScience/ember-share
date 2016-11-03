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

// GraphQL fragments that dictate the default attributes
// loaded for a given type in the detail route
export const FRAGMENT_MAP = Object.freeze({
    AbstractCreativeWork: `{
      title,
      description,

      tags { name },
      identifiers { scheme, host, uri },

      relatedAgents {
        type: __typename,
        citedAs,
        agent { id, type: __typename, name }
      }
    }`,

    AbstractAgent: `{
      name,
      identifiers { scheme, host, uri },
    }`,

    Person: `{
      relatedWorks {
        type: __typename
        creativeWork { id, type: __typename, title }
      }
    }`,
});
