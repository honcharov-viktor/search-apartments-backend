# search-apartments-backend

Main Instruction
========================================
### Install

create file with name ".env", copy .env.skell to created
```
docker-compose pull
docker-compose build --pull

docker-compose run backend npm i
```

Run
========================================
### Development

```
docker-compose up db backend
```
### Deployment to dev
   
```
docker-compose run backend npm install
docker-compose run backend npm run build
```

### Notes

#### Installing npm dependencies

All changes to `node_modules` should happen *inside* the containers. Install any new dependencies by inside the container. You can do this via `docker-compose run`, but it’s easier to just upadte a running container and avoid having to rebuild everything:

```
docker-compose run backend npm install <new_dependency>
```
