echo "Downloading CLI packager and Bento4 from pallycon server"
mkdir packager && cd packager
wget "http://sample.pallycon.com/quickstart/PallyConPackager_ubuntu.zip"
unzip PallyConPackager_ubuntu.zip
wget  "http://sample.pallycon.com/quickstart/Bento4.zip"
unzip Bento4.zip
chmod 744 PallyConPackager && chmod 744 -R Bento4

echo "Downloading sample video from pallycon server"
wget "http://sample.pallycon.com/quickstart/sintel-trailer-480p.mp4"

echo "Packager Installation Completed"
