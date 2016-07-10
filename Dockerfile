FROM node:5

RUN mkdir -p /code
WORKDIR /code

COPY ./package.json /code/package.json
RUN npm install

COPY ./.bowerrc /code/.bowerrc
COPY ./bower.json /code/bower.json
RUN ./node_modules/bower/bin/bower install --allow-root --config.interactive=false

COPY ./ /code/

RUN ./node_modules/ember-cli/bin/ember build --env production

CMD ["node"]
