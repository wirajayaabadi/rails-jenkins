pipeline {
  agent any

  environment {
    REGISTRY      = "wiraaji2301"
    IMAGE_NAME    = "myapp-amd64"
    DOCKER_CRED   = "dockerhub-creds"
    GIT_CRED      = "github-creds"
    DOCKER_BUILDKIT = "1"
  }

  stages {
    stage('Clone repo') {
      steps {
        git credentialsId: env.GIT_CRED, url: 'https://github.com/wirajayaabadi/rails-jenkins.git', branch: 'main'
      }
    }

    stage('Build docker image') {
      steps {
        script {
          def commit = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
          env.IMG_TAG = "build-${env.BUILD_NUMBER}-${commit}"
        }
        sh """
          docker build --platform=linux/amd64 -t ${REGISTRY}/${IMAGE_NAME}:${IMG_TAG} .
        """
      }
    }

    stage('Push docker') {
      steps {
        script {
          withCredentials([usernamePassword(credentialsId: DOCKER_CRED, usernameVariable: 'USER', passwordVariable: 'PASS')]) {
            try {
              sh """
                echo "\$PASS" | docker login -u "\$USER" --password-stdin
                docker push ${REGISTRY}/${IMAGE_NAME}:${IMG_TAG}
                # optional: jaga tag penanda stabil
                docker tag ${REGISTRY}/${IMAGE_NAME}:${IMG_TAG} ${REGISTRY}/${IMAGE_NAME}:latest
                docker push ${REGISTRY}/${IMAGE_NAME}:latest || true
              """
            } finally {
              sh 'docker logout || true'
            }
          }
        }
      }
    }

    stage('Render manifest') {
      steps {
        sh """
          cp myapp.yml myapp.rendered.yml
          sed -i.bak 's#image: .*#image: ${REGISTRY}/${IMAGE_NAME}:${IMG_TAG}#' myapp.rendered.yml
        """
      }
    }

    stage('Deploy to all clusters') {
      steps {
        script {
          // Definisi cluster (pakai env.* yang sudah kamu set di environment block)
          def clusters = [
            [name: 'cluster-1', tokenId: 'oc-token-1', server: 'https://api.rm2.thpm.p1.openshiftapps.com:6443', ns: 'wirajayaabadi-dev'],
            [name: 'cluster-2', tokenId: 'oc-token-2', server: 'https://api.rm1.0a51.p1.openshiftapps.com:6443', ns: 'biruswasana-dev'],
            [name: 'cluster-3', tokenId: 'oc-token-3', server: 'https://api.rm1.0a51.p1.openshiftapps.com:6443', ns: 'fchbrnn-dev'],
            [name: 'cluster-4', tokenId: 'oc-token-4', server: 'https://api.rm1.0a51.p1.openshiftapps.com:6443', ns: 'dianmatondang012-dev'],
            [name: 'cluster-5', tokenId: 'oc-token-5', server: 'https://api.rm1.0a51.p1.openshiftapps.com:6443', ns: 'rafyryana-dev'],
          ]

          def branches = clusters.collectEntries { c ->
            ["Deploy ${c.name}": {
              withCredentials([string(credentialsId: c.tokenId, variable: 'OC_TOKEN')]) {
                sh """
                  oc login ${c.server} --token=${OC_TOKEN} --insecure-skip-tls-verify=true
                  oc project ${c.ns}
                  oc apply -f myapp-secret.yml || true
                  oc apply -f myapp.rendered.yml
                  oc rollout status deploy/myapp-deployment -n ${c.ns} --timeout=3m
                  oc get route myapp-route -n ${c.ns} -o jsonpath='{.spec.host}' > route-${c.name}.txt || true
                  oc logout
                """
              }
            }]
          }

          parallel branches
        }
      }
    }

    stage('Show all routes') {
      steps {
        script {
          def routes = sh(script: "ls route-*.txt 2>/dev/null || true", returnStdout: true).trim()
          if (routes) {
            sh 'for f in route-*.txt; do echo \"$f -> https://$(cat $f)\"; done'
          } else {
            echo "Belum ada route yang terbaca."
          }
        }
      }
    }
  }

  post {
     success {
       script {
         def url = sh(script: "oc get route myapp-route -n ${env.OC_NAMESPACE} -o jsonpath='{.spec.host}' || true", returnStdout: true).trim()
         emailext subject: "[SUCCESS] rails-jenkins #${env.BUILD_NUMBER}",
                  body: "Build sukses. URL: https://${url}",
                  to: "wiraardi79@gmail.com"
       }
     }
     failure {
       emailext subject: "[FAILED] rails-jenkins #${env.BUILD_NUMBER}",
                body: "Build gagal. Cek console log Jenkins.",
                to: "wiraardi79@gmail.com"
     }
   }
}
