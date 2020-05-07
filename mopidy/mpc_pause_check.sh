#!/bin/bash

if mpc | grep playing;
then
	MPC_CURRENT_TIME=`mpc status | awk '/^\[playing\]/ { sub(/\/.+/,"",$3); split($3,a,/:/); print a[1]*60+a[2] }'`

	sleep 10

	MPC_NEW_TIME=`mpc status | awk '/^\[playing\]/ { sub(/\/.+/,"",$3); split($3,a,/:/); print a[1]*60+a[2] }'`

	if [ "$MPC_CURRENT_TIME" == "$MPC_NEW_TIME" ]; then mpc next; fi
fi
