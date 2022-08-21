cd packages;
for D in */;
    do if [ "$D" != "buffer-layout/" ]; then
        cd $D && yarn init:yarn; cd ..;
    fi
done
