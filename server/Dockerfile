FROM node:20.7.0-alpine3.18 as base
WORKDIR /app
# Enable modern yarn
RUN corepack enable 

FROM base as builder
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install
COPY . ./
RUN yarn build

FROM base as runner
COPY --from=builder /app/dist ./dist
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn workspaces focus --production
EXPOSE 4000 
CMD ["yarn", "start:prod"]