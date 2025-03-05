pipeline {
    agent any

   environment {
    IMAGE_NAME = "my-node-app"
    CONTAINER_NAME = "node-app-container"
    PORT = "3000"
    DOCKER_HOST = "unix:///var/run/docker.sock"
    // Remove DOCKER_CERT_PATH and DOCKER_TLS_VERIFY
    DOCKER_TLS_VERIFY=""
    DOCKER_CERT_PATH=""
}

    stages {
        stage('Checkout Code') {
            steps {
                // If your repo requires authentication, configure it in the job's SCM settings.
                checkout scm
            }
        }
        
        stage('Docker Login') {
    steps {
        script {
            withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', 
                                                usernameVariable: 'DOCKER_USER', 
                                                passwordVariable: 'DOCKER_PASS')]) {
                // Using single quotes and shell variable expansion prevents Groovy interpolation issues
                sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
            }
        }
    }
}

        
        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${IMAGE_NAME} ."
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                script {
                    sh "docker run --rm ${IMAGE_NAME} npm test"
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                script {
                    // Use the credentials again to tag and push the image to Docker Hub.
                    // This tags the image with your Docker Hub username and the repository name.
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', 
                                                        usernameVariable: 'DOCKER_USER', 
                                                        passwordVariable: 'DOCKER_PASS')]) {
                        sh "docker tag ${IMAGE_NAME} ${DOCKER_USER}/${IMAGE_NAME}:latest"
                        sh "docker push ${DOCKER_USER}/${IMAGE_NAME}:latest"
                    }
                }
            }
        }
    }
}
