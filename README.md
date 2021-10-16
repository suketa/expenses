```
docker-compose up -d
docker-compose exec app bash
cd expenses-ui
amplify publish
cd ../

cd expenses-api
sam build
sam deploy --guided
```
