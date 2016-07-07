export default function(server) {
  let people = server.createList('person', 15);
  server.createList('manuscript', 15);
  server.createList('funder', 15);
  server.createList('institution', 15);
  let tags = server.createList('tag', 15);
  server.createList('venue', 15);
  server.createList('award', 15);
  server.createList('creative-work', 15, {tags});
}
