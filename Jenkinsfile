pipeline {
    agent any

   environment {
    IMAGE_NAME = "my-node-app"
    CONTAINER_NAME = "node-app-container"
    PORT = "3000"
    DOCKER_TLS_VERIFY = ""
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
        
        stage('Deploy Container') {
            steps {
                script {
                    sh "docker stop ${CONTAINER_NAME} || true"
                    sh "docker rm ${CONTAINER_NAME} || true"
                    sh "docker run -d -p ${PORT}:${PORT} --name ${CONTAINER_NAME} ${IMAGE_NAME}"
                }
            }
        }
    }
}
