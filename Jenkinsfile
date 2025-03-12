pipeline {
    agent any

    environment {
        IMAGE_NAME = "my-node-app"
        PORT = "3000"
        DOCKER_HOST = "unix:///var/run/docker.sock"
        JIRA_URL = "https://your-jira-instance.atlassian.net"
        JIRA_ISSUE = "PROJ-123"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/your-repo.git'
            }
        }
        
        stage('Docker Login') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', 
                                                      usernameVariable: 'DOCKER_USER', 
                                                      passwordVariable: 'DOCKER_PASS')]) {
                        sh '''
                        if [ -z "$DOCKER_PASS" ]; then 
                            echo "Docker password missing"; 
                            exit 1; 
                        fi
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        '''
                    }
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${DOCKER_USER}/${IMAGE_NAME}:latest ."
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                script {
                    sh "docker run --rm ${DOCKER_USER}/${IMAGE_NAME}:latest npm test"
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', 
                                                      usernameVariable: 'DOCKER_USER', 
                                                      passwordVariable: 'DOCKER_PASS')]) {
                        sh '''
                        docker tag ${DOCKER_USER}/${IMAGE_NAME}:latest ${DOCKER_USER}/${IMAGE_NAME}:latest
                        docker push ${DOCKER_USER}/${IMAGE_NAME}:latest
                        '''
                    }
                }
            }
        }
        
        stage('Update Jira') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'jira-credentials',
                                                      usernameVariable: 'JIRA_USER',
                                                      passwordVariable: 'JIRA_PASS')]) {
                        sh '''
                        curl -X POST -H "Content-Type: application/json" \
                             -u "$JIRA_USER:$JIRA_PASS" \
                             --data '{"body": "Build, tests, and Docker Hub push for image ${IMAGE_NAME} were successful."}' \
                             ${JIRA_URL}/rest/api/2/issue/${JIRA_ISSUE}/comment
                        '''
                    }
                }
            }
        }
    }
    
    post { 
        always { 
            script {
                jiraSendDeploymentInfo environmentId: 'us-prod-1', 
                                       environmentName: 'us-prod-1', 
                                       environmentType: 'production'
            }
        } 
    }
}
