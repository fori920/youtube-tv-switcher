#!/bin/bash

TARGET_BROWSER=$1
[ -z $TARGET_BROWSER ] && echo "Usage: ./bundle.sh [chrome|firefox]" && exit 1

[ ! -d "/dist" ] && mkdir dist

cp $TARGET_BROWSER.manifest.json manifest.json
zip -r $TARGET_BROWSER.tusk.zip build/ assets/icons/exported/ assets/other/ dll/ popup.html options.html manifest.json
rm -rf ./demo-$TARGET_BROWSER
mkdir -p demo-$TARGET_BROWSER
cp $TARGET_BROWSER.tusk.zip ./demo-$TARGET_BROWSER
cd ./demo-$TARGET_BROWSER
unzip *
cd ..
echo "Files bundled to $TARGET_BROWSER.tusk.zip. Verify the build in ./dist/$TARGET_BROWSER"