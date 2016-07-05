export default function(server) {
  server.createList('manuscript', 15);
  server.createList('funder', 15);
  server.createList('institution', 15);
  let tags = server.createList('tag', 15);
  server.createList('venue', 15);
  server.createList('award', 15);
  server.createList('creative-work', 15, {tags});
}
