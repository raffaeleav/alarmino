#!/bin/bash

# mosquitto installation directory
mosquitto=$(realpath "/opt/homebrew/etc/mosquitto")
mosquitto_passwords=${mosquitto}/passwords
passwords_file=${mosquitto_passwords}/passwords_file

if [ ! -d "${mosquitto_passwords}" ]; then
    mkdir -p "${mosquitto_passwords}"
fi

rm -f "${passwords_file}"

mosquitto_passwd -c -b "${passwords_file}" gui alarmino
mosquitto_passwd -b "${passwords_file}" board alarmino

cp "../broker/config/acl.conf" "/opt/homebrew/etc/mosquitto/acl.conf"