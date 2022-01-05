import java.security.MessageDigest

def dockerTag
def gitCommit

node {

  stage('Checkout') {
    deleteDir()
    checkout scm
  }

  stage('Build') {
    String fileContents = readFile 'infrastructure/ansible/build/Dockerfile'
    dockerTag = MessageDigest.getInstance("MD5").digest(fileContents.bytes).encodeHex().toString()
    gitCommit = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
    sh '$(aws --region eu-west-1 ecr get-login)'
    def app = docker.build('567828013335.dkr.ecr.eu-west-1.amazonaws.com/infra-ci:' + dockerTag, '--pull -f infrastructure/ansible/build/Dockerfile .')
    app.push dockerTag
  }

  stage ('Test') {
    docker.image('567828013335.dkr.ecr.eu-west-1.amazonaws.com/infra-ci:' + dockerTag).inside {
      sh '/usr/local/bin/entrypoint.sh && \
        cd infrastructure/ansible && \
        ansible-playbook test_stacks.yml \
        -i inventories/beta \
        -e "branch=' + BRANCH_NAME + '" \
        -e "commit=' + gitCommit + '" && \
        ansible-playbook test_stacks.yml \
        -i inventories/prod \
        -e "branch=' + BRANCH_NAME + '" \
        -e "commit=' + gitCommit + '"'
    }
  }

  if (BRANCH_NAME == "develop") {
    stage('Deploy Beta') {
      docker.image('567828013335.dkr.ecr.eu-west-1.amazonaws.com/infra-ci:' + dockerTag).inside {
        sh '/usr/local/bin/entrypoint.sh && \
          cd infrastructure/ansible && \
          ansible-playbook create_stacks.yml \
          -i inventories/beta \
          -e "branch=' + BRANCH_NAME + '" \
          -e "commit=' + gitCommit + '"'
      }
    }
  }

  if (BRANCH_NAME == "master") {
    stage('Deploy Prod') {
      docker.image('567828013335.dkr.ecr.eu-west-1.amazonaws.com/infra-ci:' + dockerTag).inside {
        sh '/usr/local/bin/entrypoint.sh && \
          cd infrastructure/ansible && \
          ansible-playbook create_stacks.yml \
          -i inventories/prod \
          -e "branch=' + BRANCH_NAME + '" \
          -e "commit=' + gitCommit + '"'
      }
    }
  }

  stage('Clean') {
    sh 'docker rm -v $(docker ps --filter status=exited -q 2>/dev/null) 2>/dev/null || echo "No Docker containers to remove"'
    sh 'docker rmi $(docker images --filter dangling=true -q --no-trunc 2>/dev/null) 2>/dev/null || echo "No Docker images to remove"'
    sh 'docker volume rm $(docker volume ls -qf dangling=true 2>/dev/null) 2>/dev/null || echo "No Docker volumes to remove"'
  }
}
