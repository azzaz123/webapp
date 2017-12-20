# deploy.sh
#! /bin/bash

SHA1=$1

# Deploy image to Docker Hub
docker push circleci/hello:$SHA1

# Create new Elastic Beanstalk version
EB_BUCKET=hello-bucket
DOCKERRUN_FILE=$SHA1-Dockerrun.aws.json
sed "s/<TAG>/$SHA1/" < Dockerrun.aws.json.template > $DOCKERRUN_FILE
aws s3 cp $DOCKERRUN_FILE s3://$EB_BUCKET/$DOCKERRUN_FILE
aws elasticbeanstalk create-application-version --application-name hello \
  --version-label $SHA1 --source-bundle S3Bucket=$EB_BUCKET,S3Key=$DOCKERRUN_FILE

# Update Elastic Beanstalk environment to new version
aws elasticbeanstalk update-environment --environment-name hello-env \
    --version-label $SHA1

#npm run builddocker
echo $CIRCLE_BRANCH
docker build -f docker/Dockerfile -t "745640521341.dkr.ecr.eu-west-1.amazonaws.com/devel/webapp:${CIRCLE_BRANCH}" .
$(aws ecr get-login --no-include-email --region eu-west-1)
docker push "745640521341.dkr.ecr.eu-west-1.amazonaws.com/devel/webapp:${CIRCLE_BRANCH}"
