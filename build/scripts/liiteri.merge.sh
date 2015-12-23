#!/bin/bash
while read fn
do
        if [ ! -f "$1/$fn" ]; then
                echo "File $1/$fn not found"
                exit 1
        else
                cat "$1/$fn" >> "$2"
        fi
done < $3