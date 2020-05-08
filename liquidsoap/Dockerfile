FROM ubuntu:focal
MAINTAINER Kassim Benhaddad

# Install services
RUN apt update && apt install -y gnupg ca-certificates

RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 20D63CCDDD0F62C2 && \
    echo deb http://deb.liquidsoap.info/ubuntu bionic main >> /etc/apt/sources.list.d/liquidsoap.list && \
    apt update && \
    apt install -y liquidsoap-master

RUN apt-get purge --auto-remove -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* ~/.cache 

EXPOSE 8005 8010

USER liquidsoap

CMD ["liquidsoap" ,"/etc/liquidsoap/default.liq"]