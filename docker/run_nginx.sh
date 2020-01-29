#
# Use NGINX to test static hosting:
#

docker run --name attacksrfc-nginx -v /home/<user>/git/attacksurface/build:/usr/share/nginx/html:ro -d -p 8081:80 nginx

