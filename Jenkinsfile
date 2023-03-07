pipeline {
    agent any
    stages {
        stage ('BancaMarchFront: Download angular dependencies : npm install') {
            steps {
                sh 'rm -rf node_modules'
                sh 'npm install'
            }
        }

        stage ('BancaMarchFRONT: Build project: ng b -c --prod') {
            steps {
                sh 'ng b -c --prod --aot'
            }
        }

        stage ('BancaMarchFRONT: Deploying in nginx') {
            steps {
                sh 'cd dist && cp -vr . /var/www/vps-3fdb8b00.vps.ovh.net'
                sh 'cp -R * /var/www/vps-3fdb8b00.vps.ovh.net/html/'
                //move the files to the /var/www/vps-3fdb8b00.vps.ovh.net/html directory
            }
        }
    }
}