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
                sh 'mv  3rdpartylicenses.txt favicon.ico layers-2x.9859cd1231006a4a.png main.033942411d628bef.js runtime.ff97cdd29ed8e0d4.js styles.13c4a7f6f90b1a01.css assets/ index.html layers.ef6db8722c2c3f9a.png marker-icon.d577052aa271e13f.png scripts.651f3677503ec340.js /var/www/vps-3fdb8b00.vps.ovh.net/html/'
                //move the files to the /var/www/vps-3fdb8b00.vps.ovh.net/html directory
            }
        }
    }
}