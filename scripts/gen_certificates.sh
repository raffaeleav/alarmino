#!/bin/bash

# mosquitto installation directory
mosquitto=$(realpath "/opt/homebrew/etc/mosquitto")
mosquitto_certificates=${mosquitto}/certificates

if [ ! -d "${mosquitto_certificates}" ]; then
    mkdir -p "${mosquitto_certificates}"
fi

certificates_path=$(realpath "../broker/certificates")

# ca key
openssl genrsa -out ${certificates_path}/rootCA.key 2048

# ca certificate
openssl req -new -x509 -days 3650 \
    -key ${certificates_path}/rootCA.key \
    -out ${certificates_path}/rootCA.pem \
    -subj "/C=/ST=/L=/O=/OU=/CN=rootCA"


# broker key
openssl genrsa -out ${certificates_path}/broker-key.pem 2048

# broker certificate request
openssl req -new \
    -key ${certificates_path}/broker-key.pem \
    -out ${certificates_path}/broker.csr \
    -subj "/C=/ST=/L=/O=/OU=/CN=172.20.10.2"

# broker certificate
openssl x509 -req -days 3650 \
    -in ${certificates_path}/broker.csr \
    -CA ${certificates_path}/rootCA.pem \
    -CAkey ${certificates_path}/rootCA.key \
    -CAcreateserial \
    -out ${certificates_path}/broker.pem \
    -sha256

cp ${certificates_path}/rootCA.pem ${mosquitto_certificates}/rootCA.pem
cp ${certificates_path}/broker.pem ${mosquitto_certificates}/broker.pem
cp ${certificates_path}/broker-key.pem ${mosquitto_certificates}/broker-key.pem
