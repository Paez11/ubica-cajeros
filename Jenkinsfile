pipeline {
    agent any
    stages {
        stage ('BancaMarchFront: Download angular dependencies : npm install') {
            steps {
                sh 'rm -rf node_modules'
                sh 'npm install'
            }
        }

        stage ('BancaMarchFRONT: Build project: ng b -c des') {
            steps {
                sh 'ng b -c des --aot'
            }
        }

        stage ('BancaMarchFRONT: Deploying in nginx') {
            steps {
                sh 'cd dist && cp -vr . /usr/share/nginx/www/public'
            }
        }
    }
}