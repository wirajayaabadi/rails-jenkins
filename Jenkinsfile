pipeline {
  agent any
  options { ansiColor('xterm'); timestamps() }

  environment {
    REGISTRY      = "wiraaji2301"
    IMAGE_NAME    = "myapp-amd64"   
    DOCKER_CRED   = "dockerhub-creds"
    GIT_CRED      = "github-creds"
    OC_TOKEN_ID  = "oc-token"
    OC_SERVER     = "https://api.openshift.example:6443" // ganti cluster API
    OC_NAMESPACE  = "rails-demo"                         // ganti project
  }

  triggers {
    // Build otomatis setiap ada push/PR webhook
    pollSCM('@daily') // fallback kalau webhook belum diset
  }

  stages {
    stage('Clone repo') {
      steps {
        git credentialsId: env.GIT_CRED, url: 'https://github.com/wirajayaabadi/rails-jenkins.git', branch: 'main'
      }
    }

    // stage('Build docker image') {
    //   steps {
    //     script {
    //       COMMIT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
    //       env.IMG_TAG = "build-${env.BUILD_NUMBER}-${COMMIT}"
    //     }
    //     sh """
    //       docker build -t ${REGISTRY}/${IMAGE_NAME}:${IMG_TAG} .
    //     """
    //   }
    // }

    // stage('Push docker') {
    //   steps {
    //     withCredentials([usernamePassword(credentialsId: DOCKER_CRED, usernameVariable: 'USER', passwordVariable: 'PASS')]) {
    //       sh """
    //         echo "$PASS" | docker login ${REGISTRY} -u "$USER" --password-stdin
    //         docker push ${REGISTRY}/${IMAGE_NAME}:${IMG_TAG}
    //       """
    //     }
    //   }
    // }

    // stage('Update manifest') {
    //   steps {
    //     sh """
    //       cp myapp.yml myapp.rendered.yml
    //       sed -i 's#image: .*#image: ${REGISTRY}/${IMAGE_NAME}:${IMG_TAG}#' myapp.rendered.yml
    //     """
    //   }
    // }

    // stage('oc apply') {
    //   steps {
    //     withCredentials([string(credentialsId: OC_TOKEN_ID, variable: 'OC_TOKEN')]) {
    //       sh """
    //         oc login ${OC_SERVER} --token=${OC_TOKEN} --insecure-skip-tls-verify=true
    //         oc project ${OC_NAMESPACE}
    //         # secret dulu (idempotent apply)
    //         oc apply -f myapp-secret.yml || true
    //         # deployment/service/route
    //         oc apply -f myapp.rendered.yml
    //       """
    //     }
    //   }
    // }

    // stage('Expose route URL') {
    //   steps {
    //     sh """
    //       with_retry=0
    //       # tunggu rollout sukses
    //       oc rollout status deploy/myapp -n ${OC_NAMESPACE} --timeout=3m || true
    //       # ambil route
    //       oc get route myapp -n ${OC_NAMESPACE} -o jsonpath='{.spec.host}' > route.txt || true
    //     """
    //     script {
    //       ROUTE = readFile('route.txt').trim()
    //       if (ROUTE) {
    //         echo "App URL: https://${ROUTE}"
    //       } else {
    //         echo "Route belum tersedia."
    //       }
    //     }
    //   }
    // }
  }

  // post {
  //   success {
  //     script {
  //       def url = sh(script: "oc get route myapp -n ${env.OC_NAMESPACE} -o jsonpath='{.spec.host}' || true", returnStdout: true).trim()
  //       emailext subject: "[SUCCESS] rails-jenkins #${env.BUILD_NUMBER}",
  //                body: "Build sukses. URL: https://${url}",
  //                to: "dev-team@example.com"
  //     }
  //   }
  //   failure {
  //     emailext subject: "[FAILED] rails-jenkins #${env.BUILD_NUMBER}",
  //              body: "Build gagal. Cek console log Jenkins.",
  //              to: "dev-team@example.com"
  //   }
  // }

  post {
      always {
          echo 'This will always run after the pipeline completes.'
      }
      success {
          echo 'This will run only if the pipeline succeeds.'
      }
      failure {
          echo 'This will run only if the pipeline fails.'
      }
  }
}