FROM nginx:1.30.6-alpine3.24-slim

# Apply the current Alpine security update for the package that remained in the
# first remediated image scan. Rebuild and rescan periodically because package
# and vulnerability data change after this milestone.
RUN apk upgrade --no-cache zlib

COPY index.html /usr/share/nginx/html/index.html
COPY styles.css /usr/share/nginx/html/styles.css
COPY core-logic.js /usr/share/nginx/html/core-logic.js
COPY app.js /usr/share/nginx/html/app.js
COPY deployment/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
