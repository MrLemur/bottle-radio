FROM debian:buster

LABEL Author Kassim Benhaddad <kassim@kass.im>

RUN apt-get update \
       && DEBIAN_FRONTEND=noninteractive apt-get install -y --fix-missing \
       gcc \
       curl \
       python-crypto \
       python3-setuptools \
       python-pip \
       wget \
       git

RUN curl -L https://apt.mopidy.com/mopidy.gpg -o /tmp/mopidy.gpg \
       && wget -q -O /etc/apt/sources.list.d/mopidy.list https://apt.mopidy.com/buster.list \
       && apt-key add /tmp/mopidy.gpg \
       && apt-get update \
       && apt-get install -y mopidy \
       && apt-get install -y mopidy-spotify \
       && apt-get install -y mopidy-mpd \
       && apt-get install -y mpc

RUN cd /tmp/ \
       && git clone --single-branch --branch develop https://github.com/jaedb/Iris.git \
       && cd Iris \
       && python3 setup.py install

RUN echo "mopidy ALL=NOPASSWD: /usr/local/lib/python3.7/dist-packages/Mopidy_Iris-3.44.0-py3.7.egg/mopidy_iris/system.sh" >> /etc/sudoers

RUN apt-get purge --auto-remove -y \
       curl \
       gcc \
       && apt-get clean \
       && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* ~/.cache 

COPY mopidy.conf /var/lib/mopidy/.config/mopidy/mopidy.conf

COPY mpc_pause_check.sh /opt/

RUN chmod +x /opt/mpc_pause_check.sh

USER mopidy

HEALTHCHECK --interval=60s --timeout=30s CMD bash /opt/mpc_pause_check.sh

EXPOSE 6680

ENTRYPOINT ["/usr/bin/mopidy"]
