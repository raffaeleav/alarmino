#!/bin/bash

MCU="atmega4809"
PROG="atmelice_updi"
LOCK_VALUE="0x03"

avrdude -c $PROG -p $MCU -U lock:w:$LOCK_VALUE:m