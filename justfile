build:
    cd backend && mvn clean install && cd -
    cd frontend && pnpm run build && cd -

test:
    cd backend && mvn test && cd -
    cd frontend && pnpm test && cd -

setup:
    cd frontend
    pnpm install
    npx husky install
    cd -
    cd backend
    mvn install
    cd -