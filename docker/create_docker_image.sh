#npm run builddocker
echo $CIRCLE_BRANCH
docker build -f docker/Dockerfile -t "745640521341.dkr.ecr.eu-west-1.amazonaws.com/devel/webapp:${CIRCLE_BRANCH}" .
$(aws ecr get-login --no-include-email --region eu-west-1)
docker push "745640521341.dkr.ecr.eu-west-1.amazonaws.com/devel/webapp:${CIRCLE_BRANCH}"
