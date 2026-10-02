
pipeline {
    agent any

    triggers {
        pollSCM('H/2 * * * *')
    }

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        BACKEND_IMAGE = 'lognex-backend'
        FRONTEND_IMAGE = 'lognex-frontend'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Tests') {
            steps {
                dir('backend') {
                    sh 'mvn clean test'
                }
            }
        }

        stage('Frontend Install') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Backend Build') {
            steps {
                dir('backend') {
                    sh 'mvn package -DskipTests'
                }
            }
        }

        stage('Docker Build Backend') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'docker-hub-credentials',
                        usernameVariable: 'DOCKER_HUB_USERNAME',
                        passwordVariable: 'DOCKER_HUB_PASSWORD'
                    )
                ]) {
                    sh '''
                        set -eu
                        set +x

                        export DOCKER_CONFIG="$WORKSPACE/.docker"
                        mkdir -p "$DOCKER_CONFIG"

                        printf '%s' "$DOCKER_HUB_PASSWORD" |
                            docker login \
                            --username "$DOCKER_HUB_USERNAME" \
                            --password-stdin

                        docker build \
                            -t "$DOCKER_HUB_USERNAME/lognex-backend:$BUILD_NUMBER" \
                            -t "$DOCKER_HUB_USERNAME/lognex-backend:latest" \
                            ./backend
                    '''
                }
            }
        }

        stage('Flyway Migration Check') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'docker-hub-credentials',
                        usernameVariable: 'DOCKER_HUB_USERNAME',
                        passwordVariable: 'DOCKER_HUB_PASSWORD'
                    )
                ]) {
                    sh '''
                        set -eu
                        set +x

                        export DOCKER_CONFIG="$WORKSPACE/.docker"
                        mkdir -p "$DOCKER_CONFIG"

                        printf '%s' "$DOCKER_HUB_PASSWORD" |
                            docker login \
                            --username "$DOCKER_HUB_USERNAME" \
                            --password-stdin

                        DB_CONTAINER="lognex-flyway-db-${BUILD_NUMBER}"
                        APP_CONTAINER="lognex-flyway-app-${BUILD_NUMBER}"
                        NETWORK="lognex-flyway-${BUILD_NUMBER}"

                        cleanup() {
                            docker rm -f "$APP_CONTAINER" "$DB_CONTAINER" \
                                >/dev/null 2>&1 || true
                            docker network rm "$NETWORK" \
                                >/dev/null 2>&1 || true
                        }
                        trap cleanup EXIT

                        docker network create "$NETWORK"

                        docker run -d \
                            --name "$DB_CONTAINER" \
                            --network "$NETWORK" \
                            --network-alias postgres \
                            -e POSTGRES_DB=lognex \
                            -e POSTGRES_USER=lognex \
                            -e POSTGRES_PASSWORD=lognex \
                            postgres:16-alpine

                        attempt=0
                        until docker exec "$DB_CONTAINER" \
                            pg_isready -U lognex -d lognex \
                            >/dev/null 2>&1; do

                            attempt=$((attempt + 1))

                            if [ "$attempt" -ge 30 ]; then
                                docker logs "$DB_CONTAINER"
                                exit 1
                            fi

                            sleep 2
                        done

                        docker run -d \
                            --name "$APP_CONTAINER" \
                            --network "$NETWORK" \
                            -e SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/lognex \
                            -e SPRING_DATASOURCE_USERNAME=lognex \
                            -e SPRING_DATASOURCE_PASSWORD=lognex \
                            -e SERVER_PORT=8085 \
                            "$DOCKER_HUB_USERNAME/lognex-backend:$BUILD_NUMBER"

                        attempt=0
                        until docker exec "$APP_CONTAINER" \
                            curl --fail --silent \
                            http://127.0.0.1:8085/actuator/health \
                            >/dev/null; do

                            if [ "$(docker inspect \
                                --format='{{.State.Running}}' \
                                "$APP_CONTAINER" 2>/dev/null || true)" != "true" ]; then
                                docker logs "$APP_CONTAINER"
                                exit 1
                            fi

                            attempt=$((attempt + 1))

                            if [ "$attempt" -ge 60 ]; then
                                docker logs "$APP_CONTAINER"
                                exit 1
                            fi

                            sleep 2
                        done

                        echo 'Flyway migration and backend health check succeeded.'
                    '''
                }
            }
        }

        stage('Docker Build Frontend') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'docker-hub-credentials',
                        usernameVariable: 'DOCKER_HUB_USERNAME',
                        passwordVariable: 'DOCKER_HUB_PASSWORD'
                    )
                ]) {
                    sh '''
                        set -eu
                        set +x

                        export DOCKER_CONFIG="$WORKSPACE/.docker"
                        mkdir -p "$DOCKER_CONFIG"

                        printf '%s' "$DOCKER_HUB_PASSWORD" |
                            docker login \
                            --username "$DOCKER_HUB_USERNAME" \
                            --password-stdin

                        docker build \
                            -t "$DOCKER_HUB_USERNAME/lognex-frontend:$BUILD_NUMBER" \
                            -t "$DOCKER_HUB_USERNAME/lognex-frontend:latest" \
                            ./frontend
                    '''
                }
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'docker-hub-credentials',
                        usernameVariable: 'DOCKER_HUB_USERNAME',
                        passwordVariable: 'DOCKER_HUB_PASSWORD'
                    )
                ]) {
                    sh '''
                        set -eu
                        set +x

                        export DOCKER_CONFIG="$WORKSPACE/.docker"
                        mkdir -p "$DOCKER_CONFIG"

                        printf '%s' "$DOCKER_HUB_PASSWORD" |
                            docker login \
                            --username "$DOCKER_HUB_USERNAME" \
                            --password-stdin

                        docker push "$DOCKER_HUB_USERNAME/lognex-backend:$BUILD_NUMBER"
                        docker push "$DOCKER_HUB_USERNAME/lognex-backend:latest"

                        docker push "$DOCKER_HUB_USERNAME/lognex-frontend:$BUILD_NUMBER"
                        docker push "$DOCKER_HUB_USERNAME/lognex-frontend:latest"
                    '''
                }
            }
        }

        stage('Deploy Backend to Render') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'render-deploy-hook',
                        variable: 'RENDER_HOOK'
                    )
                ]) {
                    sh '''
                        set -eu
                        set +x

                        curl --fail --silent --show-error \
                            --request POST "$RENDER_HOOK"

                        echo 'Render deployment trigger sent successfully.'
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'LOGNEX CI/CD pipeline completed successfully.'
        }

        failure {
            echo 'LOGNEX pipeline failed. Check the stage logs before deploying.'
        }

        always {
            cleanWs()
        }
    }
}
