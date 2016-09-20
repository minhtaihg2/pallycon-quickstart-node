echo "Installing required utils"
apt-get install unzip
apt-get install wget

echo "Downloading CLI packager and Bento4 from pallycon server"
mkdir packager && cd packager
wget "http://sample.pallycon.com/quickstart/PallyConPackager_ubuntu.zip"
unzip PallyConPackager_ubuntu.zip
wget  "http://sample.pallycon.com/quickstart/Bento4.zip"
unzip Bento4.zip
chmod 744 Packager && chmod 744 ./Bento4/*.*

echo "Downloading sample video from pallycon server"
wget "http://sample.pallycon.com/quickstart/big_buck_bunny.mp4"
cd ../public && mkdir contents

echo "Packager Installation Completed"
cd ..
