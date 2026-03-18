#!/bin/bash

certificate_path=$(realpath "../broker/certificates/rootCA.pem")

./arduino-fwuploader certificates flash \
  --url arduino.cc:443 \
  -f ${certificate_path} \
  -b arduino:megaavr:uno2018 \
  -a /dev/cu.usbmodem112402
  