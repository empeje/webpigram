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

# Run backend with default configuration (FortuneLoader disabled)
dev-backend:
    cd backend && ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Run backend with FortuneLoader enabled
dev-backend-with-fortune:
    cd backend && ./mvnw spring-boot:run -Dspring-boot.run.arguments="--app.fortune-loader.enabled=true" -Dspring-boot.run.profiles=dev

# Run frontend development server
run-frontend:
    cd frontend && pnpm run dev

# Run both backend and frontend (FortuneLoader disabled)
run:
    just run-backend & just run-frontend