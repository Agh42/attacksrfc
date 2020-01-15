#
# Use NGINX to test static hosting:
#

docker run --name attacksrfc-nginx -v /home/akoderman/git/attacksurface/build:/usr/share/nginx/html:ro -d -p 8080:80 nginx

